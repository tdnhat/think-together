/**
 * Player Game Screen (v2)
 *
 * Main screen component for game player.
 * Uses the new usePlayerGame hook for all logic.
 */

'use client'

import { Loader2 } from 'lucide-react'
import { PlayerWaiting } from './player-waiting'
import { PlayerQuestion } from './player-question'
import { PlayerResults } from './player-results'
import { PlayerFinalResult } from './player-final-result'
import { usePlayerGame } from '../hooks/use-player-game'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import type { QuestionStartedMessage } from '@/features/game-host/types'

interface PlayerGameScreenProps {
  pin: string
  playerId: string
  nickname: string
  sessionId: string
  className?: string
}

export function PlayerGameScreen({
  pin,
  playerId,
  nickname,
  sessionId,
  className = '',
}: Readonly<PlayerGameScreenProps>) {
  const {
    phase,
    currentQuestion,
    selectedAnswers,
    hasAnswered,
    leaderboard,
    totalQuestions,
    isSubmitting,
    selectAnswer,
    setSelectedAnswers,
    submitAnswer,
  } = usePlayerGame({ pin, playerId, nickname, sessionId })

  // Debug logging
  console.log('[PlayerScreen] Rendering with phase:', phase, 'question:', currentQuestion?.gameQuestionId)

  // Render: Game Ended
  if (phase === 'ended') {
    return (
      <div className={className}>
        <PlayerFinalResult
          playerId={playerId}
          nickname={nickname}
          leaderboard={leaderboard}
          totalQuestions={totalQuestions}
        />
      </div>
    )
  }

  // Render: Leaderboard between questions
  if (phase === 'leaderboard' && leaderboard.length > 0) {
    return (
      <div className={className}>
        <PlayerResults playerId={playerId} leaderboard={leaderboard} />
      </div>
    )
  }

  // Render: Question (includes 'answered' state - player stays on question until leaderboard)
  if ((phase === 'question' || phase === 'answered') && currentQuestion) {
    // Cast to QuestionStartedMessage - they have the same structure
    const questionMessage: QuestionStartedMessage = {
      gameQuestionId: currentQuestion.gameQuestionId,
      questionId: currentQuestion.questionId,
      content: currentQuestion.content,
      questionType: currentQuestion.questionType,
      timeLimit: currentQuestion.timeLimit,
      endTime: currentQuestion.endTime,
      positionInGame: currentQuestion.positionInGame,
      totalQuestions: currentQuestion.totalQuestions,
      videoUrl: currentQuestion.videoUrl,
      videoTimestamp: currentQuestion.videoTimestamp,
      audioUrl: currentQuestion.audioUrl,
      audioTimestamp: currentQuestion.audioTimestamp,
      options: currentQuestion.options,
      matchingLeft: currentQuestion.matchingLeft,
      matchingRight: currentQuestion.matchingRight,
      orderingItems: currentQuestion.orderingItems,
    }

    return (
      <div className={className}>
        <PlayerQuestion
          question={questionMessage}
          selectedAnswers={selectedAnswers}
          hasAnswered={hasAnswered}
          onSelectAnswer={selectAnswer}
          onSetSelectedAnswers={setSelectedAnswers}
          onSubmit={submitAnswer}
          isSubmitting={isSubmitting}
        />
      </div>
    )
  }

  // Render: Starting (brief transition)
  if (phase === 'starting') {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">
          {GAME_PLAYER_CONSTANTS.MESSAGES.GAME_STARTED}
        </p>
      </div>
    )
  }

  // Render: Lobby / Waiting
  return (
    <div className={className}>
      <PlayerWaiting nickname={nickname} pin={pin} />
    </div>
  )
}

