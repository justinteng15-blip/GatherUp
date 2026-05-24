import React from 'react'

const svg = (props) => ({
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  ...props,
})

export const IconPlus = (p) => (
  <svg {...svg(p)}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const IconMinus = (p) => (
  <svg {...svg(p)}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

export const IconCheck = (p) => (
  <svg {...svg(p)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export const IconArrowRight = (p) => (
  <svg {...svg(p)}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

export const IconArrowLeft = (p) => (
  <svg {...svg(p)}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

export const IconSend = (p) => (
  <svg {...svg(p)}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

export const IconHome = (p) => (
  <svg {...svg(p)}>
    <path d="M3 12 12 3l9 9" />
    <path d="M5 10v10h14V10" />
  </svg>
)

export const IconUsers = (p) => (
  <svg {...svg(p)}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export const IconCompass = (p) => (
  <svg {...svg(p)}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
)

export const IconUser = (p) => (
  <svg {...svg(p)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const IconSearch = (p) => (
  <svg {...svg(p)}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export const IconBell = (p) => (
  <svg {...svg(p)}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export const IconMap = (p) => (
  <svg {...svg(p)}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
)

export const IconLeaf = (p) => (
  <svg {...svg(p)}>
    <path d="M20 4c-7 0-12 4-13 10-0.5 3 0.5 5 2 6" />
    <path d="M20 4c0 8-4 13-11 14" />
    <path d="M9 20c0-5 3-9 8-10" />
  </svg>
)

export const IconApple = (p) => (
  <svg {...svg({ ...p, fill: 'currentColor', stroke: 'none' })}>
    <path d="M17.05 12.04c-0.02-2.27 1.86-3.36 1.94-3.42-1.06-1.55-2.71-1.76-3.29-1.79-1.4-0.14-2.73 0.83-3.44 0.83-0.71 0-1.81-0.81-2.97-0.79-1.53 0.02-2.94 0.89-3.72 2.26-1.59 2.75-0.4 6.82 1.13 9.06 0.75 1.09 1.64 2.32 2.8 2.28 1.13-0.05 1.55-0.73 2.92-0.73 1.37 0 1.74 0.73 2.93 0.7 1.21-0.02 1.98-1.1 2.72-2.2 0.86-1.25 1.21-2.48 1.23-2.55-0.03-0.01-2.35-0.9-2.37-3.57zM14.87 5.34c0.62-0.76 1.04-1.81 0.93-2.85-0.9 0.04-1.99 0.6-2.63 1.36-0.58 0.67-1.08 1.74-0.94 2.76 1 0.08 2.02-0.51 2.64-1.27z" />
  </svg>
)

export const IconGoogle = (p) => (
  <svg {...svg({ ...p, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 })}>
    <path d="M21 12c0-0.6-0.06-1.2-0.17-1.8H12v3.4h5.1c-0.22 1.2-0.89 2.22-1.9 2.9v2.4h3.07C19.97 17.3 21 14.87 21 12z" />
    <path d="M12 21c2.57 0 4.73-0.85 6.3-2.3l-3.08-2.4c-0.85 0.57-1.94 0.9-3.22 0.9-2.48 0-4.58-1.67-5.33-3.93H3.5v2.47C5.07 18.93 8.3 21 12 21z" />
    <path d="M6.67 13.27c-0.19-0.57-0.3-1.17-0.3-1.77 0-0.6 0.11-1.2 0.3-1.77V7.26H3.5C2.85 8.55 2.5 10 2.5 11.5c0 1.5 0.35 2.95 1 4.24l3.17-2.47z" />
    <path d="M12 6.75c1.4 0 2.65 0.48 3.64 1.42l2.72-2.72C16.7 3.93 14.55 3 12 3 8.3 3 5.07 5.07 3.5 8.26l3.17 2.47c0.75-2.27 2.85-3.98 5.33-3.98z" />
  </svg>
)

export const IconBolt = (p) => (
  <svg {...svg({ ...p, fill: 'currentColor', stroke: 'none' })}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </svg>
)

export const IconPaperPlane = (p) => (
  <svg {...svg(p)}>
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22 11 13 2 9z" />
  </svg>
)

export const IconCalendar = (p) => (
  <svg {...svg(p)}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
  </svg>
)

export const IconWallet = (p) => (
  <svg {...svg(p)}>
    <path d="M20 7H5a2 2 0 0 1 0-4h13v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-6" />
    <path d="M21 12h-4a2 2 0 1 0 0 4h4z" />
  </svg>
)

export const IconBed = (p) => (
  <svg {...svg(p)}>
    <path d="M2 17v4" />
    <path d="M22 17v4" />
    <path d="M2 17h20v-4a3 3 0 0 0-3-3H9v7" />
    <path d="M2 10v7" />
    <circle cx="6" cy="13" r="2" />
  </svg>
)

export const IconMapPin = (p) => (
  <svg {...svg(p)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const IconSpark = (p) => (
  <svg {...svg({ ...p, fill: 'currentColor', stroke: 'none' })}>
    <path d="M12 2 13.5 9.5 21 11 13.5 12.5 12 20 10.5 12.5 3 11 10.5 9.5z" />
  </svg>
)

export const IconBulb = (p) => (
  <svg {...svg(p)}>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 3a6 6 0 0 0-4 10.5c0.9 0.9 1.5 2 1.5 3.5h5c0-1.5 0.6-2.6 1.5-3.5A6 6 0 0 0 12 3z" />
  </svg>
)

export const IconClose = (p) => (
  <svg {...svg(p)}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
)

export const IconExternal = (p) => (
  <svg {...svg(p)}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)
