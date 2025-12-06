/**
 * Game Host Constants
 */

export const GAME_HOST_CONSTANTS = {
  STORAGE: {
    HOST_SESSION_KEY: 'host_game_session',
    SESSION_EXPIRY_MS: 2 * 60 * 60 * 1000, // 2 hours
  },
  
  MESSAGES: {
    CREATING_SESSION: 'Đang tạo phiên trò chơi...',
    SESSION_CREATED: 'Phiên trò chơi đã được tạo!',
    STARTING_GAME: 'Đang bắt đầu trò chơi...',
    GAME_STARTED: 'Trò chơi đã bắt đầu!',
    ENDING_GAME: 'Đang kết thúc trò chơi...',
    GAME_ENDED: 'Trò chơi đã kết thúc!',
    CONNECTING: 'Đang kết nối...',
    CONNECTED: 'Đã kết nối!',
    DISCONNECTED: 'Mất kết nối',
    RECONNECTING: 'Đang kết nối lại...',
    PLAYER_JOINED: 'đã tham gia',
    PLAYER_LEFT: 'đã rời khỏi',
    JOINING_GAME: 'Đang tham gia trò chơi...',
    JOINED_GAME: 'Đã tham gia trò chơi!',
    SUBMITTING_ANSWER: 'Đang gửi câu trả lời...',
    ANSWER_SUBMITTED: 'Đã gửi câu trả lời!',
    WAITING_FOR_HOST: 'Đang chờ chủ phòng...',
    WAITING_FOR_NEXT: 'Đang chờ câu hỏi tiếp theo...',
    RESUMING_SESSION: 'Đang kết nối lại phiên trò chơi...',
    SESSION_RESUMED: 'Đã kết nối lại phiên trò chơi!',
    SESSION_ABANDONED: 'Đã hủy phiên cũ',
    LOADING: 'Đang tải...',
  },

  ERRORS: {
    INVALID_PIN: 'Mã PIN không hợp lệ',
    GAME_NOT_FOUND: 'Không tìm thấy trò chơi',
    GAME_ALREADY_STARTED: 'Trò chơi đã bắt đầu',
    GAME_ALREADY_ENDED: 'Phiên trò chơi này đã kết thúc. Vui lòng tạo phiên mới.',
    GAME_IN_PROGRESS: 'Phiên trò chơi này đã bắt đầu hoặc kết thúc. Vui lòng tạo phiên mới.',
    SESSION_NOT_FOUND: 'Không tìm thấy phiên trò chơi. Vui lòng tạo phiên mới.',
    NICKNAME_TAKEN: 'Tên này đã được sử dụng',
    CONNECTION_FAILED: 'Không thể kết nối đến máy chủ',
    SUBMIT_FAILED: 'Không thể gửi câu trả lời',
    JOIN_FAILED: 'Không thể tham gia trò chơi',
    NOT_ENOUGH_QUESTIONS: 'Bộ câu hỏi chưa có câu hỏi nào',
    CREATE_SESSION_FAILED: 'Không thể tạo phiên trò chơi',
    RESUME_SESSION_FAILED: 'Không thể kết nối lại phiên trò chơi',
    ABANDON_SESSION_FAILED: 'Không thể hủy phiên cũ',
    PIN_REQUIRED: 'Vui lòng nhập mã PIN gồm 6 chữ số',
    PIN_NOT_FOUND: 'Không tìm thấy phiên trò chơi với mã PIN này',
  },

  PIN_DISPLAY: {
    COPY_SUCCESS: 'Đã sao chép mã PIN!',
    COPY_FAILED: 'Không thể sao chép mã PIN',
    PIN_LENGTH: 6,
  },

  TIMER: {
    WARNING_THRESHOLD: 5, // seconds
    DANGER_THRESHOLD: 3, // seconds
  },

  ANSWER_COLORS: [
    { bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-white' },
    { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-white' },
    { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-black' },
    { bg: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-white' },
    { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', text: 'text-white' },
    { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', text: 'text-white' },
  ],

  ANSWER_SHAPES: ['triangle', 'diamond', 'circle', 'square', 'pentagon', 'hexagon'],
} as const

