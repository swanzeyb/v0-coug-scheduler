import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useSurveyState, useScheduleState } from './persistence-hooks'
import { useEffect, useState, useMemo } from 'react'

export function useAIChat(sessionKey?: string | number) {
  const { userPreferences } = useSurveyState()
  const { scheduleItems } = useScheduleState()

  // Generate a unique session ID that changes with sessionKey
  const [sessionId, setSessionId] = useState(
    () => `butch-chat-session-${Date.now()}`
  )

  // When sessionKey changes, generate a new session ID
  useEffect(() => {
    setSessionId(`butch-chat-session-${Date.now()}`)
  }, [sessionKey])

  // Create the opening message based on user preferences
  const openingMessage = useMemo(() => {
    let message =
      "Hey! Thanks for taking the time to fill out that survey. I'm Butch, and I'm here to help you build a schedule that actually works for your life."

    if (userPreferences) {
      // Personalize based on survey responses
      const sleepHours = userPreferences.sleepHours
      const productiveHours = userPreferences.productiveHours

      if (sleepHours && productiveHours) {
        message += ` I see you're typically productive from ${productiveHours} and aiming for sleep around ${sleepHours}.`
      }

      if (userPreferences.sleepScheduleWorking === 'Yes') {
        message +=
          " It's great that your sleep schedule is working well for you!"
      } else if (userPreferences.sleepScheduleWorking === 'No') {
        message +=
          ' I noticed your sleep schedule could use some work - we can definitely factor that in.'
      }
    }

    message +=
      "\n\nReady to dive in? Let's start with your classes this semester. What are you taking, and how many credits is each one?"

    return message
  }, [userPreferences])

  // Initial messages with Butch's greeting
  const initialMessages = useMemo(
    () => [
      {
        id: `butch-opening-${sessionKey}`,
        role: 'assistant' as const,
        parts: [{ type: 'text' as const, text: openingMessage }],
      },
    ],
    [openingMessage, sessionKey]
  )

  const chatOptions = useMemo(
    () => ({
      id: sessionId,
      messages: initialMessages, // Use messages parameter to set initial messages
      transport: new DefaultChatTransport({
        api: '/api/chat',
        body: {
          userPreferences,
          schedule: scheduleItems,
        },
      }),
    }),
    [sessionId, initialMessages, userPreferences, scheduleItems]
  )

  const { messages, sendMessage, status, error, stop } = useChat(chatOptions)

  return {
    messages,
    isLoading: status === 'streaming',
    error,
    sendMessage,
    stop,
    sessionId,
  }
}
