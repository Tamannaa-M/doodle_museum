import { useEffect, useRef, useState } from 'react'
import { PRESET_AVATARS, HAIRSTYLE_TEMPLATES, RenderAvatar } from './AvatarLibrary'

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
  const [avatarMode, setAvatarMode] = useState('draw') // 'draw' | 'preset'

  // Hairstyle template selection
  const [selectedHair, setSelectedHair] = useState('hair-pigtails-bows')

  // Mini Avatar Draw Canvas State
  const avatarCanvasRef = useRef(null)
  const historyRef = useRef([])
  const [isDrawingAvatar, setIsDrawingAvatar] = useState(false)
  const [avatarTool, setAvatarTool] = useState('pen') // 'pen' | 'eraser'
  const [avatarBrushSize, setAvatarBrushSize] = useState(3)
  const [avatarColor, setAvatarColor] = useState('#161616')
  const [customAvatarData, setCustomAvatarData] = useState(null)

  // Initialize Canvas with chosen hairstyle template
  useEffect(() => {
    if (avatarMode === 'draw') {
      loadHairstyleTemplate(selectedHair)
    }
  }, [avatarMode, selectedHair])

  function loadHairstyleTemplate(hairId) {
    const canvas = avatarCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Reset canvas to white background
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw chosen hairstyle template
    const template = HAIRSTYLE_TEMPLATES.find((h) => h.id === hairId)
    if (template && template.drawBase) {
      template.drawBase(ctx, canvas.width, canvas.height)
    }

    historyRef.current = [canvas.toDataURL('image/png')]
    const dataUrl = canvas.toDataURL('image/png')
    setCustomAvatarData(dataUrl)
    setSelectedAvatar(dataUrl)
  }

  function saveAvatarHistory() {
    const canvas = avatarCanvasRef.current
    if (!canvas) return
    historyRef.current.push(canvas.toDataURL('image/png'))
    if (historyRef.current.length > 20) {
      historyRef.current.shift()
    }
  }

  function startAvatarDraw(e) {
    const canvas = avatarCanvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    const x = ((e.clientX - rect.left) * canvas.width) / rect.width
    const y = ((e.clientY - rect.top) * canvas.height) / rect.height

    saveAvatarHistory()

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

    ctx.lineWidth = Number(avatarBrushSize)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (avatarTool === 'eraser') {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = '#ffffff' // Erase with clean white paper
      ctx.lineWidth = Number(avatarBrushSize) * 2.5
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = avatarColor
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

  function undoAvatar() {
    const canvas = avatarCanvasRef.current
    if (!canvas || historyRef.current.length <= 1) return

    historyRef.current.pop() // remove current
    const previousState = historyRef.current[historyRef.current.length - 1]

    const img = new Image()
    img.onload = () => {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/png')
      setCustomAvatarData(dataUrl)
      setSelectedAvatar(dataUrl)
    }
    img.src = previousState
  }

  function clearAvatarCanvas() {
    loadHairstyleTemplate(selectedHair)
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
            className={`tab-pill-btn ${avatarMode === 'draw' ? 'active' : ''}`}
            onClick={() => setAvatarMode('draw')}
          >
            ✏️ Draw Your Face (With Hair Options)
          </button>
          <button
            className={`tab-pill-btn ${avatarMode === 'preset' ? 'active' : ''}`}
            onClick={() => setAvatarMode('preset')}
          >
            🎨 Ready-Made Caricatures
          </button>
        </div>

        {/* Tab 1: Draw Your Face with Hair Options & Full Drawing Tools */}
        {avatarMode === 'draw' && (
          <div className="draw-avatar-pad-wrapper">
            <div className="board-banner-label">1. CHOOSE YOUR HAIRSTYLE BASE:</div>
            
            {/* Hairstyle Selector Pills (From Reference Image 2) */}
            <div className="hair-options-carousel">
              {HAIRSTYLE_TEMPLATES.map((hair) => (
                <button
                  key={hair.id}
                  type="button"
                  className={`hair-template-btn ${selectedHair === hair.id ? 'selected' : ''}`}
                  onClick={() => setSelectedHair(hair.id)}
                  title={hair.name}
                >
                  <span className="hair-btn-icon">💇</span>
                  <span className="hair-btn-label">{hair.name}</span>
                </button>
              ))}
            </div>

            <div className="board-banner-label" style={{ marginTop: '14px' }}>
              2. DRAW YOUR EYES, SMILE & ACCESSORIES:
            </div>

            <div className="avatar-canvas-assembly">
              {/* Circular Avatar Drawing Canvas */}
              <div className="avatar-draw-ring">
                <canvas
                  ref={avatarCanvasRef}
                  width={180}
                  height={180}
                  className="avatar-draw-canvas"
                  onPointerDown={startAvatarDraw}
                  onPointerMove={drawAvatar}
                  onPointerUp={stopAvatarDraw}
                  onPointerCancel={stopAvatarDraw}
                />
              </div>

              {/* Comprehensive Toolset: Pen, Eraser, Brush Slider, Colors, Undo */}
              <div className="avatar-tools-panel">
                <div className="avatar-tool-buttons-row">
                  <button
                    type="button"
                    className={`mini-tool-btn ${avatarTool === 'pen' ? 'active' : ''}`}
                    onClick={() => setAvatarTool('pen')}
                    title="Pen tool"
                  >
                    ✏️ Pen
                  </button>
                  <button
                    type="button"
                    className={`mini-tool-btn ${avatarTool === 'eraser' ? 'active' : ''}`}
                    onClick={() => setAvatarTool('eraser')}
                    title="Eraser tool"
                  >
                    🧹 Eraser
                  </button>
                  <button
                    type="button"
                    className="mini-tool-btn"
                    onClick={undoAvatar}
                    title="Undo stroke"
                  >
                    ↩️ Undo
                  </button>
                  <button
                    type="button"
                    className="mini-tool-btn"
                    onClick={clearAvatarCanvas}
                    title="Reset to base hair"
                  >
                    🗑️ Reset
                  </button>
                </div>

                {/* Color Pills for Avatar */}
                <div className="avatar-color-pills">
                  {['#161616', '#D98C9B', '#A88BC7', '#82B8D8', '#8D5B4C', '#CBA358'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`mini-color-dot ${avatarColor === c && avatarTool === 'pen' ? 'selected' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => {
                        setAvatarColor(c)
                        setAvatarTool('pen')
                      }}
                    />
                  ))}
                </div>

                {/* Shared Brush Size Slider */}
                <div className="avatar-slider-row">
                  <span className="slider-label">Size:</span>
                  <span style={{ fontSize: '9px' }}>•</span>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={avatarBrushSize}
                    onChange={(e) => setAvatarBrushSize(Number(e.target.value))}
                    className="avatar-size-slider"
                    title={`Brush/Eraser Size: ${avatarBrushSize}px`}
                  />
                  <span style={{ fontSize: '13px' }}>●</span>
                  <span className="slider-value">{avatarBrushSize}px</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Preset Ready-Made Avatars */}
        {avatarMode === 'preset' && (
          <div className="preset-avatar-grid-board">
            <div className="board-banner-label">✦ CHOOSE A READY-MADE CARICATURE ✦</div>
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

        {/* Live Preview Stamp */}
        <div className="artist-preview-plaque-bar">
          <div className="preview-label">WALL PREVIEW:</div>
          <div className="preview-stamp">
            <RenderAvatar
              avatar={avatarMode === 'draw' && customAvatarData ? customAvatarData : selectedAvatar}
              size={38}
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
