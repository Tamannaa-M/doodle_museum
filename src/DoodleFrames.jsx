import React from 'react'

/**
 * Hand-drawn Black & White Vintage Doodle Frames
 * Accurately styled from the user's sketchbook drawings and reference frames.
 */
export function DoodleFrame({ frameType, imageUrl, title }) {
  switch (frameType) {
    // ----------------------------------------------------
    // 1. SCALLOP / RUFFLED OVAL FRAME (From User Notebook Sketch)
    // ----------------------------------------------------
    case 'scallop-oval':
      return (
        <div className="doodle-frame-container frame-shape-oval" style={{ aspectRatio: '1 / 1.15' }}>
          <svg className="frame-svg-overlay" viewBox="0 0 300 345" preserveAspectRatio="none">
            <defs>
              <clipPath id="clip-scallop-oval">
                <ellipse cx="150" cy="172" rx="104" ry="126" />
              </clipPath>
            </defs>
            {/* Outer Scalloped / Ruffled Petals Loop */}
            <path
              d="M 150 20
                 C 168 18, 185 24, 200 35 C 215 45, 230 60, 240 78
                 C 252 98, 260 120, 264 145 C 267 165, 265 188, 258 210
                 C 250 232, 238 254, 222 272 C 205 290, 185 304, 162 312
                 C 142 318, 120 316, 100 308 C 80 298, 62 284, 48 266
                 C 34 246, 25 222, 22 198 C 18 175, 22 150, 30 128
                 C 40 102, 56 80, 76 62 C 98 42, 124 24, 150 20 Z"
              fill="none"
              stroke="#161616"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Ruffle bumps along the perimeter */}
            <path
              d="M 150 16 q 12 -8 24 0 q 12 -6 24 2 q 12 -2 22 8 q 12 4 20 14 q 10 10 16 22
                 q 8 14 10 26 q 4 16 2 28 q 0 16 -6 28 q -4 14 -12 26 q -8 14 -18 24
                 q -10 12 -22 18 q -14 10 -28 12 q -16 4 -28 0 q -16 -4 -28 -12 q -14 -8 -24 -20
                 q -10 -12 -16 -24 q -8 -16 -8 -30 q -2 -16 4 -28 q 4 -14 12 -26 q 8 -14 18 -22
                 q 12 -12 24 -18 q 14 -8 28 -8 Z"
              fill="none"
              stroke="#161616"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Inner Oval Border Lines */}
            <ellipse cx="150" cy="172" rx="112" ry="134" fill="none" stroke="#161616" strokeWidth="3" />
            <ellipse cx="150" cy="172" rx="104" ry="126" fill="none" stroke="#161616" strokeWidth="1.8" />
          </svg>
          <div className="frame-artwork-clipper" style={{ clipPath: 'url(#clip-scallop-oval)' }}>
            <img src={imageUrl} alt={title} className="frame-inner-img" loading="lazy" />
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 2. BOTANICAL LEAF WREATH OVAL (From Reference Image 2)
    // ----------------------------------------------------
    case 'leafy-wreath':
      return (
        <div className="doodle-frame-container frame-shape-oval" style={{ aspectRatio: '1 / 1.25' }}>
          <svg className="frame-svg-overlay" viewBox="0 0 280 350" preserveAspectRatio="none">
            <defs>
              <clipPath id="clip-leafy-wreath">
                <ellipse cx="140" cy="175" rx="96" ry="130" />
              </clipPath>
            </defs>
            {/* Base Oval Lines */}
            <ellipse cx="140" cy="175" rx="106" ry="140" fill="none" stroke="#161616" strokeWidth="3" />
            <ellipse cx="140" cy="175" rx="96" ry="130" fill="none" stroke="#161616" strokeWidth="1.8" />
            {/* Botanical Leaves along border */}
            <g stroke="#161616" strokeWidth="2.2" fill="none" strokeLinecap="round">
              <path d="M 140 22 c 6 -12 18 -8 16 4 c -6 8 -16 2 -16 -4 Z" fill="#ffffff" />
              <path d="M 175 32 c 12 -8 20 2 12 12 c -8 6 -16 -2 -12 -12 Z" fill="#ffffff" />
              <path d="M 210 58 c 12 -4 16 8 8 16 c -10 6 -16 -4 -8 -16 Z" fill="#ffffff" />
              <path d="M 238 98 c 10 2 12 14 2 18 c -10 2 -12 -10 -2 -18 Z" fill="#ffffff" />
              <path d="M 248 145 c 8 6 6 18 -4 18 c -8 -2 -8 -12 4 -18 Z" fill="#ffffff" />
              <path d="M 244 195 c 8 8 2 18 -8 16 c -8 -4 -6 -14 8 -16 Z" fill="#ffffff" />
              <path d="M 226 242 c 6 10 -4 18 -12 12 c -6 -6 0 -14 12 -12 Z" fill="#ffffff" />
              <path d="M 194 286 c 2 12 -10 16 -16 8 c -4 -8 4 -14 16 -8 Z" fill="#ffffff" />
              <path d="M 152 316 c -2 12 -14 12 -16 2 c 0 -8 10 -10 16 -2 Z" fill="#ffffff" />
              <path d="M 108 312 c -8 10 -18 6 -16 -4 c 4 -8 14 -4 16 4 Z" fill="#ffffff" />
              <path d="M 68 280 c -12 8 -18 -2 -10 -12 c 6 -6 16 -2 10 12 Z" fill="#ffffff" />
              <path d="M 40 234 c -12 2 -14 -10 -4 -16 c 8 -4 14 6 4 16 Z" fill="#ffffff" />
              <path d="M 28 180 c -10 -4 -8 -16 4 -16 c 8 2 8 12 -4 16 Z" fill="#ffffff" />
              <path d="M 34 126 c -8 -8 -2 -18 8 -14 c 8 4 6 14 -8 14 Z" fill="#ffffff" />
              <path d="M 58 76 c -4 -12 8 -16 14 -8 c 4 8 -4 14 -14 8 Z" fill="#ffffff" />
              <path d="M 98 38 c 0 -12 14 -12 16 -2 c 0 8 -10 10 -16 2 Z" fill="#ffffff" />
            </g>
          </svg>
          <div className="frame-artwork-clipper" style={{ clipPath: 'url(#clip-leafy-wreath)' }}>
            <img src={imageUrl} alt={title} className="frame-inner-img" loading="lazy" />
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 3. BAROQUE SCROLLWORK FRAME (From Reference Image 2)
    // ----------------------------------------------------
    case 'baroque-scroll':
      return (
        <div className="doodle-frame-container frame-shape-rect" style={{ aspectRatio: '1 / 1.28' }}>
          <svg className="frame-svg-overlay" viewBox="0 0 320 410" preserveAspectRatio="none">
            <defs>
              <clipPath id="clip-baroque-scroll">
                <rect x="36" y="38" width="248" height="334" rx="4" />
              </clipPath>
            </defs>
            {/* Outer Frame Lines */}
            <rect x="26" y="28" width="268" height="354" rx="6" fill="none" stroke="#161616" strokeWidth="3.2" />
            <rect x="36" y="38" width="248" height="334" rx="4" fill="none" stroke="#161616" strokeWidth="1.8" />
            
            {/* Corner Scrollwork Filigree (Top Left) */}
            <g stroke="#161616" strokeWidth="2.4" fill="none" strokeLinecap="round">
              <path d="M 26 55 C 10 50, 8 30, 24 24 C 40 18, 55 12, 55 28" />
              <path d="M 18 20 C 14 8, 28 6, 32 16" />
              <circle cx="16" cy="18" r="3" fill="#161616" />
              
              {/* Corner Scrollwork (Top Right) */}
              <path d="M 294 55 C 310 50, 312 30, 296 24 C 280 18, 265 12, 265 28" />
              <path d="M 302 20 C 306 8, 292 6, 288 16" />
              <circle cx="304" cy="18" r="3" fill="#161616" />
              
              {/* Corner Scrollwork (Bottom Left) */}
              <path d="M 26 355 C 10 360, 8 380, 24 386 C 40 392, 55 398, 55 382" />
              <path d="M 18 390 C 14 402, 28 404, 32 394" />
              <circle cx="16" cy="392" r="3" fill="#161616" />
              
              {/* Corner Scrollwork (Bottom Right) */}
              <path d="M 294 355 C 310 360, 312 380, 296 386 C 280 392, 265 398, 265 382" />
              <path d="M 302 390 C 306 402, 292 404, 288 394" />
              <circle cx="304" cy="392" r="3" fill="#161616" />

              {/* Top & Bottom Crest Details */}
              <path d="M 140 28 C 145 16, 175 16, 180 28" />
              <circle cx="160" cy="16" r="3.5" fill="#161616" />
              <path d="M 140 382 C 145 394, 175 394, 180 382" />
              <circle cx="160" cy="394" r="3.5" fill="#161616" />

              {/* Side Flourishes */}
              <path d="M 26 190 C 16 195, 16 215, 26 220" />
              <path d="M 294 190 C 304 195, 304 215, 294 220" />
            </g>
          </svg>
          <div className="frame-artwork-clipper" style={{ clipPath: 'url(#clip-baroque-scroll)' }}>
            <img src={imageUrl} alt={title} className="frame-inner-img" loading="lazy" />
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 4. STRIPED HATCHING BEVEL FRAME (From Reference Image 2)
    // ----------------------------------------------------
    case 'striped-bevel':
      return (
        <div className="doodle-frame-container frame-shape-rect" style={{ aspectRatio: '1.25 / 1' }}>
          <svg className="frame-svg-overlay" viewBox="0 0 350 280" preserveAspectRatio="none">
            <defs>
              <clipPath id="clip-striped-bevel">
                <rect x="36" y="36" width="278" height="208" rx="2" />
              </clipPath>
            </defs>
            {/* Outer Box */}
            <rect x="14" y="14" width="322" height="252" rx="4" fill="none" stroke="#161616" strokeWidth="3.2" />
            <rect x="36" y="36" width="278" height="208" rx="2" fill="none" stroke="#161616" strokeWidth="2.5" />
            
            {/* Diagonal Hatching along all 4 border strips */}
            <g stroke="#161616" strokeWidth="1.8" strokeLinecap="round">
              {/* Top border lines */}
              {[30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310].map((x) => (
                <line key={`top-${x}`} x1={x} y1="14" x2={x + 10} y2="36" />
              ))}
              {/* Bottom border lines */}
              {[30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310].map((x) => (
                <line key={`bot-${x}`} x1={x} y1="244" x2={x + 10} y2="266" />
              ))}
              {/* Left border lines */}
              {[35, 55, 75, 95, 115, 135, 155, 175, 195, 215, 235].map((y) => (
                <line key={`left-${y}`} x1="14" y1={y} x2="36" y2={y + 10} />
              ))}
              {/* Right border lines */}
              {[35, 55, 75, 95, 115, 135, 155, 175, 195, 215, 235].map((y) => (
                <line key={`right-${y}`} x1="314" y1={y} x2="336" y2={y + 10} />
              ))}
            </g>
          </svg>
          <div className="frame-artwork-clipper" style={{ clipPath: 'url(#clip-striped-bevel)' }}>
            <img src={imageUrl} alt={title} className="frame-inner-img" loading="lazy" />
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 5. WAVY RIBBON EDGE FRAME (From Reference Image 2)
    // ----------------------------------------------------
    case 'wavy-ribbon':
      return (
        <div className="doodle-frame-container frame-shape-rect" style={{ aspectRatio: '1 / 1.18' }}>
          <svg className="frame-svg-overlay" viewBox="0 0 300 354" preserveAspectRatio="none">
            <defs>
              <clipPath id="clip-wavy-ribbon">
                <rect x="32" y="32" width="236" height="290" rx="3" />
              </clipPath>
            </defs>
            {/* Outer Continuous Wavy Ribbon Border */}
            <path
              d="M 20 20
                 q 12 -8 25 0 q 12 -8 25 0 q 12 -8 25 0 q 12 -8 25 0 q 12 -8 25 0 q 12 -8 25 0 q 12 -8 25 0 q 12 -8 25 0 q 12 -8 25 0 q 12 -8 25 0
                 q 8 12 0 25 q 8 12 0 25 q 8 12 0 25 q 8 12 0 25 q 8 12 0 25 q 8 12 0 25 q 8 12 0 25 q 8 12 0 25 q 8 12 0 25 q 8 12 0 25 q 8 12 0 25
                 q -12 8 -25 0 q -12 8 -25 0 q -12 8 -25 0 q -12 8 -25 0 q -12 8 -25 0 q -12 8 -25 0 q -12 8 -25 0 q -12 8 -25 0 q -12 8 -25 0 q -12 8 -25 0
                 q -8 -12 0 -25 q -8 -12 0 -25 q -8 -12 0 -25 q -8 -12 0 -25 q -8 -12 0 -25 q -8 -12 0 -25 q -8 -12 0 -25 q -8 -12 0 -25 q -8 -12 0 -25 q -8 -12 0 -25 Z"
              fill="none"
              stroke="#161616"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Inner Clean Box */}
            <rect x="32" y="32" width="236" height="290" rx="3" fill="none" stroke="#161616" strokeWidth="2.6" />
            <rect x="40" y="40" width="220" height="274" rx="2" fill="none" stroke="#161616" strokeWidth="1.5" />
          </svg>
          <div className="frame-artwork-clipper" style={{ clipPath: 'url(#clip-wavy-ribbon)' }}>
            <img src={imageUrl} alt={title} className="frame-inner-img" loading="lazy" />
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 6. SUNRAY CAMEO OVAL (From Reference Image 2)
    // ----------------------------------------------------
    case 'sunray-cameo':
      return (
        <div className="doodle-frame-container frame-shape-oval" style={{ aspectRatio: '1 / 1.35' }}>
          <svg className="frame-svg-overlay" viewBox="0 0 280 378" preserveAspectRatio="none">
            <defs>
              <clipPath id="clip-sunray-cameo">
                <ellipse cx="140" cy="189" rx="85" ry="124" />
              </clipPath>
            </defs>
            {/* Beaded Outer Ring */}
            <ellipse cx="140" cy="189" rx="124" ry="168" fill="none" stroke="#161616" strokeWidth="3.2" />
            <ellipse cx="140" cy="189" rx="105" ry="144" fill="none" stroke="#161616" strokeWidth="2.2" />
            <ellipse cx="140" cy="189" rx="85" ry="124" fill="none" stroke="#161616" strokeWidth="2.8" />
            {/* Radial Hatching Rays between rings */}
            <g stroke="#161616" strokeWidth="1.8">
              {[...Array(24)].map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180
                const x1 = 140 + 85 * Math.cos(angle)
                const y1 = 189 + 124 * Math.sin(angle)
                const x2 = 140 + 105 * Math.cos(angle)
                const y2 = 189 + 144 * Math.sin(angle)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
              })}
            </g>
          </svg>
          <div className="frame-artwork-clipper" style={{ clipPath: 'url(#clip-sunray-cameo)' }}>
            <img src={imageUrl} alt={title} className="frame-inner-img" loading="lazy" />
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 7. CLASSIC MITRED DOUBLE BEVEL (From Reference Image 2)
    // ----------------------------------------------------
    case 'classic-mitred':
      return (
        <div className="doodle-frame-container frame-shape-rect" style={{ aspectRatio: '1.2 / 1' }}>
          <svg className="frame-svg-overlay" viewBox="0 0 340 284" preserveAspectRatio="none">
            <defs>
              <clipPath id="clip-classic-mitred">
                <rect x="34" y="34" width="272" height="216" rx="2" />
              </clipPath>
            </defs>
            {/* Outer Rectangle */}
            <rect x="14" y="14" width="312" height="256" rx="4" fill="none" stroke="#161616" strokeWidth="3.4" />
            {/* Inner Rectangle */}
            <rect x="34" y="34" width="272" height="216" rx="2" fill="none" stroke="#161616" strokeWidth="2.4" />
            {/* 45 Degree Corner Mitres */}
            <line x1="14" y1="14" x2="34" y2="34" stroke="#161616" strokeWidth="2.6" />
            <line x1="326" y1="14" x2="306" y2="34" stroke="#161616" strokeWidth="2.6" />
            <line x1="14" y1="270" x2="34" y2="250" stroke="#161616" strokeWidth="2.6" />
            <line x1="326" y1="270" x2="306" y2="250" stroke="#161616" strokeWidth="2.6" />
          </svg>
          <div className="frame-artwork-clipper" style={{ clipPath: 'url(#clip-classic-mitred)' }}>
            <img src={imageUrl} alt={title} className="frame-inner-img" loading="lazy" />
          </div>
        </div>
      )

    // ----------------------------------------------------
    // 8. TALL FLOURISH PORTRAIT FRAME (From Reference Image 2)
    // ----------------------------------------------------
    case 'tall-flourish':
    default:
      return (
        <div className="doodle-frame-container frame-shape-rect" style={{ aspectRatio: '1 / 1.55' }}>
          <svg className="frame-svg-overlay" viewBox="0 0 240 372" preserveAspectRatio="none">
            <defs>
              <clipPath id="clip-tall-flourish">
                <rect x="24" y="26" width="192" height="320" rx="3" />
              </clipPath>
            </defs>
            {/* Outer Box */}
            <rect x="16" y="18" width="208" height="336" rx="4" fill="none" stroke="#161616" strokeWidth="3" />
            <rect x="24" y="26" width="192" height="320" rx="3" fill="none" stroke="#161616" strokeWidth="1.8" />
            {/* Top Crown & Corner Flourishes */}
            <g stroke="#161616" strokeWidth="2.2" fill="none" strokeLinecap="round">
              <path d="M 105 18 C 110 8, 130 8, 135 18" />
              <circle cx="120" cy="8" r="3" fill="#161616" />
              {/* Corner curls */}
              <path d="M 16 36 C 8 32, 8 22, 16 18 C 24 14, 32 14, 36 26" />
              <path d="M 224 36 C 232 32, 232 22, 224 18 C 216 14, 208 14, 204 26" />
              <path d="M 16 336 C 8 340, 8 350, 16 354 C 24 358, 32 358, 36 346" />
              <path d="M 224 336 C 232 340, 232 350, 224 354 C 216 358, 208 358, 204 346" />
            </g>
          </svg>
          <div className="frame-artwork-clipper" style={{ clipPath: 'url(#clip-tall-flourish)' }}>
            <img src={imageUrl} alt={title} className="frame-inner-img" loading="lazy" />
          </div>
        </div>
      )
  }
}
