import React, { useId } from 'react'

/**
 * Hand-drawn Black & White Vintage Doodle Frames
 * Accurately styled from the user's sketchbook drawings and reference frames.
 * Uses SVG-native clipping and <image> scaling so drawings ALWAYS fit 100% perfectly.
 */
export function DoodleFrame({ frameType, imageUrl, title }) {
  const rawId = useId()
  // Clean id for SVG clipPath
  const clipId = `clip-${frameType}-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  switch (frameType) {
    // ----------------------------------------------------
    // 1. SCALLOP / RUFFLED OVAL FRAME (From User Notebook Sketch)
    // ----------------------------------------------------
    case 'scallop-oval':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '300 / 350' }}>
          <svg viewBox="0 0 300 350" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <ellipse cx="150" cy="175" rx="104" ry="128" />
              </clipPath>
            </defs>

            {/* White paper background inside frame */}
            <ellipse cx="150" cy="175" rx="104" ry="128" fill="#ffffff" />

            {/* Doodle Artwork perfectly centered and clipped */}
            <image
              href={imageUrl}
              x="46"
              y="47"
              width="208"
              height="256"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            {/* Hand-drawn Frame Overlay & Ruffled Scallop Border */}
            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              {/* Outer Ruffled Petals Loop */}
              <path
                d="M 150 18
                   q 14 -10 26 0 q 14 -8 26 4 q 12 0 24 10 q 12 6 20 16 q 10 12 16 24
                   q 8 14 10 26 q 4 16 2 28 q 0 16 -6 28 q -4 14 -12 26 q -8 14 -18 24
                   q -10 12 -22 18 q -14 10 -28 12 q -16 4 -28 0 q -16 -4 -28 -12 q -14 -8 -24 -20
                   q -10 -12 -16 -24 q -8 -16 -8 -30 q -2 -16 4 -28 q 4 -14 12 -26 q 8 -14 18 -22
                   q 12 -12 24 -18 q 14 -8 28 -8 Z"
                strokeWidth="2.8"
              />
              {/* Double Oval Molding */}
              <ellipse cx="150" cy="175" rx="114" ry="138" strokeWidth="3.2" />
              <ellipse cx="150" cy="175" rx="104" ry="128" strokeWidth="2.2" />
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 2. BOTANICAL LEAF WREATH OVAL (From Reference Image 2)
    // ----------------------------------------------------
    case 'leafy-wreath':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '300 / 360' }}>
          <svg viewBox="0 0 300 360" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <ellipse cx="150" cy="180" rx="98" ry="132" />
              </clipPath>
            </defs>

            {/* Paper backing */}
            <ellipse cx="150" cy="180" rx="98" ry="132" fill="#ffffff" />

            {/* Centered Artwork */}
            <image
              href={imageUrl}
              x="52"
              y="48"
              width="196"
              height="264"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            {/* Leaf Garland Border & Rims */}
            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="150" cy="180" rx="108" ry="142" strokeWidth="3.2" />
              <ellipse cx="150" cy="180" rx="98" ry="132" strokeWidth="2" />

              {/* Hand-drawn Leaf details around the rim */}
              <g strokeWidth="2.4">
                <path d="M 150 24 c 6 -12 18 -8 16 4 c -6 8 -16 2 -16 -4 Z" fill="#ffffff" />
                <path d="M 188 36 c 12 -8 20 2 12 12 c -8 6 -16 -2 -12 -12 Z" fill="#ffffff" />
                <path d="M 226 64 c 12 -4 16 8 8 16 c -10 6 -16 -4 -8 -16 Z" fill="#ffffff" />
                <path d="M 254 105 c 10 2 12 14 2 18 c -10 2 -12 -10 -2 -18 Z" fill="#ffffff" />
                <path d="M 264 154 c 8 6 6 18 -4 18 c -8 -2 -8 -12 4 -18 Z" fill="#ffffff" />
                <path d="M 260 205 c 8 8 2 18 -8 16 c -8 -4 -6 -14 8 -16 Z" fill="#ffffff" />
                <path d="M 240 252 c 6 10 -4 18 -12 12 c -6 -6 0 -14 12 -12 Z" fill="#ffffff" />
                <path d="M 206 298 c 2 12 -10 16 -16 8 c -4 -8 4 -14 16 -8 Z" fill="#ffffff" />
                <path d="M 162 328 c -2 12 -14 12 -16 2 c 0 -8 10 -10 16 -2 Z" fill="#ffffff" />
                <path d="M 116 322 c -8 10 -18 6 -16 -4 c 4 -8 14 -4 16 4 Z" fill="#ffffff" />
                <path d="M 74 290 c -12 8 -18 -2 -10 -12 c 6 -6 16 -2 10 12 Z" fill="#ffffff" />
                <path d="M 44 242 c -12 2 -14 -10 -4 -16 c 8 -4 14 6 4 16 Z" fill="#ffffff" />
                <path d="M 32 188 c -10 -4 -8 -16 4 -16 c 8 2 8 12 -4 16 Z" fill="#ffffff" />
                <path d="M 38 132 c -8 -8 -2 -18 8 -14 c 8 4 6 14 -8 14 Z" fill="#ffffff" />
                <path d="M 64 80 c -4 -12 8 -16 14 -8 c 4 8 -4 14 -14 8 Z" fill="#ffffff" />
                <path d="M 106 40 c 0 -12 14 -12 16 -2 c 0 8 -10 10 -16 2 Z" fill="#ffffff" />
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 3. BAROQUE SCROLLWORK FRAME (From Reference Image 2)
    // ----------------------------------------------------
    case 'baroque-scroll':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '320 / 400' }}>
          <svg viewBox="0 0 320 400" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="42" y="46" width="236" height="308" rx="4" />
              </clipPath>
            </defs>

            {/* Paper backing */}
            <rect x="42" y="46" width="236" height="308" rx="4" fill="#ffffff" />

            {/* Centered Artwork */}
            <image
              href={imageUrl}
              x="42"
              y="46"
              width="236"
              height="308"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            {/* Hand-drawn Baroque Border & Corner Flourishes */}
            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <rect x="30" y="34" width="260" height="332" rx="6" strokeWidth="3.4" />
              <rect x="42" y="46" width="236" height="308" rx="4" strokeWidth="2" />

              {/* Corner Scrollwork (Top Left) */}
              <g strokeWidth="2.5">
                <path d="M 30 62 C 14 56, 12 34, 28 28 C 44 22, 62 16, 62 34" />
                <path d="M 22 24 C 18 10, 32 8, 38 18" />
                <circle cx="20" cy="22" r="3.5" fill="#161616" />

                {/* Corner Scrollwork (Top Right) */}
                <path d="M 290 62 C 306 56, 308 34, 292 28 C 276 22, 258 16, 258 34" />
                <path d="M 298 24 C 302 10, 288 8, 282 18" />
                <circle cx="300" cy="22" r="3.5" fill="#161616" />

                {/* Corner Scrollwork (Bottom Left) */}
                <path d="M 30 338 C 14 344, 12 366, 28 372 C 44 378, 62 384, 62 366" />
                <path d="M 22 376 C 18 390, 32 392, 38 382" />
                <circle cx="20" cy="378" r="3.5" fill="#161616" />

                {/* Corner Scrollwork (Bottom Right) */}
                <path d="M 290 338 C 306 344, 308 366, 292 372 C 276 378, 258 384, 258 366" />
                <path d="M 298 376 C 302 390, 288 392, 282 382" />
                <circle cx="300" cy="378" r="3.5" fill="#161616" />

                {/* Top & Bottom Crests */}
                <path d="M 140 34 C 146 20, 174 20, 180 34" />
                <circle cx="160" cy="20" r="3.5" fill="#161616" />
                <path d="M 140 366 C 146 380, 174 380, 180 366" />
                <circle cx="160" cy="380" r="3.5" fill="#161616" />

                {/* Side Flourishes */}
                <path d="M 30 185 C 18 190, 18 210, 30 215" />
                <path d="M 290 185 C 302 190, 302 210, 290 215" />
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 4. STRIPED HATCHING BEVEL FRAME (From Reference Image 2)
    // ----------------------------------------------------
    case 'striped-bevel':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '340 / 280' }}>
          <svg viewBox="0 0 340 280" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="40" y="40" width="260" height="200" rx="2" />
              </clipPath>
            </defs>

            {/* Paper backing */}
            <rect x="40" y="40" width="260" height="200" rx="2" fill="#ffffff" />

            {/* Centered Artwork */}
            <image
              href={imageUrl}
              x="40"
              y="40"
              width="260"
              height="200"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            {/* Striped Hatching Border Lines */}
            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <rect x="18" y="18" width="304" height="244" rx="4" strokeWidth="3.4" />
              <rect x="40" y="40" width="260" height="200" rx="2" strokeWidth="2.5" />

              {/* Diagonal Hatch Lines */}
              <g strokeWidth="2">
                {[35, 55, 75, 95, 115, 135, 155, 175, 195, 215, 235, 255, 275, 295].map((x) => (
                  <line key={`top-${x}`} x1={x} y1="18" x2={x + 12} y2="40" />
                ))}
                {[35, 55, 75, 95, 115, 135, 155, 175, 195, 215, 235, 255, 275, 295].map((x) => (
                  <line key={`bot-${x}`} x1={x} y1="240" x2={x + 12} y2="262" />
                ))}
                {[42, 62, 82, 102, 122, 142, 162, 182, 202, 222].map((y) => (
                  <line key={`left-${y}`} x1="18" y1={y} x2="40" y2={y + 12} />
                ))}
                {[42, 62, 82, 102, 122, 142, 162, 182, 202, 222].map((y) => (
                  <line key={`right-${y}`} x1="300" y1={y} x2="322" y2={y + 12} />
                ))}
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 5. WAVY RIBBON EDGE FRAME (From Reference Image 2)
    // ----------------------------------------------------
    case 'wavy-ribbon':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '320 / 380' }}>
          <svg viewBox="0 0 320 380" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="42" y="42" width="236" height="296" rx="3" />
              </clipPath>
            </defs>

            {/* Paper backing */}
            <rect x="42" y="42" width="236" height="296" rx="3" fill="#ffffff" />

            {/* Centered Artwork */}
            <image
              href={imageUrl}
              x="42"
              y="42"
              width="236"
              height="296"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            {/* Continuous Outer Wavy Ribbon */}
            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M 22 22
                   q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0 q 14 -10 28 0
                   q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28 q 10 14 0 28
                   q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0 q -14 10 -28 0
                   q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 q -10 -14 0 -28 Z"
                strokeWidth="3.2"
              />
              <rect x="42" y="42" width="236" height="296" rx="3" strokeWidth="2.6" />
              <rect x="48" y="48" width="224" height="284" rx="2" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 6. SUNRAY CAMEO OVAL (From Reference Image 2)
    // ----------------------------------------------------
    case 'sunray-cameo':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '300 / 380' }}>
          <svg viewBox="0 0 300 380" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <ellipse cx="150" cy="190" rx="90" ry="128" />
              </clipPath>
            </defs>

            {/* Paper backing */}
            <ellipse cx="150" cy="190" rx="90" ry="128" fill="#ffffff" />

            {/* Centered Artwork */}
            <image
              href={imageUrl}
              x="60"
              y="62"
              width="180"
              height="256"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            {/* Sunburst Beaded Ring and Radial Lines */}
            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="150" cy="190" rx="130" ry="170" strokeWidth="3.4" />
              <ellipse cx="150" cy="190" rx="110" ry="148" strokeWidth="2.4" />
              <ellipse cx="150" cy="190" rx="90" ry="128" strokeWidth="2.8" />

              {/* Radial Hatching Rays */}
              <g strokeWidth="2">
                {[...Array(24)].map((_, i) => {
                  const angle = (i * 15 * Math.PI) / 180
                  const x1 = 150 + 90 * Math.cos(angle)
                  const y1 = 190 + 128 * Math.sin(angle)
                  const x2 = 150 + 110 * Math.cos(angle)
                  const y2 = 190 + 148 * Math.sin(angle)
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                })}
              </g>
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 7. CLASSIC MITRED DOUBLE BEVEL (From Reference Image 2)
    // ----------------------------------------------------
    case 'classic-mitred':
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '340 / 280' }}>
          <svg viewBox="0 0 340 280" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="38" y="38" width="264" height="204" rx="2" />
              </clipPath>
            </defs>

            {/* Paper backing */}
            <rect x="38" y="38" width="264" height="204" rx="2" fill="#ffffff" />

            {/* Centered Artwork */}
            <image
              href={imageUrl}
              x="38"
              y="38"
              width="264"
              height="204"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            {/* Double Box with Corner Mitres */}
            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <rect x="16" y="16" width="308" height="248" rx="4" strokeWidth="3.4" />
              <rect x="38" y="38" width="264" height="204" rx="2" strokeWidth="2.4" />

              <line x1="16" y1="16" x2="38" y2="38" strokeWidth="2.6" />
              <line x1="324" y1="16" x2="302" y2="38" strokeWidth="2.6" />
              <line x1="16" y1="264" x2="38" y2="242" strokeWidth="2.6" />
              <line x1="324" y1="264" x2="302" y2="242" strokeWidth="2.6" />
            </g>
          </svg>
        </div>
      )

    // ----------------------------------------------------
    // 8. TALL FLOURISH PORTRAIT FRAME (From Reference Image 2)
    // ----------------------------------------------------
    case 'tall-flourish':
    default:
      return (
        <div className="doodle-frame-wrapper" style={{ aspectRatio: '260 / 390' }}>
          <svg viewBox="0 0 260 390" className="doodle-svg-frame">
            <defs>
              <clipPath id={clipId}>
                <rect x="28" y="32" width="204" height="326" rx="3" />
              </clipPath>
            </defs>

            {/* Paper backing */}
            <rect x="28" y="32" width="204" height="326" rx="3" fill="#ffffff" />

            {/* Centered Artwork */}
            <image
              href={imageUrl}
              x="28"
              y="32"
              width="204"
              height="326"
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />

            {/* Tall Frame Molding & Top Crown */}
            <g fill="none" stroke="#161616" strokeLinecap="round" strokeLinejoin="round">
              <rect x="18" y="22" width="224" height="346" rx="4" strokeWidth="3.2" />
              <rect x="28" y="32" width="204" height="326" rx="3" strokeWidth="2" />

              <g strokeWidth="2.4">
                <path d="M 115 22 C 120 10, 140 10, 145 22" />
                <circle cx="130" cy="10" r="3.5" fill="#161616" />

                {/* Corner curls */}
                <path d="M 18 42 C 10 38, 10 26, 18 22 C 26 18, 36 18, 40 30" />
                <path d="M 242 42 C 250 38, 250 26, 242 22 C 234 18, 224 18, 220 30" />
                <path d="M 18 348 C 10 352, 10 364, 18 368 C 26 372, 36 372, 40 360" />
                <path d="M 242 348 C 250 352, 250 364, 242 368 C 234 372, 224 372, 220 360" />
              </g>
            </g>
          </svg>
        </div>
      )
  }
}
