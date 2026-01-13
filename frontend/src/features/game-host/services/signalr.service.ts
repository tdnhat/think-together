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
  onPlayerDisconnected?: (message: PlayerDisconnectedEvent) => void
  onPlayerReconnected?: (message: PlayerReconnectedEvent) => void
  onGameStarted?: (message: GameStartedEvent) => void
  onQuestionStarted?: (message: QuestionStartedEvent) => void
  onQuestionEnded?: (message: QuestionEndedEvent) => void
  onAnswerReceived?: (message: AnswerReceivedEvent) => void
  onLeaderboardUpdated?: (message: LeaderboardUpdatedEvent) => void
  onGameEnded?: (message: GameEndedEvent) => void
  onError?: (message: ErrorEvent) => void
  onStateSynced?: (message: GameStateSyncEvent) => void
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

export interface PlayerDisconnectedEvent {
  playerId: string
  nickname: string
  totalPlayers: number
}

export interface PlayerReconnectedEvent {
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
  duration: string // TimeSpan from backend as string (e.g., "00:05:30")
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

export interface GameStateSyncEvent {
  status: string
  currentQuestionIndex: number
  totalQuestions: number
  currentQuestion: QuestionStartedEvent | null
  leaderboard: LeaderboardUpdatedEvent['leaderboard']
  totalPlayers: number
  questionEndTime: string | null
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
        if (this.isConnected()) {
          return
        }
      } catch {
        // Previous attempt failed, continue
      }
    }

    // Create connection if needed
    if (!this.connection || this.connection.state === signalR.HubConnectionState.Disconnected) {
      this.createConnection()
    }

    if (!this.connection) {
      throw new Error('Failed to create SignalR connection')
    }

    // If already connected, return
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      this.updateState('connected')
      return
    }

    // Wait if connecting/reconnecting
    if (this.connection.state === signalR.HubConnectionState.Connecting ||
      this.connection.state === signalR.HubConnectionState.Reconnecting) {
      // Wait for connection with timeout
      const maxWaitTime = 10000 // 10 seconds
      const startTime = Date.now()
      while (this.connection && 
             (this.connection.state === signalR.HubConnectionState.Connecting ||
              this.connection.state === signalR.HubConnectionState.Reconnecting) &&
             Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      if (this.isConnected() && this.connection) {
        this.updateState('connected')
        return
      }
    }

    // Start connection
    if (this.connection && this.connection.state === signalR.HubConnectionState.Disconnected) {
      this.updateState('connecting')
      try {
        this.startPromise = this.connection.start()
        await this.startPromise
        // Verify connection is still valid after start
        if (this.connection && this.isConnected()) {
          this.updateState('connected')
          console.log('[SignalR] Connected successfully')
        } else {
          throw new Error('Connection failed to establish')
        }
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
  }

  /**
   * Ensure connection is established, connecting if necessary
   */
  async ensureConnection(): Promise<void> {
    if (this.isConnected() && this.connection) {
      return
    }
    await this.connect()
    
    // Verify connection is still valid after connecting
    if (!this.connection || !this.isConnected()) {
      throw new Error('Failed to establish SignalR connection')
    }
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
    if (!this.connection) {
      throw new Error('SignalR connection is not available')
    }
    await this.connection.invoke('JoinAsHost', gameSessionId, pin)
  }

  // =============================================================================
  // HUB METHODS (Player)
  // =============================================================================

  /**
   * Join a game as a player
   */
  async joinGame(pin: string, nickname: string): Promise<void> {
    await this.ensureConnection()
    if (!this.connection) {
      throw new Error('SignalR connection is not available')
    }
    await this.connection.invoke('JoinGame', pin, nickname)
  }

  /**
   * Reconnect to a game (for returning players)
   */
  async reconnect(pin: string, playerId: string): Promise<void> {
    await this.ensureConnection()
    if (!this.connection) {
      throw new Error('SignalR connection is not available')
    }
    await this.connection.invoke('Reconnect', pin, playerId)
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
    if (!this.connection) {
      throw new Error('SignalR connection is not available')
    }
    await this.connection.invoke(
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
    if (!this.connection) {
      throw new Error('SignalR connection is not available')
    }
    await this.connection.invoke('LeaveGame', pin, playerId)
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

    this.connection.on('PlayerDisconnected', (message: PlayerDisconnectedEvent) => {
      this.events.onPlayerDisconnected?.(message)
    })

    this.connection.on('PlayerReconnected', (message: PlayerReconnectedEvent) => {
      this.events.onPlayerReconnected?.(message)
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

    this.connection.on('StateSynced', (message: GameStateSyncEvent) => {
      this.events.onStateSynced?.(message)
    })

    this.connection.on('Ping', () => {
      // Heartbeat received from server - connection is alive
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

