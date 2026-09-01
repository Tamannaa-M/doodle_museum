export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(500).json({ error: 'Image service is not configured yet.' })

  const { image, mimeType, style = 'anime-color', pose = 'front-facing smile' } = req.body || {}
  if (!image || !mimeType) return res.status(400).json({ error: 'A photo is required.' })

  const styles = {
    'anime-color': 'cute, polished shoujo anime portrait; soft warm colours, kind expression, rosy cheeks, clean lines',
    'soft-sketch': 'cute pastel pencil-and-watercolour illustration; gentle features, soft colours, friendly mood',
    'comic-bw': 'cute black-and-white manga line-art; friendly expression, clean ink, no colour',
  }
  const prompt = `Create one polished, bright, joyful ${styles[style] || styles['anime-color']} from this photo. Keep every person recognisable and flattering. Use smooth clean linework, soft lighting, warm friendly expressions, normal facial proportions, and a light background. Pose: ${pose}. Absolutely do not use dark ink-heavy shadows, distorted faces, hollow eyes, horror, creepiness, grotesque details, or unsettling imagery. No text and no border.`

  const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-image:generateContent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: image } }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    console.error('Gemini image request failed:', response.status, details)
    let message = 'The illustration service is temporarily busy. Please try again shortly.'
    try { message = JSON.parse(details)?.error?.message || message } catch {}
    return res.status(response.status).json({ error: message })
  }
  const data = await response.json()
  const part = data?.candidates?.[0]?.content?.parts?.find((item) => item.inlineData?.data)
  if (!part) return res.status(502).json({ error: 'The illustration service did not return an image.' })
  return res.status(200).json({ image: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}` })
}
