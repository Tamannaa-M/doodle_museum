import { useEffect, useRef, useState } from 'react'
import { RenderAvatar } from './AvatarLibrary'
import { generateCaricature } from './CaricatureEngine'

export function PhotoBoothModal({ doodle, artistName, avatar, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const cameraInputRef = useRef(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [photoSnap, setPhotoSnap] = useState(null)
  const [caricatureSnap, setCaricatureSnap] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [timer, setTimer] = useState(null)
  const [caricatureMode, setCaricatureMode] = useState('comic-doodle') // 'comic-doodle' | 'soft-sketch' | 'photo'

  // Start Camera
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  async function startCamera() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setCameraActive(true)
        }
      }
    } catch (err) {
      console.warn('Webcam stream not available (using native camera input):', err)
      setCameraActive(false)
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  // Snap from live video
  function triggerCapture() {
    if (!cameraActive) {
      // Trigger native camera app
      cameraInputRef.current?.click()
      return
    }

    let count = 3
    setTimer(count)

    const interval = setInterval(() => {
      count -= 1
      if (count > 0) {
        setTimer(count)
      } else {
        clearInterval(interval)
        setTimer('📸 FLASH!')
        setTimeout(() => {
          captureVideoFrame()
          setTimer(null)
        }, 400)
      }
    }, 700)
  }

  function captureVideoFrame() {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')

    // Mirror for selfie mode
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const rawData = canvas.toDataURL('image/png')
    processPhotoToCaricature(rawData)
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      processPhotoToCaricature(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  async function processPhotoToCaricature(sourceImage) {
    setPhotoSnap(sourceImage)
    setIsProcessing(true)

    if (caricatureMode === 'photo') {
      setCaricatureSnap(sourceImage)
      setIsProcessing(false)
      return
    }

    try {
      const caricature = await generateCaricature(sourceImage, caricatureMode)
      setCaricatureSnap(caricature)
    } catch (err) {
      console.error('Caricature generation failed:', err)
      setCaricatureSnap(sourceImage)
    } finally {
      setIsProcessing(false)
    }
  }

  // Re-process if filter mode changes
  useEffect(() => {
    if (photoSnap) {
      processPhotoToCaricature(photoSnap)
    }
  }, [caricatureMode])

  // Download 3-frame vertical strip (Reference Image 3)
  function downloadPhotoStrip() {
    const canvas = document.createElement('canvas')
    const width = 420
    const height = 980
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    // Paper background
    ctx.fillStyle = '#faf7f0'
    ctx.fillRect(0, 0, width, height)

    // Outer double black border (Reference Image 3)
    ctx.strokeStyle = '#161616'
    ctx.lineWidth = 6
    ctx.strokeRect(12, 12, width - 24, height - 24)
    ctx.lineWidth = 1.5
    ctx.strokeRect(18, 18, width - 36, height - 36)

    // Header
    ctx.fillStyle = '#161616'
    ctx.font = 'bold 16px "Playfair Display", Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('✦ THE DOODLE MUSEUM ✦', width / 2, 44)
    ctx.font = 'bold 13px "Caveat", cursive'
    ctx.fillText('Live Photo Booth Memories • 2026', width / 2, 62)

    const frameWidth = 356
    const frameHeight = 240
    const frameX = (width - frameWidth) / 2

    function drawBox(y) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(frameX, y, frameWidth, frameHeight)
      ctx.strokeStyle = '#161616'
      ctx.lineWidth = 3
      ctx.strokeRect(frameX, y, frameWidth, frameHeight)
    }

    // Frame 1: Caricature
    const y1 = 78
    drawBox(y1)
    if (caricatureSnap) {
      const img1 = new Image()
      img1.crossOrigin = 'anonymous'
      img1.onload = () => {
        ctx.drawImage(img1, frameX + 4, y1 + 4, frameWidth - 8, frameHeight - 8)
        drawSecond()
      }
      img1.src = caricatureSnap
    } else {
      drawSecond()
    }

    function drawSecond() {
      // Frame 2: Doodle Artwork
      const y2 = 338
      drawBox(y2)
      if (doodle?.image_url) {
        const img2 = new Image()
        img2.crossOrigin = 'anonymous'
        img2.onload = () => {
          ctx.drawImage(img2, frameX + 8, y2 + 8, frameWidth - 16, frameHeight - 16)
          drawThird()
        }
        img2.src = doodle.image_url
      } else {
        drawThird()
      }
    }

    function drawThird() {
      // Frame 3: Artist Avatar Stamp & Caricature Signature
      const y3 = 598
      drawBox(y3)

      ctx.fillStyle = '#161616'
      ctx.font = 'bold 22px "Playfair Display", serif'
      ctx.fillText(`"${doodle?.title || 'Masterpiece'}"`, width / 2, y3 + 70)

      ctx.font = 'bold 20px "Caveat", cursive'
      ctx.fillText(`Created by: ${artistName || 'Museum Artist'} ✦`, width / 2, y3 + 115)

      ctx.font = '24px sans-serif'
      ctx.fillText('♡ ♡ ♡', width / 2, y3 + 160)

      ctx.font = '13px "Caveat", cursive'
      ctx.fillText('✦ The Doodle Museum Collection ✦', width / 2, y3 + 195)

      // Footer
      ctx.fillStyle = '#161616'
      ctx.font = 'bold 13px "Caveat", cursive'
      ctx.fillText('insert memories #doodlemuseum ✦ 2026', width / 2, 890)
      ctx.font = '10px sans-serif'
      ctx.fillText('♡ ♡ ♡ ♡ ♡', width / 2, 910)

      // Download
      const link = document.createElement('a')
      link.download = `doodle-photostrip-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="photobooth-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Live Doodle Photo Booth"
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Header */}
        <div className="cardboard-booth-header">
          <div className="cardboard-badge">LIVE doodle</div>
          <h2 className="cardboard-title">Photo Booth</h2>
          <p className="cardboard-subtitle">
            Take or upload your photo & get a cute hand-drawn caricature strip! 📸✨
          </p>
        </div>

        <div className="photobooth-split-view">
          {/* LEFT: Camera View & Caricature Controls */}
          <div className="photobooth-camera-pane">
            <div className="camera-viewfinder-box">
              {caricatureSnap ? (
                <img
                  src={caricatureSnap}
                  alt="Caricature Preview"
                  className="captured-photo-preview"
                />
              ) : cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="live-camera-video"
                />
              ) : (
                <div className="camera-placeholder-notice">
                  <span>📸</span>
                  <p>Click below to take a photo or upload an image to draw your caricature!</p>
                </div>
              )}

              {/* Countdown overlay */}
              {timer && <div className="camera-countdown-overlay">{timer}</div>}

              {/* Processing Loader */}
              {isProcessing && (
                <div className="camera-countdown-overlay" style={{ fontSize: '24px' }}>
                  ✏️ Drawing your cute caricature...
                </div>
              )}
            </div>

            {/* Filter Mode Selector */}
            <div className="caricature-mode-pills">
              <button
                type="button"
                className={`caricature-pill-btn ${caricatureMode === 'comic-doodle' ? 'active' : ''}`}
                onClick={() => setCaricatureMode('comic-doodle')}
              >
                🖋️ Comic Caricature
              </button>
              <button
                type="button"
                className={`caricature-pill-btn ${caricatureMode === 'soft-sketch' ? 'active' : ''}`}
                onClick={() => setCaricatureMode('soft-sketch')}
              >
                ✏️ Soft Sketch
              </button>
              <button
                type="button"
                className={`caricature-pill-btn ${caricatureMode === 'photo' ? 'active' : ''}`}
                onClick={() => setCaricatureMode('photo')}
              >
                📷 B&W Photo
              </button>
            </div>

            {/* Camera Actions */}
            <div className="camera-action-toolbar">
              {photoSnap ? (
                <button
                  type="button"
                  className="booth-btn secondary"
                  onClick={() => {
                    setPhotoSnap(null)
                    setCaricatureSnap(null)
                    startCamera()
                  }}
                >
                  🔄 Retake / New Photo
                </button>
              ) : (
                <button
                  type="button"
                  className="booth-btn primary"
                  onClick={triggerCapture}
                >
                  📸 Take Snapshot!
                </button>
              )}

              {/* Native Mobile Camera / File upload trigger */}
              <button
                type="button"
                className="booth-btn outline"
                onClick={() => cameraInputRef.current?.click()}
              >
                📁 Upload / Mobile Camera
              </button>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* RIGHT: Photostrip Preview (Matching Reference Image 3) */}
          <div className="photobooth-strip-container">
            <div className="vintage-photo-strip">
              <div className="strip-header">
                <span className="strip-stars">✦ ✦ ✦</span>
                <div className="strip-brand">THE DOODLE MUSEUM</div>
                <div className="strip-tag">LIVE PHOTO BOOTH</div>
              </div>

              {/* Strip Frame 1: Caricature */}
              <div className="strip-frame">
                {caricatureSnap ? (
                  <img src={caricatureSnap} alt="Caricature" className="strip-img" />
                ) : (
                  <div className="strip-frame-empty">
                    <span>📸</span>
                    <p>Frame 1: Your Caricature</p>
                  </div>
                )}
              </div>

              {/* Strip Frame 2: Doodle Artwork */}
              <div className="strip-frame">
                {doodle?.image_url ? (
                  <img src={doodle.image_url} alt="Doodle" className="strip-img" />
                ) : (
                  <div className="strip-frame-empty">
                    <span>🎨</span>
                    <p>Frame 2: Your Art</p>
                  </div>
                )}
              </div>

              {/* Strip Frame 3: Artist Avatar & Signature Stamp */}
              <div className="strip-frame strip-avatar-frame">
                <div className="strip-avatar-display">
                  <RenderAvatar avatar={avatar} size={64} />
                </div>
                <div className="strip-artist-signature">
                  <span className="by-line">Artist:</span>
                  <span className="name-line">{artistName || 'Anonymous'}</span>
                  <span className="hearts-line">♡ ♡ ♡</span>
                </div>
              </div>

              {/* Strip Footer */}
              <div className="strip-footer">
                <div className="strip-insert-badge">insert memories ✦</div>
                <div className="strip-date">
                  {new Date().toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Download Strip Button */}
            <button
              type="button"
              className="download-strip-btn"
              onClick={downloadPhotoStrip}
            >
              📥 Download Photostrip (.PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
