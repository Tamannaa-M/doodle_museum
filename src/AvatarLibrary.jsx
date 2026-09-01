import React from 'react'

/**
 * Hairstyle Base Templates (from Reference Image 2)
 * for the "Draw Your Own Avatar" studio.
 */
export const HAIRSTYLE_TEMPLATES = [
  {
    id: 'hair-pigtails-bows',
    name: 'Twin Pigtails',
    drawBase: (ctx, width, height) => {
      ctx.strokeStyle = '#161616'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      // Face outline
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 + 5, 42, 45, 0, 0, Math.PI * 2)
      ctx.stroke()
      // Bangs
      ctx.beginPath()
      ctx.moveTo(35, 60)
      ctx.quadraticCurveTo(60, 80, 85, 65)
      ctx.quadraticCurveTo(115, 80, 145, 60)
      ctx.stroke()
      // Pigtails on sides with bows
      ctx.beginPath()
      ctx.arc(28, 70, 14, 0, Math.PI * 2)
      ctx.arc(152, 70, 14, 0, Math.PI * 2)
      ctx.stroke()
      // Bows
      ctx.beginPath()
      ctx.moveTo(28, 70)
      ctx.lineTo(20, 62)
      ctx.lineTo(20, 78)
      ctx.closePath()
      ctx.moveTo(152, 70)
      ctx.lineTo(160, 62)
      ctx.lineTo(160, 78)
      ctx.closePath()
      ctx.stroke()
    },
  },
  {
    id: 'hair-bob-star',
    name: 'Star Bob',
    drawBase: (ctx, width, height) => {
      ctx.strokeStyle = '#161616'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      // Face
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 + 5, 42, 45, 0, 0, Math.PI * 2)
      ctx.stroke()
      // Bob Hair Outline
      ctx.beginPath()
      ctx.arc(90, 85, 55, Math.PI * 0.8, Math.PI * 2.2)
      ctx.stroke()
      // Bangs
      ctx.beginPath()
      ctx.moveTo(48, 65)
      ctx.quadraticCurveTo(70, 75, 90, 65)
      ctx.quadraticCurveTo(110, 75, 132, 65)
      ctx.stroke()
      // Star Clip
      ctx.beginPath()
      const cx = 55, cy = 52
      ctx.moveTo(cx, cy - 8)
      ctx.lineTo(cx + 3, cy - 2)
      ctx.lineTo(cx + 8, cy)
      ctx.lineTo(cx + 4, cy + 5)
      ctx.lineTo(cx + 6, cy + 10)
      ctx.lineTo(cx, cy + 7)
      ctx.lineTo(cx - 6, cy + 10)
      ctx.lineTo(cx - 4, cy + 5)
      ctx.lineTo(cx - 8, cy)
      ctx.lineTo(cx - 3, cy - 2)
      ctx.closePath()
      ctx.stroke()
    },
  },
  {
    id: 'hair-space-buns',
    name: 'Space Buns',
    drawBase: (ctx, width, height) => {
      ctx.strokeStyle = '#161616'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      // Face
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 + 8, 42, 44, 0, 0, Math.PI * 2)
      ctx.stroke()
      // Top Double Buns
      ctx.beginPath()
      ctx.arc(50, 42, 18, 0, Math.PI * 2)
      ctx.arc(130, 42, 18, 0, Math.PI * 2)
      ctx.stroke()
      // Center hair curve
      ctx.beginPath()
      ctx.moveTo(48, 64)
      ctx.quadraticCurveTo(90, 76, 132, 64)
      ctx.stroke()
    },
  },
  {
    id: 'hair-spiky-boy',
    name: 'Anime Spikes',
    drawBase: (ctx, width, height) => {
      ctx.strokeStyle = '#161616'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      // Face
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 + 8, 42, 44, 0, 0, Math.PI * 2)
      ctx.stroke()
      // Spikes
      ctx.beginPath()
      ctx.moveTo(45, 65)
      ctx.lineTo(30, 40)
      ctx.lineTo(55, 48)
      ctx.lineTo(70, 22)
      ctx.lineTo(90, 45)
      ctx.lineTo(110, 20)
      ctx.lineTo(125, 48)
      ctx.lineTo(150, 38)
      ctx.lineTo(135, 68)
      ctx.stroke()
    },
  },
  {
    id: 'hair-wavy-lob',
    name: 'Wavy Hair',
    drawBase: (ctx, width, height) => {
      ctx.strokeStyle = '#161616'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      // Face
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2 + 5, 42, 45, 0, 0, Math.PI * 2)
      ctx.stroke()
      // Wavy Side Curls
      ctx.beginPath()
      ctx.moveTo(48, 65)
      ctx.bezierCurveTo(28, 80, 25, 110, 38, 130)
      ctx.moveTo(132, 65)
      ctx.bezierCurveTo(152, 80, 155, 110, 142, 130)
      ctx.stroke()
      // Top hair & bangs
      ctx.beginPath()
      ctx.moveTo(48, 65)
      ctx.quadraticCurveTo(90, 50, 132, 65)
      ctx.stroke()
    },
  },
  {
    id: 'hair-blank-face',
    name: 'Blank Face',
    drawBase: (ctx, width, height) => {
      ctx.strokeStyle = '#161616'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      // Base Clean Circle Face
      ctx.beginPath()
      ctx.ellipse(width / 2, height / 2, 48, 50, 0, 0, Math.PI * 2)
      ctx.stroke()
      // Soft guide ear notches
      ctx.beginPath()
      ctx.arc(38, height / 2, 8, Math.PI * 0.5, Math.PI * 1.5)
      ctx.arc(width - 38, height / 2, 8, -Math.PI * 0.5, Math.PI * 0.5)
      ctx.stroke()
    },
  },
]

export const HAIRSTYLE_BY_ID = Object.fromEntries(
  HAIRSTYLE_TEMPLATES.map((template) => [template.id, template])
)

/**
 * Curated Hand-Drawn Doodle Avatars (from Reference Image 1 & 2)
 */
export const PRESET_AVATARS = [
  {
    id: 'avatar-pigtails',
    name: 'Pigtails Girl',
    svg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#fdfaf3" stroke="#161616" strokeWidth="3" />
        <circle cx="50" cy="52" r="30" fill="#fce5c8" stroke="#161616" strokeWidth="2.5" />
        <path d="M 26 44 q 12 14 24 2 q 12 14 24 0" fill="#161616" stroke="#161616" strokeWidth="2" />
        <circle cx="40" cy="52" r="2.5" fill="#161616" />
        <circle cx="60" cy="52" r="2.5" fill="#161616" />
        <ellipse cx="34" cy="58" rx="3.5" ry="2" fill="#f4a395" />
        <ellipse cx="66" cy="58" rx="3.5" ry="2" fill="#f4a395" />
        <path d="M 46 58 q 4 5 8 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="48" r="7" fill="#161616" />
        <circle cx="82" cy="48" r="7" fill="#161616" />
      </svg>
    ),
  },
  {
    id: 'avatar-cap-boy',
    name: 'Cap Boy',
    svg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#fdfaf3" stroke="#161616" strokeWidth="3" />
        <circle cx="50" cy="54" r="28" fill="#fce5c8" stroke="#161616" strokeWidth="2.5" />
        <path d="M 22 48 c 0 -20 56 -20 56 0 Z" fill="#302d29" stroke="#161616" strokeWidth="2.5" />
        <path d="M 52 48 q 24 -2 28 6 q -14 6 -28 0" fill="#302d29" stroke="#161616" strokeWidth="2" />
        <circle cx="42" cy="58" r="2.5" fill="#161616" />
        <circle cx="58" cy="58" r="2.5" fill="#161616" />
        <path d="M 48 64 q 4 4 8 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'avatar-glasses',
    name: 'Glasses Scholar',
    svg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#fdfaf3" stroke="#161616" strokeWidth="3" />
        <circle cx="50" cy="52" r="30" fill="#fce5c8" stroke="#161616" strokeWidth="2.5" />
        <path d="M 24 45 c 5 -18 47 -18 52 0 c -8 -2 -18 4 -26 0 c -8 4 -18 -2 -26 0 Z" fill="#161616" />
        <circle cx="40" cy="53" r="7" fill="none" stroke="#161616" strokeWidth="2.5" />
        <circle cx="60" cy="53" r="7" fill="none" stroke="#161616" strokeWidth="2.5" />
        <line x1="47" y1="53" x2="53" y2="53" stroke="#161616" strokeWidth="2.5" />
        <circle cx="40" cy="53" r="2" fill="#161616" />
        <circle cx="60" cy="53" r="2" fill="#161616" />
        <path d="M 46 63 q 4 4 8 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'avatar-cat',
    name: 'Museum Cat',
    svg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#fdfaf3" stroke="#161616" strokeWidth="3" />
        <path d="M 28 62 l -8 -20 l 16 8 c 8 -10 20 -10 28 0 l 16 -8 l -8 20 c 6 12 -4 24 -22 24 c -18 0 -28 -12 -22 -24 Z" fill="#f7f3ea" stroke="#161616" strokeWidth="2.5" />
        <ellipse cx="40" cy="56" rx="2.5" ry="3" fill="#161616" />
        <ellipse cx="60" cy="56" rx="2.5" ry="3" fill="#161616" />
        <path d="M 48 62 l 2 2 l 2 -2" fill="none" stroke="#161616" strokeWidth="2" />
        <path d="M 50 64 q -3 4 -6 0 m 6 0 q 3 4 6 0" fill="none" stroke="#161616" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="32" y1="60" x2="22" y2="58" stroke="#161616" strokeWidth="1.5" />
        <line x1="32" y1="64" x2="20" y2="66" stroke="#161616" strokeWidth="1.5" />
        <line x1="68" y1="60" x2="78" y2="58" stroke="#161616" strokeWidth="1.5" />
        <line x1="68" y1="64" x2="80" y2="66" stroke="#161616" strokeWidth="1.5" />
        <path d="M 44 38 l 3 -6 l 3 4 l 3 -4 l 3 6 Z" fill="#ffd978" stroke="#161616" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'avatar-sprout',
    name: 'Spiky Sprout',
    svg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#fdfaf3" stroke="#161616" strokeWidth="3" />
        <circle cx="50" cy="56" r="26" fill="#fce5c8" stroke="#161616" strokeWidth="2.5" />
        <path d="M 30 42 l -8 -16 l 14 10 l 8 -16 l 6 16 l 12 -12 l -2 18" fill="#161616" stroke="#161616" strokeWidth="2" />
        <circle cx="42" cy="56" r="2.5" fill="#161616" />
        <circle cx="58" cy="56" r="2.5" fill="#161616" />
        <path d="M 46 63 q 4 5 8 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="36" cy="60" rx="3" ry="1.5" fill="#f4a395" />
        <ellipse cx="64" cy="60" rx="3" ry="1.5" fill="#f4a395" />
      </svg>
    ),
  },
  {
    id: 'avatar-star',
    name: 'Star Dreamer',
    svg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#fdfaf3" stroke="#161616" strokeWidth="3" />
        <path d="M 50 18 l 9 18 l 20 3 l -14 14 l 3 20 l -18 -9 l -18 9 l 3 -20 l -14 -14 l 20 -3 Z" fill="#ffd978" stroke="#161616" strokeWidth="2.5" />
        <circle cx="44" cy="48" r="2.5" fill="#161616" />
        <circle cx="56" cy="48" r="2.5" fill="#161616" />
        <path d="M 47 54 q 3 3 6 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="40" cy="52" rx="2.5" ry="1.5" fill="#f4a395" />
        <ellipse cx="60" cy="52" rx="2.5" ry="1.5" fill="#f4a395" />
      </svg>
    ),
  },
  {
    id: 'avatar-curly',
    name: 'Curly Artist',
    svg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#fdfaf3" stroke="#161616" strokeWidth="3" />
        <circle cx="50" cy="54" r="26" fill="#fce5c8" stroke="#161616" strokeWidth="2.5" />
        <path d="M 26 48 q -8 -10 2 -16 q 4 -12 16 -8 q 12 -12 20 0 q 12 -4 16 8 q 10 6 2 16 Z" fill="#161616" stroke="#161616" strokeWidth="2" />
        <circle cx="42" cy="56" r="2.5" fill="#161616" />
        <circle cx="58" cy="56" r="2.5" fill="#161616" />
        <path d="M 46 62 q 4 5 8 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="60" r="2.5" fill="#82b8d8" />
      </svg>
    ),
  },
  {
    id: 'avatar-crown',
    name: 'Doodle Master',
    svg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#fdfaf3" stroke="#161616" strokeWidth="3" />
        <circle cx="50" cy="54" r="28" fill="#fce5c8" stroke="#161616" strokeWidth="2.5" />
        <path d="M 32 38 l 6 -14 l 6 8 l 6 -8 l 6 8 l 6 -14 l 6 14 Z" fill="#ffd978" stroke="#161616" strokeWidth="2" />
        <circle cx="42" cy="54" r="2.5" fill="#161616" />
        <circle cx="58" cy="54" r="2.5" fill="#161616" />
        <path d="M 46 62 q 4 4 8 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

/**
 * Render Avatar helper (supports preset ID or custom dataURL image)
 */
export function RenderAvatar({ avatar, size = 38 }) {
  if (!avatar) {
    return (
      <div
        className="avatar-bubble-badge default"
        style={{ width: size, height: size, minWidth: size }}
      >
        🎨
      </div>
    )
  }

  // If it's a dataURL (custom drawn face or photo)
  if (typeof avatar === 'string' && avatar.startsWith('data:')) {
    return (
      <div
        className="avatar-bubble-badge custom"
        style={{ width: size, height: size, minWidth: size }}
      >
        <img src={avatar} alt="Artist Avatar" className="avatar-img-custom" />
      </div>
    )
  }

  // Find preset by id
  const preset = PRESET_AVATARS.find((p) => p.id === avatar)
  if (preset) {
    return (
      <div
        className="avatar-bubble-badge preset"
        style={{ width: size, height: size, minWidth: size }}
        title={preset.name}
      >
        {preset.svg}
      </div>
    )
  }

  return (
    <div
      className="avatar-bubble-badge default"
      style={{ width: size, height: size, minWidth: size }}
    >
      🎨
    </div>
  )
}
