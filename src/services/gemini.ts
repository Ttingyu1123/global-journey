import { getApiKey } from './api-key'

const SYSTEM_PROMPT = `You are a creative prompt generator for MidJourney AI image generation. Your specialty is creating prompts for "3D relief miniature models of world landmarks on aged blueprints" in macro photography style.

Given a landmark or location name, generate:
1. An English image prompt in this exact style: "[City, Country]: 3D relief model of [landmark], with [distinctive features], [surrounding context], on an aged blueprint, miniatures, macro photography. [Color tones]. [Architectural style]. --ar 16:9 --style raw"
2. A Chinese translation of the prompt
3. A Chinese animation transition prompt for video (Kling/JiMeng) in this style: "穿梭動畫，鏡頭[movement description]，來到一片空白地面上，建築物如雨後春筍一般從空白地面拔地而起。"

Return ONLY a JSON object with these keys: promptEn, promptZh, animationPrompt. No markdown code blocks.`

export interface GenerateResult {
  promptEn: string
  promptZh: string
  animationPrompt: string
}

export async function generatePrompt(input: string): Promise<GenerateResult> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('Please set your Gemini API Key first')

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Generate a 3D relief miniature model prompt for: ${input}` }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 },
      }),
    }
  )

  if (!resp.ok) {
    const err = await resp.json()
    throw new Error(err.error?.message || 'API request failed')
  }

  const data = await resp.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim()
  return JSON.parse(cleaned) as GenerateResult
}
