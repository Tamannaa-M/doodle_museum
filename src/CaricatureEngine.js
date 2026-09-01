/**
 * Anime & Comic Caricature Engine
 * Transforms any photo into a vibrant, cute anime/manga illustrated caricature
 * with cel shading, soft cheek blush, hair highlights, and manga ink outlines
 * (matching the user's reference image: "Original ➔ Cute Anime Caricature").
 */

export function generateCaricature(imageSource, style = 'anime-color') {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const width = 500
      const height = 500
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })

      // 1. Draw centered square-cropped source image
      const minDim = Math.min(img.width, img.height)
      const sx = (img.width - minDim) / 2
      const sy = (img.height - minDim) / 2
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, width, height)

      const srcData = ctx.getImageData(0, 0, width, height)
      const src = srcData.data

      // Create output image buffers
      const outImgData = ctx.createImageData(width, height)
      const out = outImgData.data
      const grayscale = new Float32Array(width * height)

      // 2. Grayscale & color warmth preprocessing
      for (let i = 0; i < src.length; i += 4) {
        let r = src[i]
        let g = src[i + 1]
        let b = src[i + 2]

        // Boost saturation & warm anime skin tones
        if (style === 'anime-color' || style === 'pastel-shojo') {
          // Warmth boost
          r = Math.min(255, r * 1.08 + 8)
          g = Math.min(255, g * 1.03 + 4)
          b = Math.min(255, b * 0.96)
        }

        grayscale[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b
      }

      // 3. Compute Anime Ink Outlines (Sobel Edge Detection)
      const isEdge = new Uint8Array(width * height)
      const edgeThreshold = style === 'soft-sketch' ? 22 : 30

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x

          const gx =
            -grayscale[idx - width - 1] +
            grayscale[idx - width + 1] +
            -2 * grayscale[idx - 1] +
            2 * grayscale[idx + 1] +
            -grayscale[idx + width - 1] +
            grayscale[idx + width + 1]

          const gy =
            -grayscale[idx - width - 1] -
            2 * grayscale[idx - width] -
            grayscale[idx - width + 1] +
            grayscale[idx + width - 1] +
            2 * grayscale[idx + width] +
            grayscale[idx + width + 1]

          const edgeMagnitude = Math.sqrt(gx * gx + gy * gy)
          if (edgeMagnitude > edgeThreshold) {
            isEdge[idx] = 1
          }
        }
      }

      // 4. Color Cel-Shading / Quantization
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x
          const px = idx * 4

          if (style === 'comic-bw') {
            // Pure B&W comic ink
            if (isEdge[idx] || grayscale[idx] < 60) {
              out[px] = 24
              out[px + 1] = 22
              out[px + 2] = 20
            } else {
              out[px] = 255
              out[px + 1] = 255
              out[px + 2] = 255
            }
            out[px + 3] = 255
          } else {
            // Anime Cel-Shaded Color (Reference Image Style!)
            let r = src[px]
            let g = src[px + 1]
            let b = src[px + 2]

            // Quantize into smooth anime color bands (3-4 step cel shading)
            const quantize = (val) => Math.min(255, Math.floor(val / 42) * 44 + 18)

            r = quantize(r * 1.1)
            g = quantize(g * 1.05)
            b = quantize(b * 1.0)

            if (isEdge[idx]) {
              // Dark espresso manga ink outline
              out[px] = 36
              out[px + 1] = 28
              out[px + 2] = 24
            } else {
              // Cel shaded color
              out[px] = r
              out[px + 1] = g
              out[px + 2] = b
            }
            out[px + 3] = 255
          }
        }
      }

      ctx.putImageData(outImgData, 0, 0)

      // 5. Anime Blush, Sparkles & Vignette Embellishments
      if (style === 'anime-color' || style === 'pastel-shojo') {
        // Soft cheek blush in face region
        const blushGradient1 = ctx.createRadialGradient(width * 0.38, height * 0.52, 2, width * 0.38, height * 0.52, 28)
        blushGradient1.addColorStop(0, 'rgba(255, 130, 140, 0.45)')
        blushGradient1.addColorStop(1, 'rgba(255, 130, 140, 0)')
        ctx.fillStyle = blushGradient1
        ctx.beginPath()
        ctx.arc(width * 0.38, height * 0.52, 28, 0, Math.PI * 2)
        ctx.fill()

        const blushGradient2 = ctx.createRadialGradient(width * 0.62, height * 0.52, 2, width * 0.62, height * 0.52, 28)
        blushGradient2.addColorStop(0, 'rgba(255, 130, 140, 0.45)')
        blushGradient2.addColorStop(1, 'rgba(255, 130, 140, 0)')
        ctx.fillStyle = blushGradient2
        ctx.beginPath()
        ctx.arc(width * 0.62, height * 0.52, 28, 0, Math.PI * 2)
        ctx.fill()

        // Cute anime face blush speedlines //
        ctx.strokeStyle = '#e06070'
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(width * 0.35, height * 0.50)
        ctx.lineTo(width * 0.37, height * 0.54)
        ctx.moveTo(width * 0.38, height * 0.50)
        ctx.lineTo(width * 0.40, height * 0.54)
        ctx.moveTo(width * 0.60, height * 0.50)
        ctx.lineTo(width * 0.62, height * 0.54)
        ctx.moveTo(width * 0.63, height * 0.50)
        ctx.lineTo(width * 0.65, height * 0.54)
        ctx.stroke()
      }

      // 6. Draw Anime Sparkles & Comic Flair
      ctx.strokeStyle = '#181512'
      ctx.lineWidth = 2.4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      drawSparkle(ctx, width - 42, 42, 16)
      drawSparkle(ctx, 42, 46, 14)
      drawDoodleHeart(ctx, width - 46, height - 46, 14)
      drawDoodleHeart(ctx, 46, height - 46, 12)

      // Outer rounded anime card frame
      ctx.lineWidth = 3
      ctx.strokeRect(10, 10, width - 20, height - 20)

      resolve(canvas.toDataURL('image/png'))
    }

    img.src = imageSource
  })
}

function drawSparkle(ctx, cx, cy, size) {
  ctx.beginPath()
  ctx.moveTo(cx, cy - size)
  ctx.lineTo(cx, cy + size)
  ctx.moveTo(cx - size, cy)
  ctx.lineTo(cx + size, cy)
  ctx.moveTo(cx - size * 0.4, cy - size * 0.4)
  ctx.lineTo(cx + size * 0.4, cy + size * 0.4)
  ctx.moveTo(cx + size * 0.4, cy - size * 0.4)
  ctx.lineTo(cx - size * 0.4, cy + size * 0.4)
  ctx.stroke()
}

function drawDoodleHeart(ctx, cx, cy, size) {
  ctx.beginPath()
  const topCurveHeight = size * 0.3
  ctx.moveTo(cx, cy + topCurveHeight)
  ctx.bezierCurveTo(cx, cy, cx - size / 2, cy, cx - size / 2, cy + topCurveHeight)
  ctx.bezierCurveTo(cx - size / 2, cy + (size + topCurveHeight) / 2, cx, cy + (size + topCurveHeight) / 1.4, cx, cy + size)
  ctx.bezierCurveTo(cx, cy + (size + topCurveHeight) / 1.4, cx + size / 2, cy + (size + topCurveHeight) / 2, cx + size / 2, cy + topCurveHeight)
  ctx.bezierCurveTo(cx + size / 2, cy, cx, cy, cx, cy + topCurveHeight)
  ctx.stroke()
}
