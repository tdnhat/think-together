/**
 * Host Game Screen (v2)
 *
 * Main screen component for game host.
 * Uses the new useHostGame hook for all logic.
 */

'use client'

import { useCallback, useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { QuestionDisplay } from './question-display'
import { Leaderboard } from './leaderboard'
import { GameEnded } from './game-ended'
import { toastInfo } from '@/lib/utils/toast'
import { GAME_HOST_CONSTANTS } from '../constants'
import { useHostGame } from '../hooks/use-host-game'
import type { GameSession, GameEndedMessage } from '../types'

interface HostGameScreenProps {
  session: GameSession
  className?: string
}

export function HostGameScreen({
  session: initialSession,
  className = '',
}: Readonly<HostGameScreenProps>) {
  const [isLoadingNext, setIsLoadingNext] = useState(false)

  const {
    session,
    phase,
    currentQuestion,
    leaderboard,
    answeredCount,
    totalPlayers,
    showLeaderboard,
    nextQuestion,
  } = useHostGame({ sessionId: initialSession.id })

  // Use passed session if store doesn't have one yet
  const activeSession = session || initialSession

  // Initialize by resuming the session
  // This happens in useHostGame via sessionId option

  /**
   * Handle navigation through game flow
   * Question → Leaderboard → Next Question
   */
  const handleNextQuestion = useCallback(async () => {
    // If on question phase, show leaderboard first
    if (phase === 'question') {
      showLeaderboard()
      return
    }

    // If on leaderboard, move to next question
    setIsLoadingNext(true)
    try {
      await nextQuestion()
    } finally {
      setIsLoadingNext(false)
    }
  }, [phase, showLeaderboard, nextQuestion])

  const handleTimeEnd = useCallback(() => {
    toastInfo('Hết thời gian! Hãy nhấn "Xem kết quả" để tiếp tục.')
  }, [])

  const handlePlayAgain = useCallback(() => {
    globalThis.window.location.reload()
  }, [])

  const playerCount = activeSession?.players.length || totalPlayers || 0
  const questionCount = activeSession?.totalQuestions || 0

  // Render: Game Ended
  if (phase === 'ended') {
    const endedMessage: GameEndedMessage = {
      gameSessionId: activeSession.id,
      totalQuestions: questionCount,
      totalPlayers: playerCount,
      duration: '0:00',
      finalLeaderboard: leaderboard,
    }

    return (
      <div className={className}>
        <GameEnded result={endedMessage} onPlayAgain={handlePlayAgain} />
      </div>
    )
  }

  // Render: Leaderboard between questions
  if (phase === 'leaderboard') {
    return (
      <div className={`space-y-6 ${className}`}>
        <Leaderboard entries={leaderboard} title="Bảng xếp hạng hiện tại" />

        <div className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            onClick={handleNextQuestion}
            disabled={isLoadingNext}
          >
            {isLoadingNext ? (
              <>
                <Loader2 className="animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                Tiếp tục
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Render: Question
  if (phase === 'question' && currentQuestion) {
    return (
      <div className={`space-y-6 ${className}`}>
        <QuestionDisplay
          question={currentQuestion}
          totalQuestions={questionCount}
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
          >
            {isLoadingNext ? (
              <>
                <Loader2 className="animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                Xem kết quả
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">
        {GAME_HOST_CONSTANTS.MESSAGES.WAITING_FOR_HOST}
      </p>
    </div>
  )
}

