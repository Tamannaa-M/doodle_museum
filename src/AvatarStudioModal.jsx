import { useRef, useState } from 'react'
import { PRESET_AVATARS, RenderAvatar } from './AvatarLibrary'

export function AvatarStudioModal({
  defaultTitle,
  onSave,
  onOpenPhotoBooth,
  onClose,
  saving,
}) {
  const [title, setTitle] = useState(defaultTitle || '')
  const [artistName, setArtistName] = useState(
    localStorage.getItem('doodle_artist_name') || ''
  )
  const [selectedAvatar, setSelectedAvatar] = useState('avatar-pigtails')
  const [avatarMode, setAvatarMode] = useState('preset') // 'preset' | 'draw'

  // Mini Avatar Draw Canvas
  const avatarCanvasRef = useRef(null)
  const [isDrawingAvatar, setIsDrawingAvatar] = useState(false)
  const [avatarTool, setAvatarTool] = useState('pen')
  const [customAvatarData, setCustomAvatarData] = useState(null)

  function startAvatarDraw(e) {
    const canvas = avatarCanvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    const x = ((e.clientX - rect.left) * canvas.width) / rect.width
    const y = ((e.clientY - rect.top) * canvas.height) / rect.height

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawingAvatar(true)

    if (canvas.setPointerCapture && e.pointerId !== undefined) {
      try {
        canvas.setPointerCapture(e.pointerId)
      } catch (err) {
        // ignore
      }
    }
  }

  function drawAvatar(e) {
    if (!isDrawingAvatar) return
    const canvas = avatarCanvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    const x = ((e.clientX - rect.left) * canvas.width) / rect.width
    const y = ((e.clientY - rect.top) * canvas.height) / rect.height

    ctx.lineWidth = avatarTool === 'eraser' ? 12 : 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (avatarTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = '#181512'
    }

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function stopAvatarDraw(e) {
    if (!isDrawingAvatar) return
    const canvas = avatarCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.closePath()
    ctx.globalCompositeOperation = 'source-over'
    setIsDrawingAvatar(false)

    // Export custom avatar as data URL
    const dataUrl = canvas.toDataURL('image/png')
    setCustomAvatarData(dataUrl)
    setSelectedAvatar(dataUrl)

    if (
      canvas.releasePointerCapture &&
      e?.pointerId !== undefined &&
      canvas.hasPointerCapture?.(e.pointerId)
    ) {
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch (err) {
        // ignore
      }
    }
  }

  function clearAvatarCanvas() {
    const canvas = avatarCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setCustomAvatarData(null)
    setSelectedAvatar('avatar-pigtails')
  }

  function handleFinalSave() {
    const finalArtist = artistName.trim() || 'Anonymous Artist'
    const finalTitle = title.trim() || 'Untitled Doodle'
    const finalAvatar = avatarMode === 'draw' && customAvatarData ? customAvatarData : selectedAvatar

    // Save artist name in localStorage for convenience
    localStorage.setItem('doodle_artist_name', finalArtist)

    onSave({
      title: finalTitle,
      artistName: finalArtist,
      avatar: finalAvatar,
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="avatar-studio-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Artist Tagging and Avatar Studio"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Modal Header */}
        <div className="avatar-modal-header">
          <div className="avatar-badge">✦ ARTIST ACCREDITATION ✦</div>
          <h2 className="avatar-modal-title">Who Made This?</h2>
          <p className="avatar-modal-subtitle">
            Sign your artwork & choose or draw your avatar to pin next to your art on the wall!
          </p>
        </div>

        {/* Form Inputs */}
        <div className="avatar-fields-row">
          <div className="input-group">
            <label className="input-label">Artwork Title</label>
            <input
              type="text"
              placeholder="e.g. The Midnight Cat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="styled-museum-input"
              maxLength={45}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Artist Name / Handle</label>
            <input
              type="text"
              placeholder="e.g. Taman"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="styled-museum-input"
              maxLength={30}
            />
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="avatar-tab-pills">
          <button
            className={`tab-pill-btn ${avatarMode === 'preset' ? 'active' : ''}`}
            onClick={() => setAvatarMode('preset')}
          >
            🎨 Choose a Caricature
          </button>
          <button
            className={`tab-pill-btn ${avatarMode === 'draw' ? 'active' : ''}`}
            onClick={() => setAvatarMode('draw')}
          >
            ✏️ Draw Your Own Face!
          </button>
        </div>

        {/* Tab 1: Preset Avatars (Reference Image 1: "DRAW YOUR FACE" Board) */}
        {avatarMode === 'preset' && (
          <div className="preset-avatar-grid-board">
            <div className="board-banner-label">✦ GRAB A FACE ✦</div>
            <div className="avatar-options-grid">
              {PRESET_AVATARS.map((item) => (
                <button
                  key={item.id}
                  className={`avatar-choice-card ${selectedAvatar === item.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(item.id)}
                  type="button"
                  title={item.name}
                >
                  <div className="avatar-choice-preview">{item.svg}</div>
                  <span className="avatar-choice-name">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Draw Your Own Face Canvas */}
        {avatarMode === 'draw' && (
          <div className="draw-avatar-pad-wrapper">
            <div className="board-banner-label">✦ SKETCH YOUR 5-SECOND FACE ✦</div>
            <div className="avatar-canvas-assembly">
              <div className="avatar-draw-ring">
                <canvas
                  ref={avatarCanvasRef}
                  width={150}
                  height={150}
                  className="avatar-draw-canvas"
                  onPointerDown={startAvatarDraw}
                  onPointerMove={drawAvatar}
                  onPointerUp={stopAvatarDraw}
                  onPointerCancel={stopAvatarDraw}
                />
              </div>

              <div className="avatar-draw-controls">
                <button
                  className={`mini-tool-btn ${avatarTool === 'pen' ? 'active' : ''}`}
                  onClick={() => setAvatarTool('pen')}
                >
                  ✏️ Pen
                </button>
                <button
                  className={`mini-tool-btn ${avatarTool === 'eraser' ? 'active' : ''}`}
                  onClick={() => setAvatarTool('eraser')}
                >
                  🧹 Eraser
                </button>
                <button className="mini-tool-btn" onClick={clearAvatarCanvas}>
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Preview Stamp */}
        <div className="artist-preview-plaque-bar">
          <div className="preview-label">WALL PREVIEW:</div>
          <div className="preview-stamp">
            <RenderAvatar
              avatar={avatarMode === 'draw' && customAvatarData ? customAvatarData : selectedAvatar}
              size={36}
            />
            <div className="preview-stamp-text">
              <strong>{title || 'Untitled Doodle'}</strong>
              <span>by {artistName || 'Anonymous Artist'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="avatar-modal-actions">
          <button
            className="hang-museum-btn"
            onClick={handleFinalSave}
            disabled={saving}
          >
            {saving ? '⏳ Archiving to Museum...' : '🖼️ Hang in Museum Wall!'}
          </button>

          <button
            className="open-photobooth-pill-btn"
            onClick={() => {
              const finalArtist = artistName.trim() || 'Anonymous Artist'
              const finalTitle = title.trim() || 'Untitled Doodle'
              const finalAvatar = avatarMode === 'draw' && customAvatarData ? customAvatarData : selectedAvatar
              onOpenPhotoBooth({
                title: finalTitle,
                artistName: finalArtist,
                avatar: finalAvatar,
              })
            }}
            type="button"
          >
            📸 Create Memories Photo Strip!
          </button>
        </div>
      </div>
    </div>
  )
}
