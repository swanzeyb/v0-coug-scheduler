import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useSurveyState, useScheduleState } from './persistence-hooks'

export function useAIChat() {
  const { userPreferences } = useSurveyState()
  const { scheduleItems } = useScheduleState()

  const { messages, sendMessage, status, error, stop } = useChat({
    id: 'butch-chat-session',
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        userPreferences,
        schedule: scheduleItems,
      },
    }),
  })

  return {
    messages,
    isLoading: status === 'streaming',
    error,
    sendMessage,
    stop,
  }
}
