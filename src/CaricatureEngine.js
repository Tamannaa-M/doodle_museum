/**
 * Caricature Engine: Converts any photo into a cute, hand-drawn
 * black-and-white comic line art caricature with doodle embellishments
 * (matching Korean/Japanese photobooth caricature strips in Reference Image 3).
 */

export function generateCaricature(imageSource, style = 'comic-doodle') {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const width = 480
      const height = 480
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })

      // 1. Draw centered & square-cropped source image
      const minDim = Math.min(img.width, img.height)
      const sx = (img.width - minDim) / 2
      const sy = (img.height - minDim) / 2
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, width, height)

      const imgData = ctx.getImageData(0, 0, width, height)
      const data = imgData.data
      const grayscale = new Float32Array(width * height)

      // 2. Grayscale conversion
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        // Perceptual luminance
        grayscale[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b
      }

      // 3. Difference of Gaussians / Sobel edge detection for crisp comic ink lines
      const output = ctx.createImageData(width, height)
      const outData = output.data

      // Fill with crisp white paper
      for (let i = 0; i < outData.length; i += 4) {
        outData[i] = 255
        outData[i + 1] = 255
        outData[i + 2] = 255
        outData[i + 3] = 255
      }

      // Compute edge gradient
      const threshold = style === 'soft-sketch' ? 18 : 26
      const darkInkThreshold = style === 'manga-sparkle' ? 70 : 80

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x

          // Sobel operator
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
          const brightness = grayscale[idx]
          const outIdx = idx * 4

          if (edgeMagnitude > threshold || brightness < darkInkThreshold) {
            // Draw clean black ink line / shadow
            outData[outIdx] = 22
            outData[outIdx + 1] = 20
            outData[outIdx + 2] = 18
          } else {
            // White paper
            outData[outIdx] = 255
            outData[outIdx + 1] = 255
            outData[outIdx + 2] = 255
          }
        }
      }

      ctx.putImageData(output, 0, 0)

      // 4. Add cute doodle embellishments around the caricature (sparkles, hearts, star bursts)
      ctx.strokeStyle = '#161616'
      ctx.lineWidth = 2.4
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Top-right sparkle star ✦
      drawSparkle(ctx, width - 42, 42, 16)
      // Top-left sparkle star ✦
      drawSparkle(ctx, 42, 46, 14)
      // Small heart ♡
      drawDoodleHeart(ctx, width - 48, height - 48, 12)
      drawDoodleHeart(ctx, 48, height - 48, 11)

      // Corner frame line
      ctx.lineWidth = 2.8
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
