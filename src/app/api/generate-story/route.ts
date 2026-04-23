import { NextRequest, NextResponse } from "next/server"

// We use the Deepseek API key provided in .env
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!

export async function POST(req: NextRequest) {
  try {
    const { experience, product, community, equipment, isSelf, enhanceExisting, existingStory } = await req.json()

    // Enhance existing story mode
    if (enhanceExisting && existingStory) {
      if (!DEEPSEEK_API_KEY) {
        return NextResponse.json(
          { success: false, error: "AI generation is not correctly configured on the server." },
          { status: 500 }
        )
      }

      const enhanceSystemPrompt = `You are BuildBridge AI. Polish and improve this existing crowdfunding story while keeping the author's authentic voice. Make it more compelling for potential backers. Keep it 50-80 words, dignified and honest. Do not use hashtags, emojis, or overly dramatic language.`

      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: enhanceSystemPrompt },
            { role: "user", content: existingStory }
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        console.error("DeepSeek enhance error:", data)
        return NextResponse.json(
          { success: false, error: "Failed to enhance story with AI." },
          { status: response.status }
        )
      }

      const story = data.choices?.[0]?.message?.content?.trim() || ""
      return NextResponse.json({ success: true, story })
    }

    if (!experience || !product || !community || !equipment) {
      return NextResponse.json(
        { success: false, error: "Answers to all prompts are required." },
        { status: 400 }
      )
    }

    if (!DEEPSEEK_API_KEY) {
      console.error("Missing DeepSeek API key")
      return NextResponse.json(
        { success: false, error: "AI generation is not correctly configured on the server." },
        { status: 500 }
      )
    }

    // Adjust tone based on whether the user is creating for themselves or someone else
    const subject = isSelf ? "I" : "They"
    const possessive = isSelf ? "my" : "their"

    const systemPrompt = `You are an expert copywriter helping a tradesperson in Nigeria write a short, compelling personal story for a crowdfunding platform called BuildBridge. 
The goal is to raise funds for equipment or a specific need. 
Write 1 or 2 clear, authentic paragraphs (around 50-80 words). Do not use hashtags, emojis, or overly dramatic language. Keep it dignified, honest, and community-focused.
The story should be written from the perspective of the fundraiser (first person if creating for themselves: 'I', third person if creating for someone else: 'They').`

    const userPrompt = `Please write a story based on these details:
1. Experience: ${experience}
2. What ${subject.toLowerCase()} make/do: ${product}
3. Who ${subject.toLowerCase()} serve in ${possessive} community: ${community}
4. The equipment ${subject.toLowerCase()} need to buy: ${equipment}

Make it sound natural and heartfelt.`

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("DeepSeek API error:", data)
      return NextResponse.json(
        { success: false, error: "Failed to generate story with AI." },
        { status: response.status }
      )
    }

    const story = data.choices?.[0]?.message?.content?.trim() || ""

    return NextResponse.json({ success: true, story })
  } catch (err: any) {
    console.error("Generate story exception:", err)
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
