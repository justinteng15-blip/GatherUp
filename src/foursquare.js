/**
 * Foursquare Places API helpers
 *
 * Set VITE_FOURSQUARE_API_KEY in your .env file to enable.
 * Free tier: 100,000 API calls / month — no billing required.
 *
 * New base URL (2025): https://places-api.foursquare.com
 * Auth: Authorization: Bearer <key>
 * Required header: X-Places-Api-Version: 2025-06-17
 */

const API_KEY     = import.meta.env.VITE_FOURSQUARE_API_KEY || ''
const API_VERSION = '2025-06-17'
// Requests are routed through Vite's dev-server proxy (/api/fsq → https://places-api.foursquare.com)
// to avoid the CORS restriction on the new Foursquare Places API.
const BASE = '/api/fsq'

/** True when a key is configured — lets callers fall back gracefully. */
export const FSQ_ENABLED = Boolean(API_KEY)

function fsqHeaders() {
  return {
    'Accept':             'application/json',
    'Authorization':      `Bearer ${API_KEY}`,
    'X-Places-Api-Version': API_VERSION,
  }
}

// ---------------------------------------------------------------------------
// Place search  (used for both autocomplete and legacy-dest resolution)
// ---------------------------------------------------------------------------

/**
 * Search for places matching a query, optionally anchored to a country/city.
 * Returns a normalised array of { id, name, city, countryCode, lat, lng, fsqId, label }
 *
 * @param {string} query
 * @param {{ near?: string, signal?: AbortSignal, limit?: number }} opts
 */
export async function fsqAutocomplete(query, { near, signal, limit = 8 } = {}) {
  if (!FSQ_ENABLED) throw new Error('Foursquare API key not configured')

  const params = new URLSearchParams({
    query,
    limit:  String(limit),
    fields: 'fsq_place_id,name,location,geocodes,categories',
    sort:   'RELEVANCE',
  })
  if (near) params.set('near', near)

  const res = await fetch(`${BASE}/places/search?${params}`, {
    headers: fsqHeaders(),
    signal,
  })
  if (!res.ok) throw new Error(`Foursquare search error: ${res.status}`)

  const data = await res.json()
  const raw  = data.results || []

  return raw.map((p) => {
    const locality = p.location?.locality || p.location?.region || ''
    const country  = p.location?.country  || ''
    return {
      _type:       'place',
      id:          `fsq-${p.fsq_place_id}`,
      fsqId:       p.fsq_place_id,
      name:        p.name,
      city:        locality || country,
      countryCode: p.location?.country?.toLowerCase() || '',
      lat:         p.geocodes?.main?.latitude  ?? null,
      lng:         p.geocodes?.main?.longitude ?? null,
      label:       [locality, country].filter(Boolean).join(', '),
    }
  })
}

// ---------------------------------------------------------------------------
// Single-result search  (resolves legacy destinations without an fsqId)
// ---------------------------------------------------------------------------

/**
 * Find the best-matching FSQ place for a free-text query.
 * Returns the raw first result or null.
 */
export async function fsqSearchOne(query, { signal } = {}) {
  if (!FSQ_ENABLED) return null

  const params = new URLSearchParams({
    query,
    limit:  '1',
    fields: 'fsq_place_id,name,location,geocodes',
  })
  const res = await fetch(`${BASE}/places/search?${params}`, {
    headers: fsqHeaders(),
    signal,
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.results?.[0] ?? null
}

// ---------------------------------------------------------------------------
// Place details  (description + first photo in one request)
// ---------------------------------------------------------------------------

/**
 * Fetch place details for a known fsq_place_id.
 * Returns { desc, imageUrl } — same shape as the old Wikipedia helper.
 */
export async function fsqFetchDetails(fsqId, { signal } = {}) {
  if (!FSQ_ENABLED || !fsqId) return null

  const params = new URLSearchParams({
    fields: 'fsq_place_id,name,description,photos,rating,location,tastes,categories',
  })
  const res = await fetch(`${BASE}/places/${fsqId}?${params}`, {
    headers: fsqHeaders(),
    signal,
  })
  if (!res.ok) throw new Error(`Foursquare details error: ${res.status}`)

  const d = await res.json()

  // ── Description ──────────────────────────────────────────────────────────
  let desc = d.description?.trim() || ''

  if (!desc && d.tastes?.length) {
    const tags = d.tastes.slice(0, 3).join(', ')
    desc = `Known for being ${tags}.`
  }
  if (!desc && d.categories?.length) {
    const cat  = d.categories[0]?.name || ''
    const city = d.location?.locality  || ''
    desc = [cat, city].filter(Boolean).join(' in ') + '.'
  }

  // ── Photo ─────────────────────────────────────────────────────────────────
  const photo    = d.photos?.[0] ?? null
  const imageUrl = photo ? fsqPhotoUrl(photo, 800, 600) : null

  return { desc: desc || '', imageUrl }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Build a CDN image URL from a Foursquare photo object.
 * Format: {prefix}{width}x{height}{suffix}
 */
export function fsqPhotoUrl(photo, width = 800, height = 600) {
  if (!photo?.prefix || !photo?.suffix) return null
  return `${photo.prefix}${width}x${height}${photo.suffix}`
}
