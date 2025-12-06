'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlayerGameScreen,
  PlayerPageLoading,
  PlayerPageError,
  PlayerPageHeader,
  usePlayerGameStore,
  usePlayerSession,
  selectPlayerPin,
  selectPlayerPlayerId,
  selectPlayerNickname,
  selectPlayerSessionId,
  selectPlayerActions,
} from '@/features/game-player'
import { ROUTES } from '@/config/routes'

interface PlayPageProps {
  params: Promise<{ pin: string }>
}

export default function PlayPage({ params }: Readonly<PlayPageProps>) {
  const resolvedParams = use(params)
  const router = useRouter()
  const pin = resolvedParams.pin

  const storedPin = usePlayerGameStore(selectPlayerPin)
  const storedPlayerId = usePlayerGameStore(selectPlayerPlayerId)
  const storedNickname = usePlayerGameStore(selectPlayerNickname)
  const storedSessionId = usePlayerGameStore(selectPlayerSessionId)
  const { reset } = usePlayerGameStore(selectPlayerActions)

  const { isValid, isLoading, error } = usePlayerSession({ pin })

  const handleGoBack = () => {
    reset()
    router.push(ROUTES.game.join)
  }

  // Loading state
  if (isLoading) {
    return <PlayerPageLoading />
  }

  // Error state
  if (error || !isValid) {
    return (
      <PlayerPageError 
        error={error || 'Phiên chơi không hợp lệ'} 
        onGoBack={handleGoBack}
      />
    )
  }

  // Valid session, show game screen
  if (!storedPin || !storedPlayerId || !storedNickname || !storedSessionId) {
    return <PlayerPageLoading />
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col">
      <PlayerPageHeader nickname={storedNickname} />

      <main className="flex-1 container mx-auto px-4 py-6">
        <PlayerGameScreen
          pin={storedPin}
          playerId={storedPlayerId}
          nickname={storedNickname}
          sessionId={storedSessionId}
        />
      </main>
    </div>
  )
}
