import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'

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

  // -------------------------
  // PRESET COLOUR PALETTE
  // -------------------------
  const presetColors = [
    '#000000', // Ink Black
    '#D98C9B', // Dusty Rose
    '#A88BC7', // Lavender
    '#82B8D8', // Soft Sky Blue
    '#91A88C', // Sage Green
    '#E7A77B', // Warm Peach
    '#8D5B4C', // Terracotta
    '#CBA358', // Antique Gold
  ]

  // -------------------------
  // VINTAGE FRAME STYLES
  // -------------------------
  const frameClassList = [
    'frame-royal-arch',       // Cathedral Arch with Gold Leaf
    'frame-cameo-oval',       // Victorian Cameo Oval with Bronze Trim
    'frame-baroque-gilt',     // Grand Gilded Baroque Rectangle
    'frame-dark-mahogany',    // Curator's Dark Mahogany with Linen Mat
    'frame-florentine-wide',  // Florentine Wide Landscape Gilded Frame
    'frame-petite-antique',   // Petite Square Antique Gold Frame
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
  // DRAWING LOGIC (Pointer + Touch)
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
        // pointer capture fallback
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
        // ignore
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
  // SAVE DOODLE (Crop Bounding Box & Upload)
  // -------------------------
  async function saveDoodle() {
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
    let foundDrawing = false

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const index = (y * canvas.width + x) * 4
        const alpha = pixels[index + 3]
        if (alpha > 0) {
          foundDrawing = true
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y < minY) minY = y
          if (y > maxY) maxY = y
        }
      }
    }

    if (!foundDrawing) {
      alert('Draw something on the canvas first! 🎨')
      setSaving(false)
      return
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

      const { error: databaseError } = await supabase
        .from('doodles')
        .insert({
          title: title.trim() || 'Untitled Doodle',
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
      clearCanvas()
      await fetchDoodles()
    }, 'image/png')
  }

  return (
    <div className="museum-wall-bg">
      <div className="museum-app-container">

        {/* ======================================================
            STUDIO TOOLBAR (Responsive: Vertical Desktop / Horizontal Mobile)
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
            MAIN MUSEUM WORKSPACE
            ====================================================== */}
        <main className="museum-workspace">

          {/* --- MUSEUM HEADER --- */}
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

            {/* SAVE WORKSPACE CONTROLS */}
            <div className="save-artwork-panel">
              <input
                className="artwork-title-input"
                type="text"
                placeholder="Name your artwork..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={45}
              />
              <button
                className="add-museum-btn"
                onClick={saveDoodle}
                disabled={saving}
              >
                {saving ? '⏳ Archiving...' : '💾 Add to Museum'}
              </button>
            </div>
          </header>

          {/* --- ARTIST STUDIO / EASEL --- */}
          <section className="studio-section" aria-label="Artist Studio">
            <div className="studio-ribbon">
              <span>✦</span> ARTIST'S STUDIO <span>✦</span>
            </div>

            {/* GRAND WOODEN EASEL WITH GOLD FILLET */}
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

          {/* --- SALON EXHIBITION WALL --- */}
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
                {doodles.map((doodle, index) => {
                  const frameClass =
                    frameClassList[index % frameClassList.length]

                  return (
                    <article
                      key={doodle.id || index}
                      className="artwork-card"
                      onClick={() => setSelectedDoodle(doodle)}
                      title={`Inspect "${doodle.title || 'Untitled'}"`}
                    >
                      {/* Brass Hook & Hanging Cord */}
                      <div className="hanging-mechanism">
                        <div className="brass-nail"></div>
                        <div className="hanging-cord"></div>
                      </div>

                      {/* Vintage Frame with Mat & Image Mask */}
                      <div className={`museum-frame-base ${frameClass}`}>
                        <div className="frame-mat">
                          <div className="frame-artwork-mask">
                            <img
                              src={doodle.image_url}
                              alt={doodle.title || 'Museum Doodle'}
                              className="gallery-doodle-img"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Museum Brass Wall Plaque */}
                      <div className="museum-wall-plaque">
                        <div className="plaque-title">
                          {doodle.title || 'Untitled Doodle'}
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
            MODAL SPOTLIGHT VIEWER (Zoom in on Click)
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
                  alt={selectedDoodle.title || 'Artwork'}
                  className="modal-artwork-img"
                />
              </div>

              <h2 className="modal-artwork-title">
                {selectedDoodle.title || 'Untitled Doodle'}
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App