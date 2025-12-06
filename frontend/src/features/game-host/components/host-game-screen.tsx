'use client'

import { useEffect, useCallback, useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { QuestionDisplay } from './question-display'
import { Leaderboard } from './leaderboard'
import { GameEnded } from './game-ended'
import { toastError, toastInfo } from '@/lib/utils/toast'
import { GAME_HOST_CONSTANTS } from '../constants'
import { gameSessionService } from '../api/game-session.service'
import { 
  useHostGameStore, 
  selectHostSession, 
  selectHostPhase,
  selectHostCurrentQuestion,
  selectHostLeaderboard,
  selectHostAnsweredCount,
  selectHostActions,
} from '../store/host-game.store'
import { 
  GameSession, 
  GameEndedMessage,
  GameStatus,
} from '../types'

interface HostGameScreenProps {
  session: GameSession
  className?: string
}

export function HostGameScreen({
  session: initialSession,
  className = '',
}: Readonly<HostGameScreenProps>) {
  const [isLoadingNext, setIsLoadingNext] = useState(false)

  const session = useHostGameStore(selectHostSession) || initialSession
  const phase = useHostGameStore(selectHostPhase)
  const currentQuestion = useHostGameStore(selectHostCurrentQuestion)
  const leaderboard = useHostGameStore(selectHostLeaderboard)
  const answeredCount = useHostGameStore(selectHostAnsweredCount)
  const {
    setSession,
    setPhase,
    setCurrentQuestion,
    setLeaderboard,
    handleGameEnded,
  } = useHostGameStore(selectHostActions)

  // Initialize
  useEffect(() => {
    setSession(initialSession)
    
    let isMounted = true

    // Fetch latest session state to ensure we have current question
    const fetchSessionState = async () => {
      try {
        const response = await gameSessionService.getSessionById(initialSession.id)
        if (response.success && response.data && isMounted) {
          setSession(response.data)
          // Status 2 is InProgress
          if (response.data.currentQuestion && response.data.status === GameStatus.InProgress) {
            setCurrentQuestion(response.data.currentQuestion)
            setPhase('question')
          }
        }
      } catch (err) {
        console.error("Failed to fetch session state", err)
      }
    }

    fetchSessionState()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSession.id])

  // Fetch current leaderboard from backend
  const fetchLeaderboard = useCallback(async () => {
    if (!session) return
    
    try {
      const response = await gameSessionService.getLeaderboard(session.id)
      if (response.success && response.data) {
        setLeaderboard(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
    }
  }, [session, setLeaderboard])

  // End the game
  const endGame = useCallback(async () => {
    if (!session) return

    try {
      const response = await gameSessionService.endGame(session.id)
      if (response.success && response.data) {
        handleGameEnded({
          gameSessionId: session.id,
          totalQuestions: response.data.totalQuestions,
          totalPlayers: response.data.totalPlayers,
          duration: response.data.duration,
          finalLeaderboard: response.data.finalLeaderboard,
        })
      }
    } catch (err) {
      console.error('Failed to end game:', err)
    }
  }, [session, handleGameEnded])

  /**
   * Handle navigation through game flow: Question → Leaderboard → Next Question
   * 
   * Two-step flow:
   * 1. Question phase: Click "View Results" → Fetch leaderboard from backend
   * 2. Leaderboard phase: Click "Continue" → Call next-question API
   * 
   * Backend calculates all leaderboard data (ranks, stats) for data integrity.
   * SignalR events notify all clients when new questions start.
   */
  const handleNextQuestion = async () => {
    if (!session) return

    // Step 1: Show question results and leaderboard
    if (phase === 'question') {
      setPhase('leaderboard')
      await fetchLeaderboard()
      return
    }

    // Step 2: Move to next question
    setIsLoadingNext(true)
    toastInfo(GAME_HOST_CONSTANTS.MESSAGES.WAITING_FOR_NEXT)

    try {
      const response = await gameSessionService.nextQuestion(session.id)
      
      console.log('[Host] NextQuestion response:', response)
      
      if (!response || !response.data) {
        console.error('[Host] NextQuestion returned no data:', response)
        toastError('Không nhận được dữ liệu từ máy chủ')
        return
      }
      
      if (response.success) {
        console.log('[Host] NextQuestion data:', response.data)
        setLeaderboard(response.data.leaderboard)
        
        if (!response.data.hasMoreQuestions) {
          console.log('[Host] No more questions, ending game')
          await endGame()
        } else {
          // Move to question phase for next question
          setPhase('question')
        }
        // Next question will be sent via SignalR QuestionStarted event
      } else {
        toastError(response.message || 'Không thể chuyển câu hỏi')
      }
    } catch (err) {
      console.error('Next question error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Không thể chuyển câu hỏi'
      toastError(errorMessage)
    } finally {
      setIsLoadingNext(false)
    }
  }

  const handleTimeEnd = useCallback(() => {
    // Timer ended - host should click "Next Question" to continue
    // We could show a visual indicator here that time is up
    toastInfo('Hết thời gian! Hãy nhấn "Câu tiếp theo" để tiếp tục.')
  }, [])

  const handlePlayAgain = () => {
    // Navigate to create new session or reset
    globalThis.window.location.reload()
  }

  const playerCount = session?.players.length || 0
  const totalQuestions = session?.totalQuestions || 0

  // Render based on phase
  if (phase === 'ended') {
    const endedMessage: GameEndedMessage = {
      gameSessionId: session.id,
      totalQuestions,
      totalPlayers: playerCount,
      duration: '0:00',
      finalLeaderboard: leaderboard,
    }
    
    return (
      <div className={className}>
        <GameEnded 
          result={endedMessage}
          onPlayAgain={handlePlayAgain}
        />
      </div>
    )
  }

  // Note: question-result phase removed - backend doesn't provide question statistics
  // We show leaderboard directly between questions

  if (phase === 'leaderboard') {
    return (
      <div className={`space-y-6 ${className}`}>
        <Leaderboard
          entries={leaderboard}
          title="Bảng xếp hạng hiện tại"
        />
        
        <div className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            onClick={handleNextQuestion}
            disabled={isLoadingNext}
            className="gap-2 min-w-48"
          >
            {isLoadingNext ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                Tiếp tục
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (phase === 'question' && currentQuestion) {
    return (
      <div className={`space-y-6 ${className}`}>
        <QuestionDisplay
          question={currentQuestion}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          totalPlayers={playerCount}
          onTimeEnd={handleTimeEnd}
          showTimer={true}
          showOptions={true}
        />
        
        <div className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            onClick={handleNextQuestion}
            disabled={isLoadingNext}
            className="gap-2 min-w-48"
          >
            {isLoadingNext ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                Xem kết quả
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Waiting state
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-primary)] mb-4" />
      <p className="text-lg text-[var(--text-secondary)]">
        {GAME_HOST_CONSTANTS.MESSAGES.WAITING_FOR_HOST}
      </p>
    </div>
  )
}

