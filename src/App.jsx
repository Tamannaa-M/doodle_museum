import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const canvasRef = useRef(null)
  const historyRef = useRef([])
  const [hoveredDoodle, setHoveredDoodle] = useState(null)
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
      console.error('Gallery error:', error)
      setLoadingGallery(false)
      return
    }

    console.log('Doodles received:', data)

    setDoodles(data || [])
    setLoadingGallery(false)
  }

  // -------------------------
  // CANVAS COORDINATES
  // -------------------------

  function getCanvasCoordinates(e) {
    const canvas = canvasRef.current
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
  // DRAWING
  // -------------------------

  function startDrawing(e) {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getCanvasCoordinates(e)

    saveCanvasState()

    ctx.beginPath()
    ctx.moveTo(x, y)

    setIsDrawing(true)
  }

  function draw(e) {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getCanvasCoordinates(e)

    ctx.lineWidth = brushSize
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

  function stopDrawing() {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.closePath()
    setIsDrawing(false)
  }

  // -------------------------
  // UNDO
  // -------------------------

  function undo() {
    const canvas = canvasRef.current
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
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'source-over'
  }

  // -------------------------
  // SAVE DOODLE
  // -------------------------

  async function saveDoodle() {
    const canvas = canvasRef.current

    if (!canvas) return

    setSaving(true)

    const ctx = canvas.getContext('2d')

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    )

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
      alert('Draw something first! 🎨')
      setSaving(false)
      return
    }

    const padding = 40

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

    croppedCtx.fillRect(
      0,
      0,
      croppedWidth,
      croppedHeight
    )

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
        alert('Could not create image')
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
        alert('Image upload failed')
        setSaving(false)
        return
      }

      const { data } = supabase.storage
        .from('doodles')
        .getPublicUrl(fileName)

      const { error: databaseError } = await supabase
        .from('doodles')
        .insert({
          title: title || 'Untitled Doodle',
          image_url: data.publicUrl,
        })

      if (databaseError) {
        console.error(databaseError)
        alert('Doodle information could not be saved')
        setSaving(false)
        return
      }

      setTitle('')
      setSaving(false)

      await fetchDoodles()

      alert('Doodle added to the museum! 🖼️✨')
    }, 'image/png')
  }

  // -------------------------
  // FRAME VARIATIONS
  // -------------------------

  const frameStyles = [
    styles.frameGold,
    styles.frameDark,
    styles.frameClassic,
    styles.frameGold,
    styles.frameDark,
  ]

  // -------------------------
  // UI
  // -------------------------

  return (
    <div style={styles.app}>

      {/* LEFT ARTIST TOOLBAR */}

      <aside style={styles.toolbar}>

        <div style={styles.toolbarLogo}>
          🎨
        </div>

        <div style={styles.toolLabel}>
          ARTIST
        </div>

        <button
          style={
            tool === 'pen'
              ? styles.activeButton
              : styles.toolButton
          }
          onClick={() => setTool('pen')}
          title="Pen"
        >
          ✏️
        </button>

        <button
          style={
            tool === 'eraser'
              ? styles.activeButton
              : styles.toolButton
          }
          onClick={() => setTool('eraser')}
          title="Eraser"
        >
          🧹
        </button>

        <button
          style={styles.toolButton}
          onClick={undo}
          title="Undo"
        >
          ↩️
        </button>

        <button
          style={styles.toolButton}
          onClick={clearCanvas}
          title="Clear"
        >
          🗑️
        </button>

        <div style={styles.separator}></div>

        <label style={styles.colorLabel}>
          <span>🎨</span>

          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <label style={styles.sizeLabel}>
          <span>📏</span>

          <input
            type="range"
            min="1"
            max="40"
            value={brushSize}
            onChange={(e) =>
              setBrushSize(Number(e.target.value))
            }
          />

          <span>{brushSize}px</span>
        </label>

      </aside>


      {/* MAIN MUSEUM */}

      <main style={styles.workspace}>

        {/* HEADER */}

        <header style={styles.header}>

          <div>

            <div style={styles.museumSmallTitle}>
              EST. 2026 • DIGITAL ART
            </div>

            <h1 style={styles.heading}>
              The Doodle Museum
            </h1>

            <p style={styles.subtitle}>
              A collection of little things worth remembering.
            </p>

          </div>

          <div style={styles.saveArea}>

            <input
              style={styles.titleInput}
              type="text"
              placeholder="Name your artwork..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <button
              style={styles.saveButton}
              onClick={saveDoodle}
              disabled={saving}
            >
              {saving
                ? '⏳ Saving...'
                : '💾 Add to Museum'}
            </button>

          </div>

        </header>


        {/* ARTIST STUDIO */}

        <section style={styles.studioSection}>

          <div style={styles.sectionLabel}>
            <span>✦</span>
            ARTIST'S STUDIO
            <span>✦</span>
          </div>

          <div style={styles.canvasOuterFrame}>

            <div style={styles.canvasInnerFrame}>

              <canvas
                ref={canvasRef}
                width={1000}
                height={650}
                style={styles.canvas}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />

            </div>

          </div>

          <div style={styles.studioPlaque}>
            <span>WORK IN PROGRESS</span>
          </div>

        </section>


        {/* EXHIBITION */}

        <section style={styles.gallerySection}>

          <div style={styles.exhibitionHeading}>

            <div style={styles.exhibitionLine}></div>

            <div>

              <div style={styles.exhibitionSmall}>
                PERMANENT COLLECTION
              </div>

              <h2 style={styles.galleryTitle}>
                The Exhibition
              </h2>

            </div>

            <div style={styles.exhibitionLine}></div>

          </div>


          {loadingGallery ? (

            <div style={styles.emptyMessage}>
              <div style={styles.loadingIcon}>
                🖼️
              </div>

              <p>
                Preparing the exhibition...
              </p>
            </div>

          ) : doodles.length === 0 ? (

            <div style={styles.emptyMessage}>

              <div style={styles.loadingIcon}>
                🎨
              </div>

              <p>
                Your museum is waiting for its first masterpiece.
              </p>

            </div>

          ) : (

            <div style={styles.galleryGrid}>

              {doodles.map((doodle, index) => (

                <div
                  key={doodle.id}
                  style={{
                  ...styles.artwork,
                  ...(hoveredDoodle === doodle.id ? styles.artworkHover : {}),
                  }}
                  onClick={() => setSelectedDoodle(doodle)}
                  onMouseEnter={() => setHoveredDoodle(doodle.id)}
                  onMouseLeave={() => setHoveredDoodle(null)}
                >

                  {/* FRAME */}

                  <div
                    style={{
                      ...styles.frame,
                      ...frameStyles[
                        index % frameStyles.length
                      ],
                    }}
                  >

                    <div style={styles.frameInner}>

                      <img
                        src={doodle.image_url}
                        alt={doodle.title}
                        style={styles.doodleImage}
                      />

                    </div>

                  </div>


                  {/* PLAQUE */}

                  <div style={styles.plaque}>

                    <div style={styles.plaqueTitle}>
                      {doodle.title}
                    </div>

                    <div style={styles.plaqueDetails}>
                      DOODLE • 2026
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        <footer style={styles.footer}>
          ✦ Every doodle deserves a wall. ✦
        </footer>

      </main>


      {/* ==================================================
          ARTWORK VIEWER MODAL
          ================================================== */}

      {selectedDoodle && (

        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedDoodle(null)}
        >

          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >

            <button
              style={styles.closeButton}
              onClick={() => setSelectedDoodle(null)}
            >
              ✕
            </button>

            <div style={styles.modalFrame}>

              <img
                src={selectedDoodle.image_url}
                alt={selectedDoodle.title}
                style={styles.modalImage}
              />

            </div>

            <h2 style={styles.modalTitle}>
              {selectedDoodle.title}
            </h2>

            <div style={styles.modalDetails}>
              DOODLE • 2026 • THE DOODLE MUSEUM
            </div>

          </div>

        </div>

      )}

    </div>
  )
}


// ======================================================
// STYLES
// ======================================================

const styles = {

  app: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    background: '#e8dfd0',
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: '#29251f',
  },


  // -------------------------
  // TOOLBAR
  // -------------------------

  toolbar: {
    width: '90px',
    minWidth: '90px',
    minHeight: '100vh',
    background: '#211f1b',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '22px 10px',
    gap: '12px',
    boxSizing: 'border-box',
    boxShadow: '4px 0 15px rgba(0,0,0,0.18)',
    position: 'sticky',
    top: 0,
    alignSelf: 'flex-start',
  },

  toolbarLogo: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: '#c9a45c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '27px',
    marginBottom: '2px',
    boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
  },

  toolLabel: {
    fontSize: '9px',
    letterSpacing: '2px',
    color: '#fdfbfb',
    marginBottom: '5px',
  },

  toolButton: {
    width: '54px',
    height: '54px',
    border: '1px solid #514c43',
    borderRadius: '8px',
    background: '#302d27',
    color: '#fff',
    fontSize: '21px',
    cursor: 'pointer',
    boxShadow: '0 3px 7px rgba(0,0,0,0.2)',
  },

  activeButton: {
    width: '54px',
    height: '54px',
    border: '2px solid #d8b86b',
    borderRadius: '8px',
    background: '#4a4337',
    color: '#fff',
    fontSize: '21px',
    cursor: 'pointer',
    boxShadow: '0 0 10px rgba(201,164,92,0.3)',
  },

  separator: {
    width: '50px',
    borderTop: '1px solid #514c43',
    margin: '5px 0',
  },

  colorLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    fontSize: '18px',
    color: '#fff',
  },

  sizeLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    color: '#c9bfae',
  },


  // -------------------------
  // MAIN
  // -------------------------

  workspace: {
  flex: 1,
  minWidth: 0,
  padding: '34px clamp(18px, 4vw, 45px) 60px',
  boxSizing: 'border-box',
  overflow: 'auto',
  },

  header: {
    maxWidth: '1200px',
    margin: '0 auto 35px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '30px',
    borderBottom: '1px solid #b9ad9a',
    paddingBottom: '25px',
  },

  museumSmallTitle: {
    fontSize: '10px',
    letterSpacing: '3px',
    color: '#91774b',
    marginBottom: '8px',
    fontWeight: 'bold',
  },

  heading: {
    margin: 0,
    fontSize: '38px',
    fontWeight: '500',
    letterSpacing: '-1px',
  },

  subtitle: {
    margin: '7px 0 0',
    color: '#756d61',
    fontSize: '14px',
    fontStyle: 'italic',
  },

  saveArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },

  titleInput: {
    width: '220px',
    padding: '12px 14px',
    border: '1px solid #a6a097',
    borderRadius: '4px',
    background: '#f8f3ea',
    fontFamily: 'Georgia, serif',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#302b24',
  },

  saveButton: {
    padding: '12px 17px',
    border: 'none',
    borderRadius: '4px',
    background: '#302b24',
    color: '#fff',
    fontFamily: 'Georgia, serif',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
  },


  // -------------------------
  // STUDIO
  // -------------------------

  studioSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },

  sectionLabel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '15px',
    fontSize: '11px',
    letterSpacing: '3px',
    color: '#806d4d',
    marginBottom: '18px',
    fontWeight: 'bold',
  },

  canvasOuterFrame: {
    width: '900px',
    maxWidth: '100%',
    margin: '0 auto',
    padding: '18px',
    background: '#8b693f',
    border: '6px solid #60472d',
    boxShadow:
      'inset 0 0 0 3px #c49b5b, 0 10px 25px rgba(0,0,0,0.25)',
    boxSizing: 'border-box',
  },

  canvasInnerFrame: {
    padding: '12px',
    background: '#d1ae70',
    boxShadow: 'inset 0 0 0 2px #6d5032',
    boxSizing: 'border-box',
  },

  canvas: {
    display: 'block',
    width: '100%',
    height: 'auto',
    aspectRatio: '1000 / 650',
    background: '#ffffff',
    cursor: 'crosshair',
  },

  studioPlaque: {
    display: 'inline-block',
    marginTop: '14px',
    padding: '7px 24px',
    background: '#302b24',
    color: '#e8d8b7',
    fontSize: '9px',
    letterSpacing: '2px',
    boxShadow: '0 3px 7px rgba(0,0,0,0.18)',
  },


  // -------------------------
  // EXHIBITION
  // -------------------------

  gallerySection: {
    maxWidth: '1200px',
    margin: '75px auto 0',
  },

  exhibitionHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    marginBottom: '45px',
  },

  exhibitionLine: {
    flex: 1,
    height: '1px',
    background: '#b9ad9a',
  },

  exhibitionSmall: {
    textAlign: 'center',
    fontSize: '9px',
    letterSpacing: '3px',
    color: '#806d4d',
    marginBottom: '5px',
  },

  galleryTitle: {
    margin: 0,
    textAlign: 'center',
    fontSize: '32px',
    fontWeight: '500',
  },

  galleryGrid: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '70px 45px',
  alignItems: 'start',
  },

  artwork: {
  textAlign: 'center',
  transition: 'transform 0.25s ease, filter 0.25s ease',
  },
  frame: {
    width: '100%',
    aspectRatio: '4 / 5',
    padding: '18px',
    boxSizing: 'border-box',
    boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
  },

  frameInner: {
    width: '100%',
    height: '100%',
    background: '#fff',
    padding: '12px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  frameGold: {
    background: '#b48b43',
    border: '7px solid #775523',
    boxShadow:
      'inset 0 0 0 3px #d6b66e, inset 0 0 0 6px #80602e, 0 10px 20px rgba(0,0,0,0.22)',
  },

  frameDark: {
    background: '#4a3423',
    border: '8px solid #2d2118',
    boxShadow:
      'inset 0 0 0 3px #8a633e, 0 10px 20px rgba(0,0,0,0.25)',
  },

  frameClassic: {
    background: '#d2c2a4',
    border: '8px solid #806b4a',
    boxShadow:
      'inset 0 0 0 3px #eee1c6, inset 0 0 0 6px #9c8156, 0 10px 20px rgba(0,0,0,0.22)',
  },

  doodleImage: {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'contain',
    background: '#fff',
  },
  artworkHover: {
  transform: 'translateY(-8px)',
  transition: 'transform 0.25s ease',
  cursor: 'pointer',
  filter: 'drop-shadow(0 15px 18px rgba(0,0,0,0.18))',
  },

  plaque: {
    display: 'inline-block',
    minWidth: '150px',
    marginTop: '16px',
    padding: '10px 22px',
    background: '#eee5d5',
    border: '1px solid #c8b99e',
    boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
  },

  plaqueTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#332d25',
    marginBottom: '4px',
  },

  plaqueDetails: {
    fontSize: '8px',
    letterSpacing: '2px',
    color: '#817563',
  },

  emptyMessage: {
    textAlign: 'center',
    padding: '70px 20px',
    color: '#756d61',
    fontStyle: 'italic',
  },

  loadingIcon: {
    fontSize: '42px',
    marginBottom: '10px',
  },

  footer: {
    textAlign: 'center',
    marginTop: '80px',
    paddingTop: '25px',
    borderTop: '1px solid #b9ad9a',
    color: '#897d6d',
    fontSize: '12px',
    fontStyle: 'italic',
  },


  // -------------------------
  // ARTWORK VIEWER
  // -------------------------

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(25, 22, 18, 0.82)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
    boxSizing: 'border-box',
    zIndex: 1000,
  },

  modal: {
  position: 'relative',
  maxWidth: '850px',
  maxHeight: '90vh',
  background: '#e8dfd0',
  padding: '30px',
  textAlign: 'center',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  boxSizing: 'border-box',
  border: '1px solid #b9ad9a',
  animation: 'museumOpen 0.25s ease-out',
  },

  closeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '34px',
    height: '34px',
    border: '1px solid #b9ad9a',
    borderRadius: '50%',
    background: '#f8f3ea',
    color: '#302b24',
    fontSize: '16px',
    cursor: 'pointer',
    zIndex: 2,
  },

  modalFrame: {
    padding: '18px',
    background: '#8b693f',
    border: '7px solid #60472d',
    boxShadow:
      'inset 0 0 0 3px #d6b66e, 0 10px 25px rgba(0,0,0,0.25)',
  },

  modalImage: {
    display: 'block',
    width: '100%',
    maxWidth: '750px',
    maxHeight: '65vh',
    margin: '0 auto',
    objectFit: 'contain',
    background: '#ffffff',
  },

  modalTitle: {
    margin: '20px 0 6px',
    fontSize: '25px',
    fontWeight: '500',
  },

  modalDetails: {
    fontSize: '9px',
    letterSpacing: '2px',
    color: '#817563',
  },
}

export default App