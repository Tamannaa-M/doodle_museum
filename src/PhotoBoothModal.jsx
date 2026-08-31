import { useEffect, useRef, useState } from 'react'
import { RenderAvatar } from './AvatarLibrary'

export function PhotoBoothModal({ doodle, artistName, avatar, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const stripCanvasRef = useRef(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [photoSnap, setPhotoSnap] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [timer, setTimer] = useState(null)
  const [sketchFilter, setSketchFilter] = useState(true)

  // Start Camera
  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  async function startCamera() {
    setCameraError(null)
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setCameraActive(true)
        }
      } else {
        setCameraError('Camera access is not supported by your browser. You can upload a photo!')
      }
    } catch (err) {
      console.warn('Camera permission denied or unavailable:', err)
      setCameraError('Camera permission denied or unavailable. You can upload a photo!')
      setCameraActive(false)
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  // Trigger Snapshot with countdown
  function triggerCapture() {
    if (isCapturing) return
    setIsCapturing(true)
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
          captureFrame()
          setTimer(null)
          setIsCapturing(false)
        }, 400)
      }
    }, 800)
  }

  function captureFrame() {
    const video = videoRef.current
    if (!video) return

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = video.videoWidth || 640
    tempCanvas.height = video.videoHeight || 480
    const ctx = tempCanvas.getContext('2d')

    // Mirror image for selfie mode
    ctx.translate(tempCanvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height)

    const dataUrl = tempCanvas.toDataURL('image/png')
    setPhotoSnap(dataUrl)
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setPhotoSnap(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  // Download High-Res Photostrip
  function downloadPhotoStrip() {
    const canvas = document.createElement('canvas')
    const width = 420
    const height = 960
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    // Cardboard / Cream paper background
    ctx.fillStyle = '#faf7f0'
    ctx.fillRect(0, 0, width, height)

    // Outer double border
    ctx.strokeStyle = '#181512'
    ctx.lineWidth = 4
    ctx.strokeRect(10, 10, width - 20, height - 20)
    ctx.lineWidth = 1.5
    ctx.strokeRect(16, 16, width - 32, height - 32)

    // Header Text
    ctx.fillStyle = '#181512'
    ctx.font = 'bold 16px "Playfair Display", Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('✦ THE DOODLE MUSEUM ✦', width / 2, 42)
    ctx.font = 'italic 12px "Caveat", cursive, sans-serif'
    ctx.fillText('Live Photo Booth Memories • 2026', width / 2, 60)

    const frameWidth = 360
    const frameHeight = 240
    const frameX = (width - frameWidth) / 2

    // Helper to draw framed box
    function drawBox(y, label) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(frameX, y, frameWidth, frameHeight)
      ctx.strokeStyle = '#181512'
      ctx.lineWidth = 2.5
      ctx.strokeRect(frameX, y, frameWidth, frameHeight)

      // Corner flourishes
      ctx.beginPath()
      ctx.arc(frameX + 12, y + 12, 3, 0, Math.PI * 2)
      ctx.arc(frameX + frameWidth - 12, y + 12, 3, 0, Math.PI * 2)
      ctx.arc(frameX + 12, y + frameHeight - 12, 3, 0, Math.PI * 2)
      ctx.arc(frameX + frameWidth - 12, y + frameHeight - 12, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#181512'
      ctx.fill()
    }

    // Frame 1: Snapshot
    const y1 = 76
    drawBox(y1)
    if (photoSnap) {
      const img1 = new Image()
      img1.crossOrigin = 'anonymous'
      img1.onload = () => {
        ctx.save()
        ctx.beginPath()
        ctx.rect(frameX + 4, y1 + 4, frameWidth - 8, frameHeight - 8)
        ctx.clip()
        if (sketchFilter) {
          ctx.filter = 'grayscale(100%) contrast(140%)'
        }
        ctx.drawImage(img1, frameX + 4, y1 + 4, frameWidth - 8, frameHeight - 8)
        ctx.restore()
        drawSecond()
      }
      img1.src = photoSnap
    } else {
      ctx.fillStyle = '#6e6252'
      ctx.font = 'italic 14px "Caveat", cursive'
      ctx.fillText('[ Live Snapshot Frame ]', width / 2, y1 + frameHeight / 2)
      drawSecond()
    }

    function drawSecond() {
      // Frame 2: Doodle Artwork
      const y2 = 336
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
      // Frame 3: Artist Avatar & Memories
      const y3 = 596
      drawBox(y3)

      ctx.fillStyle = '#181512'
      ctx.font = 'bold 22px "Playfair Display", serif'
      ctx.fillText(`"${doodle?.title || 'Masterpiece'}"`, width / 2, y3 + 70)

      ctx.font = 'bold 18px "Caveat", cursive'
      ctx.fillText(`Created by: ${artistName || 'Museum Artist'} ✦`, width / 2, y3 + 115)

      ctx.font = '24px sans-serif'
      ctx.fillText('♡ ♡ ♡', width / 2, y3 + 160)

      ctx.font = '13px "Caveat", cursive'
      ctx.fillText('✦ The Doodle Museum Collection ✦', width / 2, y3 + 195)

      // Footer
      ctx.fillStyle = '#181512'
      ctx.font = 'bold 13px "Caveat", cursive'
      ctx.fillText('insert memories #doodlemuseum ✦ 2026', width / 2, 875)
      ctx.font = '10px sans-serif'
      ctx.fillText('♡ ♡ ♡ ♡ ♡', width / 2, 895)

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

        {/* Cardboard Booth Header (Reference Image 2) */}
        <div className="cardboard-booth-header">
          <div className="cardboard-badge">LIVE doodle</div>
          <h2 className="cardboard-title">Photo Booth</h2>
          <p className="cardboard-subtitle">Create your 3-frame museum memories photo strip! 📸✨</p>
        </div>

        <div className="photobooth-split-view">
          {/* LEFT: Camera & Controls */}
          <div className="photobooth-camera-pane">
            <div className="camera-viewfinder-box">
              {photoSnap ? (
                <img
                  src={photoSnap}
                  alt="Snapshot"
                  className={`captured-photo-preview ${sketchFilter ? 'sketch-mode' : ''}`}
                />
              ) : cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`live-camera-video ${sketchFilter ? 'sketch-mode' : ''}`}
                />
              ) : (
                <div className="camera-placeholder-notice">
                  <span>📷</span>
                  <p>{cameraError || 'Preparing camera...'}</p>
                </div>
              )}

              {/* Countdown overlay */}
              {timer && <div className="camera-countdown-overlay">{timer}</div>}
            </div>

            {/* Camera Actions */}
            <div className="camera-action-toolbar">
              {photoSnap ? (
                <button
                  className="booth-btn secondary"
                  onClick={() => setPhotoSnap(null)}
                >
                  🔄 Retake Photo
                </button>
              ) : (
                <button
                  className="booth-btn primary"
                  onClick={triggerCapture}
                  disabled={!cameraActive || isCapturing}
                >
                  📸 Take Snapshot!
                </button>
              )}

              <label className="booth-btn outline upload-label" title="Upload photo from device">
                📁 Upload Photo
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              <button
                className={`booth-btn outline ${sketchFilter ? 'active' : ''}`}
                onClick={() => setSketchFilter(!sketchFilter)}
                title="Toggle B&W Doodle Sketch Filter"
              >
                ✏️ {sketchFilter ? 'Sketch: ON' : 'Sketch: OFF'}
              </button>
            </div>
          </div>

          {/* RIGHT: Live Photostrip Preview (Matching Reference Image 2) */}
          <div className="photobooth-strip-container">
            <div className="vintage-photo-strip" ref={stripCanvasRef}>
              <div className="strip-header">
                <span className="strip-stars">✦ ✦ ✦</span>
                <div className="strip-brand">THE DOODLE MUSEUM</div>
                <div className="strip-tag">LIVE PHOTO BOOTH</div>
              </div>

              {/* Strip Frame 1: Snapshot */}
              <div className="strip-frame">
                {photoSnap ? (
                  <img
                    src={photoSnap}
                    alt="Photo"
                    className={`strip-img ${sketchFilter ? 'sketch-mode' : ''}`}
                  />
                ) : (
                  <div className="strip-frame-empty">
                    <span>📸</span>
                    <p>Frame 1: Your Photo</p>
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

              {/* Strip Frame 3: Artist Avatar & Caricature Stamp */}
              <div className="strip-frame strip-avatar-frame">
                <div className="strip-avatar-display">
                  <RenderAvatar avatar={avatar} size={70} />
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
                <div className="strip-date">{new Date().toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
              </div>
            </div>

            {/* Download Strip Button */}
            <button className="download-strip-btn" onClick={downloadPhotoStrip}>
              📥 Download Photostrip (.PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
