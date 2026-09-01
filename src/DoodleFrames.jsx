import React, { useId } from 'react'

/**
 * Hand-Drawn Vintage Doodle Frames
 * Accurately matching the Salon Gallery Wall Collage in Reference Image 1.
 */
export function DoodleFrame({ frameType, imageUrl, title }) {
  const rawId = useId()
  const clipId = `clip-${frameType}-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  switch (frameType) {
    // ----------------------------------------------------
    // 1. GRAND BAROQUE CENTERPIECE (Center of Image 1)
    // ----------------------------------------------------
    case 'grand-baroque':
    case 'baroque-scroll':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '300 / 400' }}>
          <svg viewBox="0 0 300 400" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="36" y="42" width="228" height="316" rx="4" />
              </clipPath>
            </defs>

            <rect x="36" y="42" width="228" height="316" rx="4" fill="#ffffff" />

            <image
              href={imageUrl}
              x="36"
              y="42"
              width="228"
              height="316"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <rect x="24" y="30" width="252" height="340" rx="6" strokeWidth="3.6" />
              <rect x="36" y="42" width="228" height="316" rx="4" strokeWidth="2.2" />

              {/* Ornate Corner Baroque Scrolls (Image 1 Center) */}
              <g strokeWidth="2.8">
                {/* Top-Left */}
                <path d="M 24 60 C 10 50, 10 26, 26 22 C 44 16, 60 16, 60 30" />
                <path d="M 18 20 C 14 6, 30 4, 34 14" />
                <circle cx="16" cy="18" r="3" fill="#161616" />

                {/* Top-Right */}
                <path d="M 276 60 C 290 50, 290 26, 274 22 C 256 16, 240 16, 240 30" />
                <path d="M 282 20 C 286 6, 270 4, 266 14" />
                <circle cx="284" cy="18" r="3" fill="#161616" />

                {/* Bottom-Left */}
                <path d="M 24 340 C 10 350, 10 374, 26 378 C 44 384, 60 384, 60 370" />
                <path d="M 18 380 C 14 394, 30 396, 34 386" />
                <circle cx="16" cy="382" r="3" fill="#161616" />

                {/* Bottom-Right */}
                <path d="M 276 340 C 290 350, 290 374, 274 378 C 256 384, 240 384, 240 370" />
                <path d="M 282 380 C 286 394, 270 396, 266 386" />
                <circle cx="284" cy="382" r="3" fill="#161616" />

                {/* Top & Bottom Crests */}
                <path d="M 130 30 C 138 14, 162 14, 170 30" />
                <circle cx="150" cy="14" r="3.5" fill="#161616" />
                <path d="M 130 370 C 138 386, 162 386, 170 370" />
                <circle cx="150" cy="386" r="3.5" fill="#161616" />
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 2. WIDE LANDSCAPE FRAME (Upper-Left Horizontal in Image 1)
    // ----------------------------------------------------
    case 'wide-landscape':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '380 / 220' }}>
          <svg viewBox="0 0 380 220" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="34" y="32" width="312" height="156" rx="3" />
              </clipPath>
            </defs>

            <rect x="34" y="32" width="312" height="156" rx="3" fill="#ffffff" />

            <image
              href={imageUrl}
              x="34"
              y="32"
              width="312"
              height="156"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <rect x="18" y="16" width="344" height="188" rx="4" strokeWidth="3.4" />
              <rect x="34" y="32" width="312" height="156" rx="3" strokeWidth="2.2" />

              {/* Hand-drawn Mitres */}
              <line x1="18" y1="16" x2="34" y2="32" strokeWidth="2.5" />
              <line x1="362" y1="16" x2="346" y2="32" strokeWidth="2.5" />
              <line x1="18" y1="204" x2="34" y2="188" strokeWidth="2.5" />
              <line x1="362" y1="204" x2="346" y2="188" strokeWidth="2.5" />
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 3. SCALLOP / RUFFLED OVAL (Left Oval in Image 1)
    // ----------------------------------------------------
    case 'scallop-oval':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '280 / 360' }}>
          <svg viewBox="0 0 280 360" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <ellipse cx="140" cy="180" rx="96" ry="136" />
              </clipPath>
            </defs>

            <ellipse cx="140" cy="180" rx="96" ry="136" fill="#ffffff" />

            <image
              href={imageUrl}
              x="44"
              y="44"
              width="192"
              height="272"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="140" cy="180" rx="108" ry="148" strokeWidth="3.4" />
              <ellipse cx="140" cy="180" rx="96" ry="136" strokeWidth="2.2" />

              {/* Hand-drawn outer loops */}
              <path
                d="M 140 18
                   q 14 -10 26 0 q 14 -8 26 4 q 12 0 24 10 q 12 6 20 16 q 10 12 16 24
                   q 8 14 10 26 q 4 16 2 28 q 0 16 -6 28 q -4 14 -12 26 q -8 14 -18 24
                   q -10 12 -22 18 q -14 10 -28 12 q -16 4 -28 0 q -16 -4 -28 -12 q -14 -8 -24 -20
                   q -10 -12 -16 -24 q -8 -16 -8 -30 q -2 -16 4 -28 q 4 -14 12 -26 q 8 -14 18 -22
                   q 12 -12 24 -18 q 14 -8 28 -8 Z"
                strokeWidth="2.8"
              />
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 4. BOTANICAL LEAF WREATH (Right Oval in Image 1)
    // ----------------------------------------------------
    case 'leafy-wreath':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '280 / 370' }}>
          <svg viewBox="0 0 280 370" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <ellipse cx="140" cy="185" rx="92" ry="136" />
              </clipPath>
            </defs>

            <ellipse cx="140" cy="185" rx="92" ry="136" fill="#ffffff" />

            <image
              href={imageUrl}
              x="48"
              y="49"
              width="184"
              height="272"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="140" cy="185" rx="104" ry="148" strokeWidth="3.2" />
              <ellipse cx="140" cy="185" rx="92" ry="136" strokeWidth="2" />

              {/* Botanical leaves around rim */}
              <g strokeWidth="2.4">
                <path d="M 140 24 c 6 -12 18 -8 16 4 c -6 8 -16 2 -16 -4 Z" fill="#ffffff" />
                <path d="M 178 36 c 12 -8 20 2 12 12 c -8 6 -16 -2 -12 -12 Z" fill="#ffffff" />
                <path d="M 216 64 c 12 -4 16 8 8 16 c -10 6 -16 -4 -8 -16 Z" fill="#ffffff" />
                <path d="M 244 105 c 10 2 12 14 2 18 c -10 2 -12 -10 -2 -18 Z" fill="#ffffff" />
                <path d="M 252 154 c 8 6 6 18 -4 18 c -8 -2 -8 -12 4 -18 Z" fill="#ffffff" />
                <path d="M 248 205 c 8 8 2 18 -8 16 c -8 -4 -6 -14 8 -16 Z" fill="#ffffff" />
                <path d="M 228 252 c 6 10 -4 18 -12 12 c -6 -6 0 -14 12 -12 Z" fill="#ffffff" />
                <path d="M 194 298 c 2 12 -10 16 -16 8 c -4 -8 4 -14 16 -8 Z" fill="#ffffff" />
                <path d="M 152 334 c -2 12 -14 12 -16 2 c 0 -8 10 -10 16 -2 Z" fill="#ffffff" />
                <path d="M 106 328 c -8 10 -18 6 -16 -4 c 4 -8 14 -4 16 4 Z" fill="#ffffff" />
                <path d="M 64 290 c -12 8 -18 -2 -10 -12 c 6 -6 16 -2 10 12 Z" fill="#ffffff" />
                <path d="M 34 242 c -12 2 -14 -10 -4 -16 c 8 -4 14 6 4 16 Z" fill="#ffffff" />
                <path d="M 24 188 c -10 -4 -8 -16 4 -16 c 8 2 8 12 -4 16 Z" fill="#ffffff" />
                <path d="M 30 132 c -8 -8 -2 -18 8 -14 c 8 4 6 14 -8 14 Z" fill="#ffffff" />
                <path d="M 54 80 c -4 -12 8 -16 14 -8 c 4 8 -4 14 -14 8 Z" fill="#ffffff" />
                <path d="M 96 40 c 0 -12 14 -12 16 -2 c 0 8 -10 10 -16 2 Z" fill="#ffffff" />
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 5. ORNATE TOP-RIGHT SQUARE (Top-Right in Image 1)
    // ----------------------------------------------------
    case 'ornate-square':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '300 / 300' }}>
          <svg viewBox="0 0 300 300" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="36" y="36" width="228" height="228" rx="4" />
              </clipPath>
            </defs>

            <rect x="36" y="36" width="228" height="228" rx="4" fill="#ffffff" />

            <image
              href={imageUrl}
              x="36"
              y="36"
              width="228"
              height="228"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <rect x="22" y="22" width="256" height="256" rx="6" strokeWidth="3.4" />
              <rect x="36" y="36" width="228" height="228" rx="4" strokeWidth="2.2" />

              {/* Ribbon Curl Corner details */}
              <g strokeWidth="2.6">
                <path d="M 22 46 C 8 40, 8 20, 24 16 C 40 12, 50 14, 52 24" />
                <path d="M 278 46 C 292 40, 292 20, 276 16 C 260 12, 250 14, 248 24" />
                <path d="M 22 254 C 8 260, 8 280, 24 284 C 40 288, 50 286, 52 276" />
                <path d="M 278 254 C 292 260, 292 280, 276 284 C 260 288, 250 286, 248 276" />
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 6. TALL NARROW PORTRAIT (Bottom-Left in Image 1)
    // ----------------------------------------------------
    case 'tall-portrait':
    case 'tall-flourish':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '220 / 400' }}>
          <svg viewBox="0 0 220 400" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="26" y="30" width="168" height="340" rx="3" />
              </clipPath>
            </defs>

            <rect x="26" y="30" width="168" height="340" rx="3" fill="#ffffff" />

            <image
              href={imageUrl}
              x="26"
              y="30"
              width="168"
              height="340"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <rect x="16" y="20" width="188" height="360" rx="4" strokeWidth="3.2" />
              <rect x="26" y="30" width="168" height="340" rx="3" strokeWidth="2" />

              {/* Scalloped notches along edges */}
              <g strokeWidth="2">
                <circle cx="16" cy="100" r="3" fill="#161616" />
                <circle cx="16" cy="200" r="3" fill="#161616" />
                <circle cx="16" cy="300" r="3" fill="#161616" />
                <circle cx="204" cy="100" r="3" fill="#161616" />
                <circle cx="204" cy="200" r="3" fill="#161616" />
                <circle cx="204" cy="300" r="3" fill="#161616" />
                <path d="M 90 20 C 100 8, 120 8, 130 20" />
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 7. STRIPED HATCHING FRAME (Top Center in Image 1)
    // ----------------------------------------------------
    case 'striped-bevel':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '340 / 220' }}>
          <svg viewBox="0 0 340 220" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="36" y="34" width="268" height="152" rx="2" />
              </clipPath>
            </defs>

            <rect x="36" y="34" width="268" height="152" rx="2" fill="#ffffff" />

            <image
              href={imageUrl}
              x="36"
              y="34"
              width="268"
              height="152"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <rect x="16" y="16" width="308" height="188" rx="4" strokeWidth="3.4" />
              <rect x="36" y="34" width="268" height="152" rx="2" strokeWidth="2.4" />

              <g strokeWidth="1.8">
                {[30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310].map((x) => (
                  <line key={`t-${x}`} x1={x} y1="16" x2={x + 10} y2="34" />
                ))}
                {[30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310].map((x) => (
                  <line key={`b-${x}`} x1={x} y1="186" x2={x + 10} y2="204" />
                ))}
                {[35, 55, 75, 95, 115, 135, 155, 175].map((y) => (
                  <line key={`l-${y}`} x1="16" y1={y} x2="36" y2={y + 10} />
                ))}
                {[35, 55, 75, 95, 115, 135, 155, 175].map((y) => (
                  <line key={`r-${y}`} x1="304" y1={y} x2="324" y2={y + 10} />
                ))}
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 8. SUNRAY CAMEO OVAL (Bottom Center in Image 1)
    // ----------------------------------------------------
    case 'sunray-cameo':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '260 / 360' }}>
          <svg viewBox="0 0 260 360" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <ellipse cx="130" cy="180" rx="80" ry="120" />
              </clipPath>
            </defs>

            <ellipse cx="130" cy="180" rx="80" ry="120" fill="#ffffff" />

            <image
              href={imageUrl}
              x="50"
              y="60"
              width="160"
              height="240"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="130" cy="180" rx="116" ry="158" strokeWidth="3.4" />
              <ellipse cx="130" cy="180" rx="98" ry="138" strokeWidth="2.2" />
              <ellipse cx="130" cy="180" rx="80" ry="120" strokeWidth="2.6" />

              {/* Hatching Rays */}
              <g strokeWidth="2">
                {[...Array(20)].map((_, i) => {
                  const angle = (i * 18 * Math.PI) / 180
                  const x1 = 130 + 80 * Math.cos(angle)
                  const y1 = 180 + 120 * Math.sin(angle)
                  const x2 = 130 + 98 * Math.cos(angle)
                  const y2 = 180 + 138 * Math.sin(angle)
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                })}
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 9. WAVY RIBBON CONTOUR (Bottom Right in Image 1)
    // ----------------------------------------------------
    case 'wavy-ribbon':
    case 'wavy-square':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '320 / 280' }}>
          <svg viewBox="0 0 320 280" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="42" y="38" width="236" height="204" rx="3" />
              </clipPath>
            </defs>

            <rect x="42" y="38" width="236" height="204" rx="3" fill="#ffffff" />

            <image
              href={imageUrl}
              x="42"
              y="38"
              width="236"
              height="204"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M 22 22
                   q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0
                   q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28
                   q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0
                   q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 Z"
                strokeWidth="3.2"
              />
              <rect x="42" y="38" width="236" height="204" rx="3" strokeWidth="2.4" />
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 10. MINI CAMEO / ACCENT FRAME (Top/Bottom Accent in Image 1)
    // ----------------------------------------------------
    case 'mini-cameo':
    default:
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '220 / 260' }}>
          <svg viewBox="0 0 220 260" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <ellipse cx="110" cy="130" rx="72" ry="92" />
              </clipPath>
            </defs>

            <ellipse cx="110" cy="130" rx="72" ry="92" fill="#ffffff" />

            <image
              href={imageUrl}
              x="38"
              y="38"
              width="144"
              height="184"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="110" cy="130" rx="90" ry="110" strokeWidth="3.2" />
              <ellipse cx="110" cy="130" rx="72" ry="92" strokeWidth="2" />

              {/* Top hanging loop */}
              <circle cx="110" cy="14" r="7" strokeWidth="2.4" />
            </g>
          </svg>
        </div>
      )
  }
}
