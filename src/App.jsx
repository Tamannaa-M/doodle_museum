import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'
import { DoodleFrame } from './DoodleFrames'
import { RenderAvatar } from './AvatarLibrary'
import { AvatarStudioModal } from './AvatarStudioModal'
import { PhotoBoothModal } from './PhotoBoothModal'

/**
 * Helper to parse title, artist, and avatar metadata
 */
function parseDoodleMetadata(doodle, index = 0) {
  let cleanTitle = doodle.title || 'Untitled Doodle'
  let artistName = 'Anonymous Artist'
  let avatar = ['avatar-pigtails', 'avatar-cap-boy', 'avatar-glasses', 'avatar-cat', 'avatar-sprout', 'avatar-star', 'avatar-curly', 'avatar-crown'][index % 8]

  if (cleanTitle.includes(' /// by ')) {
    const parts = cleanTitle.split(' /// by ')
    cleanTitle = parts[0] || 'Untitled Doodle'
    if (parts[1]) {
      const subParts = parts[1].split(' /// ')
      artistName = subParts[0] || 'Anonymous Artist'
      if (subParts[1]) {
        avatar = subParts[1]
      }
    }
  } else if (doodle.artist_name || doodle.artist) {
    artistName = doodle.artist_name || doodle.artist
    avatar = doodle.avatar || doodle.avatar_url || avatar
  }

  return {
    ...doodle,
    cleanTitle,
    artistName,
    avatar,
  }
}

function App() {
  const canvasRef = useRef(null)
  const historyRef = useRef([])

  const [selectedDoodle, setSelectedDoodle] = useState(null)
  const [doodles, setDoodles] = useState([])
  const [loadingGallery, setLoadingGallery] = useState(true)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)

  // Modals state
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [photoBoothTarget, setPhotoBoothTarget] = useState(null) // { doodle, artistName, avatar }

  // -------------------------
  // PRESET COLOUR PALETTE
  // -------------------------
  const presetColors = [
    '#000000', // Ink Black
    '#D98C9B', // Dusty Pink
    '#A88BC7', // Lavender
    '#82B8D8', // Soft Blue
    '#91A88C', // Sage
    '#E7A77B', // Peach
    '#8D5B4C', // Terracotta
    '#CBA358', // Vintage Gold
  ]

  // -------------------------
  // VINTAGE HAND-DRAWN DOODLE FRAME STYLES
  // -------------------------
  const frameTypeList = [
    'scallop-oval',   // Ruffled Pie-Crust Oval from User Notebook Sketch
    'baroque-scroll', // Grand Ornate Scrollwork Rectangle
    'leafy-wreath',   // Botanical Leaf Wreath Oval
    'striped-bevel',  // Engraved Striped / Hatching Bevel Rectangle
    'wavy-ribbon',    // Wavy Ribbon Contour Frame
    'sunray-cameo',   // Sunburst Radial Cameo Oval
    'classic-mitred', // Crisp Mitred Double Line Frame
    'tall-flourish',  // Tall Portrait Baroque Flourish Frame
  ]

  // -------------------------
  // LOAD GALLERY
  // -------------------------
  useEffect(() => {
    fetchDoodles()
  }, [])

  async function fetchDoodles() {
    setLoadingGallery(true)
    const { data, error } = await supabase
      .from('doodles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Gallery fetch error:', error)
      setLoadingGallery(false)
      return
    }

    setDoodles(data || [])
    setLoadingGallery(false)
  }

  // -------------------------
  // CANVAS COORDINATES
  // -------------------------
  function getCanvasCoordinates(e) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  // -------------------------
  // UNDO HISTORY
  // -------------------------
  function saveCanvasState() {
    const canvas = canvasRef.current
    if (!canvas) return

    historyRef.current.push(canvas.toDataURL())
    if (historyRef.current.length > 30) {
      historyRef.current.shift()
    }
  }

  // -------------------------
  // DRAWING LOGIC (Pointer + Touch Friendly)
  // -------------------------
  function startDrawing(e) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { x, y } = getCanvasCoordinates(e)

    saveCanvasState()

    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)

    if (canvas.setPointerCapture && e.pointerId !== undefined) {
      try {
        canvas.setPointerCapture(e.pointerId)
      } catch (err) {
        // fallback
      }
    }
  }

  function draw(e) {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { x, y } = getCanvasCoordinates(e)

    ctx.lineWidth = Number(brushSize)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
    }

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function stopDrawing(e) {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.closePath()
    ctx.globalCompositeOperation = 'source-over'
    setIsDrawing(false)

    if (
      canvas.releasePointerCapture &&
      e?.pointerId !== undefined &&
      canvas.hasPointerCapture?.(e.pointerId)
    ) {
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch (err) {
        // fallback
      }
    }
  }

  // -------------------------
  // UNDO
  // -------------------------
  function undo() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    if (historyRef.current.length === 0) return

    const previousState = historyRef.current.pop()
    const image = new Image()
    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(image, 0, 0)
    }
    image.src = previousState
  }

  // -------------------------
  // CLEAR
  // -------------------------
  function clearCanvas() {
    saveCanvasState()
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'source-over'
  }

  // -------------------------
  // SELECT COLOR
  // -------------------------
  function selectColor(newColor) {
    setColor(newColor)
    setTool('pen')
  }

  // -------------------------
  // CHECK CANVAS CONTENT & OPEN AVATAR STUDIO
  // -------------------------
  function initiateSaveFlow() {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let foundDrawing = false

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 0) {
        foundDrawing = true
        break
      }
    }

    if (!foundDrawing) {
      alert('Draw something on the canvas first before saving to the museum! 🎨✨')
      return
    }

    setShowAvatarModal(true)
  }

  // -------------------------
  // SAVE DOODLE (With Artist & Avatar metadata)
  // -------------------------
  async function handleCompleteSave({ title: saveTitle, artistName: saveArtist, avatar: saveAvatar }) {
    const canvas = canvasRef.current
    if (!canvas) return

    setSaving(true)
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    let minX = canvas.width
    let minY = canvas.height
    let maxX = 0
    let maxY = 0

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4
        const alpha = pixels[index + 3]
        if (alpha > 0) {
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }

    const padding = 36
    minX = Math.max(0, minX - padding)
    minY = Math.max(0, minY - padding)
    maxX = Math.min(canvas.width, maxX + padding)
    maxY = Math.min(canvas.height, maxY + padding)

    const croppedWidth = maxX - minX
    const croppedHeight = maxY - minY

    const croppedCanvas = document.createElement('canvas')
    croppedCanvas.width = croppedWidth
    croppedCanvas.height = croppedHeight

    const croppedCtx = croppedCanvas.getContext('2d')
    croppedCtx.fillStyle = '#ffffff'
    croppedCtx.fillRect(0, 0, croppedWidth, croppedHeight)
    croppedCtx.drawImage(
      canvas,
      minX,
      minY,
      croppedWidth,
      croppedHeight,
      0,
      0,
      croppedWidth,
      croppedHeight
    )

    croppedCanvas.toBlob(async (blob) => {
      if (!blob) {
        alert('Could not process image')
        setSaving(false)
        return
      }

      const fileName = `${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from('doodles')
        .upload(fileName, blob, {
          contentType: 'image/png',
        })

      if (uploadError) {
        console.error(uploadError)
        alert('Image upload failed. Please try again.')
        setSaving(false)
        return
      }

      const { data } = supabase.storage
        .from('doodles')
        .getPublicUrl(fileName)

      // Encode cleanTitle, artistName, and avatar
      const encodedTitle = `${saveTitle} /// by ${saveArtist} /// ${saveAvatar}`

      const { error: databaseError } = await supabase
        .from('doodles')
        .insert({
          title: encodedTitle,
          image_url: data.publicUrl,
        })

      if (databaseError) {
        console.error(databaseError)
        alert('Doodle record could not be saved.')
        setSaving(false)
        return
      }

      setTitle('')
      setSaving(false)
      setShowAvatarModal(false)
      clearCanvas()
      await fetchDoodles()
    }, 'image/png')
  }

  // Direct Photo Booth launch for current canvas
  function launchPhotoBoothForCanvas(artistMeta) {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')

    setShowAvatarModal(false)
    setPhotoBoothTarget({
      doodle: {
        title: artistMeta?.title || title || 'Current Doodle',
        image_url: dataUrl,
      },
      artistName: artistMeta?.artistName || 'Museum Artist',
      avatar: artistMeta?.avatar || 'avatar-pigtails',
    })
  }

  return (
    <div className="museum-wall-bg">
      <div className="museum-app-container">

        {/* ======================================================
            1. DESKTOP STUDIO SIDEBAR (Shown on screen > 1024px)
            ====================================================== */}
        <aside className="desktop-toolbar" aria-label="Artist Tools">
          <div className="toolbar-crest" title="The Doodle Museum Studio">
            🎨
          </div>

          <div className="toolbar-section-label">Tools</div>

          {/* PEN */}
          <button
            className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => setTool('pen')}
            title="Drawing Pen"
            aria-label="Pen"
          >
            <span>✏️</span>
            <span className="tool-btn-caption">PEN</span>
          </button>

          {/* ERASER */}
          <button
            className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
            aria-label="Eraser"
          >
            <span>🧹</span>
            <span className="tool-btn-caption">ERASE</span>
          </button>

          {/* UNDO */}
          <button
            className="tool-btn"
            onClick={undo}
            title="Undo last stroke"
            aria-label="Undo"
          >
            <span>↩️</span>
            <span className="tool-btn-caption">UNDO</span>
          </button>

          {/* CLEAR */}
          <button
            className="tool-btn"
            onClick={clearCanvas}
            title="Clear canvas"
            aria-label="Clear"
          >
            <span>🗑️</span>
            <span className="tool-btn-caption">CLEAR</span>
          </button>

          <div className="toolbar-divider"></div>

          {/* PALETTE */}
          <div className="toolbar-section-label">Colors</div>

          <div className="palette-grid">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => selectColor(presetColor)}
                title={presetColor}
                className={`color-swatch ${
                  color === presetColor && tool === 'pen' ? 'selected' : ''
                }`}
                style={{ backgroundColor: presetColor }}
                aria-label={`Color ${presetColor}`}
              />
            ))}
          </div>

          {/* CUSTOM COLOR WHEEL */}
          <label className="custom-picker-wrapper" title="Choose custom color">
            <span>🎨</span>
            <input
              type="color"
              value={color}
              onChange={(e) => selectColor(e.target.value)}
              className="hidden-color-input"
            />
          </label>

          <div className="toolbar-divider"></div>

          {/* BRUSH SIZE */}
          <div className="brush-size-box">
            <div className="toolbar-section-label">Brush</div>
            <input
              type="range"
              min="1"
              max="40"
              step="1"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="brush-slider"
              title={`Brush Size: ${brushSize}px`}
            />
            <div className="brush-indicator">{brushSize}px</div>
          </div>
        </aside>

        {/* ======================================================
            2. MAIN MUSEUM WORKSPACE (Header, Easel, Exhibition Wall)
            ====================================================== */}
        <main className="museum-workspace">

          {/* --- TOP HEADER --- */}
          <header className="museum-header">
            <div className="header-brand">
              <div className="museum-badge">
                <span>✦</span> EST. 2026 • DIGITAL ART <span>✦</span>
              </div>
              <h1 className="museum-title">
                The Doodle Museum
              </h1>
              <p className="museum-subtitle">
                A collection of little things worth remembering.
              </p>
            </div>

            {/* ARTWORK SAVE CONTROLS & PHOTO BOOTH BUTTON */}
            <div className="save-artwork-panel">
              <button
                className="add-museum-btn photo-booth-nav-btn"
                onClick={() => {
                  const canvas = canvasRef.current
                  const dataUrl = canvas ? canvas.toDataURL('image/png') : null
                  setPhotoBoothTarget({
                    doodle: {
                      title: title || 'Museum Doodle',
                      image_url: dataUrl || (doodles[0]?.image_url ?? ''),
                    },
                    artistName: localStorage.getItem('doodle_artist_name') || 'Museum Artist',
                    avatar: 'avatar-pigtails',
                  })
                }}
                type="button"
                style={{ background: '#3b3022', borderColor: '#8c6e33' }}
              >
                📸 Photo Booth
              </button>

              <button
                className="add-museum-btn"
                onClick={initiateSaveFlow}
                disabled={saving}
              >
                {saving ? '⏳ Archiving...' : '💾 Add to Museum'}
              </button>
            </div>
          </header>

          {/* --- ARTIST STUDIO EASEL --- */}
          <section className="studio-section" aria-label="Artist Studio">
            <div className="studio-ribbon">
              <span>✦</span> ARTIST'S STUDIO <span>✦</span>
            </div>

            {/* GRAND WOODEN EASEL */}
            <div className="canvas-grand-easel">
              <div className="canvas-gold-fillet">
                <canvas
                  ref={canvasRef}
                  width={1000}
                  height={650}
                  className="studio-canvas"
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerCancel={stopDrawing}
                  onPointerLeave={stopDrawing}
                />
              </div>
            </div>

            <div className="easel-status-plaque">
              <span>✦ WORK IN PROGRESS ✦</span>
            </div>
          </section>

          {/* --- SALON EXHIBITION GALLERY WALL --- */}
          <section className="exhibition-section" aria-label="Museum Exhibition">
            <div className="exhibition-title-banner">
              <div className="exhibition-rule-line"></div>
              <div className="exhibition-header-text">
                <div className="exhibition-subtitle-tag">
                  PERMANENT COLLECTION
                </div>
                <h2 className="exhibition-main-title">
                  The Exhibition Wall
                </h2>
              </div>
              <div className="exhibition-rule-line"></div>
            </div>

            {loadingGallery ? (
              <div className="gallery-empty-state">
                <div className="empty-icon">🖼️</div>
                <p className="empty-text">Curating the gallery exhibition...</p>
              </div>
            ) : doodles.length === 0 ? (
              <div className="gallery-empty-state">
                <div className="empty-icon">🎨</div>
                <p className="empty-text">
                  The gallery wall is ready for its very first masterpiece.
                </p>
              </div>
            ) : (
              <div className="salon-gallery-wall">
                {doodles.map((rawDoodle, index) => {
                  const doodle = parseDoodleMetadata(rawDoodle, index)
                  const frameType = frameTypeList[index % frameTypeList.length]

                  return (
                    <article
                      key={doodle.id || index}
                      className="artwork-card"
                      onClick={() => setSelectedDoodle(doodle)}
                      title={`Inspect "${doodle.cleanTitle}" by ${doodle.artistName}`}
                    >
                      {/* Brass Nail & Hanging Cord */}
                      <div className="hanging-mechanism">
                        <div className="brass-nail"></div>
                        <div className="hanging-cord"></div>
                      </div>

                      {/* Top-Right Artist Avatar Seal */}
                      <div className="artwork-artist-seal" title={`Artist: ${doodle.artistName}`}>
                        <RenderAvatar avatar={doodle.avatar} size={34} />
                      </div>

                      {/* Hand-Drawn Black & White SVG Frame */}
                      <DoodleFrame
                        frameType={frameType}
                        imageUrl={doodle.image_url}
                        title={doodle.cleanTitle}
                      />

                      {/* Hand-Drawn Museum Wall Plaque */}
                      <div className="museum-wall-plaque">
                        <div className="plaque-title">
                          {doodle.cleanTitle}
                        </div>
                        <div className="plaque-artist-row">
                          <RenderAvatar avatar={doodle.avatar} size={18} />
                          <span className="plaque-artist-name">by {doodle.artistName}</span>
                        </div>
                        <div className="plaque-metadata">
                          DOODLE •{' '}
                          {doodle.created_at
                            ? new Date(doodle.created_at).getFullYear()
                            : '2026'}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          {/* FOOTER */}
          <footer className="museum-footer">
            ✦ Every doodle deserves a place on the wall. ✦
          </footer>
        </main>

        {/* ======================================================
            3. MOBILE & TABLET FLOATING BOTTOM DOCK
               (Always pinned at screen bottom on phone & tablet)
            ====================================================== */}
        <nav className="mobile-bottom-dock" aria-label="Mobile Drawing Tools">
          {/* Action Tools */}
          <div className="mobile-dock-group">
            <button
              className={`mobile-tool-btn ${tool === 'pen' ? 'active' : ''}`}
              onClick={() => setTool('pen')}
              title="Pen"
              aria-label="Pen"
            >
              ✏️
            </button>
            <button
              className={`mobile-tool-btn ${tool === 'eraser' ? 'active' : ''}`}
              onClick={() => setTool('eraser')}
              title="Eraser"
              aria-label="Eraser"
            >
              🧹
            </button>
            <button
              className="mobile-tool-btn"
              onClick={undo}
              title="Undo"
              aria-label="Undo"
            >
              ↩️
            </button>
            <button
              className="mobile-tool-btn"
              onClick={clearCanvas}
              title="Clear Canvas"
              aria-label="Clear"
            >
              🗑️
            </button>
          </div>

          <div className="mobile-dock-divider"></div>

          {/* Palette Swatches */}
          <div className="mobile-palette-row">
            {presetColors.slice(0, 4).map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => selectColor(presetColor)}
                className={`mobile-color-dot ${
                  color === presetColor && tool === 'pen' ? 'selected' : ''
                }`}
                style={{ backgroundColor: presetColor }}
                aria-label={`Color ${presetColor}`}
              />
            ))}

            {/* Custom Color Picker */}
            <label className="mobile-picker-btn" title="More Colors">
              🎨
              <input
                type="color"
                value={color}
                onChange={(e) => selectColor(e.target.value)}
                className="hidden-color-input"
              />
            </label>
          </div>

          <div className="mobile-dock-divider"></div>

          {/* Brush Size Slider */}
          <div className="mobile-slider-wrap">
            <span>●</span>
            <input
              type="range"
              min="1"
              max="40"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              title={`Brush: ${brushSize}px`}
            />
            <span>{brushSize}</span>
          </div>
        </nav>

        {/* ======================================================
            4. ARTIST AVATAR & TAGGING MODAL ("Who Made This?")
            ====================================================== */}
        {showAvatarModal && (
          <AvatarStudioModal
            defaultTitle={title}
            onSave={handleCompleteSave}
            onOpenPhotoBooth={launchPhotoBoothForCanvas}
            onClose={() => setShowAvatarModal(false)}
            saving={saving}
          />
        )}

        {/* ======================================================
            5. LIVE DOODLE PHOTO BOOTH MODAL (3-Frame Strip Creator)
            ====================================================== */}
        {photoBoothTarget && (
          <PhotoBoothModal
            doodle={photoBoothTarget.doodle}
            artistName={photoBoothTarget.artistName}
            avatar={photoBoothTarget.avatar}
            onClose={() => setPhotoBoothTarget(null)}
          />
        )}

        {/* ======================================================
            6. MODAL SPOTLIGHT VIEWER (Zoom in on Click)
            ====================================================== */}
        {selectedDoodle && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedDoodle(null)}
          >
            <div
              className="modal-spotlight-box"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setSelectedDoodle(null)}
                aria-label="Close artwork viewer"
              >
                ✕
              </button>

              <div className="modal-frame-wrapper">
                <img
                  src={selectedDoodle.image_url}
                  alt={selectedDoodle.cleanTitle || 'Artwork'}
                  className="modal-artwork-img"
                />
              </div>

              <div className="plaque-artist-row" style={{ marginTop: '16px' }}>
                <RenderAvatar avatar={selectedDoodle.avatar} size={28} />
                <span className="plaque-artist-name" style={{ fontSize: '18px' }}>
                  by {selectedDoodle.artistName}
                </span>
              </div>

              <h2 className="modal-artwork-title">
                {selectedDoodle.cleanTitle}
              </h2>

              <div className="modal-artwork-sub">
                DIGITAL INK ON CANVAS •{' '}
                {selectedDoodle.created_at
                  ? new Date(selectedDoodle.created_at).toLocaleDateString(
                      undefined,
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )
                  : 'EST. 2026'}{' '}
                • THE DOODLE MUSEUM
              </div>

              {/* Make Photo Strip with this Artwork Button */}
              <button
                className="open-photobooth-pill-btn"
                style={{ marginTop: '18px', maxWidth: '320px' }}
                onClick={() => {
                  const currentSelected = selectedDoodle
                  setSelectedDoodle(null)
                  setPhotoBoothTarget({
                    doodle: currentSelected,
                    artistName: currentSelected.artistName,
                    avatar: currentSelected.avatar,
                  })
                }}
              >
                📸 Create Photo Strip with This Art!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App