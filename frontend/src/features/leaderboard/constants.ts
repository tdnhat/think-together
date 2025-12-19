/**
 * Leaderboard Feature Constants
 * Messages, limits, and default values for leaderboard feature
 */

export const LEADERBOARD_CONSTANTS = {
  MESSAGES: {
    // Success messages
    LOAD_SUCCESS: 'Đã tải bảng xếp hạng thành công',

    // Error messages
    LOAD_FAILED: 'Không thể tải bảng xếp hạng',
    EMPTY_LEADERBOARD: 'Chưa có dữ liệu xếp hạng',
    EMPTY_LEADERBOARD_DESCRIPTION: 'Hãy hoàn thành một bài kiểm tra để xuất hiện trên bảng xếp hạng',

    // Filter messages
    NO_RESULTS: 'Không tìm thấy kết quả phù hợp',
  },

  LIMITS: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },

  // Time period options
  TIME_PERIODS: {
    TODAY: 'today',
    WEEK: 'week',
    MONTH: 'month',
    ALL: 'all',
  } as const,

  // Sort options
  SORT_OPTIONS: {
    SCORE: 'score',
    ACCURACY: 'accuracy',
    TIME: 'time',
    COMPLETED_AT: 'completedAt',
  } as const,

  // Sort order options
  SORT_ORDER: {
    ASC: 'asc',
    DESC: 'desc',
  } as const,
} as const

// Leaderboard column headers
export const LEADERBOARD_HEADERS = {
  RANK: 'Xếp hạng',
  NICKNAME: 'Tên',
  SCORE: 'Điểm',
  CORRECT_ANSWERS: 'Câu đúng',
  ACCURACY: 'Độ chính xác',
  TIME: 'Thời gian',
  COMPLETED_AT: 'Hoàn thành lúc',
  QUIZ_SET: 'Bộ câu hỏi',
} as const

// Time period labels
export const TIME_PERIOD_LABELS: Record<string, string> = {
  today: 'Hôm nay',
  week: 'Tuần này',
  month: 'Tháng này',
  all: 'Tất cả',
}

// Sort option labels
export const SORT_OPTION_LABELS: Record<string, string> = {
  score: 'Điểm số',
  accuracy: 'Độ chính xác',
  time: 'Thời gian',
  completedAt: 'Ngày hoàn thành',
}
