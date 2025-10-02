"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Send,
  Settings,
  Share,
  BarChart3,
  AlertCircle,
  Plus,
  Calendar,
  Grid3X3,
  Sparkles,
  RotateCcw,
} from "lucide-react"

type UserPreferences = {
  studySchedule: string
  sleepHours: string
  scheduleView: string
  taskBreakdown: string
  reminderType: string
}

type TaskForm = {
  name: string
  startTime: string
  endTime: string
  dueDate: string
  reminder: boolean
  isPrivate: boolean
  priority: string
  useAIOptimize: boolean
  taskLength: string
  splittable: boolean
  minTaskLength: string
}

type ScheduleItem = {
  id: number
  title: string
  time: string
  priority: "high" | "medium" | "low"
  completed: boolean
  isAISuggestion: boolean
  aiExplanation?: string
  aiType?: "preparation" | "wellness" | "academic"
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const SURVEY_QUESTIONS = [
  {
    id: 1,
    question: "What's your preferred study schedule?",
    options: ["Morning (6-10 AM)", "Afternoon (12-4 PM)", "Evening (6-10 PM)", "Late Night (10 PM-2 AM)"],
  },
  {
    id: 2,
    question: "How many hours of sleep do you typically need?",
    options: ["6-7 hours", "7-8 hours", "8-9 hours", "9+ hours"],
  },
  {
    id: 3,
    question: "What's your preferred schedule view?",
    options: ["Daily Schedule", "Weekly Schedule", "Monthly Schedule"],
  },
  {
    id: 4,
    question: "How do you prefer to break down large tasks?",
    options: ["Keep tasks whole", "Break into 30-min chunks", "Break into 1-hour chunks", "Let AI decide"],
  },
  {
    id: 5,
    question: "What type of reminders work best for you?",
    options: ["Visual notifications", "Sound alerts", "Gentle nudges", "No reminders"],
  },
]

// Initial schedule data
const INITIAL_SCHEDULE_ITEMS = {
  Mon: [
    {
      id: 1,
      title: "Morning workout",
      time: "7:00 AM - 8:00 AM",
      priority: "high" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 2,
      title: "Physics homework",
      time: "2:00 PM - 4:00 PM",
      priority: "medium" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 3,
      title: "20 min stretching",
      time: "6:30 AM - 6:50 AM",
      priority: "low" as const,
      completed: false,
      isAISuggestion: true,
      aiExplanation: "Stretching before your workout can improve performance and reduce injury risk by up to 30%",
      aiType: "preparation" as const,
    },
    {
      id: 16,
      title: "Study break - 10 min walk",
      time: "3:00 PM - 3:10 PM",
      priority: "low" as const,
      completed: false,
      isAISuggestion: true,
      aiExplanation: "A short walk between study sessions can boost focus and retention by 25%",
      aiType: "wellness" as const,
    },
  ],
  Tue: [
    {
      id: 4,
      title: "Lab report",
      time: "10:00 AM - 12:00 PM",
      priority: "high" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 5,
      title: "Study group",
      time: "4:00 PM - 6:00 PM",
      priority: "medium" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 17,
      title: "Review lab notes",
      time: "9:30 AM - 9:50 AM",
      priority: "medium" as const,
      completed: false,
      isAISuggestion: true,
      aiExplanation: "Reviewing notes 30 minutes before lab work increases efficiency by 40%",
      aiType: "preparation" as const,
    },
  ],
  Wed: [
    {
      id: 6,
      title: "Calculus quiz",
      time: "9:00 AM - 10:00 AM",
      priority: "high" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 7,
      title: "Gym session",
      time: "5:00 PM - 6:30 PM",
      priority: "medium" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 18,
      title: "Calculus practice - 30 min",
      time: "8:00 AM - 8:30 AM",
      priority: "high" as const,
      completed: false,
      isAISuggestion: true,
      aiExplanation: "30 minutes of practice before a quiz can improve scores by an average of 15 points",
      aiType: "academic" as const,
    },
  ],
  Thu: [
    {
      id: 8,
      title: "Project meeting",
      time: "11:00 AM - 12:00 PM",
      priority: "medium" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 9,
      title: "Grocery shopping",
      time: "3:00 PM - 4:00 PM",
      priority: "low" as const,
      completed: false,
      isAISuggestion: false,
    },
  ],
  Fri: [
    {
      id: 10,
      title: "Engineering exam",
      time: "1:00 PM - 3:00 PM",
      priority: "high" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 11,
      title: "Social event",
      time: "7:00 PM - 9:00 PM",
      priority: "low" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 19,
      title: "Engineering review session",
      time: "11:00 AM - 12:30 PM",
      priority: "high" as const,
      completed: false,
      isAISuggestion: true,
      aiExplanation: "A focused review 2 hours before an exam optimizes memory recall",
      aiType: "academic" as const,
    },
  ],
  Sat: [
    {
      id: 12,
      title: "Laundry",
      time: "10:00 AM - 11:00 AM",
      priority: "low" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 13,
      title: "Call family",
      time: "2:00 PM - 3:00 PM",
      priority: "medium" as const,
      completed: false,
      isAISuggestion: false,
    },
  ],
  Sun: [
    {
      id: 14,
      title: "Weekly planning",
      time: "9:00 AM - 10:00 AM",
      priority: "medium" as const,
      completed: false,
      isAISuggestion: false,
    },
    {
      id: 15,
      title: "Meal prep",
      time: "4:00 PM - 6:00 PM",
      priority: "low" as const,
      completed: false,
      isAISuggestion: false,
    },
  ],
}

const WSU_COUGAR_AI = {
  id: 1,
  name: "Butch the Cougar",
  color: "bg-red-700",
  description: "Your WSU study companion",
  emoji: "🐾",
}

type Message = {
  id: number
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Go Cougs! I'm Butch, your WSU study companion! Ready to optimize your schedule and achieve your goals? Let me know how I can help!",
    sender: "ai",
    timestamp: new Date(),
  },
]

const BUTCH_SUGGESTIONS = [
  "Hey Coug! Consider breaking that 3-hour study session into two 90-minute blocks with a break.",
  "Great schedule! I notice you have back-to-back classes - want me to add a 15-minute buffer?",
  "Your success rate is looking good! Keep up the momentum, Coug!",
  "I see you've been consistent with morning workouts. That's champion behavior!",
  "Crimson and Gray pride! Your time management skills are improving every week.",
  "Study tip: Try scheduling your hardest subjects when your energy is highest!",
]

const AI_TASK_COMMENTS = {
  1: "Consider adding a 10-minute warm-up before this workout",
  2: "This task could be split into two focused 1-hour sessions",
  8: "Schedule this right after your most productive hours",
  10: "Add a 30-minute review session before this exam",
  14: "Try doing this on Sunday evening instead for better week prep",
}

const BUTCH_GENERAL_SUGGESTIONS = [
  "Looking at your schedule, you might want to add some buffer time between classes!",
  "I notice you're most productive in the mornings - want me to move some tasks there?",
  "Your completion rate is 78% - that's solid Cougar performance! Let's aim for 85%.",
  "Consider adding a 15-minute break between your back-to-back study sessions.",
  "Your sleep schedule looks good, but try to wind down 30 minutes earlier on weekdays.",
  "Great job staying consistent! Your habits are building momentum.",
]

export default function ScheduleApp() {
  const [showSurvey, setShowSurvey] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [surveyAnswers, setSurveyAnswers] = useState<string[]>([])
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [aiStage, setAiStage] = useState<1 | 2 | 3>(1)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(getCurrentDayIndex())
  const [currentView, setCurrentView] = useState<"main" | "chat" | "task-editor">("main")
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [inputText, setInputText] = useState("")
  const [calendarView, setCalendarView] = useState<"weekly" | "monthly">("weekly")
  const [showButchTip, setShowButchTip] = useState(false)
  const [editingTask, setEditingTask] = useState<ScheduleItem | null>(null)
  const [showTaskEditor, setShowTaskEditor] = useState(false)
  const [taskForm, setTaskForm] = useState<TaskForm>({
    name: "",
    startTime: "",
    endTime: "",
    dueDate: "",
    reminder: false,
    isPrivate: false,
    priority: "medium",
    useAIOptimize: false,
    taskLength: "",
    splittable: false,
    minTaskLength: "",
  })
  const [currentButchSuggestion, setCurrentButchSuggestion] = useState("")
  const [showButchBubble, setShowButchBubble] = useState(true)

  const [scheduleItems, setScheduleItems] = useState<{ [key: string]: ScheduleItem[] }>(INITIAL_SCHEDULE_ITEMS)
  const [nextTaskId, setNextTaskId] = useState(20)

  function getCurrentDayIndex() {
    const today = new Date()
    return (today.getDay() + 6) % 7
  }

  function calculateSuccessPercentage() {
    const allTasks = Object.values(scheduleItems).flat()
    const completedTasks = allTasks.filter((task) => task.completed && !task.isAISuggestion)
    const totalTasks = allTasks.filter((task) => !task.isAISuggestion)

    if (totalTasks.length === 0) return 0
    return Math.round((completedTasks.length / totalTasks.length) * 100)
  }

  const successPercentage = calculateSuccessPercentage()

  function handleSurveyAnswer(answer: string) {
    const newAnswers = [...surveyAnswers, answer]
    setSurveyAnswers(newAnswers)

    if (currentQuestionIndex < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Survey complete, process preferences
      const preferences: UserPreferences = {
        studySchedule: newAnswers[0],
        sleepHours: newAnswers[1],
        scheduleView: newAnswers[2],
        taskBreakdown: newAnswers[3],
        reminderType: newAnswers[4],
      }
      setUserPreferences(preferences)
      setShowSurvey(false)
    }
  }

  function getWeekDates(date: Date) {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek)
      weekDate.setDate(startOfWeek.getDate() + i)
      week.push(weekDate)
    }
    return week
  }

  function navigateWeek(direction: "prev" | "next") {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
  }

  function handleCougarClick() {
    setCurrentView("chat")
  }

  function handleBackToMain() {
    setCurrentView("main")
  }

  function handleSendMessage() {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    const cougarResponses = [
      "That's the Cougar spirit! Let me help you optimize that in your schedule.",
      "Go Cougs! I can suggest the perfect time slot for that task.",
      "Crimson and Gray pride! Want me to break that down into manageable chunks?",
      "Way to go, Coug! I'll factor that into your success predictions.",
      "That's what I call Cougar courage! Let's make your schedule work for you.",
      "Pullman proud! Your dedication is showing in your completion rates.",
    ]

    const randomResponse = cougarResponses[Math.floor(Math.random() * cougarResponses.length)]

    const aiMessage: Message = {
      id: Date.now() + 1,
      text: randomResponse,
      sender: "ai",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage, aiMessage])
    setInputText("")
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  function getSuccessColor(percentage: number) {
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  function getPriorityIcon(priority: string) {
    if (priority === "high") {
      return (
        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-white" />
        </div>
      )
    }
    if (priority === "medium") {
      return (
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-white" />
        </div>
      )
    }
    return null
  }

  function handleTaskCompletion(taskId: number, dayKey: string) {
    setScheduleItems((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey].map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    }))

    // Show encouraging message when task is completed
    if (!scheduleItems[dayKey].find((t) => t.id === taskId)?.completed) {
      setCurrentButchSuggestion("Great job, Coug! Another task completed. You're building momentum!")
      setShowButchBubble(true)
    }
  }

  function handleTaskClick(task: ScheduleItem) {
    if (task.isAISuggestion) {
      // Handle AI suggestion approval/denial
      return
    }
    setEditingTask(task)
    setTaskForm({
      name: task.title,
      startTime: task.time.split(" - ")[0],
      endTime: task.time.split(" - ")[1],
      dueDate: "",
      reminder: false,
      isPrivate: false,
      priority: task.priority,
      useAIOptimize: false,
      taskLength: "",
      splittable: false,
      minTaskLength: "",
    })
    setShowTaskEditor(true)
  }

  function handleSaveTask() {
    const dayKey = DAYS[selectedDay]

    if (editingTask) {
      // Update existing task
      setScheduleItems((prev) => ({
        ...prev,
        [dayKey]: prev[dayKey].map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: taskForm.name,
                time: `${taskForm.startTime} - ${taskForm.endTime}`,
                priority: taskForm.priority as "high" | "medium" | "low",
              }
            : task,
        ),
      }))
    } else {
      // Add new task
      const newTask: ScheduleItem = {
        id: nextTaskId,
        title: taskForm.name,
        time: taskForm.useAIOptimize ? "AI will optimize timing" : `${taskForm.startTime} - ${taskForm.endTime}`,
        priority: taskForm.priority as "high" | "medium" | "low",
        completed: false,
        isAISuggestion: false,
      }

      setScheduleItems((prev) => ({
        ...prev,
        [dayKey]: [...(prev[dayKey] || []), newTask],
      }))

      setNextTaskId((prev) => prev + 1)

      // If AI optimize was selected, show AI feedback
      if (taskForm.useAIOptimize) {
        setCurrentButchSuggestion(
          `Perfect! I've analyzed your schedule and found the optimal time for "${taskForm.name}". This timing maximizes your productivity!`,
        )
        setShowButchBubble(true)
      }
    }

    setShowTaskEditor(false)
    setEditingTask(null)
    setTaskForm({
      name: "",
      startTime: "",
      endTime: "",
      dueDate: "",
      reminder: false,
      isPrivate: false,
      priority: "medium",
      useAIOptimize: false,
      taskLength: "",
      splittable: false,
      minTaskLength: "",
    })
  }

  function handleAIApproval(taskId: number, action: "approve" | "deny" | "edit") {
    const dayKey = DAYS[selectedDay]

    if (action === "approve") {
      // Convert AI suggestion to regular task
      setScheduleItems((prev) => ({
        ...prev,
        [dayKey]: prev[dayKey].map((task) => (task.id === taskId ? { ...task, isAISuggestion: false } : task)),
      }))
      setCurrentButchSuggestion("Excellent choice, Coug! That suggestion is now part of your schedule.")
      setShowButchBubble(true)
    } else if (action === "deny") {
      // Remove AI suggestion
      setScheduleItems((prev) => ({
        ...prev,
        [dayKey]: prev[dayKey].filter((task) => task.id !== taskId),
      }))
      setCurrentButchSuggestion("No problem! I'll keep learning your preferences for better suggestions.")
      setShowButchBubble(true)
    } else if (action === "edit") {
      // Open task editor with AI suggestion pre-filled
      const aiTask = scheduleItems[dayKey].find((item) => item.id === taskId)
      if (aiTask) {
        setEditingTask(aiTask)
        setTaskForm({
          name: aiTask.title,
          startTime: aiTask.time.split(" - ")[0],
          endTime: aiTask.time.split(" - ")[1],
          dueDate: "",
          reminder: false,
          isPrivate: false,
          priority: aiTask.priority,
          useAIOptimize: false,
          taskLength: "",
          splittable: false,
          minTaskLength: "",
        })
        setShowTaskEditor(true)
      }
    }
  }

  function handleRecalculateSchedule() {
    setScheduleItems((prev) => {
      const newSchedule = { ...prev }

      // Boost priority of incomplete tasks
      Object.keys(newSchedule).forEach((dayKey) => {
        newSchedule[dayKey] = newSchedule[dayKey].map((task) => {
          if (!task.completed && !task.isAISuggestion) {
            const currentPriority = task.priority
            const newPriority = currentPriority === "low" ? "medium" : currentPriority === "medium" ? "high" : "high"
            return { ...task, priority: newPriority }
          }
          return task
        })
      })

      return newSchedule
    })

    setCurrentButchSuggestion(
      "Schedule recalculated! I've prioritized your incomplete tasks and found better time slots.",
    )
    setShowButchBubble(true)
  }

  const currentScheduleItems = scheduleItems[DAYS[selectedDay]] || []

  function getStageAppropriateContent() {
    if (aiStage === 1) {
      return {
        showAISuggestions: true,
        showTaskComments: true,
        showButchComments: true,
        aiSuggestionStyle: "prominent",
        showAIOptimizeButton: true,
        butchFrequency: "high",
        description: "Full AI assistance with suggestions and explanations",
      }
    } else if (aiStage === 2) {
      return {
        showAISuggestions: false,
        showTaskComments: true,
        showButchComments: true,
        aiSuggestionStyle: "subtle",
        showAIOptimizeButton: false,
        butchFrequency: "medium",
        description: "AI comments and guidance without direct suggestions",
      }
    } else {
      return {
        showAISuggestions: false,
        showTaskComments: false,
        showButchComments: false,
        aiSuggestionStyle: "none",
        showAIOptimizeButton: false,
        butchFrequency: "low",
        description: "Minimal AI interaction, focus on manual scheduling",
      }
    }
  }

  function handleStageChange(newStage: 1 | 2 | 3) {
    setAiStage(newStage)

    const stageMessages = {
      1: "Stage 1 activated! I'll provide full AI assistance with suggestions and explanations.",
      2: "Stage 2 activated! I'll offer guidance through comments without direct schedule suggestions.",
      3: "Stage 3 activated! You're in control - I'll step back and let you manage independently.",
    }

    setCurrentButchSuggestion(stageMessages[newStage])
    setShowButchBubble(true)

    // Auto-hide bubble after 5 seconds for stage 3
    if (newStage === 3) {
      setTimeout(() => setShowButchBubble(false), 5000)
    }
  }

  const stageContent = getStageAppropriateContent()
  const weekDates = getWeekDates(currentDate)

  if (showSurvey) {
    const currentQuestion = SURVEY_QUESTIONS[currentQuestionIndex]

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-700 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img src="/images/butch-cougar.png" alt="Butch the Cougar" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">Welcome, Coug!</h1>
            <p className="text-sm text-muted-foreground">Let's personalize your AI companion</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-center mb-4">
              {SURVEY_QUESTIONS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full mx-1 ${index <= currentQuestionIndex ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-6 text-balance">{currentQuestion.question}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4 hover:bg-primary/10 hover:border-primary transition-all bg-transparent"
                  onClick={() => handleSurveyAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (currentView === "chat") {
    return (
      <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-muted/40 to-muted/20 border-b border-border/50">
          <Button variant="ghost" size="sm" onClick={handleBackToMain} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center overflow-hidden">
              <img src="/images/butch-cougar.png" alt="Butch the Cougar" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{WSU_COUGAR_AI.name}</h1>
              <p className="text-sm text-muted-foreground">{WSU_COUGAR_AI.description}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start gap-3 max-w-[80%]">
                {message.sender === "ai" && (
                  <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src="/images/butch-cougar.png" alt="Butch the Cougar" className="w-6 h-6 object-contain" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">You</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border/50 bg-background">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message Butch the Cougar..."
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={1}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                size="sm"
                className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showTaskEditor) {
    return (
      <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setShowTaskEditor(false)} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{editingTask ? "Edit Task" : "Add New Task"}</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Task Name</label>
            <input
              type="text"
              value={taskForm.name}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter task name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
            <div className="flex gap-2">
              {(["high", "medium", "low"] as const).map((priority) => (
                <Button
                  key={priority}
                  variant={taskForm.priority === priority ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTaskForm((prev) => ({ ...prev, priority }))}
                  className="flex-1"
                >
                  {priority === "high" && <AlertCircle className="w-4 h-4 mr-1 text-red-500" />}
                  {priority === "medium" && <AlertCircle className="w-4 h-4 mr-1 text-orange-500" />}
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {!taskForm.useAIOptimize ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Start Time</label>
                <input
                  type="time"
                  value={taskForm.startTime}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">End Time</label>
                <input
                  type="time"
                  value={taskForm.endTime}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Task Length</label>
                <select
                  value={taskForm.taskLength}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, taskLength: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select duration</option>
                  <option value="30min">30 minutes</option>
                  <option value="1hour">1 hour</option>
                  <option value="1.5hours">1.5 hours</option>
                  <option value="2hours">2 hours</option>
                  <option value="3hours">3 hours</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="splittable"
                  checked={taskForm.splittable}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, splittable: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor="splittable" className="text-sm font-medium text-foreground">
                  Allow AI to split this task
                </label>
              </div>

              {taskForm.splittable && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Minimum chunk size</label>
                  <select
                    value={taskForm.minTaskLength}
                    onChange={(e) => setTaskForm((prev) => ({ ...prev, minTaskLength: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select minimum</option>
                    <option value="15min">15 minutes</option>
                    <option value="30min">30 minutes</option>
                    <option value="45min">45 minutes</option>
                    <option value="1hour">1 hour</option>
                  </select>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Due Date (Optional)</label>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="reminder"
                checked={taskForm.reminder}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, reminder: e.target.checked }))}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="reminder" className="text-sm font-medium text-foreground">
                Set reminder notification
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="private"
                checked={taskForm.isPrivate}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, isPrivate: e.target.checked }))}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="private" className="text-sm font-medium text-foreground">
                Make private
              </label>
            </div>

            {stageContent.showAIOptimizeButton && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="aiOptimize"
                  checked={taskForm.useAIOptimize}
                  onChange={(e) => setTaskForm((prev) => ({ ...prev, useAIOptimize: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor="aiOptimize" className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Optimize
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowTaskEditor(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSaveTask}>
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      <div className="bg-gradient-to-r from-muted/40 to-muted/20 rounded-3xl p-6 mb-6 border border-border/50 shadow-lg relative">
        {/* Corner Icons */}
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Share className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowSurvey(true)}>
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className={`flex items-center gap-1 ${getSuccessColor(successPercentage)}`}>
            <span className="text-sm font-semibold">{successPercentage}%</span>
          </div>
        </div>

        {stageContent.showButchComments && showButchBubble && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-red-700 text-white rounded-2xl p-3 max-w-xs shadow-lg relative">
              <button
                onClick={() => setShowButchBubble(false)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-800 rounded-full flex items-center justify-center text-xs hover:bg-red-900 transition-colors"
              >
                ×
              </button>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-red-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src="/images/butch-cougar.png" alt="Butch" className="w-4 h-4 object-contain" />
                </div>
                <p className="text-xs leading-relaxed">
                  {currentButchSuggestion ||
                    BUTCH_GENERAL_SUGGESTIONS[Math.floor(Math.random() * BUTCH_GENERAL_SUGGESTIONS.length)]}
                </p>
              </div>
              {/* Speech bubble tail pointing to Butch */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-700"></div>
            </div>
          </div>
        )}

        <h3 className="text-sm font-semibold text-foreground mb-4 text-center">WSU AI Companion</h3>
        <div className="flex justify-center">
          <button
            onClick={handleCougarClick}
            className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-background/60 transition-all duration-300 group hover:scale-105 active:scale-95"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-red-700 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 border-2 border-white/20 overflow-hidden">
                <img src="/images/butch-cougar.png" alt="Butch the Cougar" className="w-16 h-16 object-contain" />
              </div>
              <div className="absolute -top-1 -right-1 text-xl">🐾</div>
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {WSU_COUGAR_AI.name}
              </div>
              <div className="text-sm text-muted-foreground">{WSU_COUGAR_AI.description}</div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {[1, 2, 3].map((stage) => (
                <Button
                  key={stage}
                  variant={aiStage === stage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleStageChange(stage as 1 | 2 | 3)}
                  className={`h-7 px-2 text-xs transition-all ${
                    aiStage === stage ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background/60"
                  }`}
                >
                  Stage {stage}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-right max-w-32 leading-tight">
              {stageContent.description}
            </p>
          </div>
          {aiStage === 1 && (
            <Button variant="outline" size="sm" className="h-7 px-2 bg-transparent" onClick={handleRecalculateSchedule}>
              <RotateCcw className="w-3 h-3 mr-1" />
              Recalculate
            </Button>
          )}
        </div>
      </div>

      {/* Calendar */}
      <Card className="mb-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => navigateWeek("prev")} className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium text-foreground">
              {calendarView === "weekly"
                ? `Week of ${weekDates[0].getDate()} - ${weekDates[6].getDate()}`
                : `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigateWeek("next")} className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={calendarView === "weekly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCalendarView("weekly")}
              className="h-7 px-2"
            >
              <Calendar className="w-3 h-3" />
            </Button>
            <Button
              variant={calendarView === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCalendarView("monthly")}
              className="h-7 px-2"
            >
              <Grid3X3 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day, index) => {
            const date = weekDates[index]
            const isSelected = selectedDay === index
            const isToday = date.toDateString() === new Date().toDateString()

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={`p-3 rounded-lg text-center transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isToday
                      ? "bg-secondary/20 text-secondary"
                      : "hover:bg-muted"
                }`}
              >
                <div className="text-xs font-medium">{day}</div>
                <div className="text-lg font-bold mt-1">{date.getDate()}</div>
                <div className="flex justify-center mt-1">
                  <div className={`w-2 h-2 rounded-full ${Math.random() > 0.5 ? "bg-primary" : "bg-muted"}`} />
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      <div className="mb-20">
        <h2 className="text-lg font-semibold text-foreground mb-3">{DAYS[selectedDay]}'s Schedule</h2>
        <div className="space-y-3">
          <Card className="p-3 bg-muted/30 border-muted">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-4 h-4" /> {/* Empty space for alignment */}
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm">Last day to drop a course without a "W"</h3>
                </div>
              </div>
            </div>
          </Card>

          {currentScheduleItems.map((item) => {
            if (item.isAISuggestion && !stageContent.showAISuggestions) {
              return null
            }

            return (
              <Card
                key={item.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                  item.isAISuggestion ? "border-dashed border-primary/50 bg-primary/5" : ""
                }`}
                onClick={() => handleTaskClick(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      className={`w-4 h-4 rounded-full border-2 transition-all hover:scale-110 ${
                        item.completed ? "bg-primary border-primary" : "border-muted-foreground hover:border-primary"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTaskCompletion(item.id, DAYS[selectedDay])
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium ${
                            item.completed ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {item.title}
                        </h3>
                        {item.isAISuggestion && <Sparkles className="w-4 h-4 text-primary animate-pulse" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.time}</p>
                      {item.isAISuggestion && item.aiExplanation && aiStage === 1 && (
                        <p className="text-xs text-primary mt-1 italic">{item.aiExplanation}</p>
                      )}
                      {!item.isAISuggestion && stageContent.showTaskComments && AI_TASK_COMMENTS[item.id] && (
                        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2 relative">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-700 leading-relaxed">{AI_TASK_COMMENTS[item.id]}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">{getPriorityIcon(item.priority)}</div>
                </div>

                {item.isAISuggestion && aiStage === 1 && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAIApproval(item.id, "approve")
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAIApproval(item.id, "edit")
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAIApproval(item.id, "deny")
                      }}
                    >
                      Deny
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}

          {currentScheduleItems.filter((item) => !item.isAISuggestion || stageContent.showAISuggestions).length ===
            0 && (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">No scheduled items for this day</p>
            </Card>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 p-4">
        <div className="max-w-md mx-auto">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 font-semibold shadow-lg"
            onClick={() => setShowTaskEditor(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Task to Schedule
          </Button>
        </div>
      </div>
    </div>
  )
}
