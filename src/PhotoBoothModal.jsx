import { useEffect, useRef, useState } from 'react'
import { RenderAvatar } from './AvatarLibrary'

/* Instant local photo-strip panels. Nothing is uploaded and no account, key,
   server function, or AI quota is required. */
function makeCutePanel(photoDataUrl, styleMode, variant) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const width = 720
      const height = 900
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      const drawPhoto = (x, y, w, h, mirror, filter) => {
        const ratio = Math.max(w / image.width, h / image.height)
        const photoW = image.width * ratio
        const photoH = image.height * ratio
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(x, y, w, h, 24)
        ctx.clip()
        ctx.filter = filter
        if (mirror) {
          ctx.translate(x + w, y)
          ctx.scale(-1, 1)
          ctx.drawImage(image, (w - photoW) / 2, (h - photoH) / 2, photoW, photoH)
        } else ctx.drawImage(image, x + (w - photoW) / 2, y + (h - photoH) / 2, photoW, photoH)
        ctx.restore()
        ctx.filter = 'none'
      }
      const outlinedCard = (x, y, w, h, ink, paper) => {
        ctx.fillStyle = paper
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 28); ctx.fill()
        ctx.strokeStyle = ink; ctx.lineWidth = 7
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 28); ctx.stroke()
      }

      if (styleMode === 'soft-sketch') {
        // A bright pastel stationery card, deliberately unlike the warm photo mode.
        const wash = ctx.createLinearGradient(0, 0, width, height)
        wash.addColorStop(0, '#cfeaff'); wash.addColorStop(.5, '#f4d9ec'); wash.addColorStop(1, '#fff0c8')
        ctx.fillStyle = wash; ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = 'rgba(255,255,255,.5)'
        for (let i = 0; i < 18; i += 1) ctx.beginPath(), ctx.arc(35 + (i * 101) % 670, 38 + (i * 137) % 820, 8 + (i % 3) * 6, 0, Math.PI * 2), ctx.fill()
        outlinedCard(54, 102, 612, 692, '#71647a', '#fffdf9')
        drawPhoto(72, 120, 576, 630, variant, 'saturate(1.04) brightness(1.09) contrast(.96)')
        ctx.fillStyle = '#71647a'; ctx.textAlign = 'center'; ctx.font = 'italic 29px Georgia, serif'
        ctx.fillText('little memory', width / 2, 850)
      } else if (styleMode === 'comic-bw') {
        ctx.fillStyle = '#fffdf8'; ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = '#dedbd4'
        for (let y = 32; y < height; y += 26) for (let x = 32; x < width; x += 26) ctx.fillRect(x, y, 4, 4)
        outlinedCard(46, 92, 628, 710, '#202020', '#fff')
        drawPhoto(64, 110, 592, 656, variant, 'grayscale(1) contrast(1.08) brightness(1.18)')
        ctx.fillStyle = '#202020'; ctx.textAlign = 'center'; ctx.font = 'bold 25px Georgia, serif'
        ctx.fillText('DOODLE DAY', width / 2, 850)
      } else {
        // Crisp warm photo in a cute hand-drawn card — no foggy overlay.
        ctx.fillStyle = '#ffd9e4'; ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = '#f8b8ca'
        for (let y = 35; y < height; y += 46) for (let x = 28; x < width; x += 46) ctx.fillRect(x, y, 5, 5)
        outlinedCard(46, 92, 628, 710, '#5b4148', '#fffaf5')
        drawPhoto(64, 110, 592, 656, variant, 'saturate(1.16) brightness(1.07) contrast(1.03)')
        ctx.fillStyle = '#5b4148'; ctx.textAlign = 'center'; ctx.font = 'italic 29px Georgia, serif'
        ctx.fillText('doodle day ♡', width / 2, 850)
      }
      resolve(canvas.toDataURL('image/jpeg', .92))
    }
    image.onerror = () => reject(new Error('This image could not be opened. Please try another photo.'))
    image.src = photoDataUrl
  })
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PHOTO BOOTH MODAL
───────────────────────────────────────────────────────────────────────────── */

export function PhotoBoothModal({ doodle, artistName, avatar, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const uploadInputRef = useRef(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [startingCamera, setStartingCamera] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [photoSnap, setPhotoSnap] = useState(null)         // original data-url
  const [animeSnaps, setAnimeSnaps] = useState([])         // two instant local photo-strip panels
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMsg, setProcessingMsg] = useState('')
  const [apiError, setApiError] = useState('')
  const [timerCount, setTimerCount] = useState(null)
  const [filterMode, setFilterMode] = useState('anime-color')

  useEffect(() => () => stopCamera(), [])

  useEffect(() => {
    if (!cameraActive || !videoRef.current || !streamRef.current) return
    videoRef.current.srcObject = streamRef.current
    videoRef.current.play().catch((error) => {
      console.error('Camera preview error:', error)
      setCameraError(true)
    })
  }, [cameraActive, photoSnap])

  async function startCamera() {
    if (streamRef.current) return true
    setStartingCamera(true)
    setCameraError(false)
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('No camera API')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      setCameraActive(true)
      return true
    } catch (error) {
      console.error('Camera permission error:', error)
      setCameraActive(false)
      setCameraError(true)
      return false
    } finally {
      setStartingCamera(false)
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  async function triggerSnapshot() {
    if (!cameraActive) {
      await startCamera()
      return
    }
    let c = 3
    setTimerCount(c)
    const iv = setInterval(() => {
      c -= 1
      if (c > 0) { setTimerCount(c) }
      else {
        clearInterval(iv)
        setTimerCount('📸')
        setTimeout(() => { snapFromVideo(); setTimerCount(null) }, 350)
      }
    }, 700)
  }

  function snapFromVideo() {
    const video = videoRef.current
    if (!video) return
    const c = document.createElement('canvas')
    c.width = video.videoWidth || 480
    c.height = video.videoHeight || 480
    const ctx = c.getContext('2d')
    ctx.translate(c.width, 0); ctx.scale(-1, 1)  // mirror selfie
    ctx.drawImage(video, 0, 0)
    processPhoto(c.toDataURL('image/jpeg', 0.92))
  }

  function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => processPhoto(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function processPhoto(src) {
    setPhotoSnap(src)
    setAnimeSnaps([])
    setApiError('')
  }

  function resetPhoto() {
    setPhotoSnap(null)
    setAnimeSnaps([])
    setApiError('')
    if (!cameraActive) startCamera()
  }

  // ── Download strip as PNG ──
  function downloadStrip() {
    const canvas = document.createElement('canvas')
    const W = 400, H = 1000
    canvas.width = W; canvas.height = H
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#faf7f0'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = '#161616'; ctx.lineWidth = 5
    ctx.strokeRect(10, 10, W - 20, H - 20)
    ctx.lineWidth = 1.5
    ctx.strokeRect(17, 17, W - 34, H - 34)

    ctx.fillStyle = '#161616'; ctx.textAlign = 'center'
    ctx.font = 'bold 14px Georgia, serif'
    ctx.fillText('✦ THE DOODLE MUSEUM ✦', W / 2, 42)
    ctx.font = '12px cursive'
    ctx.fillText('Photo Booth Memories • 2026', W / 2, 60)

    const fW = 340, fH = 240, fX = (W - fW) / 2
    const drawFrame = (y) => {
      ctx.fillStyle = '#fff'; ctx.fillRect(fX, y, fW, fH)
      ctx.strokeStyle = '#161616'; ctx.lineWidth = 2.5; ctx.strokeRect(fX, y, fW, fH)
    }

    const y1 = 75, y2 = 335, y3 = 595

    const loadAll = () => {
      drawFrame(y1)
      if (photoSnap) {
        const i1 = new Image(); i1.crossOrigin = 'anonymous'
        i1.onload = () => { ctx.drawImage(i1, fX + 3, y1 + 3, fW - 6, fH - 6); doFrame2() }
        i1.src = photoSnap
      } else doFrame2()
    }

    function doFrame2() {
      drawFrame(y2)
      if (doodle?.image_url) {
        const art = new Image(); art.crossOrigin = 'anonymous'
        art.onload = () => { ctx.drawImage(art, fX + 4, y2 + 4, fW - 8, fH - 8); doFrame3() }
        art.onerror = doFrame3
        art.src = doodle.image_url
      } else doFrame3()
    }

    function doFrame3() {
      drawFrame(y3)
      finishStrip()
    }

    function finishStrip() {
      ctx.fillStyle = '#181512'
      ctx.font = 'bold 20px Georgia, serif'
      ctx.fillText(`"${doodle?.title?.split(' /// ')[0] || 'Masterpiece'}"`, W / 2, y3 + 66)
      ctx.font = 'bold 18px cursive'
      ctx.fillText(`by ${artistName || 'Museum Artist'}`, W / 2, y3 + 108)
      ctx.font = '20px sans-serif'; ctx.fillText('♡  ♡  ♡', W / 2, y3 + 148)
      ctx.font = '11px cursive'
      ctx.fillText('✦ The Doodle Museum Collection ✦', W / 2, y3 + 188)

      ctx.font = 'bold 11px cursive'
      ctx.fillText('#doodlemuseum  •  insert memories ✦', W / 2, 900)

      const link = document.createElement('a')
      link.download = `doodle-strip-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    loadAll()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="photobooth-modal-card"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Photo Booth"
      >
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="cardboard-booth-header">
          <div className="cardboard-badge">LIVE doodle</div>
          <h2 className="cardboard-title">Photo Booth</h2>
          <p className="cardboard-subtitle">
            Take or upload your photo → your browser makes a cute comic strip ✨
          </p>
        </div>

        <div className="photobooth-split-view">

          {/* ── LEFT: Camera + Controls ── */}
          <div className="photobooth-camera-pane">

            {/* Viewfinder */}
            <div className="camera-viewfinder-box">
              {photoSnap ? (
                <img src={photoSnap} alt="Your photo" className="captured-photo-preview" style={{ opacity: 0.7 }} />
              ) : cameraActive ? (
                <video ref={videoRef} autoPlay playsInline muted className="live-camera-video" />
              ) : (
                <div className="camera-placeholder-notice">
                  <span>📸</span>
                  <p>{cameraError ? 'Camera not available — use Upload Photo!' : 'Connecting to camera...'}</p>
                </div>
              )}

              {/* Countdown overlay */}
              {timerCount !== null && (
                <div className="camera-countdown-overlay">{timerCount}</div>
              )}

            </div>

            {/* Error message */}
            {apiError && (
              <div className="api-error-banner">
                ⚠️ {apiError}
              </div>
            )}

            {/* Action buttons — Snapshot (camera) + Upload (separate) */}
            <div className="camera-action-toolbar">
              {photoSnap ? (
                <button type="button" className="booth-btn secondary" onClick={resetPhoto}>
                  🔄 Retake Photo
                </button>
              ) : (
                <button
                  type="button"
                  className="booth-btn primary"
                  onClick={triggerSnapshot}
                  disabled={startingCamera}
                  title={cameraActive ? 'Take a selfie with countdown' : 'Open camera'}
                >
                📸 {startingCamera ? 'Opening camera…' : cameraActive ? 'Take Photo' : 'Open Camera'}
                </button>
              )}

              <label className="booth-btn outline booth-upload-label">
                📁 Upload Photo
                <input
                  ref={uploadInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {cameraError && (
              <p className="camera-fallback-notice">
                💡 Camera access was not granted. You can allow it in your browser settings, or choose an existing image with Upload Photo.
              </p>
            )}

          </div>

          {/* ── RIGHT: Preview Strip ── */}
          <div className="photobooth-strip-container">
            <div className="vintage-photo-strip">
              <div className="strip-header">
                <span className="strip-stars">✦ ✦ ✦</span>
                <div className="strip-brand">THE DOODLE MUSEUM</div>
                <div className="strip-tag">LIVE PHOTO BOOTH</div>
              </div>

              {/* Frame 1 — illustrated avatar */}
              <div className="strip-frame strip-avatar-frame">
                <div className="strip-avatar-display"><RenderAvatar avatar={avatar} size={105} /></div>
                <div className="strip-artist-signature"><span className="by-line">doodle portrait</span><span className="name-line">{artistName || 'Artist'}</span></div>
              </div>

              {/* Frame 2 — your artwork */}
              <div className="strip-frame">
                {doodle?.image_url ? (
                  <img src={doodle.image_url} alt="Your artwork" className="strip-img" />
                ) : (
                  <div className="strip-frame-empty">
                    <span>🎨</span>
                    <p>Your artwork goes here</p>
                  </div>
                )}
              </div>

              {/* Frame 3 — optional memory photo */}
              <div className="strip-frame strip-avatar-frame">
                {photoSnap ? <img src={photoSnap} alt="Your memory photo" className="strip-img" /> : <div className="strip-frame-empty"><span>📸</span><p>Optional memory photo</p></div>}
              </div>

              <div className="strip-footer">
                <div className="strip-insert-badge">insert memories ✦</div>
                <div className="strip-date">
                  {new Date().toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="download-strip-btn"
              onClick={downloadStrip}
              disabled={!photoSnap}
              title={photoSnap ? 'Download your photo strip!' : 'Take a photo first'}
            >
              📥 Download Photostrip (.PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
