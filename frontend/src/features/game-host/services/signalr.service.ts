/**
 * SignalR Service for Game Host
 *
 * Manages SignalR connection lifecycle and message handling.
 * Single source of truth for real-time communication.
 */

import * as signalR from '@microsoft/signalr'
import { env } from '@/config/env'

// =============================================================================
// TYPES
// =============================================================================

export interface SignalRConfig {
  hubUrl: string
  reconnectPolicy?: {
    maxRetries: number
    retryDelayMs: number
    maxRetryDelayMs: number
  }
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'

export interface SignalREvents {
  onStateChange?: (state: ConnectionState) => void
  onPlayerJoined?: (message: PlayerJoinedEvent) => void
  onPlayerLeft?: (message: PlayerLeftEvent) => void
  onGameStarted?: (message: GameStartedEvent) => void
  onQuestionStarted?: (message: QuestionStartedEvent) => void
  onQuestionEnded?: (message: QuestionEndedEvent) => void
  onAnswerReceived?: (message: AnswerReceivedEvent) => void
  onLeaderboardUpdated?: (message: LeaderboardUpdatedEvent) => void
  onGameEnded?: (message: GameEndedEvent) => void
  onError?: (message: ErrorEvent) => void
}

// Event types matching backend IGameHubClient
export interface PlayerJoinedEvent {
  playerId: string
  nickname: string
  totalPlayers: number
}

export interface PlayerLeftEvent {
  playerId: string
  nickname: string
  totalPlayers: number
}

export interface GameStartedEvent {
  gameSessionId: string
  totalQuestions: number
  totalPlayers: number
}

export interface QuestionStartedEvent {
  gameQuestionId: string
  questionId: string
  content: string
  questionType: string
  timeLimit: number
  endTime: string
  positionInGame: number
  totalQuestions: number
  videoUrl: string | null
  videoTimestamp: number | null
  options: Array<{ index: number; content: string; imageUrl: string | null }>
}

export interface QuestionEndedEvent {
  gameQuestionId: string
  correctOptionIndexes: number[]
  correctAnswerCount: number
  wrongAnswerCount: number
  topPlayers: Array<{
    playerId: string
    nickname: string
    totalPoints: number
    correctAnswers: number
    rank: number
  }>
}

export interface AnswerReceivedEvent {
  playerId: string
  answeredCount: number
  totalPlayers: number
}

export interface LeaderboardUpdatedEvent {
  leaderboard: Array<{
    playerId: string
    nickname: string
    totalPoints: number
    correctAnswers: number
    rank: number
  }>
}

export interface GameEndedEvent {
  gameSessionId: string
  totalQuestions: number
  totalPlayers: number
  duration: string
  finalLeaderboard: Array<{
    playerId: string
    nickname: string
    totalPoints: number
    correctAnswers: number
    rank: number
  }>
}

export interface ErrorEvent {
  code: string
  message: string
}

// =============================================================================
// SIGNALR SERVICE CLASS
// =============================================================================

const DEFAULT_CONFIG: SignalRConfig = {
  hubUrl: `${env.socketUrl}/hubs/game`,
  reconnectPolicy: {
    maxRetries: 5,
    retryDelayMs: 2000,
    maxRetryDelayMs: 30000,
  },
}

class GameSignalRService {
  private connection: signalR.HubConnection | null = null
  private events: SignalREvents = {}
  private config: SignalRConfig = DEFAULT_CONFIG
  private connectionState: ConnectionState = 'disconnected'
  private startPromise: Promise<void> | null = null

  // =============================================================================
  // CONNECTION MANAGEMENT
  // =============================================================================

  /**
   * Initialize and start the SignalR connection
   */
  async connect(events?: SignalREvents): Promise<void> {
    if (events) {
      this.events = events
    }

    // Already connected
    if (this.isConnected()) {
      this.updateState('connected')
      return
    }

    // Already connecting - wait for it
    if (this.startPromise) {
      try {
        await this.startPromise
        // After waiting, check again (connection state may have changed)
        if (this.isConnected()) {
          return
        }
      } catch {
        // Previous connection attempt failed, continue to try again
      }
    }

    // Create new connection if needed or if connection is null/disconnected
    if (!this.connection || this.connection.state === signalR.HubConnectionState.Disconnected) {
      this.createConnection()
    }

    // After createConnection, connection should not be null
    if (!this.connection) {
      throw new Error('Failed to create SignalR connection')
    }

    // Handle different connection states
    let connectionState = this.connection.state

    // If already connected, we're good
    if (connectionState === signalR.HubConnectionState.Connected) {
      this.updateState('connected')
      return
    }

    // If connecting/reconnecting, wait a bit for state to settle
    if (connectionState === signalR.HubConnectionState.Connecting ||
        connectionState === signalR.HubConnectionState.Reconnecting) {
      await new Promise(resolve => setTimeout(resolve, 500))

      // Check again
      if (this.isConnected()) {
        this.updateState('connected')
        return
      }
      connectionState = this.connection.state
    }

    // If disconnecting, wait for it to complete
    if (connectionState === signalR.HubConnectionState.Disconnecting) {
      await new Promise(resolve => setTimeout(resolve, 200))
      connectionState = this.connection.state
    }

    // If still not in disconnected or connected state, recreate connection
    if (connectionState !== signalR.HubConnectionState.Disconnected &&
        connectionState !== signalR.HubConnectionState.Connected) {
      console.warn(`[SignalR] Recreating connection from state: ${connectionState}`)
      this.connection = null
      this.createConnection()

      if (!this.connection) {
        throw new Error('Failed to create SignalR connection')
      }
    }

    // If we're now connected after all the waiting, return
    if (this.isConnected()) {
      this.updateState('connected')
      return
    }

    // Only proceed if in disconnected state
    if (this.connection.state !== signalR.HubConnectionState.Disconnected) {
      console.warn(`[SignalR] Cannot start connection in state: ${this.connection.state}`)
      return
    }

    this.updateState('connecting')

    try {
      this.startPromise = this.connection.start()
      await this.startPromise
      this.updateState('connected')
      console.log('[SignalR] Connected successfully')
    } catch (error) {
      // Ignore "stopped during negotiation" errors (React strict mode)
      if (error instanceof Error && error.message.includes('stopped during negotiation')) {
        console.debug('[SignalR] Connection stopped during negotiation')
        return
      }
      this.updateState('disconnected')
      throw error
    } finally {
      this.startPromise = null
    }
  }

  /**
   * Ensure connection is established, connecting if necessary
   */
  async ensureConnection(): Promise<void> {
    if (this.isConnected()) {
      return
    }
    await this.connect()
  }

  /**
   * Disconnect from SignalR hub
   */
  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop()
      } catch (error) {
        console.debug('[SignalR] Error stopping connection:', error)
      }
      this.connection = null
      this.updateState('disconnected')
    }
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.connectionState
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected
  }

  // =============================================================================
  // HUB METHODS (Host)
  // =============================================================================

  /**
   * Join as host for a game session
   */
  async joinAsHost(gameSessionId: string, pin: string): Promise<void> {
    await this.ensureConnection()
    await this.connection!.invoke('JoinAsHost', gameSessionId, pin)
  }

  // =============================================================================
  // HUB METHODS (Player)
  // =============================================================================

  /**
   * Join a game as a player
   */
  async joinGame(pin: string, nickname: string): Promise<void> {
    await this.ensureConnection()
    await this.connection!.invoke('JoinGame', pin, nickname)
  }

  /**
   * Reconnect to a game (for returning players)
   */
  async reconnect(pin: string, playerId: string): Promise<void> {
    await this.ensureConnection()
    await this.connection!.invoke('Reconnect', pin, playerId)
  }

  /**
   * Submit an answer
   */
  async submitAnswer(
    gameSessionId: string,
    playerId: string,
    gameQuestionId: string,
    selectedOptionIndexes: number[],
    responseTimeMs: number
  ): Promise<void> {
    await this.ensureConnection()
    await this.connection!.invoke(
      'SubmitAnswer',
      gameSessionId,
      playerId,
      gameQuestionId,
      selectedOptionIndexes,
      responseTimeMs
    )
  }

  /**
   * Leave a game
   */
  async leaveGame(pin: string, playerId: string): Promise<void> {
    await this.ensureConnection()
    await this.connection!.invoke('LeaveGame', pin, playerId)
  }

  // =============================================================================
  // PRIVATE METHODS
  // =============================================================================

  private createConnection(): void {
    const { hubUrl, reconnectPolicy } = this.config

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        withCredentials: true,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (context) => {
          if (!reconnectPolicy) return null
          if (context.previousRetryCount >= reconnectPolicy.maxRetries) return null
          const delay = Math.min(
            reconnectPolicy.retryDelayMs * Math.pow(2, context.previousRetryCount),
            reconnectPolicy.maxRetryDelayMs
          )
          return delay
        },
      })
      .configureLogging(env.isDevelopment ? signalR.LogLevel.Information : signalR.LogLevel.Warning)
      .build()

    this.registerEventHandlers()
    this.registerLifecycleHandlers()
  }

  private registerEventHandlers(): void {
    if (!this.connection) return

    this.connection.on('PlayerJoined', (message: PlayerJoinedEvent) => {
      this.events.onPlayerJoined?.(message)
    })

    this.connection.on('PlayerLeft', (message: PlayerLeftEvent) => {
      this.events.onPlayerLeft?.(message)
    })

    this.connection.on('GameStarted', (message: GameStartedEvent) => {
      this.events.onGameStarted?.(message)
    })

    this.connection.on('QuestionStarted', (message: QuestionStartedEvent) => {
      this.events.onQuestionStarted?.(message)
    })

    this.connection.on('QuestionEnded', (message: QuestionEndedEvent) => {
      this.events.onQuestionEnded?.(message)
    })

    this.connection.on('AnswerReceived', (message: AnswerReceivedEvent) => {
      this.events.onAnswerReceived?.(message)
    })

    this.connection.on('LeaderboardUpdated', (message: LeaderboardUpdatedEvent) => {
      this.events.onLeaderboardUpdated?.(message)
    })

    this.connection.on('GameEnded', (message: GameEndedEvent) => {
      this.events.onGameEnded?.(message)
    })

    this.connection.on('Error', (message: ErrorEvent) => {
      this.events.onError?.(message)
    })
  }

  private registerLifecycleHandlers(): void {
    if (!this.connection) return

    this.connection.onreconnecting(() => {
      this.updateState('reconnecting')
    })

    this.connection.onreconnected(() => {
      this.updateState('connected')
    })

    this.connection.onclose(() => {
      this.updateState('disconnected')
    })
  }

  private updateState(state: ConnectionState): void {
    this.connectionState = state
    this.events.onStateChange?.(state)
  }


  /**
   * Update event handlers (useful for React component updates)
   */
  updateEvents(events: Partial<SignalREvents>): void {
    this.events = { ...this.events, ...events }
  }
}

// Export singleton instance
export const gameSignalR = new GameSignalRService()

