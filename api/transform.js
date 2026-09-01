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
  const prompt = `Create one safe, cute, friendly ${styles[style] || styles['anime-color']} from this photo. Keep the person recognisable. Pose: ${pose}. Never horror, creepy, distorted, grotesque, or scary. No text, no border.`

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: image } }] }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
    }),
  })

  if (!response.ok) return res.status(response.status).json({ error: 'The illustration service is temporarily busy. Please try again shortly.' })
  const data = await response.json()
  const part = data?.candidates?.[0]?.content?.parts?.find((item) => item.inlineData?.data)
  if (!part) return res.status(502).json({ error: 'The illustration service did not return an image.' })
  return res.status(200).json({ image: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}` })
}
