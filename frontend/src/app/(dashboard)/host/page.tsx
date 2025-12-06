'use client'

import { useCallback, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import { CreatorRouteGuard } from '@/shared/components/creator-route-guard'
import { 
  HostLobby, 
  HostGameScreen,
  HostPageLoading,
  HostPageError,
  HostPageResumeOption,
  HostPageNoQuiz,
  useHostGameStore,
  useGameHub,
  useHostSession,
  selectHostPhase,
  selectHostSession,
  selectHostCurrentQuestion,
  selectHostActions,
  GAME_HOST_CONSTANTS,
} from '@/features/game-host'
import type { 
  GameEndedMessage,
  QuestionStartedMessage,
  QuestionEndedMessage,
  AnswerReceivedMessage,
  LeaderboardUpdatedMessage,
  PlayerJoinedMessage,
  PlayerLeftMessage,
  StartGameResponse,
} from '@/features/game-host'
import { toastError, toastInfo, toastSuccess } from '@/lib/utils/toast'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'

function HostPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const sessionIdParam = searchParams.get('sessionId')

  const phase = useHostGameStore(selectHostPhase)
  const storeSession = useHostGameStore(selectHostSession)
  const currentQuestion = useHostGameStore(selectHostCurrentQuestion)
  const { 
    setPhase, 
    setSession: setStoreSession,
    setCurrentQuestion,
    setQuestionResult,
    setLeaderboard,
    setConnected,
    handlePlayerJoined,
    handlePlayerLeft,
    handleAnswerReceived,
    handleGameEnded: handleStoreGameEnded,
    setError: setStoreError,
  } = useHostGameStore(selectHostActions)

  // Session management hook
  const {
    session: hookSession,
    isLoading: sessionLoading,
    isCreating,
    error: sessionError,
    showResumeOption,
    storedSession,
    createNewSession,
    resumeSession,
    rejoinByPin,
    abandonSession,
  } = useHostSession({
    quizId,
    sessionIdParam,
    onSessionReady: (session) => {
      setStoreSession(session)
      setPhase('lobby')
    },
  })

  // Use session from hook or store
  const activeSession = hookSession || storeSession

  // SignalR Callbacks
  const handleQuestionStarted = useCallback((message: QuestionStartedMessage) => {
    console.log('[Host] QuestionStarted received:', {
      gameQuestionId: message.gameQuestionId,
      positionInGame: message.positionInGame,
      currentQuestionId: currentQuestion?.gameQuestionId,
    })
    
    // Only update if this is actually a new question
    if (currentQuestion?.gameQuestionId === message.gameQuestionId) {
      console.log('[Host] Ignoring duplicate QuestionStarted event - same gameQuestionId')
      return
    }
    
    console.log('[Host] Processing new question:', message.positionInGame)
    
    setCurrentQuestion({
      id: message.questionId,
      gameQuestionId: message.gameQuestionId,
      content: message.content,
      type: Number.parseInt(message.questionType) || 1,
      timeLimit: message.timeLimit,
      positionInGame: message.positionInGame,
      videoUrl: message.videoUrl,
      videoTimestamp: message.videoTimestamp,
      options: message.options,
    })
    setQuestionResult(null)
    setPhase('question')
  }, [setCurrentQuestion, setQuestionResult, setPhase, currentQuestion?.gameQuestionId])

  const handleQuestionEnded = useCallback((message: QuestionEndedMessage) => {
    setQuestionResult(message)
    setPhase('question-result')
  }, [setQuestionResult, setPhase])

  const handleAnswerReceivedCallback = useCallback((message: AnswerReceivedMessage) => {
    handleAnswerReceived(message)
  }, [handleAnswerReceived])

  const handleLeaderboardUpdated = useCallback((message: LeaderboardUpdatedMessage) => {
    setLeaderboard(message.leaderboard)
  }, [setLeaderboard])

  const handleHubGameEnded = useCallback((message: GameEndedMessage) => {
    handleStoreGameEnded(message)
  }, [handleStoreGameEnded])

  const handleHubPlayerJoined = useCallback((message: PlayerJoinedMessage) => {
    handlePlayerJoined(message)
    toastInfo(`${message.nickname} ${GAME_HOST_CONSTANTS.MESSAGES.PLAYER_JOINED}`)
  }, [handlePlayerJoined])

  const handleHubPlayerLeft = useCallback((message: PlayerLeftMessage) => {
    handlePlayerLeft(message)
    toastInfo(`${message.nickname} ${GAME_HOST_CONSTANTS.MESSAGES.PLAYER_LEFT}`)
  }, [handlePlayerLeft])

  const handleHubError = useCallback((error: { message: string }) => {
    setStoreError(error.message)
    toastError(error.message)
  }, [setStoreError])

  // SignalR Hub
  const {
    isConnected,
    connect,
    joinAsHost,
  } = useGameHub({
    onQuestionStarted: handleQuestionStarted,
    onQuestionEnded: handleQuestionEnded,
    onAnswerReceived: handleAnswerReceivedCallback,
    onLeaderboardUpdated: handleLeaderboardUpdated,
    onGameEnded: handleHubGameEnded,
    onPlayerJoined: handleHubPlayerJoined,
    onPlayerLeft: handleHubPlayerLeft,
    onError: handleHubError,
    onConnected: () => {
      setConnected(true)
      toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.CONNECTED)
    },
    onDisconnected: () => {
      setConnected(false)
      toastInfo(GAME_HOST_CONSTANTS.MESSAGES.DISCONNECTED)
    },
    onReconnecting: () => {
      toastInfo(GAME_HOST_CONSTANTS.MESSAGES.RECONNECTING)
    },
    onReconnected: () => {
      setConnected(true)
      toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.CONNECTED)
    },
  })

  // Manage SignalR connection
  useEffect(() => {
    if (!activeSession?.id || !activeSession?.pin) return

    let isMounted = true
    let connectionInitiated = false

    const initConnection = async () => {
      if (connectionInitiated) return
      connectionInitiated = true

      try {
        if (!isConnected) {
          await connect()
        }
        if (isMounted) {
          await joinAsHost(activeSession.id, activeSession.pin)
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : GAME_HOST_CONSTANTS.ERRORS.CONNECTION_FAILED
          toastError(errorMessage)
        }
      } finally {
        connectionInitiated = false
      }
    }

    // Only connect if not already connected
    if (isConnected) {
      // If already connected but session changed, join as host
      joinAsHost(activeSession.id, activeSession.pin).catch(console.error)
    } else {
      initConnection()
    }

    return () => {
      isMounted = false
    }
  }, [activeSession?.id, activeSession?.pin, connect, joinAsHost, isConnected])

  // Game handlers
  const handleGameStart = (data: StartGameResponse) => {
    setCurrentQuestion({
      id: data.id,
      gameQuestionId: data.gameQuestionId,
      content: data.content,
      type: data.type,
      timeLimit: data.timeLimit,
      positionInGame: data.positionInGame,
      videoUrl: data.videoUrl,
      videoTimestamp: data.videoTimestamp,
      options: data.options,
    })
    setQuestionResult(null)
    setPhase('question')
  }

  const handleGameEnd = useCallback((_result: GameEndedMessage) => {
    setPhase('ended')
  }, [setPhase])

  const handleGoBack = () => {
    router.push(ROUTES.quiz.list)
  }

  const handleStartFresh = async () => {
    await abandonSession()
    if (quizId) {
      await createNewSession()
    }
  }

  // Loading state
  if (sessionLoading) {
    return <HostPageLoading />
  }

  // Show resume option
  if (showResumeOption && storedSession) {
    return (
      <HostPageResumeOption
        storedSession={storedSession}
        isLoading={sessionLoading}
        error={sessionError}
        onResume={resumeSession}
        onStartFresh={handleStartFresh}
      />
    )
  }

  // Error state (no active session)
  if (sessionError && !activeSession) {
    return (
      <HostPageError
        error={sessionError}
        quizId={quizId}
        onRetry={handleStartFresh}
      />
    )
  }

  // No quiz selected - show options
  if (!quizId && !activeSession) {
    return (
      <HostPageNoQuiz
        error={sessionError}
        onRejoinByPin={rejoinByPin}
      />
    )
  }

  // Creating state
  if (isCreating) {
    return <HostPageLoading />
  }

  // Need to create session
  if (!activeSession && quizId) {
    createNewSession()
    return <HostPageLoading />
  }

  // Session not ready
  if (!activeSession) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Render based on phase
  if (phase === 'lobby' || phase === 'creating' || phase === 'idle') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="neutral" size="sm" onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            Phòng chờ
          </h1>
        </div>
        
        <HostLobby
          session={activeSession}
          onGameStart={handleGameStart}
          onGameEnd={handleGameEnd}
        />
      </div>
    )
  }

  // Game in progress or ended
  return (
    <div className="space-y-6">
      <HostGameScreen session={activeSession} />
    </div>
  )
}

export default function HostPage() {
  return (
    <DashboardLayout>
      <CreatorRouteGuard>
        <Suspense fallback={
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <HostPageContent />
        </Suspense>
      </CreatorRouteGuard>
    </DashboardLayout>
  )
}
