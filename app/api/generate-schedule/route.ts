import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { AIGeneratedScheduleSchema } from '@/lib/schemas'

export const maxDuration = 30

const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_GEMINI_API_KEY,
})

interface GenerateScheduleRequest {
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    parts: Array<{ type: string; text: string }>
  }>
}

export async function POST(req: Request) {
  try {
    const { messages }: GenerateScheduleRequest = await req.json()

    // Build conversation context from messages
    const conversationContext = messages
      .map((msg) => {
        const role = msg.role === 'user' ? 'Student' : 'Butch'
        const text = msg.parts?.map((p) => p.text).join('') || ''
        return `${role}: ${text}`
      })
      .join('\n\n')

    const systemPrompt = `You are analyzing a conversation between Butch (an academic success coach) and a student to extract and generate a structured weekly schedule.

Review the conversation carefully and extract ALL schedule information that was discussed, including:
- Class times, names, credits, and locations
- Study blocks and their durations
- Work hours and shifts
- Athletic practices or gym time
- Extracurricular activities
- Personal time blocks (meals, sleep prep, etc.)

IMPORTANT RULES:
1. Only include schedule blocks that were explicitly discussed or agreed upon in the conversation
2. Use 24-hour time format (e.g., "09:00", "15:30")
3. Map day names exactly as: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
4. Calculate accurate totals for the schedule_summary based on the blocks you create
5. Ensure all time blocks don't overlap within a day
6. If specific times weren't provided but activities were discussed, make reasonable assumptions based on context
7. Study time should be distributed across the week based on the student's preferences and productive hours
8. Include all commitments in the schedule, even if not time-specific (assign reasonable times)

CONVERSATION:
${conversationContext}

Generate a complete weekly schedule based on this conversation. Be thorough and include all commitments discussed.`

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: AIGeneratedScheduleSchema,
      schemaName: 'WeeklySchedule',
      schemaDescription:
        'A structured weekly schedule generated from the coaching conversation',
      system: systemPrompt,
      prompt:
        'Analyze the conversation above and generate a comprehensive weekly schedule. Include all classes, study blocks, work hours, and other commitments that were discussed.',
    })

    return Response.json({ success: true, schedule: object })
  } catch (error) {
    console.error('Schedule generation error:', error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
