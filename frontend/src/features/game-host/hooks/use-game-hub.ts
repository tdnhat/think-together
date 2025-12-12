/**
 * Game Hub Hook
 * 
 * SignalR hook for real-time game communication.
 * Handles connection, events, and reconnection logic.
 */

'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import * as signalR from '@microsoft/signalr'
import { env } from '@/config/env'
import type {
  PlayerJoinedMessage,
  PlayerLeftMessage,
  LobbyUpdatedMessage,
  GameStartedMessage,
  QuestionStartedMessage,
  QuestionEndedMessage,
  AnswerReceivedMessage,
  LeaderboardUpdatedMessage,
  GameEndedMessage,
  ErrorMessage,
} from '../types'

// =============================================================================
// TYPES
// =============================================================================

export interface GameHubCallbacks {
  onPlayerJoined?: (message: PlayerJoinedMessage) => void
  onPlayerLeft?: (message: PlayerLeftMessage) => void
  onLobbyUpdated?: (message: LobbyUpdatedMessage) => void
  onGameStarted?: (message: GameStartedMessage) => void
  onQuestionStarted?: (message: QuestionStartedMessage) => void
  onQuestionEnded?: (message: QuestionEndedMessage) => void
  onAnswerReceived?: (message: AnswerReceivedMessage) => void
  onLeaderboardUpdated?: (message: LeaderboardUpdatedMessage) => void
  onGameEnded?: (message: GameEndedMessage) => void
  onError?: (message: ErrorMessage) => void
  onConnected?: () => void
  onDisconnected?: () => void
  onReconnecting?: () => void
  onReconnected?: () => void
}

export interface GameHubState {
  isConnected: boolean
  isConnecting: boolean
  connectionId: string | null
  error: string | null
}

export interface GameHubActions {
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  joinGame: (pin: string, nickname: string) => Promise<void>
  joinAsHost: (gameSessionId: string, pin: string) => Promise<void>
  reconnect: (pin: string, playerId: string) => Promise<void>
  submitAnswer: (
    gameSessionId: string,
    playerId: string,
    gameQuestionId: string,
    selectedOptionIndexes: number[],
    responseTimeMs: number
  ) => Promise<void>
  leaveGame: (pin: string, playerId: string) => Promise<void>
}

// =============================================================================
// HOOK
// =============================================================================

export function useGameHub(callbacks?: GameHubCallbacks): GameHubState & GameHubActions {
  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const callbacksRef = useRef(callbacks)
  
  const [state, setState] = useState<GameHubState>({
    isConnected: false,
    isConnecting: false,
    connectionId: null,
    error: null,
  })

  // Keep callbacks ref updated
  useEffect(() => {
    callbacksRef.current = callbacks
  }, [callbacks])

  // Build hub URL
  const hubUrl = `${env.socketUrl}/hubs/game`

  // Create connection
  const createConnection = useCallback(() => {
    // Return existing connection if available and connected
    if (connectionRef.current && 
        connectionRef.current.state === signalR.HubConnectionState.Connected) {
      return connectionRef.current
    }

    // Clean up disconnected connection
    if (connectionRef.current) {
      connectionRef.current.stop().catch(() => {
        // Ignore errors when stopping disconnected connection
      })
      connectionRef.current = null
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        skipNegotiation: false,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff: 0, 2s, 4s, 8s, max 30s
          if (retryContext.elapsedMilliseconds > 60000) {
            return null // Stop retrying after 1 minute
          }
          return Math.min(2000 * Math.pow(2, retryContext.previousRetryCount), 30000)
        }
      })
      .configureLogging(env.isDevelopment ? signalR.LogLevel.Information : signalR.LogLevel.Warning)
      .build()

    // Register event handlers
    connection.on('PlayerJoined', (message: PlayerJoinedMessage) => {
      callbacksRef.current?.onPlayerJoined?.(message)
    })

    connection.on('PlayerLeft', (message: PlayerLeftMessage) => {
      callbacksRef.current?.onPlayerLeft?.(message)
    })

    connection.on('LobbyUpdated', (message: LobbyUpdatedMessage) => {
      callbacksRef.current?.onLobbyUpdated?.(message)
    })

    connection.on('GameStarted', (message: GameStartedMessage) => {
      callbacksRef.current?.onGameStarted?.(message)
    })

    connection.on('QuestionStarted', (message: QuestionStartedMessage) => {
      callbacksRef.current?.onQuestionStarted?.(message)
    })

    connection.on('QuestionEnded', (message: QuestionEndedMessage) => {
      callbacksRef.current?.onQuestionEnded?.(message)
    })

    connection.on('AnswerReceived', (message: AnswerReceivedMessage) => {
      callbacksRef.current?.onAnswerReceived?.(message)
    })

    connection.on('LeaderboardUpdated', (message: LeaderboardUpdatedMessage) => {
      callbacksRef.current?.onLeaderboardUpdated?.(message)
    })

    connection.on('GameEnded', (message: GameEndedMessage) => {
      callbacksRef.current?.onGameEnded?.(message)
    })

    connection.on('Error', (message: ErrorMessage) => {
      callbacksRef.current?.onError?.(message)
      setState(prev => ({ ...prev, error: message.message }))
    })

    // Connection state handlers
    connection.onclose(() => {
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionId: null,
      }))
      callbacksRef.current?.onDisconnected?.()
    })

    connection.onreconnecting(() => {
      setState(prev => ({ ...prev, isConnected: false, isConnecting: true }))
      callbacksRef.current?.onReconnecting?.()
    })

    connection.onreconnected((connectionId) => {
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        connectionId: connectionId || null,
      }))
      callbacksRef.current?.onReconnected?.()
    })

    connectionRef.current = connection
    return connection
  }, [hubUrl])

  // Helper to wait for connection state
  const waitForConnectionState = useCallback((
    conn: signalR.HubConnection,
    timeoutMs: number
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Kết nối quá thời gian chờ'))
      }, timeoutMs)

      const checkConnection = () => {
        const state = conn.state
        
        if (state === signalR.HubConnectionState.Connected) {
          clearTimeout(timeout)
          setState(prev => ({
            ...prev,
            isConnected: true,
            isConnecting: false,
            connectionId: conn.connectionId,
          }))
          resolve()
        } else if (state === signalR.HubConnectionState.Disconnected) {
          clearTimeout(timeout)
          reject(new Error('Kết nối thất bại'))
        } else {
          setTimeout(checkConnection, 100)
        }
      }

      checkConnection()
    })
  }, [])

  // Connect to hub
  const connect = useCallback(async () => {
    const connection = createConnection()

    // If already connected, return immediately
    if (connection.state === signalR.HubConnectionState.Connected) {
      setState(prev => ({
        ...prev,
        isConnected: true,
        connectionId: connection.connectionId,
      }))
      return
    }

    // If already connecting, wait for it
    if (connection.state === signalR.HubConnectionState.Connecting) {
      // Wait for connection to complete (max 15 seconds)
      return waitForConnectionState(connection, 15000)
    }

    // If disconnecting, wait for it to finish
    if (connection.state === signalR.HubConnectionState.Disconnecting) {
      await new Promise<void>((resolve) => {
        const checkDisconnection = () => {
          if (connection.state === signalR.HubConnectionState.Disconnected) {
            resolve()
          } else {
            setTimeout(checkDisconnection, 100)
          }
        }
        checkDisconnection()
      })
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }))

    try {
      await connection.start()
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        connectionId: connection.connectionId,
      }))
      callbacksRef.current?.onConnected?.()
    } catch (error) {
      console.error('GameHub connection failed:', error)
      
      let errorMessage = 'Không thể kết nối đến máy chủ'
      if (error instanceof Error) {
        if (error.message.includes('negotiation') || error.message.includes('stopped during negotiation')) {
          errorMessage = 'Kết nối bị gián đoạn trong quá trình đàm phán. Vui lòng thử lại.'
        } else if (error.message.includes('404')) {
          errorMessage = 'Không tìm thấy điểm kết nối game hub'
        } else {
          errorMessage = error.message
        }
      }
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [createConnection, waitForConnectionState])

  // Disconnect from hub
  const disconnect = useCallback(async () => {
    const connection = connectionRef.current
    if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
      await connection.stop()
    }
    connectionRef.current = null
    setState({
      isConnected: false,
      isConnecting: false,
      connectionId: null,
      error: null,
    })
  }, [])

  // Helper to ensure connection is ready
  const ensureConnected = useCallback(async (): Promise<signalR.HubConnection> => {
    const connection = connectionRef.current
    if (!connection) {
      throw new Error('Chưa kết nối đến máy chủ')
    }

    if (connection.state === signalR.HubConnectionState.Connected) {
      return connection
    }

    if (connection.state === signalR.HubConnectionState.Connecting) {
      // Wait for connection
      await waitForConnectionState(connection, 10000)
      return connection
    }

    // Try to start if disconnected
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      await connection.start()
      return connection
    }

    throw new Error('Kết nối không sẵn sàng')
  }, [waitForConnectionState])

  // Join game as player
  const joinGame = useCallback(async (pin: string, nickname: string) => {
    const connection = await ensureConnected()
    await connection.invoke('JoinGame', pin, nickname)
  }, [ensureConnected])

  // Join as host
  const joinAsHost = useCallback(async (gameSessionId: string, pin: string) => {
    const connection = await ensureConnected()
    await connection.invoke('JoinAsHost', gameSessionId, pin)
  }, [ensureConnected])

  // Reconnect player
  const reconnect = useCallback(async (pin: string, playerId: string) => {
    const connection = await ensureConnected()
    await connection.invoke('Reconnect', pin, playerId)
  }, [ensureConnected])

  // Submit answer
  const submitAnswer = useCallback(async (
    gameSessionId: string,
    playerId: string,
    gameQuestionId: string,
    selectedOptionIndexes: number[],
    responseTimeMs: number
  ) => {
    const connection = await ensureConnected()
    await connection.invoke(
      'SubmitAnswer',
      gameSessionId,
      playerId,
      gameQuestionId,
      selectedOptionIndexes,
      responseTimeMs
    )
  }, [ensureConnected])

  // Leave game
  const leaveGame = useCallback(async (pin: string, playerId: string) => {
    const connection = connectionRef.current
    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
      return
    }
    await connection.invoke('LeaveGame', pin, playerId)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const connection = connectionRef.current
      if (connection) {
        if (connection.state !== signalR.HubConnectionState.Connecting) {
          connection.stop().catch(err => {
            if (env.isDevelopment) {
              console.warn('[GameHub] Error stopping connection during cleanup:', err)
            }
          })
        }
        connectionRef.current = null
      }
    }
  }, [])

  return {
    ...state,
    connect,
    disconnect,
    joinGame,
    joinAsHost,
    reconnect,
    submitAnswer,
    leaveGame,
  }
}
