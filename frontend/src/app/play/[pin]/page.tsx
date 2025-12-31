'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  PlayerGameScreen,
  PlayerPageLoading,
  PlayerPageError,
  PlayerPageHeader,
  usePlayerGameStore,
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

  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Validate session on mount
  useEffect(() => {
    // Check if we have stored session info for this PIN
    if (storedPin !== pin || !storedPlayerId || !storedNickname) {
      // No valid session, redirect to join page
      router.replace(`${ROUTES.game.join}?pin=${pin}`)
      return
    }

    // We have valid stored data
    setIsValid(true)
    setIsLoading(false)
  }, [pin, storedPin, storedPlayerId, storedNickname, router])

  const handleGoBack = () => {
    reset()
    router.push(ROUTES.game.join)
  }

  // Loading state
  if (isLoading) {
    return <PlayerPageLoading />
  }

  // Not valid - redirect will happen
  if (!isValid) {
    return <PlayerPageLoading />
  }

  // Valid session, show game screen
  if (!storedPin || !storedPlayerId || !storedNickname || !storedSessionId) {
    return <PlayerPageLoading />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
