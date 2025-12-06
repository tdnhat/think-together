/**
 * Game Player Constants
 */

export const GAME_PLAYER_CONSTANTS = {
  LOCAL_STORAGE_KEY: 'player_game_session',
  
  MESSAGES: {
    JOINING: 'Đang tham gia trò chơi...',
    JOINED: 'Đã tham gia thành công!',
    WAITING_FOR_HOST: 'Đang chờ chủ phòng bắt đầu...',
    GAME_STARTED: 'Trò chơi đã bắt đầu!',
    SUBMITTING: 'Đang gửi câu trả lời...',
    SUBMITTED: 'Đã gửi câu trả lời!',
    WAITING_FOR_RESULT: 'Đang chờ kết quả...',
    WAITING_FOR_NEXT: 'Đang chờ câu hỏi tiếp theo...',
    GAME_ENDED: 'Trò chơi đã kết thúc!',
    CONNECTING: 'Đang kết nối...',
    CONNECTED: 'Đã kết nối!',
    DISCONNECTED: 'Mất kết nối',
    RECONNECTING: 'Đang kết nối lại...',
    RECONNECTED: 'Đã kết nối lại!',
    CORRECT_ANSWER: 'Chính xác!',
    WRONG_ANSWER: 'Chưa đúng',
  },

  ERRORS: {
    INVALID_PIN: 'Mã PIN không hợp lệ. Vui lòng kiểm tra lại.',
    GAME_NOT_FOUND: 'Không tìm thấy trò chơi với mã PIN này',
    GAME_ALREADY_STARTED: 'Trò chơi đã bắt đầu, không thể tham gia',
    NICKNAME_REQUIRED: 'Vui lòng nhập tên của bạn',
    NICKNAME_TAKEN: 'Tên này đã được sử dụng, vui lòng chọn tên khác',
    CONNECTION_FAILED: 'Không thể kết nối đến máy chủ',
    JOIN_FAILED: 'Không thể tham gia trò chơi',
    SUBMIT_FAILED: 'Không thể gửi câu trả lời',
    TIME_UP: 'Hết thời gian!',
  },

  VALIDATION: {
    PIN_LENGTH: 6,
    PIN_PATTERN: /^\d{6}$/,
    NICKNAME_MIN_LENGTH: 2,
    NICKNAME_MAX_LENGTH: 20,
  },

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
} as const

