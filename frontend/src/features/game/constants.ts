/**
 * Shared Game Constants
 * Used by both game-host and game-player features
 */

export const GAME_CONSTANTS = {
    TIMER: {
        WARNING_THRESHOLD: 5, // seconds
        DANGER_THRESHOLD: 3, // seconds
    },

    ANSWER_COLORS: [
        { bg: 'bg-red-500', hover: 'hover:bg-red-600', active: 'bg-red-600', text: 'text-white', ring: 'ring-red-300' },
        { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', active: 'bg-blue-600', text: 'text-white', ring: 'ring-blue-300' },
        { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', active: 'bg-yellow-600', text: 'text-black', ring: 'ring-yellow-300' },
        { bg: 'bg-green-500', hover: 'hover:bg-green-600', active: 'bg-green-600', text: 'text-white', ring: 'ring-green-300' },
        { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', active: 'bg-purple-600', text: 'text-white', ring: 'ring-purple-300' },
        { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', active: 'bg-orange-600', text: 'text-white', ring: 'ring-orange-300' },
    ],

    ANSWER_SHAPES: ['triangle', 'diamond', 'circle', 'square', 'pentagon', 'hexagon'],
} as const
