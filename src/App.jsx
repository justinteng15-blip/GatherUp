import React, { useState, useMemo, useEffect } from 'react'
import {
  IconPlus, IconMinus, IconCheck, IconArrowRight, IconArrowLeft,
  IconSend, IconHome, IconUsers, IconCompass, IconUser, IconSearch,
  IconBell, IconMap, IconLeaf, IconApple, IconGoogle, IconBolt,
  IconPaperPlane, IconCalendar, IconWallet, IconBed, IconMapPin,
  IconSpark, IconBulb, IconClose, IconExternal,
} from './icons.jsx'
import {
  GPLACES_ENABLED,
  gAutocomplete,
  gResolvePlace,
  gSearchOne,
  gFetchDetails,
} from './google-places.js'

const COUNTRY_PHOTOS = {
  // ---- already curated ----
  'japan':                  'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&auto=format&q=80',
  'portugal':               'https://images.unsplash.com/photo-1513735492246-483525079686?w=400&auto=format&q=80',
  'italy':                  'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=400&auto=format&q=80',
  'france':                 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&q=80',
  'spain':                  'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400&auto=format&q=80',
  'iceland':                'https://images.unsplash.com/photo-1504233529578-6d46baba6d34?w=400&auto=format&q=80',
  'morocco':                'https://images.unsplash.com/photo-1548013146-8f59ea0e7e50?w=400&auto=format&q=80',
  'greece':                 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&auto=format&q=80',
  'thailand':               'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&auto=format&q=80',
  'peru':                   'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&auto=format&q=80',
  'mexico':                 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400&auto=format&q=80',
  'vietnam':                'https://images.unsplash.com/photo-1504214208698-ea1916a55c8c?w=400&auto=format&q=80',
  'new zealand':            'https://images.unsplash.com/photo-1469521669194-babb45599def?w=400&auto=format&q=80',
  // ---- expanded ----
  'india':                  'https://images.unsplash.com/photo-1524492412937-b28074a47d70?w=400&auto=format&q=80',
  'australia':              'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=400&auto=format&q=80',
  'canada':                 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&auto=format&q=80',
  'united states':          'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&auto=format&q=80',
  'germany':                'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&auto=format&q=80',
  'united kingdom':         'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&auto=format&q=80',
  'brazil':                 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&auto=format&q=80',
  'argentina':              'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=400&auto=format&q=80',
  'indonesia':              'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&auto=format&q=80',
  'turkey':                 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=400&auto=format&q=80',
  'egypt':                  'https://images.unsplash.com/photo-1539768942893-daf2d21ebb5a?w=400&auto=format&q=80',
  'south africa':           'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&auto=format&q=80',
  'kenya':                  'https://images.unsplash.com/photo-1547471080-7cc2caa01726?w=400&auto=format&q=80',
  'norway':                 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&auto=format&q=80',
  'sweden':                 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&auto=format&q=80',
  'switzerland':            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&q=80',
  'austria':                'https://images.unsplash.com/photo-1516550135131-fe3dcdd4b5a7?w=400&auto=format&q=80',
  'netherlands':            'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&auto=format&q=80',
  'united arab emirates':   'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&auto=format&q=80',
  'singapore':              'https://images.unsplash.com/photo-1525625293386-0d5ea8c06c6f?w=400&auto=format&q=80',
  'malaysia':               'https://images.unsplash.com/photo-1596422441065-e2cf8879d75a?w=400&auto=format&q=80',
  'nepal':                  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&auto=format&q=80',
  'maldives':               'https://images.unsplash.com/photo-1573843981267-be1480dda037?w=400&auto=format&q=80',
  'sri lanka':              'https://images.unsplash.com/photo-1586ead007484-97b8bde3e2e3?w=400&auto=format&q=80',
  'china':                  'https://images.unsplash.com/photo-1508804185872-173bbab25c1c?w=400&auto=format&q=80',
  'south korea':            'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=400&auto=format&q=80',
  'ireland':                'https://images.unsplash.com/photo-1559628233-100c798642d2?w=400&auto=format&q=80',
  'hungary':                'https://images.unsplash.com/photo-1565426873118-a17ed65d74b9?w=400&auto=format&q=80',
  'czech republic':         'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&auto=format&q=80',
  'croatia':                'https://images.unsplash.com/photo-1555990538-c82ab35d8a09?w=400&auto=format&q=80',
  'poland':                 'https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=400&auto=format&q=80',
  'russia':                 'https://images.unsplash.com/photo-1547928578-bca72e5a17a4?w=400&auto=format&q=80',
  'colombia':               'https://images.unsplash.com/photo-1518560693857-1e1069a7cd70?w=400&auto=format&q=80',
  'cuba':                   'https://images.unsplash.com/photo-1500920800395-75f3f1b8b0d5?w=400&auto=format&q=80',
  'chile':                  'https://images.unsplash.com/photo-1508930175293-16e72e4af7e6?w=400&auto=format&q=80',
  'jordan':                 'https://images.unsplash.com/photo-1539622106114-e0df812097e6?w=400&auto=format&q=80',
  'tanzania':               'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&auto=format&q=80',
  'philippines':            'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400&auto=format&q=80',
  'cambodia':               'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&auto=format&q=80',
  'denmark':                'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&auto=format&q=80',
  'finland':                'https://images.unsplash.com/photo-1530968831187-a937bddb9f28?w=400&auto=format&q=80',
  'belgium':                'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=400&auto=format&q=80',
  'costa rica':             'https://images.unsplash.com/photo-1518259102261-b40117eabbc9?w=400&auto=format&q=80',
  'ecuador':                'https://images.unsplash.com/photo-1539137329891-c3a3db5fce63?w=400&auto=format&q=80',
  'bolivia':                'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&auto=format&q=80',
  'uzbekistan':             'https://images.unsplash.com/photo-1576502200916-3808e07386a5?w=400&auto=format&q=80',
  'georgia':                'https://images.unsplash.com/photo-1565008576549-57569a49f68a?w=400&auto=format&q=80',
  'myanmar':                'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&q=80',
  'taiwan':                 'https://images.unsplash.com/photo-1526483396607-49065bd37b70?w=400&auto=format&q=80',
  'saudi arabia':           'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=400&auto=format&q=80',
  'qatar':                  'https://images.unsplash.com/photo-1577609660009-f7fdd1a5b24d?w=400&auto=format&q=80',
  'seychelles':             'https://images.unsplash.com/photo-1565073182887-6bcefbe225b1?w=400&auto=format&q=80',
  'mauritius':              'https://images.unsplash.com/photo-1544085701-4d54e91c4c07?w=400&auto=format&q=80',
  'namibia':                'https://images.unsplash.com/photo-1511233002422-9905cf52a5b4?w=400&auto=format&q=80',
  'ethiopia':               'https://images.unsplash.com/photo-1578783808137-1bdd0d8e8d7a?w=400&auto=format&q=80',
  'laos':                   'https://images.unsplash.com/photo-1571655553718-e1e45cdc064a?w=400&auto=format&q=80',
  'pakistan':               'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=400&auto=format&q=80',
  'ghana':                  'https://images.unsplash.com/photo-1581356977847-8bd4c5e0ca1e?w=400&auto=format&q=80',
  'ukraine':                'https://images.unsplash.com/photo-1555500101-c6900e1b037a?w=400&auto=format&q=80',
  'romania':                'https://images.unsplash.com/photo-1555952494-efd681c7e3f9?w=400&auto=format&q=80',
  'bulgaria':               'https://images.unsplash.com/photo-1578593048832-c86bbfbebe4c?w=400&auto=format&q=80',
  'slovenia':               'https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=400&auto=format&q=80',
  'panama':                 'https://images.unsplash.com/photo-1519138612848-df8f498a8c3d?w=400&auto=format&q=80',
}

// Canonical country name lookup. Maps lowercase input → proper-cased display name.
// Includes common aliases and abbreviations so users aren't penalised for shorthand.
const COUNTRY_LOOKUP = {
  'afghanistan': 'Afghanistan', 'albania': 'Albania', 'algeria': 'Algeria',
  'andorra': 'Andorra', 'angola': 'Angola', 'argentina': 'Argentina',
  'armenia': 'Armenia', 'australia': 'Australia', 'austria': 'Austria',
  'azerbaijan': 'Azerbaijan', 'bahamas': 'Bahamas', 'bahrain': 'Bahrain',
  'bangladesh': 'Bangladesh', 'barbados': 'Barbados', 'belarus': 'Belarus',
  'belgium': 'Belgium', 'belize': 'Belize', 'benin': 'Benin',
  'bhutan': 'Bhutan', 'bolivia': 'Bolivia', 'bosnia': 'Bosnia and Herzegovina',
  'bosnia and herzegovina': 'Bosnia and Herzegovina', 'botswana': 'Botswana',
  'brazil': 'Brazil', 'brunei': 'Brunei', 'bulgaria': 'Bulgaria',
  'burkina faso': 'Burkina Faso', 'burundi': 'Burundi',
  'cabo verde': 'Cabo Verde', 'cape verde': 'Cabo Verde',
  'cambodia': 'Cambodia', 'cameroon': 'Cameroon', 'canada': 'Canada',
  'central african republic': 'Central African Republic',
  'chad': 'Chad', 'chile': 'Chile', 'china': 'China',
  'colombia': 'Colombia', 'comoros': 'Comoros', 'congo': 'Congo',
  'costa rica': 'Costa Rica', 'croatia': 'Croatia', 'cuba': 'Cuba',
  'cyprus': 'Cyprus', 'czech republic': 'Czech Republic', 'czechia': 'Czech Republic',
  'denmark': 'Denmark', 'djibouti': 'Djibouti', 'dominica': 'Dominica',
  'dominican republic': 'Dominican Republic', 'ecuador': 'Ecuador',
  'egypt': 'Egypt', 'el salvador': 'El Salvador', 'eritrea': 'Eritrea',
  'estonia': 'Estonia', 'eswatini': 'Eswatini', 'ethiopia': 'Ethiopia',
  'fiji': 'Fiji', 'finland': 'Finland', 'france': 'France',
  'gabon': 'Gabon', 'gambia': 'Gambia', 'georgia': 'Georgia',
  'germany': 'Germany', 'ghana': 'Ghana', 'greece': 'Greece',
  'grenada': 'Grenada', 'guatemala': 'Guatemala', 'guinea': 'Guinea',
  'guyana': 'Guyana', 'haiti': 'Haiti', 'honduras': 'Honduras',
  'hungary': 'Hungary', 'iceland': 'Iceland', 'india': 'India',
  'indonesia': 'Indonesia', 'iran': 'Iran', 'iraq': 'Iraq',
  'ireland': 'Ireland', 'israel': 'Israel', 'italy': 'Italy',
  'ivory coast': "Côte d'Ivoire", "côte d'ivoire": "Côte d'Ivoire",
  'jamaica': 'Jamaica', 'japan': 'Japan', 'jordan': 'Jordan',
  'kazakhstan': 'Kazakhstan', 'kenya': 'Kenya', 'kuwait': 'Kuwait',
  'kyrgyzstan': 'Kyrgyzstan', 'laos': 'Laos', 'latvia': 'Latvia',
  'lebanon': 'Lebanon', 'lesotho': 'Lesotho', 'liberia': 'Liberia',
  'libya': 'Libya', 'liechtenstein': 'Liechtenstein', 'lithuania': 'Lithuania',
  'luxembourg': 'Luxembourg', 'madagascar': 'Madagascar', 'malawi': 'Malawi',
  'malaysia': 'Malaysia', 'maldives': 'Maldives', 'mali': 'Mali',
  'malta': 'Malta', 'mauritania': 'Mauritania', 'mauritius': 'Mauritius',
  'mexico': 'Mexico', 'moldova': 'Moldova', 'monaco': 'Monaco',
  'mongolia': 'Mongolia', 'montenegro': 'Montenegro', 'morocco': 'Morocco',
  'mozambique': 'Mozambique', 'myanmar': 'Myanmar', 'burma': 'Myanmar',
  'namibia': 'Namibia', 'nepal': 'Nepal', 'netherlands': 'Netherlands',
  'new zealand': 'New Zealand', 'nicaragua': 'Nicaragua', 'niger': 'Niger',
  'nigeria': 'Nigeria', 'north macedonia': 'North Macedonia', 'norway': 'Norway',
  'oman': 'Oman', 'pakistan': 'Pakistan', 'panama': 'Panama',
  'papua new guinea': 'Papua New Guinea', 'paraguay': 'Paraguay',
  'peru': 'Peru', 'philippines': 'Philippines', 'poland': 'Poland',
  'portugal': 'Portugal', 'qatar': 'Qatar', 'romania': 'Romania',
  'russia': 'Russia', 'rwanda': 'Rwanda', 'saudi arabia': 'Saudi Arabia',
  'senegal': 'Senegal', 'serbia': 'Serbia', 'seychelles': 'Seychelles',
  'sierra leone': 'Sierra Leone', 'singapore': 'Singapore',
  'slovakia': 'Slovakia', 'slovenia': 'Slovenia', 'somalia': 'Somalia',
  'south africa': 'South Africa', 'south korea': 'South Korea',
  'korea': 'South Korea', 'south sudan': 'South Sudan', 'spain': 'Spain',
  'sri lanka': 'Sri Lanka', 'sudan': 'Sudan', 'suriname': 'Suriname',
  'sweden': 'Sweden', 'switzerland': 'Switzerland', 'syria': 'Syria',
  'taiwan': 'Taiwan', 'tajikistan': 'Tajikistan', 'tanzania': 'Tanzania',
  'thailand': 'Thailand', 'east timor': 'Timor-Leste', 'timor-leste': 'Timor-Leste',
  'togo': 'Togo', 'tonga': 'Tonga', 'trinidad and tobago': 'Trinidad and Tobago',
  'tunisia': 'Tunisia', 'turkey': 'Turkey', 'türkiye': 'Turkey',
  'turkmenistan': 'Turkmenistan', 'uganda': 'Uganda', 'ukraine': 'Ukraine',
  'united arab emirates': 'United Arab Emirates', 'uae': 'United Arab Emirates',
  'dubai': 'United Arab Emirates',
  'united kingdom': 'United Kingdom', 'uk': 'United Kingdom',
  'great britain': 'United Kingdom', 'england': 'United Kingdom',
  'britain': 'United Kingdom', 'scotland': 'United Kingdom',
  'wales': 'United Kingdom',
  'united states': 'United States', 'usa': 'United States',
  'united states of america': 'United States', 'us': 'United States',
  'america': 'United States', 'uruguay': 'Uruguay',
  'uzbekistan': 'Uzbekistan', 'vanuatu': 'Vanuatu',
  'venezuela': 'Venezuela', 'vietnam': 'Vietnam', 'viet nam': 'Vietnam',
  'yemen': 'Yemen', 'zambia': 'Zambia', 'zimbabwe': 'Zimbabwe',
}

// Returns the properly-cased canonical country name, or null if unrecognised.
function lookupCountry(input) {
  return COUNTRY_LOOKUP[input.trim().toLowerCase()] || null
}

function getCountryPhoto(country) {
  return COUNTRY_PHOTOS[country?.toLowerCase()] ||
    // Fallback: a generic world-travel photo that at least isn't misleading.
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&auto=format&q=80'
}

// ---------- Mock data ----------
const SEED_TRAVELERS = [
  { id: 'u_maya', name: 'Maya Chen', handle: '@mayac', color: 'avatar-blush' },
  { id: 'u_daniel', name: 'Daniel Park', handle: '@dpark', color: 'avatar-sky' },
  { id: 'u_leila', name: 'Leila Ahmadi', handle: '@leila.a', color: 'avatar-sage' },
  { id: 'u_theo', name: 'Theo Rivera', handle: '@theorv', color: 'avatar-sand' },
  { id: 'u_noa', name: 'Noa Silva', handle: '@noasilva', color: 'avatar-terra' },
]

const SEED_INCOMING_TRAVELERS = [
  { id: 'rt_1', name: 'Alex Kim', handle: '@alexk', color: 'avatar-sky' },
  { id: 'rt_2', name: 'Yuki Tanaka', handle: '@yukit', color: 'avatar-blush' },
]

// A trip invite carries full host/co-planner context so the hub can render after accept.
const SEED_INCOMING_TRIPS = [
  {
    id: 'rp_1',
    tripName: 'Lisbon Summer',
    country: 'Portugal',
    dates: 'Jun 12 – Jun 22, 2026',
    tripLength: { value: 10, unit: 'days' },
    host: {
      id: 'u_maya', name: 'Maya Chen', handle: '@mayac', color: 'avatar-blush',
      role: 'host',
      datePrefs: [r(5, 12, 2026, 5, 22, 2026)],
      budget: { value: 2800, currency: 'USD' },
      accommodation: { types: ['hotel', 'airbnb'], headcount: 2, costPerNight: 220 },
      mustVisit: ['pt-alfama', 'pt-belem', 'pt-sintra', 'pt-lagos'],
      groupVotes: { interested: ['pt-belem', 'pt-sintra', 'pt-porto-douro'], passed: [] },
    },
    otherCoPlanners: [
      {
        id: 'u_daniel', name: 'Daniel Park', handle: '@dpark', color: 'avatar-sky',
        role: 'co-planner',
        datePrefs: [r(5, 15, 2026, 5, 25, 2026)],
        budget: { value: 3400, currency: 'USD' },
        accommodation: { types: ['hotel'], headcount: 3, costPerNight: 280 },
        mustVisit: ['pt-belem', 'pt-sintra', 'pt-porto-douro', 'pt-cascais'],
        groupVotes: { interested: ['pt-alfama', 'pt-belem', 'pt-sintra', 'pt-cascais'], passed: ['pt-lagos'] },
      },
      {
        id: 'u_leila', name: 'Leila Ahmadi', handle: '@leila.a', color: 'avatar-sage',
        role: 'co-planner',
        datePrefs: null,
        budget: null,
        accommodation: null,
        mustVisit: [],
        groupVotes: { interested: [], passed: [] },
      },
    ],
    adults: 3, children: 0, infants: 0,
  },
]

// Curated destination catalog. Each entry has lat/lng for map plotting and a
// one-sentence `desc` used in the swipe-deck card to tell travelers what the
// place actually is.
const DESTINATIONS = {
  japan: [
    { id: 'jp-shibuya', name: 'Shibuya Crossing', city: 'Tokyo', lat: 35.66, lng: 139.70, desc: 'The world\'s busiest pedestrian crossing, surrounded by neon billboards and Tokyo nightlife.' },
    { id: 'jp-fuji', name: 'Mount Fuji', city: 'Honshū', lat: 35.36, lng: 138.73, desc: 'Japan\'s iconic snow-capped volcano and a sacred climbing pilgrimage in summer.' },
    { id: 'jp-kinkakuji', name: 'Kinkaku-ji Temple', city: 'Kyoto', lat: 35.04, lng: 135.73, desc: 'A 14th-century Zen temple sheathed in gold leaf, mirrored in its surrounding pond.' },
    { id: 'jp-nara', name: 'Nara Park', city: 'Nara', lat: 34.68, lng: 135.84, desc: 'A sprawling park where hundreds of friendly deer roam freely among ancient temples.' },
    { id: 'jp-osaka-castle', name: 'Osaka Castle', city: 'Osaka', lat: 34.69, lng: 135.53, desc: 'A grand 16th-century castle tower set in cherry-blossom-lined grounds.' },
    { id: 'jp-dotonbori', name: 'Dōtonbori', city: 'Osaka', lat: 34.67, lng: 135.50, desc: 'A neon-lit canal district famous for takoyaki, okonomiyaki, and the Glico running-man sign.' },
    { id: 'jp-hakone', name: 'Hakone Hot Springs', city: 'Hakone', lat: 35.23, lng: 139.02, desc: 'A mountain resort town known for hot-spring ryokans and views of Mt. Fuji across Lake Ashi.' },
    { id: 'jp-tsukiji', name: 'Tsukiji Market', city: 'Tokyo', lat: 35.66, lng: 139.77, desc: 'A bustling outer market for street-food sushi, fresh seafood, and Japanese kitchenware.' },
    { id: 'jp-itsukushima', name: 'Itsukushima Shrine', city: 'Miyajima', lat: 34.30, lng: 132.32, desc: 'A Shinto shrine famous for its giant red torii gate that appears to float on the sea at high tide.' },
    { id: 'jp-arashiyama', name: 'Arashiyama Bamboo', city: 'Kyoto', lat: 35.02, lng: 135.67, desc: 'A towering bamboo grove on Kyoto\'s western edge with a serene walking path through emerald stalks.' },
  ],
  portugal: [
    { id: 'pt-alfama', name: 'Alfama District', city: 'Lisbon', lat: 38.71, lng: -9.13, desc: 'Lisbon\'s oldest quarter — a tangle of tile-clad lanes, fado bars, and viewpoints over the Tagus.' },
    { id: 'pt-belem', name: 'Belém Tower', city: 'Lisbon', lat: 38.69, lng: -9.22, desc: 'A 16th-century fortress on the Tagus riverfront and a symbol of Portugal\'s age of discovery.' },
    { id: 'pt-sintra', name: 'Sintra Palace', city: 'Sintra', lat: 38.80, lng: -9.39, desc: 'A fairytale hilltop palace of bright yellows and reds, set among misty forests and royal gardens.' },
    { id: 'pt-porto-douro', name: 'Douro Valley', city: 'Porto', lat: 41.15, lng: -7.78, desc: 'A terraced wine region carved by the Douro river, home to Portugal\'s celebrated port vineyards.' },
    { id: 'pt-lagos', name: 'Lagos Beaches', city: 'Algarve', lat: 37.10, lng: -8.67, desc: 'Golden-sand Atlantic beaches flanked by dramatic ochre cliffs and sea caves on the Algarve coast.' },
    { id: 'pt-obidos', name: 'Óbidos Village', city: 'Óbidos', lat: 39.36, lng: -9.16, desc: 'A whitewashed medieval village wrapped inside intact castle walls and known for cherry liqueur.' },
    { id: 'pt-cascais', name: 'Cascais', city: 'Cascais', lat: 38.70, lng: -9.42, desc: 'A breezy seaside town just west of Lisbon, mixing fishing-village charm with elegant promenades.' },
    { id: 'pt-evora', name: 'Évora Old Town', city: 'Évora', lat: 38.57, lng: -7.91, desc: 'A UNESCO-listed Alentejo city of Roman temples, narrow lanes, and a famous chapel of bones.' },
    { id: 'pt-madeira', name: 'Madeira Coast', city: 'Funchal', lat: 32.65, lng: -16.91, desc: 'A subtropical Atlantic island known for volcanic cliffs, levada hikes, and fortified Madeira wine.' },
  ],
  italy: [
    { id: 'it-colosseum', name: 'Colosseum', city: 'Rome', lat: 41.89, lng: 12.49, desc: 'The vast Roman amphitheatre that once hosted gladiator games for crowds of 50,000 spectators.' },
    { id: 'it-florence', name: 'Uffizi Gallery', city: 'Florence', lat: 43.77, lng: 11.26, desc: 'A Renaissance art museum holding Botticelli\'s Birth of Venus and works by Da Vinci and Michelangelo.' },
    { id: 'it-venice', name: "St. Mark's Square", city: 'Venice', lat: 45.43, lng: 12.34, desc: 'Venice\'s grand central piazza framed by St. Mark\'s Basilica, the Doge\'s Palace, and the Campanile.' },
    { id: 'it-amalfi', name: 'Amalfi Coast', city: 'Amalfi', lat: 40.63, lng: 14.60, desc: 'A cliffside Mediterranean coastline of pastel villages, lemon groves, and turquoise coves.' },
    { id: 'it-cinque', name: 'Cinque Terre', city: 'La Spezia', lat: 44.12, lng: 9.71, desc: 'Five colorful fishing villages stitched together by clifftop hiking trails along the Ligurian Sea.' },
  ],
  france: [
    { id: 'fr-eiffel', name: 'Eiffel Tower', city: 'Paris', lat: 48.86, lng: 2.29, desc: 'The 330-meter wrought-iron tower built in 1889 that has become Paris\'s defining landmark.' },
    { id: 'fr-louvre', name: 'The Louvre', city: 'Paris', lat: 48.86, lng: 2.34, desc: 'The world\'s most-visited museum, home to the Mona Lisa, Venus de Milo, and 35,000 other works.' },
    { id: 'fr-nice', name: 'Promenade des Anglais', city: 'Nice', lat: 43.70, lng: 7.27, desc: 'A palm-lined seafront walk hugging the pebble beaches of the French Riviera.' },
    { id: 'fr-mont', name: 'Mont Saint-Michel', city: 'Normandy', lat: 48.64, lng: -1.51, desc: 'A medieval abbey perched on a rocky tidal island that becomes surrounded by sea at high tide.' },
  ],
}

function getDestinationsForCountry(country) {
  return DESTINATIONS[country?.toLowerCase()] || []
}

function findDestinationById(id) {
  for (const list of Object.values(DESTINATIONS)) {
    const found = list.find((d) => d.id === id)
    if (found) return found
  }
  return null
}

function r(fm, fd, fy, tm, td, ty) {
  return { fromMonth: fm, fromDay: fd, fromYear: fy, toMonth: tm, toDay: td, toYear: ty }
}

const avatarColors = ['avatar-blush', 'avatar-sky', 'avatar-sage', 'avatar-sand', 'avatar-terra']

const PEAK_INFO = {
  japan: { months: 'March, April, and May', reason: 'cherry blossom season' },
  portugal: { months: 'June, July, and August', reason: 'warm Mediterranean summers and long coastal days' },
  italy: { months: 'May, June, and September', reason: 'mild weather before the hottest summer crowds' },
  france: { months: 'June, July, and September', reason: 'long days and peak festival season' },
  spain: { months: 'May, June, and September', reason: 'warm weather without the August heat wave' },
  iceland: { months: 'June, July, and August', reason: 'near-24-hour daylight and open highland roads' },
  morocco: { months: 'April, October, and November', reason: 'mild temperatures ideal for cities and desert alike' },
  greece: { months: 'May, June, and September', reason: 'warm seas and calmer island crowds' },
  thailand: { months: 'November, December, and January', reason: 'the dry cool season' },
  peru: { months: 'May, June, and July', reason: 'the dry season around the Andes and Machu Picchu' },
  mexico: { months: 'November, December, and March', reason: 'dry weather and cool evenings' },
  vietnam: { months: 'February, March, and April', reason: 'the mild dry season across most of the country' },
  'new zealand': { months: 'December, January, and February', reason: 'Southern-hemisphere summer' },
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const YEARS = [2026, 2027, 2028]

function daysInMonth(monthIdx, year) {
  return new Date(year, monthIdx + 1, 0).getDate()
}

function toDateObj(range, prefix) {
  return new Date(range[`${prefix}Year`], range[`${prefix}Month`], range[`${prefix}Day`])
}

function formatRange(range) {
  const f = `${MONTHS[range.fromMonth]} ${range.fromDay}, ${range.fromYear}`
  const t = `${MONTHS[range.toMonth]} ${range.toDay}, ${range.toYear}`
  return `${f} – ${t}`
}

function formatDate(d) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function tripLengthInDays(tl) {
  if (!tl) return 7
  if (tl.unit === 'days') return tl.value
  if (tl.unit === 'weeks') return tl.value * 7
  if (tl.unit === 'months') return tl.value * 30
  return tl.value
}

function formatTripLength(tl) {
  if (!tl) return ''
  const unit = tl.value === 1 ? tl.unit.slice(0, -1) : tl.unit
  return `${tl.value} ${unit}`
}

function overlapDays(aStart, aEnd, bStart, bEnd) {
  const s = Math.max(aStart.getTime(), bStart.getTime())
  const e = Math.min(aEnd.getTime(), bEnd.getTime())
  if (e < s) return 0
  return Math.floor((e - s) / 86400000) + 1
}

// Suggest a trip-length window that maximizes planner overlap.
function computeReco(planners, lengthDays) {
  const submitted = planners.filter((p) => p.datePrefs && p.datePrefs.length > 0)
  if (submitted.length === 0) return null

  const candidates = new Set()
  submitted.forEach((p) =>
    p.datePrefs.forEach((range) => {
      const start = toDateObj(range, 'from')
      const end = toDateObj(range, 'to')
      for (let d = new Date(start); d.getTime() <= end.getTime(); d.setDate(d.getDate() + 1)) {
        candidates.add(new Date(d).setHours(0, 0, 0, 0))
      }
    })
  )

  let best = null
  for (const startMs of candidates) {
    const start = new Date(startMs)
    const end = new Date(startMs)
    end.setDate(end.getDate() + lengthDays - 1)

    let count = 0
    let totalOverlap = 0
    submitted.forEach((p) => {
      let hasOverlap = false
      let maxOverlap = 0
      p.datePrefs.forEach((range) => {
        const od = overlapDays(start, end, toDateObj(range, 'from'), toDateObj(range, 'to'))
        if (od > 0) hasOverlap = true
        if (od > maxOverlap) maxOverlap = od
      })
      if (hasOverlap) count++
      totalOverlap += maxOverlap
    })

    if (
      !best ||
      count > best.count ||
      (count === best.count && totalOverlap > best.totalOverlap)
    ) {
      best = { start: new Date(start), end: new Date(end), count, total: submitted.length, totalOverlap }
    }
  }
  return best
}

// Aggregate budget across planners who've submitted one.
function computeBudgetInsight(planners) {
  const submitted = planners.filter((p) => p.budget && p.budget.value > 0)
  if (submitted.length === 0) return { count: 0, total: planners.length }
  const values = submitted.map((p) => p.budget.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const avg = Math.round(values.reduce((s, v) => s + v, 0) / values.length)
  const currency = submitted[0].budget.currency || 'USD'
  return { count: submitted.length, total: planners.length, min, max, avg, currency }
}

// Aggregate accommodation prefs.
function computeAccommodationInsight(planners) {
  const submitted = planners.filter((p) => p.accommodation && p.accommodation.types?.length > 0)
  if (submitted.length === 0) return { count: 0, total: planners.length, headcounts: [], costs: [], avgCost: null, topTypes: [] }
  const typeCounts = {}
  const headcounts = []
  const costs      = []
  submitted.forEach((p) => {
    p.accommodation.types.forEach((t) => { typeCounts[t] = (typeCounts[t] || 0) + 1 })
    const hc = Number(p.accommodation.headcount)
    if (Number.isFinite(hc) && hc > 0) headcounts.push(hc)
    const c = Number(p.accommodation.costPerNight)
    if (Number.isFinite(c) && c > 0) costs.push(c)
  })
  const topTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).map(([t, c]) => ({ type: t, count: c }))
  const avgCost  = costs.length > 0 ? Math.round(costs.reduce((s, n) => s + n, 0) / costs.length) : null
  return { count: submitted.length, total: planners.length, topTypes, headcounts, costs, avgCost }
}

// Build the 2-sentence summary for the Travel Hub accommodation section.
// - Sentence 1: preferred stay type based on the majority of picks.
// - Sentence 2: how many accommodations to book, based on headcounts vs
//   the total travelers listed in the trip setup.
function computeAccommodationSummary(insight, totalTravelers) {
  if (!insight || insight.count === 0) return null
  const top = insight.topTypes[0]
  const topLabel = top ? (ACCOMMODATION_TYPES.find((t) => t.id === top.type)?.label || top.type).toLowerCase() : null

  const accounted = insight.headcounts.reduce((s, n) => s + n, 0)
  const remaining = Math.max(0, totalTravelers - accounted)
  const groups = insight.headcounts.length + (remaining > 0 ? 1 : 0)

  let sentence1
  if (topLabel) {
    sentence1 = `Most travelers lean toward ${topLabel} stays based on the majority of picks so far.`
  } else {
    sentence1 = 'No clear stay preference has emerged yet.'
  }

  let sentence2
  if (totalTravelers <= 0) {
    sentence2 = 'Add traveler counts in the trip setup to estimate rooms needed.'
  } else if (groups === 0) {
    sentence2 = `Plan for 1 accommodation for all ${totalTravelers} traveler${totalTravelers !== 1 ? 's' : ''} until headcounts come in.`
  } else if (remaining > 0) {
    const hcParts = insight.headcounts.map((n) => `${n}`).join(', ')
    sentence2 = `Based on submitted headcounts (${hcParts}), plan for ${groups} accommodation${groups !== 1 ? 's' : ''} — ${insight.headcounts.length} for the submitted group${insight.headcounts.length !== 1 ? 's' : ''} covering ${accounted} ${accounted === 1 ? 'person' : 'people'}, plus 1 for the remaining ${remaining} traveler${remaining !== 1 ? 's' : ''}.`
  } else {
    sentence2 = `Based on submitted headcounts, plan for ${groups} accommodation${groups !== 1 ? 's' : ''} covering all ${totalTravelers} traveler${totalTravelers !== 1 ? 's' : ''}.`
  }

  return { sentence1, sentence2, groups, accounted, remaining }
}

// Resolve a planner's mustVisit entry (id string OR full object) into a full
// destination object. Returns null when nothing can be resolved.
function resolveDestEntry(entry) {
  if (typeof entry === 'string') return findDestinationById(entry)
  if (entry && typeof entry === 'object' && entry.id) return entry
  return null
}

// Build the full pool of destinations any planner has picked. This is the
// candidate set the Group Selection swipe deck shuffles through.
function collectGroupPool(planners) {
  const map = new Map() // id -> destination
  planners.forEach((p) => {
    (p.mustVisit || []).forEach((entry) => {
      const dest = resolveDestEntry(entry)
      if (!dest) return
      if (!map.has(dest.id)) map.set(dest.id, dest)
    })
  })
  return Array.from(map.values())
}

// Rank destinations by total interest across the group. Every destination on
// a planner's mustVisit list counts as an implicit "Interested" vote from
// that planner (a destination you add is, by definition, one you're
// interested in). On top of that, planners can explicitly swipe Interested
// on other planners' picks via the Group Selection deck — those count too.
// Only destinations with >= 2 unique interested planners appear in the
// ranked list, so a pick from a single traveler isn't enough to surface here.
function computeTopDestinations(planners) {
  const pool = new Map() // id -> destination object
  planners.forEach((p) => {
    (p.mustVisit || []).forEach((entry) => {
      const dest = resolveDestEntry(entry)
      if (!dest) return
      if (!pool.has(dest.id)) pool.set(dest.id, dest)
    })
  })

  // Each planner contributes one vote per unique id in (their picks ∪ their
  // explicit swipe votes). Picks and swipes for the same id by the same
  // planner are deduped via Set so we don't double-count.
  const interestCounts = new Map() // id -> count of distinct planners
  planners.forEach((p) => {
    const ownPickIds = (p.mustVisit || [])
      .map((entry) => (typeof entry === 'string' ? entry : entry?.id))
      .filter(Boolean)
    const explicitVotes = p.groupVotes?.interested || []
    const effective = new Set([...ownPickIds, ...explicitVotes])
    effective.forEach((id) => {
      interestCounts.set(id, (interestCounts.get(id) || 0) + 1)
    })
  })

  const ranked = []
  pool.forEach((dest, id) => {
    const count = interestCounts.get(id) || 0
    if (count >= 2) ranked.push({ ...dest, count })
  })
  return ranked.sort((a, b) => b.count - a.count).slice(0, 10)
}

// Format currency amount.
function formatCurrency(value, currency = 'USD') {
  const symbol = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', JPY: '¥' }[currency] || '$'
  return `${symbol}${value.toLocaleString()}`
}

const ACCOMMODATION_TYPES = [
  { id: 'hotel', label: 'Hotel' },
  { id: 'airbnb', label: 'Airbnb / Rental' },
  { id: 'hostel', label: 'Hostel' },
  { id: 'resort', label: 'Resort' },
  { id: 'boutique', label: 'Boutique Inn' },
]

// ---------- Shared phone chrome ----------
function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span className="right">
        <span>•••</span>
        <span>◐</span>
        <span>▮</span>
      </span>
    </div>
  )
}

function Toast({ text }) {
  if (!text) return null
  return <div className="toast">{text}</div>
}

// ---------- Sign Up ----------
function SignUp({ onSignUp }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const canSubmit = name.trim() && email.trim() && password.length >= 4

  return (
    <div className="screen screen-enter">
      <div className="signup">
        <div className="hero">
          <div className="logo-mark"><IconLeaf width={28} height={28} /></div>
          <div className="app-name">Triply</div>
          <div className="tag">Plan trips together, without the group-chat chaos.</div>
        </div>

        <div className="form-stack">
          <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button
            className="btn btn-primary"
            disabled={!canSubmit}
            style={!canSubmit ? { opacity: 0.5 } : {}}
            onClick={() => onSignUp(name.trim())}
          >
            Create my account
          </button>

          <div className="divider">or</div>
          <div className="social-row">
            <button className="social-btn"><IconApple width={16} height={16} /> Apple</button>
            <button className="social-btn"><IconGoogle width={16} height={16} /> Google</button>
          </div>
        </div>

        <div className="signup-footer">
          Already planning with us? <button className="btn-link" onClick={() => onSignUp('Justin')}>Sign in</button>
        </div>

        <button className="dev-skip" onClick={() => onSignUp('Dev')}>
          <IconBolt width={12} height={12} /> Dev skip
        </button>
      </div>
    </div>
  )
}

// ---------- Bottom nav ----------
function BottomNav({ active, onChange, requestsCount }) {
  const items = [
    { id: 'home', label: 'Home', Icon: IconHome },
    { id: 'requests', label: 'Requests', Icon: IconBell },
    { id: 'travelers', label: 'Travelers', Icon: IconUsers },
    { id: 'me', label: 'Me', Icon: IconUser },
  ]
  return (
    <div className="bottom-nav">
      {items.map(({ id, label, Icon }) => (
        <button key={id} className={`nav-btn ${active === id ? 'active' : ''}`} onClick={() => onChange(id)}>
          <Icon />
          <span>
            {label}
            {id === 'requests' && requestsCount > 0 && <span className="nav-badge">{requestsCount}</span>}
          </span>
        </button>
      ))}
    </div>
  )
}

// ---------- Home ----------
function Home({ userName, trips, onNewTrip, onNewTraveler, onOpenTrip }) {
  const [fabOpen, setFabOpen] = useState(false)

  return (
    <div className="screen-scroll">
      <div className="home-greeting">
        <div className="hello">Hello, {userName || 'traveler'}</div>
        <div className="h1">Where to next?</div>
      </div>

      <div className="section-header">
        <div className="h2">Upcoming Trips</div>
      </div>

      {trips.length === 0 ? (
        <div className="empty-card minimal">
          <span className="sticker"><IconPaperPlane width={22} height={22} /></span>
          <div className="title">You have no upcoming trips planned.</div>
          <button className="cta" onClick={onNewTrip}>Plan a trip →</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {trips.map((t) => (
            <button key={t.id} className="trip-card" onClick={() => onOpenTrip(t.id)}>
              <div className="trip-card-content">
                <div className="tc-eyebrow">{t.country}</div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-meta">
                  {formatTripLength(t.tripLength)} &nbsp;·&nbsp;
                  {t.adults} adult{t.adults !== 1 ? 's' : ''}
                  {t.children > 0 ? `, ${t.children} child${t.children !== 1 ? 'ren' : ''}` : ''}
                  {t.infants > 0 ? `, ${t.infants} infant${t.infants !== 1 ? 's' : ''}` : ''}
                </div>
                <div className="tc-planners">
                  <span className="tc-dot" />
                  {t.planners.length} planner{t.planners.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="trip-card-img-wrap">
                <div className="trip-card-img" style={{ backgroundImage: `url(${getCountryPhoto(t.country)})` }} />
                <div className="trip-card-img-fade" />
              </div>
            </button>
          ))}
        </div>
      )}

      <HomeFab open={fabOpen} setOpen={setFabOpen} onNewTrip={onNewTrip} onNewTraveler={onNewTraveler} />
    </div>
  )
}

function HomeFab({ open, setOpen, onNewTrip, onNewTraveler }) {
  return (
    <>
      <div className={`scrim ${open ? 'visible' : ''}`} onClick={() => setOpen(false)} />
      <div className="fab">
        <div className={`fab-bubbles ${open ? 'open' : ''}`}>
          <button className="fab-bubble" onClick={() => { setOpen(false); onNewTraveler() }}>
            <span>New Traveler</span>
            <span className="dot sage"><IconUsers width={16} height={16} /></span>
          </button>
          <button className="fab-bubble" onClick={() => { setOpen(false); onNewTrip() }}>
            <span>New Trip</span>
            <span className="dot blush"><IconMap width={16} height={16} /></span>
          </button>
        </div>
        <button className={`fab-main ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)}>
          <IconPlus width={24} height={24} />
        </button>
      </div>
    </>
  )
}

// ---------- Travelers tab ----------
function TravelersTab({ travelers, onAddTraveler }) {
  return (
    <div className="screen-scroll">
      <div className="h1" style={{ marginBottom: 6, paddingTop: 6 }}>Your crew</div>
      <div className="body" style={{ marginBottom: 16 }}>
        People you plan trips with. Add someone by their Traveler ID.
      </div>

      <input className="search-input" placeholder="Search travelers" />

      {travelers.length === 0 ? (
        <div className="empty-card">
          <div className="title">No travelers yet</div>
          <div className="copy">Tap the + button to send a Traveler request.</div>
        </div>
      ) : (
        travelers.map((t) => (
          <div key={t.id} className="traveler-card">
            <div className={`avatar ${t.color}`}>{t.name[0]}</div>
            <div className="meta">
              <div className="name">{t.name}</div>
              <div className="handle">{t.handle}</div>
            </div>
            <div className="pill sage"><IconCheck width={12} height={12} /> Connected</div>
          </div>
        ))
      )}

      <button className="add-range-btn" style={{ marginTop: 18 }} onClick={onAddTraveler}>
        <span className="plus-circle"><IconPlus width={16} height={16} /></span>
        Add a new Traveler
      </button>
    </div>
  )
}

// ---------- Requests tab ----------
function RequestsTab({
  incomingTravelers, incomingTrips,
  onAcceptTraveler, onRejectTraveler,
  onAcceptTrip, onRejectTrip,
}) {
  const [sub, setSub] = useState('travelers')
  return (
    <div className="screen-scroll">
      <div className="h1" style={{ marginBottom: 6, paddingTop: 6 }}>Requests</div>
      <div className="body" style={{ marginBottom: 14 }}>People and trips waiting on your response.</div>

      <div className="segmented">
        <button className={`seg ${sub === 'travelers' ? 'active' : ''}`} onClick={() => setSub('travelers')}>
          Travelers {incomingTravelers.length > 0 ? `· ${incomingTravelers.length}` : ''}
        </button>
        <button className={`seg ${sub === 'trips' ? 'active' : ''}`} onClick={() => setSub('trips')}>
          Trips {incomingTrips.length > 0 ? `· ${incomingTrips.length}` : ''}
        </button>
      </div>

      {sub === 'travelers' && (
        incomingTravelers.length === 0 ? (
          <div className="empty-card">
            <div className="title">No traveler requests</div>
            <div className="copy">When someone adds you as a Traveler, you'll see it here.</div>
          </div>
        ) : incomingTravelers.map((r) => (
          <div key={r.id} className="request-card">
            <div className={`avatar ${r.color}`}>{r.name[0]}</div>
            <div className="meta">
              <div className="name">{r.name}</div>
              <div className="sub">wants to add you · {r.handle}</div>
            </div>
            <div className="actions">
              <button className="action-btn reject" onClick={() => onRejectTraveler(r.id)} aria-label="Reject">
                <IconMinus width={16} height={16} />
              </button>
              <button className="action-btn accept" onClick={() => onAcceptTraveler(r.id)} aria-label="Accept">
                <IconCheck width={16} height={16} />
              </button>
            </div>
          </div>
        ))
      )}

      {sub === 'trips' && (
        incomingTrips.length === 0 ? (
          <div className="empty-card">
            <div className="title">No trip invites</div>
            <div className="copy">When a friend invites you on a trip, it'll show up here.</div>
          </div>
        ) : incomingTrips.map((r) => (
          <div key={r.id} className="request-card trip-request">
            <div className="trip-request-thumb" style={{ backgroundImage: `url(${getCountryPhoto(r.country)})` }}>
              <div className="trip-request-thumb-fade" />
            </div>
            <div className="meta">
              <div className="tc-eyebrow">{r.country}</div>
              <div className="name">{r.tripName}</div>
              <div className="sub">{r.dates}</div>
              <div className="sub" style={{ marginTop: 2 }}>from {r.host.name}</div>
            </div>
            <div className="actions">
              <button className="action-btn reject" onClick={() => onRejectTrip(r.id)} aria-label="Reject">
                <IconMinus width={16} height={16} />
              </button>
              <button className="action-btn accept" onClick={() => onAcceptTrip(r.id)} aria-label="Accept">
                <IconCheck width={16} height={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ---------- Me tab ----------
function MeTab({ userName }) {
  return (
    <div className="screen-scroll">
      <div className="h1" style={{ paddingTop: 6 }}>Profile</div>
      <div className="body" style={{ marginBottom: 20 }}>Your Triply account</div>
      <div className="traveler-card" style={{ padding: 16 }}>
        <div className="avatar avatar-terra" style={{ width: 56, height: 56, fontSize: 20 }}>
          {userName ? userName[0].toUpperCase() : 'T'}
        </div>
        <div className="meta">
          <div className="name" style={{ fontSize: 17 }}>{userName || 'Traveler'}</div>
          <div className="handle">@{(userName || 'you').toLowerCase()}</div>
        </div>
      </div>
    </div>
  )
}

// ---------- New Traveler ----------
function NewTraveler({ onBack, onSend }) {
  const [id, setId] = useState('')

  const submit = () => {
    if (!id.trim()) return
    onSend(id.trim())
  }

  return (
    <div className="screen screen-enter">
      <div className="topbar">
        <button className="back" onClick={onBack}><IconArrowLeft /></button>
        <span className="step">New Traveler</span>
        <span style={{ width: 40 }} />
      </div>

      <div className="screen-scroll">
        <div className="prompt-block" style={{ marginTop: 18 }}>
          <div className="eyebrow">Invite</div>
          <div className="dialogue">Add someone to your Travelers list by their Traveler ID.</div>
        </div>

        <div className="body" style={{ marginBottom: 14 }}>
          They'll get a notification that you've added them. Once they accept, you can plan trips together.
        </div>

        <div className="send-row">
          <input
            className="input"
            placeholder="@travelerID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoFocus
          />
          <button className="icon-btn primary" onClick={submit} aria-label="Send request">
            <IconSend width={18} height={18} />
          </button>
        </div>

        <div className="tiny" style={{ marginTop: 22, marginBottom: 10 }}>Recent suggestions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { handle: '@saraho', name: 'Sarah O.' },
            { handle: '@jin.kim', name: 'Jin Kim' },
            { handle: '@priyav', name: 'Priya V.' },
          ].map((s, i) => (
            <div key={s.handle} className="traveler-card">
              <div className={`avatar ${avatarColors[i % avatarColors.length]}`}>{s.name[0]}</div>
              <div className="meta">
                <div className="name">{s.name}</div>
                <div className="handle">{s.handle}</div>
              </div>
              <button className="btn btn-soft" onClick={() => onSend(s.handle)}>Invite</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------- Date range row (shared) ----------
function DateRangeRow({ range, onChange, onRemove, canRemove, index }) {
  const setField = (key, value) => onChange({ ...range, [key]: value })
  const fromDays = daysInMonth(range.fromMonth, range.fromYear)
  const toDays = daysInMonth(range.toMonth, range.toYear)

  return (
    <div className="date-range-card">
      <div className="row-header">
        <span className="row-label">Range {index + 1}</span>
        {canRemove && (
          <button className="remove-btn" onClick={onRemove} aria-label="Remove range">
            <IconMinus width={14} height={14} />
          </button>
        )}
      </div>

      <div className="date-line">
        <span className="tag">From</span>
        <select className="date-select month" value={range.fromMonth} onChange={(e) => setField('fromMonth', +e.target.value)}>
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <select className="date-select day" value={range.fromDay} onChange={(e) => setField('fromDay', +e.target.value)}>
          {Array.from({ length: fromDays }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="date-select year" value={range.fromYear} onChange={(e) => setField('fromYear', +e.target.value)}>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="date-line">
        <span className="tag">To</span>
        <select className="date-select month" value={range.toMonth} onChange={(e) => setField('toMonth', +e.target.value)}>
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <select className="date-select day" value={range.toDay} onChange={(e) => setField('toDay', +e.target.value)}>
          {Array.from({ length: toDays }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="date-select year" value={range.toYear} onChange={(e) => setField('toYear', +e.target.value)}>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  )
}

function makeDefaultRange() {
  return { fromMonth: 5, fromDay: 10, fromYear: 2026, toMonth: 5, toDay: 20, toYear: 2026 }
}

// ---------- Setup confirmation modal ----------
function SetupConfirmModal({ onProceed, onCancel }) {
  const [dontShow, setDontShow] = useState(false)
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-title">Ready to send invites?</div>
        <div className="modal-body">
          Your trip will be set up, and your travelers will be invited to join. Would you like to proceed?
        </div>
        <div className={`modal-check ${dontShow ? 'checked' : ''}`} onClick={() => setDontShow((v) => !v)}>
          <span className="box">{dontShow && <IconCheck width={14} height={14} />}</span>
          <span>Don't show this message again</span>
        </div>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={() => onProceed(dontShow)}>Please proceed</button>
          <button className="btn btn-ghost" onClick={onCancel}>Hang on</button>
        </div>
      </div>
    </div>
  )
}

// ---------- New Trip wizard ----------
function NewTripWizard({
  travelers, onCancel, onFinish, currentUserName, showConfirmation, onDismissConfirmation,
}) {
  // Steps: 1 Country, 2 Counts, 3 Planners (skip if adults==1), 4 Length, 5 Dates, 6 Name
  const [step, setStep] = useState(1)
  const [country, setCountry] = useState('')
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [selectedPlanners, setSelectedPlanners] = useState([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [lengthValue, setLengthValue] = useState(10)
  const [lengthUnit, setLengthUnit] = useState('days')
  const [dateRanges, setDateRanges] = useState([makeDefaultRange()])
  const [tripName, setTripName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [countryError, setCountryError] = useState('')

  const totalSteps = adults > 1 ? 6 : 5
  const visibleStep = step > 3 && adults === 1 ? step - 1 : step

  const peak = useMemo(() => PEAK_INFO[country.trim().toLowerCase()], [country])

  const goNext = () => {
    if (step === 1) {
      const canonical = lookupCountry(country)
      if (!canonical) {
        setCountryError('Please enter the name of a country (e.g. Japan, India, Brazil).')
        return
      }
      setCountry(canonical)
      setCountryError('')
      setStep(2)
      return
    }
    if (step === 2) setStep(adults > 1 ? 3 : 4)
    else if (step === 3) setStep(4)
    else if (step === 4 && lengthValue > 0) setStep(5)
    else if (step === 5) setStep(6)
    else if (step === 6) tryFinish()
  }

  const pickInspoCountry = (name) => {
    const canonical = lookupCountry(name) || name
    setCountry(canonical)
    setCountryError('')
    setStep(2)
  }

  const goBack = () => {
    if (step === 1) onCancel()
    else if (step === 2) setStep(1)
    else if (step === 3) setStep(2)
    else if (step === 4) setStep(adults > 1 ? 3 : 2)
    else if (step === 5) setStep(4)
    else if (step === 6) setStep(5)
  }

  const tryFinish = () => {
    if (selectedPlanners.length > 0 && showConfirmation) {
      setShowModal(true)
    } else {
      finalize()
    }
  }

  const finalize = () => {
    onFinish({
      country: country.trim(),
      adults, children, infants,
      planners: selectedPlanners,
      dateRanges,
      name: tripName.trim() || country.trim(),
      tripLength: { value: Number(lengthValue), unit: lengthUnit },
    })
  }

  const stepLabel = `Step ${visibleStep} of ${totalSteps} · New Trip`

  return (
    <div className="screen screen-enter">
      <div className="topbar">
        <button className="back" onClick={goBack}><IconArrowLeft /></button>
        <span className="step">{stepLabel}</span>
        <span style={{ width: 40 }} />
      </div>

      {/* STEP 1: Country */}
      {step === 1 && (
        <div className="wizard">
          <div className="scroll">
            <div className="prompt-block" style={{ marginTop: 18 }}>
              <div className="eyebrow">Destination</div>
              <div className="dialogue">New trip? How exciting! Where would you like to go?</div>
            </div>

            <div className="send-row">
              <input
                className={`input ${countryError ? 'input-error' : ''}`}
                placeholder="e.g. Japan, India, Brazil…"
                value={country}
                onChange={(e) => { setCountry(e.target.value); setCountryError('') }}
                onKeyDown={(e) => e.key === 'Enter' && country.trim() && goNext()}
                autoFocus
              />
              <button
                className="icon-btn primary"
                disabled={!country.trim()}
                style={!country.trim() ? { opacity: 0.4 } : {}}
                onClick={() => country.trim() && goNext()}
              >
                <IconSend width={18} height={18} />
              </button>
            </div>

            {countryError && (
              <div className="country-error">
                {countryError}
              </div>
            )}

            <div className="tiny" style={{ marginTop: 24, marginBottom: 10 }}>Trending with your crew</div>
            <div className="inspo-row">
              {['Japan', 'Portugal', 'Morocco', 'Iceland'].map((c, i) => (
                <button
                  key={c}
                  className="inspo-card"
                  style={{
                    background: ['var(--blush)', 'var(--sage)', 'var(--sky)', 'var(--sand)'][i],
                    textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}
                  onClick={() => pickInspoCountry(c)}
                >
                  <span className="tag">Popular</span>
                  <span className="place">{c}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Counts */}
      {step === 2 && (
        <div className="wizard">
          <div className="scroll">
            <div className="prompt-block" style={{ marginTop: 18 }}>
              <div className="eyebrow">Travelers</div>
              <div className="dialogue">How many travelers are going to {country}?</div>
            </div>

            <div className="counter-group">
              <CounterRow label="Adults" sub="13+" value={adults} setValue={setAdults} min={1} />
              <CounterRow label="Children" sub="2 – 12" value={children} setValue={setChildren} min={0} />
              <CounterRow label="Infants" sub="0 – 2" value={infants} setValue={setInfants} min={0} />
            </div>
          </div>

          <button className="fab-continue" onClick={goNext} aria-label="Continue"><IconArrowRight width={22} height={22} /></button>
        </div>
      )}

      {/* STEP 3: Planners */}
      {step === 3 && !pickerOpen && (
        <div className="wizard">
          <div className="scroll">
            <div className="prompt-block" style={{ marginTop: 18 }}>
              <div className="eyebrow">Group planning</div>
              <div className="dialogue">Who is planning this trip?</div>
            </div>

            <div className="body" style={{ marginBottom: 14 }}>
              Add other travelers from your crew. They become Co-Planners and can edit the itinerary, vote on stays, and add ideas.
            </div>

            <button className="add-row" onClick={() => setPickerOpen(true)}>
              <span className="plus-circle"><IconPlus width={18} height={18} /></span>
              <span>Add Traveler</span>
            </button>

            {selectedPlanners.length > 0 && (
              <>
                <div className="tiny" style={{ marginTop: 22, marginBottom: 10 }}>Selected planners</div>
                {[
                  { id: 'me', name: `${currentUserName || 'You'} (you)`, handle: '@you', color: 'avatar-terra', role: 'host' },
                  ...travelers
                    .filter((t) => selectedPlanners.includes(t.id))
                    .map((t) => ({ ...t, role: 'co' })),
                ].map((t) => (
                  <div key={t.id} className="traveler-card">
                    <div className={`avatar ${t.color}`}>{t.name[0]}</div>
                    <div className="meta">
                      <div className="name">
                        {t.name}
                        <span className={`role-pill ${t.role === 'host' ? 'host' : 'co'}`}>
                          {t.role === 'host' ? 'Host' : 'Co-Planner'}
                        </span>
                      </div>
                      <div className="handle">{t.handle}</div>
                    </div>
                    {t.id !== 'me' && (
                      <button className="action" onClick={() => setSelectedPlanners((s) => s.filter((x) => x !== t.id))} aria-label="Remove">
                        <IconMinus width={16} height={16} />
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          <button className="fab-continue" onClick={goNext} aria-label="Continue"><IconArrowRight width={22} height={22} /></button>
        </div>
      )}

      {step === 3 && pickerOpen && (
        <div className="wizard">
          <div className="scroll">
            <div className="prompt-block" style={{ marginTop: 8 }}>
              <div className="eyebrow">From your Travelers</div>
              <div className="h2">Tap + to add planners</div>
            </div>

            <input className="search-input" placeholder="Search travelers" />

            {travelers.map((t) => {
              const selected = selectedPlanners.includes(t.id)
              return (
                <div key={t.id} className="traveler-card">
                  <div className={`avatar ${t.color}`}>{t.name[0]}</div>
                  <div className="meta">
                    <div className="name">{t.name}</div>
                    <div className="handle">{t.handle}</div>
                  </div>
                  <button
                    className={`action ${selected ? 'selected' : ''}`}
                    onClick={() => setSelectedPlanners((s) => selected ? s.filter((x) => x !== t.id) : [...s, t.id])}
                    aria-label={selected ? 'Remove' : 'Add'}
                  >
                    {selected ? <IconCheck width={16} height={16} /> : <IconPlus width={16} height={16} />}
                  </button>
                </div>
              )
            })}
          </div>

          <button className="fab-continue" onClick={() => setPickerOpen(false)} aria-label="Confirm selection"><IconArrowRight width={22} height={22} /></button>
        </div>
      )}

      {/* STEP 4: Trip length */}
      {step === 4 && (
        <div className="wizard">
          <div className="scroll">
            <div className="prompt-block" style={{ marginTop: 18 }}>
              <div className="eyebrow">Duration</div>
              <div className="dialogue">How long will this trip be?</div>
            </div>

            <div className="body" style={{ marginBottom: 18 }}>
              This helps us pick a window that overlaps with everyone's availability.
            </div>

            <div className="length-row">
              <input
                className="num"
                type="number"
                min="1"
                value={lengthValue}
                onChange={(e) => setLengthValue(e.target.value === '' ? '' : Math.max(1, +e.target.value))}
              />
              <select className="unit" value={lengthUnit} onChange={(e) => setLengthUnit(e.target.value)}>
                <option value="days">Day(s)</option>
                <option value="weeks">Week(s)</option>
                <option value="months">Month(s)</option>
              </select>
            </div>

            <div className="tip-banner" style={{ marginTop: 18 }}>
              <span className="tip-icon"><IconBulb width={14} height={14} /></span>
              <span>
                <span className="tip-label">Tip:</span> Most international trips land between <strong>7 and 14 days</strong>. You can always adjust later.
              </span>
            </div>
          </div>

          <button
            className="fab-continue"
            onClick={goNext}
            disabled={!lengthValue || lengthValue < 1}
            aria-label="Continue"
          >
            <IconArrowRight width={22} height={22} />
          </button>
        </div>
      )}

      {/* STEP 5: Dates */}
      {step === 5 && (
        <div className="wizard">
          <div className="scroll">
            <div className="prompt-block" style={{ marginTop: 18 }}>
              <div className="eyebrow">Dates</div>
              <div className="dialogue">What dates are you thinking?</div>
            </div>

            <div className="body" style={{ marginBottom: 14 }}>
              Share your preferred date ranges as the Host. Co-Planners will add theirs after joining.
            </div>

            {dateRanges.map((r, i) => (
              <DateRangeRow
                key={i}
                index={i}
                range={r}
                canRemove={dateRanges.length > 1}
                onChange={(next) => setDateRanges((arr) => arr.map((x, idx) => (idx === i ? next : x)))}
                onRemove={() => setDateRanges((arr) => arr.filter((_, idx) => idx !== i))}
              />
            ))}

            <button className="add-range-btn" onClick={() => setDateRanges((arr) => [...arr, makeDefaultRange()])}>
              <span className="plus-circle"><IconPlus width={14} height={14} /></span>
              Add another date range
            </button>

            <div className="tip-banner">
              <span className="tip-icon"><IconBulb width={14} height={14} /></span>
              <span>
                <span className="tip-label">Tip:</span>{' '}
                {peak ? (
                  <>In {country}, peak months to travel are <strong>{peak.months}</strong> due to {peak.reason}.</>
                ) : (
                  <>Peak months in {country || 'your destination'} vary — worth a quick check before you lock dates.</>
                )}
              </span>
            </div>
          </div>

          <button className="fab-continue" onClick={goNext} aria-label="Continue"><IconArrowRight width={22} height={22} /></button>
        </div>
      )}

      {/* STEP 6: Name */}
      {step === 6 && (
        <div className="wizard">
          <div className="scroll">
            <div className="prompt-block" style={{ marginTop: 18 }}>
              <div className="eyebrow">Almost there</div>
              <div className="dialogue">What should we name this trip?</div>
            </div>

            <input
              className="input"
              placeholder={`e.g. ${country} Summer '26`}
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              autoFocus
            />

            <div className="tiny" style={{ marginTop: 24, marginBottom: 10 }}>Trip summary</div>
            <div className="traveler-card" style={{ alignItems: 'flex-start' }}>
              <div className="avatar avatar-blush" style={{ fontFamily: 'var(--font-serif)' }}>
                {country[0]?.toUpperCase() || '?'}
              </div>
              <div className="meta">
                <div className="name">{country}</div>
                <div className="handle">
                  {lengthValue || 0} {lengthUnit} ·{' '}
                  {adults} adult{adults !== 1 ? 's' : ''}
                  {children > 0 ? `, ${children} child${children !== 1 ? 'ren' : ''}` : ''}
                  {infants > 0 ? `, ${infants} infant${infants !== 1 ? 's' : ''}` : ''}
                </div>
                <div className="handle" style={{ marginTop: 2 }}>
                  {dateRanges.map(formatRange).join(' · ')}
                </div>
                {selectedPlanners.length > 0 && (
                  <div className="handle" style={{ marginTop: 2 }}>
                    {selectedPlanners.length} co-planner{selectedPlanners.length !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className="setup-btn" disabled={!tripName.trim()} onClick={tryFinish}>
            Set up my trip <IconArrowRight width={16} height={16} />
          </button>
        </div>
      )}

      {showModal && (
        <SetupConfirmModal
          onProceed={(dontShow) => {
            setShowModal(false)
            if (dontShow) onDismissConfirmation()
            finalize()
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

function CounterRow({ label, sub, value, setValue, min = 0 }) {
  return (
    <div className="counter-row">
      <div className="info">
        <div className="label">{label}</div>
        <div className="sub">{sub}</div>
      </div>
      <div className="controls">
        <button className="counter-btn minus" onClick={() => setValue(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label}`}>
          <IconMinus width={16} height={16} />
        </button>
        <span className="count">{value}</span>
        <button className="counter-btn plus" onClick={() => setValue(value + 1)} aria-label={`Increase ${label}`}>
          <IconPlus width={16} height={16} />
        </button>
      </div>
    </div>
  )
}

// ---------- Travel Hub (shared) ----------
function TravelHub({ trip, currentUserId, onBack, onOpenEditor, onOpenItinerary }) {
  const [tab, setTab] = useState('hub') // 'hub' | 'prefs'
  const [showPlanners, setShowPlanners] = useState(false)

  const me = trip.planners.find((p) => p.id === currentUserId)
  const host = trip.planners.find((p) => p.role === 'host')
  const missingMyDates = !me?.datePrefs || me.datePrefs.length === 0

  const reco = useMemo(
    () => computeReco(trip.planners, tripLengthInDays(trip.tripLength)),
    [trip.planners, trip.tripLength]
  )
  const budgetInsight = useMemo(() => computeBudgetInsight(trip.planners), [trip.planners])
  const accomInsight = useMemo(() => computeAccommodationInsight(trip.planners), [trip.planners])
  const totalTravelers = (trip.adults || 0) + (trip.children || 0) + (trip.infants || 0)
  const accomSummary = useMemo(
    () => computeAccommodationSummary(accomInsight, totalTravelers),
    [accomInsight, totalTravelers]
  )
  const destinations = useMemo(() => computeTopDestinations(trip.planners), [trip.planners])

  return (
    <div className="screen screen-enter">
      <div className="topbar">
        <button className="back" onClick={onBack}><IconArrowLeft /></button>
        <span className="step">Travel Hub</span>
        <button className="planners-btn" onClick={() => setShowPlanners(true)}>
          <span className="planners-label">Planners</span>
          <div className="avatar-stack">
            {trip.planners.slice(0, 4).map((p, i) => (
              <div key={p.id} className={`avatar-sm ${p.color}`} style={{ zIndex: 10 - i }}>
                {p.name[0]}
              </div>
            ))}
          </div>
        </button>
      </div>

      <div className="screen-scroll">
        <div className="hub-header has-hero">
          <div className="hub-hero" style={{ backgroundImage: `url(${getCountryPhoto(trip.country)})` }}>
            <div className="hub-hero-fade" />
          </div>
          <div className="hub-header-body">
            <div className="eyebrow">Trip</div>
            <div className="hub-title">{trip.name}</div>
            <div className="hub-sub">
              {trip.country} · {formatTripLength(trip.tripLength)} · hosted by {host ? (host.id === currentUserId ? 'you' : host.name) : '—'}
            </div>
          </div>
        </div>

        <div className="hub-tabs">
          <button className={`hub-tab ${tab === 'hub' ? 'active' : ''}`} onClick={() => setTab('hub')}>Travel Hub</button>
          <button className="hub-tab" onClick={onOpenItinerary}>Itinerary</button>
          <button className={`hub-tab ${tab === 'prefs' ? 'active' : ''}`} onClick={() => setTab('prefs')}>My Preferences</button>
        </div>

        {tab === 'hub' && (
          <>
            {/* Suggested Trip Date — sits above the Travel Optimizer header */}
            {reco && (
              <div className="reco-card">
                <span className="spark"><IconSpark width={14} height={14} /></span>
                <div className="pill">Suggested Trip Date</div>
                <div className="title">
                  {formatDate(reco.start)} – {formatDate(reco.end)}
                </div>
                <div className="meta">
                  Best window across planners who've submitted preferences ({reco.count} of {reco.total} overlap).
                </div>
                <div className="bar">
                  {Array.from({ length: reco.total }).map((_, i) => (
                    <span key={i} className={`bar-seg ${i < reco.count ? 'on' : ''}`} />
                  ))}
                </div>
              </div>
            )}

            <div className="hub-section-title optimizer-title">Travel Optimizer</div>

            {/* Each section only renders if it has content. If none do, show a
                single combined empty state. */}
            {budgetInsight.count === 0 && accomInsight.count === 0 && destinations.length === 0 ? (
              <div className="optimizer-empty">
                No information available, planners can update this section via "My Preferences"
              </div>
            ) : (
              <>
                {budgetInsight.count > 0 && (
                  <>
                    <div className="hub-section-title">Traveler Budget</div>
                    <div className="insight-card budget">
                      <div className="insight-row">
                        <div className="insight-figure">
                          <span className="value">{formatCurrency(budgetInsight.avg, budgetInsight.currency)}</span>
                          <span className="label">average per planner</span>
                        </div>
                        <div className="insight-split">
                          <div><div className="k">Low</div><div className="v">{formatCurrency(budgetInsight.min, budgetInsight.currency)}</div></div>
                          <div><div className="k">High</div><div className="v">{formatCurrency(budgetInsight.max, budgetInsight.currency)}</div></div>
                        </div>
                      </div>
                      <div className="insight-foot">{budgetInsight.count} of {budgetInsight.total} planners submitted</div>
                    </div>
                  </>
                )}

                {accomInsight.count > 0 && (
                  <>
                    <div className="hub-section-title">Accommodation Insights</div>
                    <div className="insight-card accom">
                      <div className="accom-stack">
                        {/* 1. Preferred stay type (majority) */}
                        <div className="accom-stat">
                          <span className="accom-stat-icon"><IconBed width={16} height={16} /></span>
                          <div className="accom-stat-body">
                            <div className="accom-stat-label">Preferred stay type</div>
                            <div className="accom-stat-value">
                              {accomInsight.topTypes[0]
                                ? (ACCOMMODATION_TYPES.find((t) => t.id === accomInsight.topTypes[0].type)?.label || accomInsight.topTypes[0].type)
                                : '—'}
                            </div>
                            <div className="accom-stat-meta">
                              {accomInsight.topTypes[0]
                                ? `${accomInsight.topTypes[0].count} of ${accomInsight.count} planner${accomInsight.count !== 1 ? 's' : ''} picked this`
                                : 'No clear majority yet'}
                            </div>
                          </div>
                        </div>

                        {/* 2. Average cost per night */}
                        <div className="accom-stat">
                          <span className="accom-stat-icon"><IconWallet width={16} height={16} /></span>
                          <div className="accom-stat-body">
                            <div className="accom-stat-label">Average cost per night</div>
                            <div className="accom-stat-value">
                              {accomInsight.avgCost !== null ? `$${accomInsight.avgCost.toLocaleString()}` : '—'}
                            </div>
                            <div className="accom-stat-meta">
                              {accomInsight.costs.length > 0
                                ? `Across ${accomInsight.costs.length} of ${accomInsight.count} planner${accomInsight.count !== 1 ? 's' : ''}`
                                : 'No cost preferences submitted yet'}
                            </div>
                          </div>
                        </div>

                        {/* 3. Rooms to book (from headcounts) */}
                        {accomSummary && (
                          <div className="accom-stat">
                            <span className="accom-stat-icon"><IconUsers width={16} height={16} /></span>
                            <div className="accom-stat-body">
                              <div className="accom-stat-label">Rooms to book</div>
                              <div className="accom-stat-value">
                                {accomSummary.groups > 0
                                  ? `${accomSummary.groups} room${accomSummary.groups !== 1 ? 's' : ''}`
                                  : '—'}
                              </div>
                              <div className="accom-stat-meta">
                                {accomSummary.groups > 0
                                  ? `For ${totalTravelers} traveler${totalTravelers !== 1 ? 's' : ''}${
                                      accomSummary.remaining > 0
                                        ? ` (${accomSummary.remaining} not yet accounted for)`
                                        : ''
                                    }`
                                  : 'Add headcounts to estimate rooms needed'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="insight-foot">{accomInsight.count} of {accomInsight.total} planners submitted</div>
                    </div>
                  </>
                )}

                {destinations.length > 0 && (
                  <>
                    <div className="hub-section-title">Top Traveler Destinations</div>
                    <ol className="ranked-list">
                      {destinations.map((d, i) => (
                        <li key={d.id} className="ranked-row">
                          <span className="ranked-label">Rank {i + 1}</span>
                          <span className="ranked-sep">-</span>
                          <span className="ranked-name">{d.name}</span>
                          <span className="ranked-votes">{d.count} vote{d.count !== 1 ? 's' : ''}</span>
                        </li>
                      ))}
                    </ol>
                    {destinations.length < 10 && (
                      <div className="optimizer-notice">
                        Showing destinations with 2+ interested votes. Add more top destinations or vote on group picks in My Preferences to fill out the top 10.
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {tab === 'prefs' && (
          <MyPreferences
            trip={trip}
            me={me}
            missingMyDates={missingMyDates}
            onOpenEditor={onOpenEditor}
          />
        )}
      </div>

      {showPlanners && (
        <div className="planners-overlay" onClick={() => setShowPlanners(false)}>
          <div className="planners-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-header">
              <span className="sheet-title">Planners</span>
              <button className="sheet-close" onClick={() => setShowPlanners(false)}><IconClose width={14} height={14} /></button>
            </div>
            {trip.planners.map((p) => {
              const isMe = p.id === currentUserId
              const submitted = p.datePrefs && p.datePrefs.length > 0
              return (
                <div key={p.id} className="roster-card">
                  <div className={`avatar ${p.color}`}>{p.name[0]}</div>
                  <div className="meta">
                    <div className="name">
                      {isMe ? `${p.name} (you)` : p.name}
                      <span className={`role-pill ${p.role === 'host' ? 'host' : 'co'}`}>
                        {p.role === 'host' ? 'Host' : 'Co-Planner'}
                      </span>
                    </div>
                    <div className="handle">{p.handle}</div>
                  </div>
                  <span className={`status-pill ${submitted ? 'submitted' : 'pending'}`}>
                    {submitted ? 'Dates in' : 'Pending'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------- My Preferences (per-user, inside TravelHub) ----------
function MyPreferences({ trip, me, missingMyDates, onOpenEditor }) {
  if (!me) return null
  const budget = me.budget
  const accom = me.accommodation
  const mustVisit = me.mustVisit || []

  return (
    <div className="my-prefs">
      <div className="prefs-hint">Only you can see these — they shape the group insights on the Travel Hub.</div>

      <button className={`pref-card ${missingMyDates ? 'attention' : ''}`} onClick={() => onOpenEditor('dates')}>
        <span className="pref-dot"><IconCalendar width={18} height={18} /></span>
        <div className="pref-copy">
          <div className="pref-headline">Your date ranges</div>
          <div className="pref-sub">
            {missingMyDates ? 'Add your preferred windows' : me.datePrefs.map(formatRange).join(' · ')}
          </div>
        </div>
        <IconArrowRight width={18} height={18} />
      </button>

      <button className={`pref-card ${!budget ? 'attention' : ''}`} onClick={() => onOpenEditor('budget')}>
        <span className="pref-dot"><IconWallet width={18} height={18} /></span>
        <div className="pref-copy">
          <div className="pref-headline">Overall Budget</div>
          <div className="pref-sub">
            {budget ? `${formatCurrency(budget.value, budget.currency)} for the trip` : 'Add your total budget'}
          </div>
        </div>
        <IconArrowRight width={18} height={18} />
      </button>

      <button className={`pref-card ${!accom ? 'attention' : ''}`} onClick={() => onOpenEditor('accommodation')}>
        <span className="pref-dot"><IconBed width={18} height={18} /></span>
        <div className="pref-copy">
          <div className="pref-headline">Accommodation Preferences</div>
          <div className="pref-sub">
            {accom
              ? `${(accom.types || [])
                  .map((t) => ACCOMMODATION_TYPES.find((x) => x.id === t)?.label || t)
                  .join(', ') || 'No types selected'}${
                  Number.isFinite(accom.headcount) && accom.headcount > 0
                    ? ` · staying as ${accom.headcount}`
                    : ''
                }${
                  Number.isFinite(accom.costPerNight) && accom.costPerNight > 0
                    ? ` · $${accom.costPerNight}/night`
                    : ''
                }`
              : 'Pick your preferred stays'}
          </div>
        </div>
        <IconArrowRight width={18} height={18} />
      </button>

      <button className={`pref-card ${mustVisit.length === 0 ? 'attention' : ''}`} onClick={() => onOpenEditor('destinations')}>
        <span className="pref-dot"><IconMapPin width={18} height={18} /></span>
        <div className="pref-copy">
          <div className="pref-headline">Top 10 Must-Visit Destinations</div>
          <div className="pref-sub">
            {mustVisit.length > 0
              ? `${mustVisit.length} picked${mustVisit.length === 10 ? ' (max)' : ''}`
              : 'Pin the places you love'}
          </div>
        </div>
        <IconArrowRight width={18} height={18} />
      </button>
    </div>
  )
}

// ---------- Google Maps (iframe embed, no API key required) ----------
const COUNTRY_CENTERS = {
  japan:         { lat: 36.2,  lng: 138.3, zoom: 5 },
  portugal:      { lat: 39.5,  lng: -8.0,  zoom: 7 },
  italy:         { lat: 41.9,  lng: 12.6,  zoom: 6 },
  france:        { lat: 46.2,  lng: 2.2,   zoom: 6 },
  spain:         { lat: 40.0,  lng: -3.7,  zoom: 6 },
  iceland:       { lat: 64.9,  lng: -19.0, zoom: 7 },
  morocco:       { lat: 31.8,  lng: -7.1,  zoom: 6 },
  greece:        { lat: 39.0,  lng: 22.0,  zoom: 6 },
  thailand:      { lat: 15.0,  lng: 101.0, zoom: 6 },
  peru:          { lat: -9.2,  lng: -75.0, zoom: 5 },
  mexico:        { lat: 23.6,  lng: -102.5, zoom: 5 },
  vietnam:       { lat: 16.0,  lng: 106.0, zoom: 6 },
  'new zealand': { lat: -41.0, lng: 174.0, zoom: 5 },
}

function getCountryCenter(country) {
  return COUNTRY_CENTERS[country?.toLowerCase()] || { lat: 20, lng: 0, zoom: 2 }
}

// ISO 3166-1 alpha-2 codes used by Nominatim to validate that a picked
// destination is actually in the trip's country.
const COUNTRY_CODES = {
  japan:         'jp',
  portugal:      'pt',
  italy:         'it',
  france:        'fr',
  spain:         'es',
  iceland:       'is',
  morocco:       'ma',
  greece:        'gr',
  thailand:      'th',
  peru:          'pe',
  mexico:        'mx',
  vietnam:       'vn',
  'new zealand': 'nz',
}

function getCountryCode(country) {
  return COUNTRY_CODES[country?.toLowerCase()] || null
}

function buildMapSrc({ lat, lng, zoom, label }) {
  // Google Maps iframe embed without API key.
  // `q=` places a pin at that location; label (if any) shows as the marker title.
  const q = label ? `${lat},${lng}(${encodeURIComponent(label)})` : `${lat},${lng}`
  return `https://maps.google.com/maps?q=${q}&ll=${lat},${lng}&z=${zoom}&hl=en&output=embed`
}

function googleMapsLink({ lat, lng, label }) {
  const q = label ? encodeURIComponent(label) : `${lat},${lng}`
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

function GoogleMap({ center, zoom, label, compact, pointer }) {
  const src = buildMapSrc({ lat: center.lat, lng: center.lng, zoom, label })
  return (
    <div className={`gmap ${compact ? 'compact' : ''}`} aria-label="map preview">
      <iframe
        key={src}
        src={src}
        title="Google Map"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      {pointer && <div className="gmap-block" />}
    </div>
  )
}

// ---------- Itinerary ----------
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatItineraryDate(d) {
  return `${WEEKDAYS_SHORT[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

// Great-circle distance (km) between two lat/lng points.
function haversineKm(a, b) {
  if (!a || !b || !Number.isFinite(a.lat) || !Number.isFinite(b.lat)) return Infinity
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s1 = Math.sin(dLat / 2)
  const s2 = Math.sin(dLng / 2)
  const aa = s1 * s1 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * s2 * s2
  return 2 * R * Math.asin(Math.sqrt(aa))
}

// Greedy geographic clustering. Threshold controls cluster radius.
function clusterDestinations(destinations, thresholdKm = 40) {
  const remaining = [...destinations].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  )
  const clusters = []
  while (remaining.length > 0) {
    const seed = remaining.shift()
    const members = [seed]
    for (let i = remaining.length - 1; i >= 0; i--) {
      const candidate = remaining[i]
      if (members.some((m) => haversineKm(m, candidate) <= thresholdKm)) {
        members.push(candidate)
        remaining.splice(i, 1)
      }
    }
    const lat = members.reduce((s, m) => s + m.lat, 0) / members.length
    const lng = members.reduce((s, m) => s + m.lng, 0) / members.length
    const totalCount = members.reduce((s, m) => s + (m.count || 0), 0)
    clusters.push({ members, lat, lng, totalCount })
  }
  return clusters
}

// Ordering strategies — each produces a different sequence of clusters for
// the day-by-day plan, exposing trade-offs between popularity, proximity,
// and geographic flow.

// Nearest-neighbour from the highest-interest cluster.
function orderClustersNearestPopular(clusters) {
  if (clusters.length <= 1) return clusters
  const pool = [...clusters].sort((a, b) => b.totalCount - a.totalCount)
  const ordered = [pool.shift()]
  while (pool.length > 0) {
    let bestIdx = 0
    let bestDist = Infinity
    pool.forEach((c, i) => {
      const d = haversineKm(ordered[ordered.length - 1], c)
      if (d < bestDist) { bestDist = d; bestIdx = i }
    })
    ordered.push(pool.splice(bestIdx, 1)[0])
  }
  return ordered
}

// Popularity-weighted: front-load the most-interested clusters, then sort
// the rest by proximity to the previous day. Surfaces the must-sees early.
function orderClustersPopularityFirst(clusters) {
  if (clusters.length <= 1) return clusters
  const sorted = [...clusters].sort((a, b) => b.totalCount - a.totalCount)
  // Take the top 1/3 in popularity order; route the remainder by proximity.
  const cutoff = Math.max(1, Math.ceil(sorted.length / 3))
  const head = sorted.slice(0, cutoff)
  const tail = sorted.slice(cutoff)
  const ordered = [...head]
  while (tail.length > 0) {
    let bestIdx = 0
    let bestDist = Infinity
    tail.forEach((c, i) => {
      const d = haversineKm(ordered[ordered.length - 1], c)
      if (d < bestDist) { bestDist = d; bestIdx = i }
    })
    ordered.push(tail.splice(bestIdx, 1)[0])
  }
  return ordered
}

// Geographic loop: sort clusters by polar angle around their collective
// centroid. Produces a round-trip-style path that visits everything once.
function orderClustersLoop(clusters) {
  if (clusters.length <= 2) return clusters
  const cx = clusters.reduce((s, c) => s + c.lat, 0) / clusters.length
  const cy = clusters.reduce((s, c) => s + c.lng, 0) / clusters.length
  const withAngle = clusters.map((c) => ({
    cluster: c,
    angle: Math.atan2(c.lat - cx, c.lng - cy),
  }))
  withAngle.sort((a, b) => a.angle - b.angle)
  // Rotate so the most-popular cluster starts the loop.
  let startIdx = 0
  let bestPop = -Infinity
  withAngle.forEach((w, i) => {
    if (w.cluster.totalCount > bestPop) { bestPop = w.cluster.totalCount; startIdx = i }
  })
  return [...withAngle.slice(startIdx), ...withAngle.slice(0, startIdx)].map((w) => w.cluster)
}

// Place ordered clusters across the available days.
function fitClustersToDays(clusters, days) {
  let working = [...clusters]
  while (working.length > days.length) {
    const last = working.pop()
    const prev = working[working.length - 1]
    prev.members = prev.members.concat(last.members)
    prev.totalCount += last.totalCount
  }
  const result = days.map((d) => ({ ...d, destinations: [] }))
  if (working.length === result.length) {
    working.forEach((c, i) => { result[i].destinations = c.members })
  } else {
    // Spread fewer clusters evenly across the trip so open days fall between.
    const step = result.length / working.length
    working.forEach((c, i) => {
      const idx = Math.min(Math.floor(i * step + step / 2), result.length - 1)
      result[idx].destinations = c.members
    })
  }
  return result
}

// Three scenario presets — each blends a clustering radius and an ordering
// strategy to produce a meaningfully different route.
const ITINERARY_SCENARIOS = [
  {
    id: 'compact',
    label: 'Compact Days',
    blurb: 'Tighter clusters of nearby spots — fewer travel transitions, more time per area.',
    threshold: 22,
    order: orderClustersNearestPopular,
  },
  {
    id: 'balanced',
    label: 'Balanced Route',
    blurb: 'Most-loved spots first, then a proximity-friendly tail. A solid default.',
    threshold: 45,
    order: orderClustersPopularityFirst,
  },
  {
    id: 'loop',
    label: 'Wide Loop',
    blurb: 'Looser clusters in a circular path — covers more ground without backtracking.',
    threshold: 90,
    order: orderClustersLoop,
  },
]

// Build a day-by-day itinerary using ONLY the destinations travelers
// collectively picked. Driven by a scenario preset that selects clustering
// radius + ordering strategy. Empty days stay "open".
function buildItinerary(reco, destinations, scenario = ITINERARY_SCENARIOS[1]) {
  if (!reco) return null
  const days = []
  for (let d = new Date(reco.start); d.getTime() <= reco.end.getTime(); d.setDate(d.getDate() + 1)) {
    days.push({ date: new Date(d), destinations: [] })
  }
  if (destinations.length === 0) return { days, hasDestinations: false }

  const clusters = clusterDestinations(destinations, scenario.threshold)
  const ordered = scenario.order(clusters)
  const filled = fitClustersToDays(ordered, days)
  return { days: filled, hasDestinations: true, clusterCount: ordered.length, scenarioId: scenario.id }
}

function ItineraryScreen({ trip, onBack }) {
  const [scenarioIdx, setScenarioIdx] = useState(1) // default to Balanced Route

  const reco = useMemo(
    () => computeReco(trip.planners, tripLengthInDays(trip.tripLength)),
    [trip.planners, trip.tripLength]
  )
  const destinations = useMemo(() => computeTopDestinations(trip.planners), [trip.planners])

  // Build all 3 scenarios up-front so switching tabs is instant.
  const itineraries = useMemo(
    () => ITINERARY_SCENARIOS.map((s) => buildItinerary(reco, destinations, s)),
    [reco, destinations]
  )
  const activeScenario = ITINERARY_SCENARIOS[scenarioIdx]
  const itinerary = itineraries[scenarioIdx]

  return (
    <div className="screen screen-enter">
      <div className="topbar">
        <button className="back" onClick={onBack}><IconArrowLeft /></button>
        <span className="step">Itinerary</span>
        <span style={{ width: 40 }} />
      </div>

      <div className="screen-scroll">
        <div className="itin-header has-hero">
          <div className="hub-hero" style={{ backgroundImage: `url(${getCountryPhoto(trip.country)})` }}>
            <div className="hub-hero-fade" />
          </div>
          <div className="itin-header-body">
            <div className="eyebrow">{trip.country}</div>
            <div className="itin-title">{trip.name}</div>
            {reco ? (
              <div className="itin-sub">
                {formatDate(reco.start)} – {formatDate(reco.end)}
              </div>
            ) : (
              <div className="itin-sub">Dates pending</div>
            )}
            {itinerary && (
              <div className="itin-meta">
                {itinerary.days.length} day{itinerary.days.length !== 1 ? 's' : ''}
                {' · '}
                {destinations.length} ranked destination{destinations.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {destinations.length > 0 && (
          <>
            <div className="scenario-tabs">
              {ITINERARY_SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  className={`scenario-tab ${scenarioIdx === i ? 'active' : ''}`}
                  onClick={() => setScenarioIdx(i)}
                >
                  Scenario {i + 1}
                </button>
              ))}
            </div>
            <div className="scenario-meta">
              <div className="scenario-name">{activeScenario.label}</div>
              <div className="scenario-blurb">{activeScenario.blurb}</div>
            </div>
          </>
        )}

        {!reco && (
          <div className="insight-empty">
            Add date preferences to generate a suggested itinerary.
          </div>
        )}

        {reco && !itinerary?.hasDestinations && (
          <div className="insight-empty">
            No top-ranked destinations yet — vote on group picks in My Preferences to populate the itinerary.
          </div>
        )}

        {itinerary && itinerary.days.length > 0 && (
          <div className="itin-list">
            {itinerary.days.map((day, i) => {
              const empty = day.destinations.length === 0
              return (
                <div key={i} className={`itin-day ${empty ? 'open' : ''}`}>
                  <div className="itin-day-head">
                    <span className="itin-day-num">Day {i + 1}</span>
                    <span className="itin-day-date">{formatItineraryDate(day.date)}</span>
                  </div>
                  {empty ? (
                    <div className="itin-open-copy">
                      Open day — leave room to explore or rest.
                    </div>
                  ) : (
                    <div className="itin-stops">
                      {day.destinations.map((d) => (
                        <div key={d.id} className="itin-stop">
                          <span className="itin-stop-pin"><IconMapPin width={14} height={14} /></span>
                          <div className="itin-stop-info">
                            <div className="itin-stop-name">{d.name}</div>
                            <div className="itin-stop-city">{d.city}</div>
                          </div>
                          <span className="itin-stop-count">×{d.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="itin-footnote">
          Each scenario reorganises the same top-ranked destinations using a different route-optimization strategy. Open days stay open — places nobody picked are never added.
        </div>
      </div>
    </div>
  )
}

// ---------- Editors ----------
function DatePrefsEditorScreen({ trip, initialRanges, onBack, onSave }) {
  const [ranges, setRanges] = useState(
    initialRanges && initialRanges.length > 0 ? initialRanges : [makeDefaultRange()]
  )
  return (
    <div className="screen screen-enter">
      <div className="topbar">
        <button className="back" onClick={onBack}><IconArrowLeft /></button>
        <span className="step">Your dates · {trip.name}</span>
        <span style={{ width: 40 }} />
      </div>
      <div className="wizard">
        <div className="scroll">
          <div className="prompt-block" style={{ marginTop: 18 }}>
            <div className="eyebrow">Your preferences</div>
            <div className="dialogue">What dates work for you?</div>
          </div>
          <div className="body" style={{ marginBottom: 14 }}>
            Share a few windows. We'll combine everyone's preferences to suggest the best trip dates.
          </div>
          {ranges.map((rg, i) => (
            <DateRangeRow
              key={i}
              index={i}
              range={rg}
              canRemove={ranges.length > 1}
              onChange={(next) => setRanges((arr) => arr.map((x, idx) => (idx === i ? next : x)))}
              onRemove={() => setRanges((arr) => arr.filter((_, idx) => idx !== i))}
            />
          ))}
          <button className="add-range-btn" onClick={() => setRanges((arr) => [...arr, makeDefaultRange()])}>
            <span className="plus-circle"><IconPlus width={14} height={14} /></span>
            Add another date range
          </button>
        </div>
        <button className="setup-btn" onClick={() => onSave(ranges)}>
          Save preferences <IconCheck width={16} height={16} />
        </button>
      </div>
    </div>
  )
}

function BudgetEditor({ trip, initialBudget, onBack, onSave }) {
  const [value, setValue] = useState(initialBudget?.value || 2000)
  const [currency, setCurrency] = useState(initialBudget?.currency || 'USD')
  return (
    <div className="screen screen-enter">
      <div className="topbar">
        <button className="back" onClick={onBack}><IconArrowLeft /></button>
        <span className="step">Your budget · {trip.name}</span>
        <span style={{ width: 40 }} />
      </div>
      <div className="wizard">
        <div className="scroll">
          <div className="prompt-block" style={{ marginTop: 18 }}>
            <div className="eyebrow">Your preferences</div>
            <div className="dialogue">What's your overall budget?</div>
          </div>
          <div className="body" style={{ marginBottom: 18 }}>
            Your all-in budget for this trip. We'll blend it with your crew for an average.
          </div>
          <div className="budget-row">
            <select className="unit" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
              <option value="CAD">CAD</option>
              <option value="JPY">JPY ¥</option>
            </select>
            <input
              className="num"
              type="number"
              min="0"
              step="50"
              value={value}
              onChange={(e) => setValue(e.target.value === '' ? '' : Math.max(0, +e.target.value))}
            />
          </div>
        </div>
        <button className="setup-btn" onClick={() => onSave({ value: Number(value) || 0, currency })} disabled={!value || value < 1}>
          Save budget <IconCheck width={16} height={16} />
        </button>
      </div>
    </div>
  )
}

function AccommodationEditor({ trip, initial, onBack, onSave }) {
  const [types, setTypes] = useState(initial?.types || [])
  const [headcount, setHeadcount] = useState(Number.isFinite(initial?.headcount) && initial.headcount > 0 ? initial.headcount : 1)
  const [costPerNight, setCostPerNight] = useState(
    Number.isFinite(initial?.costPerNight) && initial.costPerNight > 0 ? initial.costPerNight : ''
  )

  const toggleType = (id) => {
    setTypes((arr) => (arr.includes(id) ? arr.filter((t) => t !== id) : [...arr, id]))
  }

  return (
    <div className="screen screen-enter">
      <div className="topbar">
        <button className="back" onClick={onBack}><IconArrowLeft /></button>
        <span className="step">Stays · {trip.name}</span>
        <span style={{ width: 40 }} />
      </div>
      <div className="wizard">
        <div className="scroll">
          <div className="prompt-block" style={{ marginTop: 18 }}>
            <div className="eyebrow">Your preferences</div>
            <div className="dialogue">Where do you like to stay?</div>
          </div>
          <div className="body" style={{ marginBottom: 14 }}>Pick any stay types you're open to.</div>

          <div className="choice-grid">
            {ACCOMMODATION_TYPES.map((t) => (
              <button
                key={t.id}
                className={`choice-chip ${types.includes(t.id) ? 'on' : ''}`}
                onClick={() => toggleType(t.id)}
              >
                {types.includes(t.id) && <IconCheck width={14} height={14} />}
                {t.label}
              </button>
            ))}
          </div>

          <div className="sub-label">How many people are staying in your accommodation?</div>
          <div className="body sub-label-copy">
            This would be any friends or family that may be a smaller part of your larger group.
          </div>
          <div className="counter-group">
            <CounterRow
              label="People in your stay"
              sub="Includes you"
              value={headcount}
              setValue={setHeadcount}
              min={1}
            />
          </div>

          <div className="sub-label" style={{ marginTop: 22 }}>What is your ideal cost per night?</div>
          <div className="body sub-label-copy">
            How much you'd be comfortable spending per night on accommodation.
          </div>
          <div className="cost-row">
            <span className="cost-prefix">$</span>
            <input
              className="cost-input"
              type="number"
              min="0"
              step="10"
              placeholder="e.g. 200"
              value={costPerNight}
              onChange={(e) => setCostPerNight(e.target.value === '' ? '' : Math.max(0, +e.target.value))}
            />
            <span className="cost-suffix">/ night</span>
          </div>
        </div>
        <button
          className="setup-btn"
          onClick={() => onSave({ types, headcount, costPerNight: Number(costPerNight) || 0 })}
          disabled={types.length === 0}
        >
          Save stays <IconCheck width={16} height={16} />
        </button>
      </div>
    </div>
  )
}

// ---------- Place details from Wikipedia REST API ----------
// Wikipedia is the same authoritative source Google's Knowledge Graph cards
// use for landmark descriptions and imagery. Calling its REST API client-side
// Place details — backed by Foursquare when a key is available, with a
// graceful text-only fallback when it isn't.
// We cache per destination id so we never re-fetch.
const PLACE_DETAILS_CACHE    = new Map()  // dest.id -> { desc, imageUrl }
const PLACE_DETAILS_PROMISES = new Map()  // dest.id -> Promise

function buildFallbackDesc(dest) {
  if (dest?.desc) return dest.desc
  if (dest?.city && dest.city !== dest.name) {
    return `A spot in ${dest.city} on this trip's must-visit list.`
  }
  return `A spot on this trip's must-visit list.`
}

async function fetchPlaceDetails(dest) {
  if (!dest) return { desc: '', imageUrl: null }
  if (PLACE_DETAILS_CACHE.has(dest.id))    return PLACE_DETAILS_CACHE.get(dest.id)
  if (PLACE_DETAILS_PROMISES.has(dest.id)) return PLACE_DETAILS_PROMISES.get(dest.id)

  const fallback = { desc: buildFallbackDesc(dest), imageUrl: null }

  // If no API key is configured, return the text-only fallback immediately.
  if (!GPLACES_ENABLED) return fallback

  const promise = (async () => {
    try {
      // Step 1: resolve the Google Place ID.
      // Destinations added via autocomplete already carry googlePlaceId.
      // Seed / legacy destinations (e.g. "pt-alfama") need a text search.
      let googlePlaceId = dest.googlePlaceId || null
      if (!googlePlaceId) {
        const searchQuery = [dest.name, dest.city].filter(Boolean).join(' ')
        const found = await gSearchOne(searchQuery)
        googlePlaceId = found?.id ?? null
      }
      if (!googlePlaceId) throw new Error('google place not found')

      // Step 2: fetch description + photo in one request.
      const details = await gFetchDetails(googlePlaceId)
      if (!details) throw new Error('details empty')

      const result = {
        desc:     details.desc     || fallback.desc,
        imageUrl: details.imageUrl || null,
      }
      PLACE_DETAILS_CACHE.set(dest.id, result)
      return result
    } catch {
      PLACE_DETAILS_CACHE.set(dest.id, fallback)
      return fallback
    } finally {
      PLACE_DETAILS_PROMISES.delete(dest.id)
    }
  })()

  PLACE_DETAILS_PROMISES.set(dest.id, promise)
  return promise
}

// Shuffle deterministically per session so the deck order is stable while the
// component is mounted but feels random across visits.
function shuffleArray(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// Hook: fetch (and cache) place details for a destination, returning a stable
// object that updates when the underlying fetch resolves.
function usePlaceDetails(dest) {
  const [details, setDetails] = useState(() =>
    dest && PLACE_DETAILS_CACHE.has(dest.id) ? PLACE_DETAILS_CACHE.get(dest.id) : null
  )
  useEffect(() => {
    let mounted = true
    setDetails(dest && PLACE_DETAILS_CACHE.has(dest.id) ? PLACE_DETAILS_CACHE.get(dest.id) : null)
    if (dest) {
      fetchPlaceDetails(dest).then((d) => { if (mounted) setDetails(d) })
    }
    return () => { mounted = false }
  }, [dest?.id])
  return details
}

// One card visual — used for both the front (interactive) and behind cards.
function SwipeCardView({ dest, fallbackImage, style, stampStates, dragHandlers, isFront }) {
  const details = usePlaceDetails(dest)
  if (!dest) return null
  const imageUrl = details?.imageUrl || fallbackImage
  const desc = details?.desc || buildFallbackDesc(dest)
  return (
    <div
      className={`swipe-card ${isFront ? 'front' : 'behind'}`}
      style={style}
      {...(dragHandlers || {})}
    >
      {isFront && (
        <>
          <div className={`swipe-stamp interest ${stampStates?.interest ? 'on' : ''}`}>INTERESTED</div>
          <div className={`swipe-stamp pass ${stampStates?.pass ? 'on' : ''}`}>PASS</div>
        </>
      )}
      <div
        className="swipe-card-img"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="swipe-card-img-fade" />
      </div>
      <div className="swipe-card-body">
        <div className="swipe-card-eyebrow"><IconMapPin width={12} height={12} /> A traveler's pick</div>
        <div className="swipe-card-name">{dest.name}</div>
        <div className="swipe-card-city">{dest.city}</div>
        <div className="swipe-card-blurb">{desc}</div>
      </div>
    </div>
  )
}

// Tinder-style swipe deck. Local queue mirrors the `destinations` prop in a
// stable shuffled order — votes pop the front, new picks from other planners
// auto-append, and removed picks fall out. Cards are anonymized; the source
// planner is never revealed.
function SwipeDeck({ destinations, onVote, fallbackImage }) {
  const [queue, setQueue] = useState(() => shuffleArray(destinations))
  const [dragX, setDragX] = useState(0)
  const [animatingDir, setAnimatingDir] = useState(null) // 'left' | 'right' | null
  const dragStartRef = React.useRef(null)

  // Sync local queue with the live prop. Append any new ids and drop any that
  // disappeared from the source. Existing order is preserved so votes stay
  // ergonomic across re-renders.
  useEffect(() => {
    setQueue((prev) => {
      const sourceIds = new Set(destinations.map((d) => d.id))
      const stillThere = prev.filter((d) => sourceIds.has(d.id))
      const known = new Set(stillThere.map((d) => d.id))
      const newOnes = destinations.filter((d) => !known.has(d.id))
      if (newOnes.length === 0 && stillThere.length === prev.length) return prev
      return [...stillThere, ...shuffleArray(newOnes)]
    })
  }, [destinations])

  const current = queue[0]
  const next = queue[1]

  const commitVote = (direction) => {
    if (!current || animatingDir) return
    const currentId = current.id
    setAnimatingDir(direction)
    setTimeout(() => {
      // Drop the voted card locally first so the next card is in place
      // before the parent's filtered prop arrives.
      setQueue((q) => q.slice(1))
      onVote(currentId, direction === 'right' ? 'interested' : 'passed')
      setDragX(0)
      setAnimatingDir(null)
    }, 240)
  }

  const onPointerDown = (e) => {
    if (animatingDir) return
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragStartRef.current || animatingDir) return
    setDragX(e.clientX - dragStartRef.current.x)
  }
  const onPointerUp = () => {
    if (!dragStartRef.current || animatingDir) return
    const threshold = 90
    if (dragX > threshold) commitVote('right')
    else if (dragX < -threshold) commitVote('left')
    else setDragX(0)
    dragStartRef.current = null
  }

  if (!current) {
    return (
      <div className="swipe-done">
        <div className="swipe-done-title">You're all caught up.</div>
        <div className="swipe-done-sub">Come back when more travelers add their picks.</div>
      </div>
    )
  }

  const rotate = Math.max(-12, Math.min(12, dragX / 12))
  let translateX = dragX
  if (animatingDir === 'right') translateX = 500
  if (animatingDir === 'left') translateX = -500
  const cardStyle = {
    transform: `translateX(${translateX}px) rotate(${animatingDir ? rotate * 2 : rotate}deg)`,
    transition: animatingDir ? 'transform 0.24s ease-out' : (dragStartRef.current ? 'none' : 'transform 0.2s ease-out'),
  }
  const showInterest = dragX > 30
  const showPass = dragX < -30

  return (
    <div className="swipe-deck">
      <div className="swipe-stack">
        <SwipeCardView
          key={`behind-${next?.id || 'none'}`}
          dest={next}
          fallbackImage={fallbackImage}
        />
        <SwipeCardView
          key={`front-${current.id}`}
          dest={current}
          fallbackImage={fallbackImage}
          isFront
          style={cardStyle}
          stampStates={{ interest: showInterest, pass: showPass }}
          dragHandlers={{
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onPointerCancel: onPointerUp,
          }}
        />
      </div>
      <div className="swipe-actions">
        <button className="swipe-btn pass-btn" onClick={() => commitVote('left')} aria-label="Pass">
          <IconClose width={20} height={20} />
        </button>
        <div className="swipe-progress">{queue.length} left</div>
        <button className="swipe-btn interest-btn" onClick={() => commitVote('right')} aria-label="Interested">
          <IconCheck width={20} height={20} />
        </button>
      </div>
      <div className="swipe-hint">Swipe left to pass · swipe right if you're interested</div>
    </div>
  )
}

function DestinationsEditor({ trip, initial, initialVotes, currentUserId, onBack, onSave, onSaveVotes, allPlanners }) {
  const [subTab, setSubTab] = useState('mine') // 'mine' | 'group'

  // `picked` holds full destination objects so we can display name/city/lat/lng
  // without relying on the curated catalog after users search freely.
  const initialObjects = (initial || [])
    .map((idOrObj) => (typeof idOrObj === 'string' ? findDestinationById(idOrObj) : idOrObj))
    .filter(Boolean)
  const [picked, setPicked] = useState(initialObjects)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [picking, setPicking] = useState(false)   // true while resolving a Google pick
  const [error, setError] = useState('')
  const [votes, setVotes] = useState({
    interested: initialVotes?.interested ? [...initialVotes.interested] : [],
    passed: initialVotes?.passed ? [...initialVotes.passed] : [],
  })

  const expectedCode = getCountryCode(trip.country)

  // The swipe deck shows destinations picked by other Travelers in the group
  // (excluding the current user's own picks — they don't need to vote on
  // their own selections). The list is recomputed whenever the planner pool
  // or this user's votes change, so new additions from other Travelers show
  // up automatically and already-voted items never reappear.
  const groupPool = useMemo(() => {
    const others = (allPlanners || []).filter((p) => p.id !== currentUserId)
    return collectGroupPool(others)
  }, [allPlanners, currentUserId])
  const swipePool = useMemo(() => {
    const voted = new Set([...(votes.interested || []), ...(votes.passed || [])])
    return groupPool.filter((d) => !voted.has(d.id))
  }, [groupPool, votes])

  // Debounce the autocomplete fetch (Foursquare, with Nominatim fallback).
  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setSearching(true)
      setError('')
      try {
        if (GPLACES_ENABLED) {
          // ── Google Places autocomplete ──────────────────────────────────
          const items = await gAutocomplete(q, {
            countryCode: expectedCode,
            signal:      controller.signal,
          })
          setResults(items)
        } else {
          // ── Nominatim fallback (no API key) ─────────────────────────────
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6`
          const res = await fetch(url, {
            signal:  controller.signal,
            headers: { 'Accept': 'application/json' },
          })
          if (!res.ok) throw new Error('Search failed')
          const data = await res.json()
          // Normalise Nominatim results to the same shape as Foursquare so
          // the render and pick() functions stay uniform.
          const normalised = (Array.isArray(data) ? data : []).map((r) => {
            const addr = r.address || {}
            const name = (r.display_name || '').split(',')[0].trim()
            const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || trip.country
            return {
              _type:       'nominatim',
              id:          `osm-${r.osm_type}-${r.osm_id}`,
              fsqId:       null,
              name,
              city,
              countryCode: addr.country_code?.toLowerCase() || '',
              lat:         Number(r.lat),
              lng:         Number(r.lon),
              label:       r.display_name,
              // keep raw ref for pick()
              _raw: r,
            }
          })
          setResults(normalised)
        }
      } catch (err) {
        if (err.name !== 'AbortError') setResults([])
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [query])

  const pick = async (r) => {
    if (picking) return
    let { id, name, city, countryCode, lat, lng, googlePlaceId } = r

    if (picked.length >= 10) {
      setError('You can only pick up to 10 destinations.')
      return
    }
    if (picked.some((p) => p.id === id)) {
      setError('That spot is already on your list.')
      return
    }

    // Google autocomplete results don't include lat/lng — resolve with one
    // Place Details call before adding the destination.
    if (googlePlaceId && (lat === null || lng === null)) {
      setPicking(true)
      try {
        const resolved = await gResolvePlace(googlePlaceId)
        if (resolved) {
          lat = resolved.lat
          lng = resolved.lng
          if (!countryCode) countryCode = resolved.countryCode
        }
      } finally {
        setPicking(false)
      }
    }

    if (expectedCode && countryCode && countryCode !== expectedCode) {
      setError(`Sorry, this location could not be found in ${trip.country}.`)
      return
    }

    const dest = {
      id,
      name,
      city:  city || trip.country,
      lat:   lat  ?? null,
      lng:   lng  ?? null,
      // Store googlePlaceId so swipe-card detail fetches go direct (no text search).
      ...(googlePlaceId ? { googlePlaceId } : {}),
    }
    setPicked((arr) => [...arr, dest])
    setQuery('')
    setResults([])
    setError('')
  }

  const remove = (id) => {
    setPicked((arr) => arr.filter((p) => p.id !== id))
    setError('')
  }

  // Cast a swipe vote and immediately push it up so other planners can see
  // the count grow on the hub. We keep local state in sync for the deck filter.
  const castVote = (destId, kind) => {
    setVotes((v) => {
      const interested = (v.interested || []).filter((x) => x !== destId)
      const passed = (v.passed || []).filter((x) => x !== destId)
      if (kind === 'interested') interested.push(destId)
      else passed.push(destId)
      const next = { interested, passed }
      if (onSaveVotes) onSaveVotes(next)
      return next
    })
  }

  return (
    <div className="screen screen-enter">
      <div className="topbar">
        <button className="back" onClick={onBack}><IconArrowLeft /></button>
        <span className="step">Destinations · {trip.name}</span>
        <span style={{ width: 40 }} />
      </div>
      <div className="wizard">
        <div className="scroll">
          <div className="prompt-block" style={{ marginTop: 18 }}>
            <div className="eyebrow">Your preferences</div>
            <div className="dialogue">
              {subTab === 'mine' ? 'Top 10 Must-Visit Destinations' : 'Group Selected Destinations'}
            </div>
          </div>

          <div className="dest-subtabs">
            <button className={`dest-subtab ${subTab === 'mine' ? 'active' : ''}`} onClick={() => setSubTab('mine')}>
              My Destinations
            </button>
            <button className={`dest-subtab ${subTab === 'group' ? 'active' : ''}`} onClick={() => setSubTab('group')}>
              Group Selection
            </button>
          </div>

          {subTab === 'mine' && (
            <>
              <div className="body" style={{ marginBottom: 14 }}>
                Search any place in {trip.country} you'd love to see. ({picked.length}/10)
              </div>

              <div className="autocomplete-wrap">
                <div className="autocomplete-input-row">
                  <span className="autocomplete-icon"><IconSearch width={16} height={16} /></span>
                  <input
                    className="input autocomplete-input"
                    placeholder={`Search places in ${trip.country}…`}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setError('') }}
                  />
                </div>
                {query.trim().length >= 2 && (
                  <div className="autocomplete-list">
                    {searching && <div className="autocomplete-hint">Searching…</div>}
                    {!searching && results.length === 0 && (
                      <div className="autocomplete-hint">No matches yet — keep typing.</div>
                    )}
                    {picking && <div className="autocomplete-hint">Adding…</div>}
                    {!searching && !picking && results.map((r) => {
                      const mismatched = expectedCode && r.countryCode && r.countryCode !== expectedCode
                      return (
                        <button
                          key={r.id}
                          className={`autocomplete-item ${mismatched ? 'mismatch' : ''}`}
                          onClick={() => pick(r)}
                        >
                          <span className="autocomplete-pin"><IconMapPin width={14} height={14} /></span>
                          <div className="autocomplete-text">
                            <div className="name">{r.name}</div>
                            <div className="sub">{r.label || r.city}</div>
                          </div>
                          {mismatched && <span className="autocomplete-warn">Outside {trip.country}</span>}
                        </button>
                      )
                    })}
                  </div>
                )}
                {error && <div className="autocomplete-error">{error}</div>}
              </div>

              {picked.length > 0 && (
                <>
                  <div className="tiny" style={{ marginTop: 22, marginBottom: 10 }}>Your picks</div>
                  <div className="dest-list">
                    {picked.map((d) => (
                      <div key={d.id} className="dest-row on">
                        <span className="dest-pin"><IconMapPin width={16} height={16} /></span>
                        <div className="dest-info">
                          <div className="name">{d.name}</div>
                          <div className="city">{d.city}</div>
                        </div>
                        <button className="action-btn reject" onClick={() => remove(d.id)} aria-label="Remove">
                          <IconMinus width={14} height={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {subTab === 'group' && (
            <>
              <div className="group-subheader">
                Below you'll find the destinations selected by the Travelers in your group. Swipe left to "Pass" or swipe right to show you're "Interested" in going. This will inform the Travel Optimizer of the top ranked destinations by group interest.
              </div>

              {groupPool.length === 0 ? (
                <div className="insight-empty">
                  No preferences have been selected yet — destinations selected by other planners will appear here for you to vote on.
                </div>
              ) : (
                <SwipeDeck
                  destinations={swipePool}
                  onVote={castVote}
                  fallbackImage={getCountryPhoto(trip.country)}
                />
              )}
            </>
          )}
        </div>
        {subTab === 'mine' && (
          <button className="setup-btn" onClick={() => onSave(picked)}>
            Save destinations <IconCheck width={16} height={16} />
          </button>
        )}
      </div>
    </div>
  )
}

// ---------- Root App ----------
const ME_ID = 'me'

export default function App() {
  const [route, setRoute] = useState('signup') // signup | tabs | newTraveler | newTrip | tripHub | itinerary | editDates | editBudget | editAccommodation | editDestinations
  const [activeTab, setActiveTab] = useState('home')
  const [userName, setUserName] = useState('')
  const [travelers, setTravelers] = useState(SEED_TRAVELERS)
  const [trips, setTrips] = useState([])
  const [incomingTravelers, setIncomingTravelers] = useState(SEED_INCOMING_TRAVELERS)
  const [incomingTrips, setIncomingTrips] = useState(SEED_INCOMING_TRIPS)
  const [showSetupConfirmation, setShowSetupConfirmation] = useState(true)
  const [toast, setToast] = useState('')
  const [selectedTripId, setSelectedTripId] = useState(null)

  const flashToast = (text) => {
    setToast(text)
    setTimeout(() => setToast(''), 2400)
  }

  const handleSignUp = (name) => {
    setUserName(name)
    setRoute('tabs')
    setActiveTab('home')
  }

  const handleNewTravelerSent = (handle) => {
    flashToast(`Request sent to ${handle}`)
    setRoute('tabs')
  }

  const handleFinishTrip = (data) => {
    const hostPlanner = {
      id: ME_ID,
      name: userName || 'You',
      handle: '@you',
      color: 'avatar-terra',
      role: 'host',
      datePrefs: data.dateRanges,
      budget: null,
      accommodation: null,
      mustVisit: [],
      groupVotes: { interested: [], passed: [] },
    }
    const coPlanners = travelers
      .filter((t) => data.planners.includes(t.id))
      .map((t) => ({
        id: t.id, name: t.name, handle: t.handle, color: t.color,
        role: 'co-planner',
        datePrefs: null,
        budget: null,
        accommodation: null,
        mustVisit: [],
        groupVotes: { interested: [], passed: [] },
      }))

    const trip = {
      id: `trip_${Date.now()}`,
      name: data.name,
      country: data.country,
      adults: data.adults,
      children: data.children,
      infants: data.infants,
      tripLength: data.tripLength,
      planners: [hostPlanner, ...coPlanners],
    }
    setTrips((t) => [trip, ...t])
    if (coPlanners.length > 0) {
      flashToast(`Emails sent to ${coPlanners.length} co-planner${coPlanners.length !== 1 ? 's' : ''}`)
    } else {
      flashToast(`Trip "${data.name}" created!`)
    }
    setRoute('tabs')
    setActiveTab('home')
  }

  const acceptTraveler = (id) => {
    const req = incomingTravelers.find((r) => r.id === id)
    if (!req) return
    setTravelers((t) => [{ ...req, id: req.id.replace('rt_', 'u_') }, ...t])
    setIncomingTravelers((arr) => arr.filter((r) => r.id !== id))
    flashToast(`${req.name} added to your Travelers`)
  }

  const rejectTraveler = (id) => {
    setIncomingTravelers((arr) => arr.filter((r) => r.id !== id))
    flashToast('Request dismissed')
  }

  const acceptTrip = (id) => {
    const req = incomingTrips.find((r) => r.id === id)
    if (!req) return
    const mePlanner = {
      id: ME_ID,
      name: userName || 'You',
      handle: '@you',
      color: 'avatar-terra',
      role: 'co-planner',
      datePrefs: null,
      budget: null,
      accommodation: null,
      mustVisit: [],
      groupVotes: { interested: [], passed: [] },
    }
    const trip = {
      id: `trip_${Date.now()}`,
      name: req.tripName,
      country: req.country,
      adults: req.adults, children: req.children, infants: req.infants,
      tripLength: req.tripLength,
      planners: [req.host, ...req.otherCoPlanners, mePlanner],
    }
    setTrips((t) => [trip, ...t])
    setIncomingTrips((arr) => arr.filter((r) => r.id !== id))
    flashToast(`Joined "${req.tripName}" — add your dates!`)
  }

  const rejectTrip = (id) => {
    setIncomingTrips((arr) => arr.filter((r) => r.id !== id))
    flashToast('Invite declined')
  }

  const openTrip = (id) => {
    setSelectedTripId(id)
    setRoute('tripHub')
  }

  const updateMyField = (tripId, field, value, toast) => {
    setTrips((all) =>
      all.map((t) =>
        t.id !== tripId
          ? t
          : { ...t, planners: t.planners.map((p) => (p.id === ME_ID ? { ...p, [field]: value } : p)) }
      )
    )
    if (toast) flashToast(toast)
    setRoute('tripHub')
  }

  // Vote-only update: applies in-place without navigating away from the
  // editor so the user can keep swiping through the deck.
  const updateMyVotes = (tripId, votes) => {
    setTrips((all) =>
      all.map((t) =>
        t.id !== tripId
          ? t
          : { ...t, planners: t.planners.map((p) => (p.id === ME_ID ? { ...p, groupVotes: votes } : p)) }
      )
    )
  }

  const openEditor = (kind) => {
    if (kind === 'dates') setRoute('editDates')
    else if (kind === 'budget') setRoute('editBudget')
    else if (kind === 'accommodation') setRoute('editAccommodation')
    else if (kind === 'destinations') setRoute('editDestinations')
  }

  const requestsCount = incomingTravelers.length + incomingTrips.length
  const selectedTrip = trips.find((t) => t.id === selectedTripId)

  return (
    <div className="stage">
      <div className="phone">
        <div className="notch" />
        <StatusBar />

        {route === 'signup' && <SignUp onSignUp={handleSignUp} />}

        {route === 'tabs' && (
          <div className="screen screen-enter">
            {activeTab === 'home' && (
              <Home
                userName={userName}
                trips={trips}
                onNewTrip={() => setRoute('newTrip')}
                onNewTraveler={() => setRoute('newTraveler')}
                onOpenTrip={openTrip}
              />
            )}
            {activeTab === 'requests' && (
              <RequestsTab
                incomingTravelers={incomingTravelers}
                incomingTrips={incomingTrips}
                onAcceptTraveler={acceptTraveler}
                onRejectTraveler={rejectTraveler}
                onAcceptTrip={acceptTrip}
                onRejectTrip={rejectTrip}
              />
            )}
            {activeTab === 'travelers' && (
              <TravelersTab travelers={travelers} onAddTraveler={() => setRoute('newTraveler')} />
            )}
            {activeTab === 'me' && <MeTab userName={userName} />}

            <BottomNav active={activeTab} onChange={setActiveTab} requestsCount={requestsCount} />
          </div>
        )}

        {route === 'newTraveler' && (
          <NewTraveler onBack={() => setRoute('tabs')} onSend={handleNewTravelerSent} />
        )}

        {route === 'newTrip' && (
          <NewTripWizard
            travelers={travelers}
            currentUserName={userName}
            onCancel={() => setRoute('tabs')}
            onFinish={handleFinishTrip}
            showConfirmation={showSetupConfirmation}
            onDismissConfirmation={() => setShowSetupConfirmation(false)}
          />
        )}

        {route === 'tripHub' && selectedTrip && (
          <TravelHub
            trip={selectedTrip}
            currentUserId={ME_ID}
            onBack={() => setRoute('tabs')}
            onOpenEditor={openEditor}
            onOpenItinerary={() => setRoute('itinerary')}
          />
        )}

        {route === 'itinerary' && selectedTrip && (
          <ItineraryScreen
            trip={selectedTrip}
            onBack={() => setRoute('tripHub')}
          />
        )}

        {route === 'editDates' && selectedTrip && (
          <DatePrefsEditorScreen
            trip={selectedTrip}
            initialRanges={selectedTrip.planners.find((p) => p.id === ME_ID)?.datePrefs}
            onBack={() => setRoute('tripHub')}
            onSave={(ranges) => updateMyField(selectedTrip.id, 'datePrefs', ranges, 'Date preferences saved')}
          />
        )}

        {route === 'editBudget' && selectedTrip && (
          <BudgetEditor
            trip={selectedTrip}
            initialBudget={selectedTrip.planners.find((p) => p.id === ME_ID)?.budget}
            onBack={() => setRoute('tripHub')}
            onSave={(budget) => updateMyField(selectedTrip.id, 'budget', budget, 'Budget saved')}
          />
        )}

        {route === 'editAccommodation' && selectedTrip && (
          <AccommodationEditor
            trip={selectedTrip}
            initial={selectedTrip.planners.find((p) => p.id === ME_ID)?.accommodation}
            onBack={() => setRoute('tripHub')}
            onSave={(accom) => updateMyField(selectedTrip.id, 'accommodation', accom, 'Accommodation saved')}
          />
        )}

        {route === 'editDestinations' && selectedTrip && (
          <DestinationsEditor
            trip={selectedTrip}
            initial={selectedTrip.planners.find((p) => p.id === ME_ID)?.mustVisit}
            initialVotes={selectedTrip.planners.find((p) => p.id === ME_ID)?.groupVotes}
            currentUserId={ME_ID}
            allPlanners={selectedTrip.planners}
            onBack={() => setRoute('tripHub')}
            onSave={(picks) => updateMyField(selectedTrip.id, 'mustVisit', picks, 'Destinations saved')}
            onSaveVotes={(votes) => updateMyVotes(selectedTrip.id, votes)}
          />
        )}

        <Toast text={toast} />
        <div className="home-indicator" />
      </div>
    </div>
  )
}
