/**
 * Challenge Feature Constants
 * Messages, limits, and default values for challenge feature
 */

export const CHALLENGE_CONSTANTS = {
  MESSAGES: {
    // Success messages
    CREATE_SUCCESS: 'Thử thách đã được tạo thành công',
    UPDATE_SUCCESS: 'Thử thách đã được cập nhật thành công',
    DELETE_SUCCESS: 'Thử thách đã được xóa thành công',
    START_SUCCESS: 'Bắt đầu thử thách',
    COMPLETE_SUCCESS: 'Thử thách đã được hoàn thành',

    // Error messages
    CREATE_FAILED: 'Không thể tạo thử thách',
    UPDATE_FAILED: 'Không thể cập nhật thử thách',
    DELETE_FAILED: 'Không thể xóa thử thách',
    LOAD_FAILED: 'Không thể tải thử thách',
    START_FAILED: 'Không thể bắt đầu thử thách',
    SUBMIT_ANSWER_FAILED: 'Không thể gửi câu trả lời',
    COMPLETE_FAILED: 'Không thể hoàn thành thử thách',

    // Confirmations
    CONFIRM_DELETE: 'Bạn có chắc chắn muốn xóa thử thách này không?',
    CONFIRM_QUIT: 'Bạn có chắc chắn muốn thoát thử thách? Tiến trình sẽ bị mất.',

    // Timer warnings
    TIME_RUNNING_OUT: 'Thời gian sắp hết!',
    TIME_EXPIRED: 'Hết thời gian',

    // Status messages
    IN_PROGRESS: 'Đang làm',
    COMPLETED: 'Đã hoàn thành',
    ABANDONED: 'Đã bỏ dở',

    // Empty states
    NO_LEADERBOARD: 'Chưa có bài nộp nào',
    EMPTY_LEADERBOARD_DESCRIPTION: 'Hãy là người đầu tiên hoàn thành thử thách này',
  },

  LIMITS: {
    TITLE_MAX_LENGTH: 255,
    DESCRIPTION_MAX_LENGTH: 2000,
    NICKNAME_MAX_LENGTH: 100,
  },

  PLACEHOLDERS: {
    TITLE: 'Ví dụ: Kiểm tra Toán học lớp 10 - Chương 1',
    DESCRIPTION: 'Mô tả chi tiết về nội dung thử thách...',
    NICKNAME: 'Nhập tên của bạn',
  },

  // Timer defaults (in milliseconds)
  TIMER: {
    WARNING_THRESHOLD: 60000, // 1 minute warning
    CRITICAL_THRESHOLD: 10000, // 10 seconds critical
  },

  // Answer submission timeout (in milliseconds)
  SUBMIT_TIMEOUT: 10000,

  // Leaderboard
  LEADERBOARD: {
    ITEMS_PER_PAGE: 10,
    TOP_ENTRIES: 50,
  },

  // Scoring
  SCORING: {
    CORRECT_ANSWER_MULTIPLIER: 1,
    TIME_BONUS_THRESHOLD: 10000, // Give bonus if answered in 10 seconds
  },
} as const

// Challenge status labels in Vietnamese
export const CHALLENGE_STATUS_LABELS: Record<string, string> = {
  Active: 'Đang hoạt động',
  Archived: 'Đã lưu trữ',
}

// Attempt status labels in Vietnamese
export const ATTEMPT_STATUS_LABELS: Record<string, string> = {
  InProgress: 'Đang làm',
  Completed: 'Đã hoàn thành',
  Abandoned: 'Đã bỏ dở',
}

// Leaderboard column headers
export const LEADERBOARD_HEADERS = {
  RANK: 'Xếp hạng',
  NICKNAME: 'Tên',
  SCORE: 'Điểm',
  CORRECT_ANSWERS: 'Câu đúng',
  ACCURACY: 'Độ chính xác',
  TIME: 'Thời gian',
  COMPLETED_AT: 'Hoàn thành lúc',
} as const

