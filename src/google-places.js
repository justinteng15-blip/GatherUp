/**
 * Google Places API (New) helpers
 *
 * Docs: https://developers.google.com/maps/documentation/places/web-service/overview
 * Base: https://places.googleapis.com/v1
 * Auth: X-Goog-Api-Key header (supports browser CORS natively — no proxy needed)
 */

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY || ''
const BASE    = 'https://places.googleapis.com/v1'

/** True when a key is configured. */
export const GPLACES_ENABLED = Boolean(API_KEY)

function gHeaders(fieldMask) {
  const h = {
    'Content-Type':  'application/json',
    'X-Goog-Api-Key': API_KEY,
  }
  if (fieldMask) h['X-Goog-FieldMask'] = fieldMask
  return h
}

// ---------------------------------------------------------------------------
// Autocomplete  (replaces Nominatim search-as-you-type)
// ---------------------------------------------------------------------------

/**
 * Fetch autocomplete suggestions for a query, optionally restricted to a country.
 *
 * Returns normalised { id, googlePlaceId, name, city, countryCode, lat, lng, label }
 * Note: lat/lng are null until gResolvePlace() is called on pick.
 *
 * @param {string} query
 * @param {{ countryCode?: string, signal?: AbortSignal, limit?: number }} opts
 */
export async function gAutocomplete(query, { countryCode, signal, limit = 8 } = {}) {
  if (!GPLACES_ENABLED) throw new Error('Google Places API key not configured')

  const body = { input: query }
  // Restrict to trip country so users can't accidentally add out-of-country spots.
  if (countryCode) body.includedRegionCodes = [countryCode.toLowerCase()]

  const res = await fetch(`${BASE}/places:autocomplete`, {
    method:  'POST',
    headers: gHeaders(),
    body:    JSON.stringify(body),
    signal,
  })
  if (!res.ok) throw new Error(`Google Places autocomplete error: ${res.status}`)

  const data        = await res.json()
  const suggestions = (data.suggestions || []).slice(0, limit)

  return suggestions
    .map((s) => s.placePrediction)
    .filter(Boolean)
    .map((p) => ({
      _type:         'google',
      id:            `gp-${p.placeId}`,
      googlePlaceId: p.placeId,
      name:          p.structuredFormat?.mainText?.text  || p.text?.text || '',
      city:          p.structuredFormat?.secondaryText?.text || '',
      // Country is enforced via includedRegionCodes, so we trust the trip's code.
      countryCode:   countryCode?.toLowerCase() || '',
      lat:           null, // resolved on pick via gResolvePlace()
      lng:           null,
      label:         p.structuredFormat?.secondaryText?.text || p.text?.text || '',
    }))
}

// ---------------------------------------------------------------------------
// Resolve lat/lng  (one call per pick, not per keystroke)
// ---------------------------------------------------------------------------

/**
 * Fetch the location (lat/lng) and verified country code for a place ID.
 * Called once when the user selects a suggestion from the autocomplete list.
 *
 * @param {string} placeId  Google Place ID
 * @returns {{ lat, lng, countryCode } | null}
 */
export async function gResolvePlace(placeId, { signal } = {}) {
  if (!GPLACES_ENABLED || !placeId) return null

  const res = await fetch(`${BASE}/places/${placeId}`, {
    headers: gHeaders('location,addressComponents,displayName'),
    signal,
  })
  if (!res.ok) return null

  const d           = await res.json()
  const lat         = d.location?.latitude  ?? null
  const lng         = d.location?.longitude ?? null
  const countryComp = (d.addressComponents || []).find((c) => c.types?.includes('country'))
  const countryCode = countryComp?.shortText?.toLowerCase() || ''

  return { lat, lng, countryCode }
}

// ---------------------------------------------------------------------------
// Text search  (resolves legacy/seed destinations without a googlePlaceId)
// ---------------------------------------------------------------------------

/**
 * Find the best-matching Google Place for a free-text query.
 * Returns the first result's { id, location } or null.
 */
export async function gSearchOne(query, { signal } = {}) {
  if (!GPLACES_ENABLED) return null

  const res = await fetch(`${BASE}/places:searchText`, {
    method:  'POST',
    headers: gHeaders('places.id,places.displayName,places.location'),
    body:    JSON.stringify({ textQuery: query, pageSize: 1 }),
    signal,
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.places?.[0] ?? null
}

// ---------------------------------------------------------------------------
// Place details  (description + photo for swipe cards)
// ---------------------------------------------------------------------------

/**
 * Fetch place details for a known Google Place ID.
 * Returns { desc, imageUrl } — same shape as the old Wikipedia/Foursquare helpers.
 */
export async function gFetchDetails(placeId, { signal } = {}) {
  if (!GPLACES_ENABLED || !placeId) return null

  const res = await fetch(`${BASE}/places/${placeId}`, {
    headers: gHeaders('displayName,editorialSummary,photos,types,addressComponents'),
    signal,
  })
  if (!res.ok) throw new Error(`Google Places details error: ${res.status}`)

  const d = await res.json()

  // ── Description ──────────────────────────────────────────────────────────
  let desc = d.editorialSummary?.text?.trim() || ''
  if (!desc && d.types?.length) {
    const type = d.types[0].replace(/_/g, ' ')
    const city = (d.addressComponents || [])
      .find((c) => c.types?.includes('locality'))?.longText || ''
    desc = city ? `A ${type} in ${city}.` : `A ${type}.`
  }

  // ── Photo ─────────────────────────────────────────────────────────────────
  // Photo resource name looks like: "places/{id}/photos/{photoRef}"
  // Appending /media?maxWidthPx=800&key=... returns the image directly.
  const photo    = d.photos?.[0]
  const imageUrl = photo
    ? `${BASE}/${photo.name}/media?maxWidthPx=800&key=${API_KEY}`
    : null

  return { desc: desc || '', imageUrl }
}
