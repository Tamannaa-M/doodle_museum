import { useEffect, useRef, useState } from 'react'
import { RenderAvatar } from './AvatarLibrary'

/* ─────────────────────────────────────────────────────────────────────────────
   GEMINI IMAGE TRANSFORMATION
   Uses the Gemini 3.1 Flash Image model (Nano Banana 2) to convert a real
   photo into a cute anime-style illustration — exactly like the reference.
   REST endpoint: POST /v1beta/interactions
   Model: gemini-3.1-flash-image
   Input: [ { type:"text", text: PROMPT }, { type:"image", data: base64, mime_type } ]
   Output: interaction.output_image.data (base64 PNG)
───────────────────────────────────────────────────────────────────────────── */

const ANIME_PROMPT = `Transform this photo into a cute, high-quality anime illustration.
Style rules:
- Keep the person's face shape, hair color, and clothing recognizable
- Large, luminous anime eyes with sparkling highlights and soft irises
- Clean, smooth skin with gentle warm cel-shading and rosy blush on cheeks
- Soft ink outlines — not harsh, more like a webtoon or Studio Ghibli style
- Warm, slightly desaturated color palette — creamy skin, soft warm shadows
- Hair rendered with smooth flowing strands and gentle highlights
- Background simplified into soft shapes matching the original colors
- Overall feel: warm, cute, polished anime illustration — NEVER scary, creepy, horror, distorted, or grotesque

Output: A single illustration image, no text, no borders, same composition as the original.`

const SOFT_SKETCH_PROMPT = `Transform this photo into a soft pastel anime sketch illustration.
Style rules:
- Keep the person's likeness but soften all features
- Pencil-sketch-style outlines that are delicate and hand-drawn looking
- Soft watercolor-like fills — pale pinks, creams, light blues
- Big soft eyes with subtle highlights
- Gentle blush marks on cheeks
- Background becomes a soft gradient wash of color
- Very clean, gentle, and dreamy overall feel — like a shoujo manga panel, NEVER scary or horror-like

Output: A single illustration image, no text, no borders.`

const MANGA_PROMPT = `Transform this photo into a classic black-and-white manga illustration.
Style rules:
- Clean, confident ink lines — bold outlines, fine detail lines
- High-contrast black and white with manga screen-tone hatching for shading
- Expressive anime eyes with manga sparkle lines
- Hair rendered with bold flowing ink strokes
- Face slightly simplified and stylized in manga proportions
- Background simplified to clean geometric lines or crosshatch
- Use grayscale only: pure black, white, and gray ink. Do not include any color.
- Keep the mood sweet, friendly, and cute — never scary, horror-like, or unsettling.

Output: A single black and white illustration image, no text, no borders.`

const STYLE_PROMPTS = {
  'anime-color': ANIME_PROMPT,
  'soft-sketch': SOFT_SKETCH_PROMPT,
  'comic-bw': MANGA_PROMPT,
}

/**
 * Strip a data-URL prefix to get raw base64.
 * Also returns the mime type.
 */
function parseDataUrl(dataUrl) {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!m) throw new Error('Not a valid data URL')
  return { mimeType: m[1], base64: m[2] }
}

/**
 * Call Gemini Image Generation REST API.
 * Returns a data-URL string for the generated image.
 */
async function callGeminiImageAPI(photoDataUrl, styleMode, apiKey, poseInstruction) {
  const { mimeType, base64 } = parseDataUrl(photoDataUrl)
  const response = await fetch('/api/transform', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64, mimeType, style: styleMode, pose: poseInstruction }),
  })
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.error || 'Could not create the illustration.')
  return payload.image
  /*
  const { mimeType, base64 } = parseDataUrl(photoDataUrl)
  const prompt = `${STYLE_PROMPTS[styleMode] || ANIME_PROMPT}\n\nPose direction: ${poseInstruction}. Keep the same person recognizable. Output one portrait only.`

  const body = {
    model: 'gemini-3.1-flash-image',
    input: [
      { type: 'text', text: prompt },
      { type: 'image', mime_type: mimeType, data: base64 },
    ],
  }

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/interactions?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!resp.ok) {
    const errText = await resp.text()
    throw new Error(`Gemini API error ${resp.status}: ${errText}`)
  }

  const data = await resp.json()

  // The output image is in interaction.output_image.data (base64)
  const imgData = data?.output_image?.data
  if (!imgData) {
    // Try iterating steps for the image part
    const steps = data?.steps || []
    for (const step of steps) {
      for (const part of step?.parts || []) {
        if (part?.inline_data?.data) {
          return `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`
        }
      }
    }
    throw new Error('No image in Gemini API response')
  }

  return `data:image/png;base64,${imgData}` */
}

/* ─────────────────────────────────────────────────────────────────────────────
   API KEY GATE
   User enters their Gemini API key once — stored in localStorage.
   Instructions link to aistudio.google.com/app/apikey
───────────────────────────────────────────────────────────────────────────── */

const LS_KEY = 'doodle_museum_gemini_key'

function ApiKeyGate({ onKeySet }) {
  const [keyInput, setKeyInput] = useState('')
  const [error, setError] = useState('')

  function handleSave() {
    const k = keyInput.trim()
    if (!k || k.length < 20) {
      setError('Please paste a valid Gemini API key.')
      return
    }
    localStorage.setItem(LS_KEY, k)
    onKeySet(k)
  }

  return (
    <div className="api-key-gate">
      <div className="api-key-gate-icon">🔑</div>
      <h3 className="api-key-gate-title">Enter Your Gemini API Key</h3>
      <p className="api-key-gate-desc">
        The cute anime transformation is powered by <strong>Gemini AI</strong> image generation.
        You need a free API key to use it.
      </p>
      <ol className="api-key-gate-steps">
        <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">aistudio.google.com/app/apikey</a></li>
        <li>Click <strong>"Create API key"</strong> and copy it</li>
        <li>Paste it below ↓</li>
      </ol>
      <div className="api-key-input-row">
        <input
          type="password"
          placeholder="AIza..."
          value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="api-key-input"
          autoComplete="off"
        />
        <button type="button" className="api-key-save-btn" onClick={handleSave}>
          Save &amp; Continue →
        </button>
      </div>
      {error && <p className="api-key-error">{error}</p>}
      <p className="api-key-privacy">Your key is stored only in your browser (localStorage). It never leaves your device except to call the Gemini API directly.</p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PHOTO BOOTH MODAL
───────────────────────────────────────────────────────────────────────────── */

export function PhotoBoothModal({ doodle, artistName, avatar, onClose }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const uploadInputRef = useRef(null)

  const apiKey = 'local-browser-comic'
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [photoSnap, setPhotoSnap] = useState(null)         // original data-url
  const [animeSnaps, setAnimeSnaps] = useState([])         // two Gemini-generated poses
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingMsg, setProcessingMsg] = useState('')
  const [apiError, setApiError] = useState('')
  const [timerCount, setTimerCount] = useState(null)
  const [filterMode, setFilterMode] = useState('anime-color')

  useEffect(() => { startCamera(); return () => stopCamera() }, [])

  async function startCamera() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('No camera API')
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
    } catch {
      setCameraActive(false)
      setCameraError(true)
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  function triggerSnapshot() {
    if (!cameraActive) {
      setCameraError(true)
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
    setProcessingMsg('✨ Creating two cute poses...')

    try {
      setProcessingMsg('🎨 Drawing pose 1 of 2...')
      const first = await callGeminiImageAPI(src, filterMode, apiKey, 'a cheerful front-facing portrait with a gentle smile')
      setProcessingMsg('🎨 Drawing pose 2 of 2...')
      const second = await callGeminiImageAPI(src, filterMode, apiKey, 'a playful three-quarter portrait, waving one hand')
      setAnimeSnaps([first, second])
    } catch (err) {
      console.error('Gemini API error:', err)
      setApiError(err.message || 'Something went wrong. Check your API key.')
    } finally {
      setIsProcessing(false)
      setProcessingMsg('')
    }
  }

  // Re-generate when style changes (if photo already taken)
  useEffect(() => {
    if (photoSnap && apiKey) {
      processPhoto(photoSnap)
    }
  }, [filterMode])

  function resetPhoto() {
    setPhotoSnap(null)
    setAnimeSnaps([])
    setApiError('')
    if (!cameraActive) startCamera()
  }

  function clearApiKey() {}

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
                /* Generated anime image fills the viewfinder */
                <img src={animeSnaps[0]} alt="First cute anime pose" className={`captured-photo-preview ${filterMode === 'comic-bw' ? 'bw-result' : ''}`} />
              ) : isProcessing ? (
                <div className="ai-processing-screen">
                  <div className="ai-processing-spinner">✨</div>
                  <p className="ai-processing-text">{processingMsg}</p>
                  <p className="ai-processing-sub">No key or account needed ☁️</p>
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
                {apiError.includes('403') || apiError.includes('key') ? (
                  <button className="api-key-reset-link" onClick={clearApiKey}>Reset API key →</button>
                ) : null}
              </div>
            )}

            {/* Style pills */}
            <div className="caricature-mode-pills">
              {[
                { id: 'anime-color', emoji: '🌸', label: 'Cute Anime' },
                { id: 'soft-sketch', emoji: '🖍️', label: 'Soft Sketch' },
                { id: 'comic-bw',   emoji: '🖋️', label: 'Manga B&W' },
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
                  disabled={!cameraActive}
                  title={cameraActive ? 'Take a selfie with countdown' : 'Camera permission is needed to take a photo'}
                >
                📸 Take Photo
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

            {/* API key reset */}
          </div>

          {/* ── RIGHT: Preview Strip ── */}
          <div className="photobooth-strip-container">
            <div className="vintage-photo-strip">
              <div className="strip-header">
                <span className="strip-stars">✦ ✦ ✦</span>
                <div className="strip-brand">THE DOODLE MUSEUM</div>
                <div className="strip-tag">LIVE PHOTO BOOTH</div>
              </div>

              {/* Frame 1 — Anime illustration */}
              <div className="strip-frame">
              {animeSnaps[0] ? (
                  <img src={animeSnaps[0]} alt="Cute anime pose one" className={`strip-img ${filterMode === 'comic-bw' ? 'bw-result' : ''}`} />
                ) : isProcessing ? (
                  <div className="strip-frame-empty">
                    <span>✨</span>
                    <p>AI generating...</p>
                  </div>
                ) : (
                  <div className="strip-frame-empty">
                    <span>📸</span>
                    <p>Cute pose one</p>
                  </div>
                )}
              </div>

              {/* Frame 2 — second cute pose */}
              <div className="strip-frame">
                {animeSnaps[1] ? (
                  <img src={animeSnaps[1]} alt="Cute anime pose two" className={`strip-img ${filterMode === 'comic-bw' ? 'bw-result' : ''}`} />
                ) : (
                  <div className="strip-frame-empty">
                    <span>✨</span>
                    <p>Cute pose two</p>
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
