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
      const ratio = Math.max(width / image.width, height / image.height)
      const drawWidth = image.width * ratio
      const drawHeight = image.height * ratio
      const offsetX = (width - drawWidth) / 2 + (variant ? Math.min(42, drawWidth * 0.04) : -Math.min(18, drawWidth * 0.02))
      const offsetY = (height - drawHeight) / 2

      const drawCover = (mirror = false) => {
        if (mirror) {
          ctx.save()
          ctx.translate(width, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
          ctx.restore()
        } else ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
      }

      if (styleMode === 'soft-sketch') {
        // A deliberately different look: blurred pastel backdrop + a crisp little print.
        ctx.fillStyle = '#e9def3'
        ctx.fillRect(0, 0, width, height)
        ctx.filter = 'blur(22px) saturate(.7) brightness(1.06)'
        drawCover(variant)
        ctx.filter = 'none'
        const fade = ctx.createLinearGradient(0, 0, width, height)
        fade.addColorStop(0, 'rgba(255, 209, 224, .42)')
        fade.addColorStop(1, 'rgba(202, 222, 255, .42)')
        ctx.fillStyle = fade
        ctx.fillRect(0, 0, width, height)

        const pad = 48
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(pad, pad, width - pad * 2, height - pad * 2, 28)
        ctx.clip()
        ctx.filter = 'saturate(.95) brightness(1.08) contrast(.98)'
        if (variant) {
          ctx.translate(width, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
        } else ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
        ctx.restore()
        ctx.filter = 'none'
        ctx.strokeStyle = '#fffaf5'
        ctx.lineWidth = 13
        ctx.beginPath()
        ctx.roundRect(pad, pad, width - pad * 2, height - pad * 2, 28)
        ctx.stroke()
      } else {
        ctx.fillStyle = '#fffaf3'
        ctx.fillRect(0, 0, width, height)
        ctx.filter = styleMode === 'comic-bw'
          ? 'grayscale(1) contrast(1.18) brightness(1.13)'
          : 'saturate(1.18) brightness(1.05) contrast(1.04)'
        drawCover(variant)
        ctx.filter = 'none'

        if (styleMode === 'anime-color') {
          ctx.strokeStyle = '#fff7ed'
          ctx.lineWidth = 12
          ctx.strokeRect(10, 10, width - 20, height - 20)
          ctx.fillStyle = '#fffaf3'
          ctx.font = '27px serif'
          ctx.fillText('♡', 42, 64)
          ctx.fillText('✦', width - 68, height - 38)
        }
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
  }, [cameraActive])

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
    setIsProcessing(true)
    setProcessingMsg('✨ Making your cute photo strip...')

    try {
      const first = await makeCutePanel(src, filterMode, false)
      const second = await makeCutePanel(src, filterMode, true)
      setAnimeSnaps([first, second])
    } catch (err) {
      console.error('Photo strip error:', err)
      setApiError(err.message || 'Something went wrong while making your photo strip.')
    } finally {
      setIsProcessing(false)
      setProcessingMsg('')
    }
  }

  // Re-make the two local panels when the style changes.
  useEffect(() => {
    if (photoSnap) {
      processPhoto(photoSnap)
    }
  }, [filterMode])

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
      if (animeSnaps[0]) {
        const i1 = new Image(); i1.crossOrigin = 'anonymous'
        i1.onload = () => { ctx.drawImage(i1, fX + 3, y1 + 3, fW - 6, fH - 6); doFrame2() }
        i1.src = animeSnaps[0]
      } else doFrame2()
    }

    function doFrame2() {
      drawFrame(y2)
      if (animeSnaps[1]) {
        const i2 = new Image(); i2.crossOrigin = 'anonymous'
        i2.onload = () => { ctx.drawImage(i2, fX + 8, y2 + 8, fW - 16, fH - 16); doFrame3() }
        i2.src = animeSnaps[1]
      } else doFrame3()
    }

    function doFrame3() {
      drawFrame(y3)
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
              {animeSnaps[0] ? (
                <img src={animeSnaps[0]} alt="First photo-strip panel" className="captured-photo-preview" />
              ) : isProcessing ? (
                <div className="ai-processing-screen">
                  <div className="ai-processing-spinner">✨</div>
                  <p className="ai-processing-text">{processingMsg}</p>
                  <p className="ai-processing-sub">Instant and private — no key or account needed ☁️</p>
                </div>
              ) : photoSnap ? (
                /* Show original while waiting for re-process */
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

              {/* Original photo pip when anime result is shown */}
              {photoSnap && animeSnaps.length > 0 && (
                <div className="original-thumb-pip">
                  <img src={photoSnap} alt="Original" />
                  <span>Original</span>
                </div>
              )}
            </div>

            {/* Error message */}
            {apiError && (
              <div className="api-error-banner">
                ⚠️ {apiError}
              </div>
            )}

            {/* Style pills */}
            <div className="caricature-mode-pills">
              {[
                { id: 'anime-color', emoji: '🌸', label: 'Cute Photo' },
                { id: 'soft-sketch', emoji: '🖍️', label: 'Soft Glow' },
                { id: 'comic-bw',   emoji: '🖋️', label: 'True B&W' },
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  className={`caricature-pill-btn ${filterMode === s.id ? 'active' : ''}`}
                  onClick={() => setFilterMode(s.id)}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>

            {/* Action buttons — Snapshot (camera) + Upload (separate) */}
            <div className="camera-action-toolbar">
              {animeSnaps.length > 0 || photoSnap ? (
                <button type="button" className="booth-btn secondary" onClick={resetPhoto}>
                  🔄 Try Again
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

              {/* Frame 1 */}
              <div className="strip-frame">
              {animeSnaps[0] ? (
                  <img src={animeSnaps[0]} alt="First photo-strip panel" className="strip-img" />
                ) : isProcessing ? (
                  <div className="strip-frame-empty">
                    <span>✨</span>
                    <p>Making your strip...</p>
                  </div>
                ) : (
                  <div className="strip-frame-empty">
                    <span>📸</span>
                    <p>Your first photo</p>
                  </div>
                )}
              </div>

              {/* Frame 2 */}
              <div className="strip-frame">
                {animeSnaps[1] ? (
                  <img src={animeSnaps[1]} alt="Second photo-strip panel" className="strip-img" />
                ) : (
                  <div className="strip-frame-empty">
                    <span>✨</span>
                    <p>Your second photo</p>
                  </div>
                )}
              </div>

              {/* Frame 3 — Avatar signature */}
              <div className="strip-frame strip-avatar-frame">
                <div className="strip-avatar-display">
                  <RenderAvatar avatar={avatar} size={60} />
                </div>
                <div className="strip-artist-signature">
                  <span className="by-line">Artist</span>
                  <span className="name-line">{artistName || 'Anonymous'}</span>
                  <span className="hearts-line">♡ ♡ ♡</span>
                </div>
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
              disabled={animeSnaps.length !== 2}
              title={animeSnaps.length === 2 ? 'Download your photo strip!' : 'Take a photo first'}
            >
              📥 Download Photostrip (.PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
