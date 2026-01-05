/**
 * Game Player Constants
 * 
 * Note: Validation constants (PIN_LENGTH, PIN_PATTERN, NICKNAME_MIN/MAX_LENGTH) are now available
 * in shared constants. Import from '@/shared' (SHARED_CONSTANTS.VALIDATION) for consistency.
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
    PIN_LENGTH: 6, // Also in SHARED_CONSTANTS.VALIDATION.PIN_LENGTH
    PIN_PATTERN: /^\d{6}$/, // Also in SHARED_CONSTANTS.VALIDATION.PIN_PATTERN
    NICKNAME_MIN_LENGTH: 2, // Also in SHARED_CONSTANTS.VALIDATION.NICKNAME_MIN_LENGTH
    NICKNAME_MAX_LENGTH: 20, // Note: Differs from shared (100), keep for backward compatibility
  },

} as const


