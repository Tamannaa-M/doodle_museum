import React from 'react'

/**
 * Curated Hand-Drawn Doodle Avatars inspired by the "DRAW YOUR FACE" board
 * and the user's notebook sketches.
 */
export const PRESET_AVATARS = [
  {
    id: 'avatar-pigtails',
    name: 'Pigtails Girl',
    svg: (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="#fdfaf3" stroke="#161616" strokeWidth="3" />
        {/* Face contour */}
        <circle cx="50" cy="52" r="30" fill="#fce5c8" stroke="#161616" strokeWidth="2.5" />
        {/* Bangs */}
        <path d="M 26 44 q 12 14 24 2 q 12 14 24 0" fill="#161616" stroke="#161616" strokeWidth="2" />
        {/* Eyes & Blushes */}
        <circle cx="40" cy="52" r="2.5" fill="#161616" />
        <circle cx="60" cy="52" r="2.5" fill="#161616" />
        <ellipse cx="34" cy="58" rx="3.5" ry="2" fill="#f4a395" />
        <ellipse cx="66" cy="58" rx="3.5" ry="2" fill="#f4a395" />
        {/* Smile */}
        <path d="M 46 58 q 4 5 8 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
        {/* Braids / Buns */}
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
        {/* Face */}
        <circle cx="50" cy="54" r="28" fill="#fce5c8" stroke="#161616" strokeWidth="2.5" />
        {/* Cap */}
        <path d="M 22 48 c 0 -20 56 -20 56 0 Z" fill="#302d29" stroke="#161616" strokeWidth="2.5" />
        <path d="M 52 48 q 24 -2 28 6 q -14 6 -28 0" fill="#302d29" stroke="#161616" strokeWidth="2" />
        {/* Eyes & Smile */}
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
        {/* Hair */}
        <path d="M 24 45 c 5 -18 47 -18 52 0 c -8 -2 -18 4 -26 0 c -8 4 -18 -2 -26 0 Z" fill="#161616" />
        {/* Glasses */}
        <circle cx="40" cy="53" r="7" fill="none" stroke="#161616" strokeWidth="2.5" />
        <circle cx="60" cy="53" r="7" fill="none" stroke="#161616" strokeWidth="2.5" />
        <line x1="47" y1="53" x2="53" y2="53" stroke="#161616" strokeWidth="2.5" />
        <circle cx="40" cy="53" r="2" fill="#161616" />
        <circle cx="60" cy="53" r="2" fill="#161616" />
        {/* Smile */}
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
        {/* Cat head */}
        <path d="M 28 62 l -8 -20 l 16 8 c 8 -10 20 -10 28 0 l 16 -8 l -8 20 c 6 12 -4 24 -22 24 c -18 0 -28 -12 -22 -24 Z" fill="#f7f3ea" stroke="#161616" strokeWidth="2.5" />
        {/* Eyes */}
        <ellipse cx="40" cy="56" rx="2.5" ry="3" fill="#161616" />
        <ellipse cx="60" cy="56" rx="2.5" ry="3" fill="#161616" />
        {/* Nose & Mouth */}
        <path d="M 48 62 l 2 2 l 2 -2" fill="none" stroke="#161616" strokeWidth="2" />
        <path d="M 50 64 q -3 4 -6 0 m 6 0 q 3 4 6 0" fill="none" stroke="#161616" strokeWidth="1.8" strokeLinecap="round" />
        {/* Whiskers */}
        <line x1="32" y1="60" x2="22" y2="58" stroke="#161616" strokeWidth="1.5" />
        <line x1="32" y1="64" x2="20" y2="66" stroke="#161616" strokeWidth="1.5" />
        <line x1="68" y1="60" x2="78" y2="58" stroke="#161616" strokeWidth="1.5" />
        <line x1="68" y1="64" x2="80" y2="66" stroke="#161616" strokeWidth="1.5" />
        {/* Mini Crown */}
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
        {/* Spiky hair */}
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
        {/* Star face */}
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
        {/* Curly cloud hair */}
        <path d="M 26 48 q -8 -10 2 -16 q 4 -12 16 -8 q 12 -12 20 0 q 12 -4 16 8 q 10 6 2 16 Z" fill="#161616" stroke="#161616" strokeWidth="2" />
        <circle cx="42" cy="56" r="2.5" fill="#161616" />
        <circle cx="58" cy="56" r="2.5" fill="#161616" />
        <path d="M 46 62 q 4 5 8 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
        {/* Paint smudge on cheek */}
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
        {/* Crown */}
        <path d="M 32 38 l 6 -14 l 6 8 l 6 -8 l 6 8 l 6 -14 l 6 14 Z" fill="#ffd978" stroke="#161616" strokeWidth="2" />
        <circle cx="42" cy="54" r="2.5" fill="#161616" />
        <circle cx="58" cy="54" r="2.5" fill="#161616" />
        <path d="M 46 62 q 4 4 8 0" fill="none" stroke="#161616" strokeWidth="2" strokeLinecap="round" />
        <path d="M 38 48 q 4 -3 8 0" fill="none" stroke="#161616" strokeWidth="1.5" />
        <path d="M 54 48 q 4 -3 8 0" fill="none" stroke="#161616" strokeWidth="1.5" />
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
