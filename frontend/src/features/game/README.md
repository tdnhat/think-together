# Game Feature Module

This module handles all game session-related functionality for the ThinkTogether quiz platform.

## Structure

```
game/
├── api/                    # API service layer
│   └── game.service.ts    # Game session API calls
├── store/                 # Zustand state management
│   └── game.store.ts      # Game store with selectors
├── types/                 # Game-specific TypeScript types
│   └── index.ts           # Game session types
└── index.ts               # Public API exports
```

## Public API

```typescript
// Store & Selectors
import {
  useGameStore,
  selectSession,
  selectIsHost,
  selectCurrentQuestion,
  selectLeaderboard,
  selectTimeRemaining,
  selectIsConnected,
  selectGameActions
} from '@/features/game'

// API Service
import { gameService } from '@/features/game'

// Types
import type {
  Player,
  Question,
  GameSession,
  GameState,
  PlayerAnswer,
  GameResult
} from '@/features/game'
```

## Usage Examples

### Managing Game State

```typescript
import { useGameStore, selectSession, selectGameActions } from '@/features/game'

function GameHost() {
  const session = useGameStore(selectSession)
  const { setSession, addPlayer, startGame } = useGameStore(selectGameActions)

  const createSession = async (quizId: string) => {
    const response = await gameService.createSession(quizId)
    if (response.success && response.data) {
      setSession(response.data)
    }
  }

  return <div>Game Code: {session?.code}</div>
}
```

### Leaderboard

```typescript
import { useGameStore, selectLeaderboard } from '@/features/game'

function Leaderboard() {
  const leaderboard = useGameStore(selectLeaderboard)

  return (
    <ul>
      {leaderboard.map(player => (
        <li key={player.id}>
          {player.name}: {player.score} points
        </li>
      ))}
    </ul>
  )
}
```

## Key Features

- **Session Management**: Create and join game sessions
- **Real-time State**: Track players, questions, and scores
- **Leaderboard**: Automatic score sorting
- **WebSocket Ready**: State management prepared for real-time updates
- **Host/Player Roles**: Different views for game host and players

## Architecture Decisions

### Store Design
- Actions grouped in an `actions` object
- Selectors exported for optimized re-renders
- Devtools middleware for debugging
- Designed to work with WebSocket events

### Type Safety
- Comprehensive TypeScript types for all game entities
- Player, Question, GameSession, and GameResult types
- Strong typing throughout the feature

## Future Enhancements

- WebSocket integration for real-time updates
- Game components (host view, player view)
- Question display and answer submission UI
- Game results and statistics

