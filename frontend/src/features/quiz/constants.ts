/**
 * Quiz Feature Constants
 * 
 * All constants for quiz sets and questions.
 */

import { QuestionType } from '@/types/api'

export const QUIZ_SET_CONSTANTS = {
  MESSAGES: {
    CREATE_SUCCESS: 'Bộ trắc nghiệm đã được tạo thành công',
    UPDATE_SUCCESS: 'Bộ trắc nghiệm đã được cập nhật thành công',
    DELETE_SUCCESS: 'Bộ trắc nghiệm đã được xóa thành công',
    PUBLISH_SUCCESS: 'Bộ trắc nghiệm đã được xuất bản thành công',
    CREATE_FAILED: 'Không thể tạo bộ trắc nghiệm',
    UPDATE_FAILED: 'Không thể cập nhật bộ trắc nghiệm',
    DELETE_FAILED: 'Không thể xóa bộ trắc nghiệm',
    PUBLISH_FAILED: 'Không thể xuất bản bộ trắc nghiệm',
    LOAD_FAILED: 'Không thể tải danh sách bộ trắc nghiệm',
    CONFIRM_DELETE: 'Bạn có chắc chắn muốn xóa bộ trắc nghiệm này không?',
    CONFIRM_PUBLISH: 'Xuất bản bộ trắc nghiệm sẽ cho phép người khác sử dụng. Bạn có muốn tiếp tục?',
    EMPTY_STATE_TITLE: 'Chưa có bộ trắc nghiệm nào',
    EMPTY_STATE_DESCRIPTION: 'Tạo bộ trắc nghiệm đầu tiên để bắt đầu hành trình giảng dạy của bạn',
    CREATE_FIRST_QUIZ: 'Tạo bộ trắc nghiệm đầu tiên',
  },

  LIMITS: {
    TITLE_MAX_LENGTH: 255,
    DESCRIPTION_MAX_LENGTH: 2000,
    TITLE_MIN_LENGTH: 1,
  },

  PLACEHOLDERS: {
    TITLE: 'Ví dụ: Bài kiểm tra Toán học lớp 10',
    DESCRIPTION: 'Mô tả ngắn gọn về nội dung bộ trắc nghiệm...',
  },

  DEFAULTS: {
    COVER_IMAGE: '/images/quiz-default-cover.png',
  },
} as const

export const QUESTION_CONSTANTS = {
  // Time limits (in seconds)
  TIME_LIMITS: {
    MIN: 5,
    MAX: 300,
    DEFAULT: 30,
    PRESETS: [10, 20, 30, 45, 60, 90, 120],
  },

  // Question counts
  COUNTS: {
    MIN_OPTIONS: 2,
    MAX_OPTIONS: 6,
    MIN_MATCHING_PAIRS: 2,
    MAX_MATCHING_PAIRS: 5,
    MIN_ORDERING_ITEMS: 3,
    MAX_ORDERING_ITEMS: 6,
  },

  // Content limits
  LIMITS: {
    CONTENT_MAX_LENGTH: 2000,
    OPTION_MAX_LENGTH: 1000,
    MATCHING_ITEM_MAX_LENGTH: 500,
    ORDERING_ITEM_MAX_LENGTH: 500,
  },

  // Question types with metadata
  TYPES: {
    [QuestionType.SINGLE_CHOICE]: {
      label: 'Một lựa chọn',
      description: 'Chọn một đáp án đúng từ nhiều lựa chọn',
      icon: 'CircleDot',
      minOptions: 2,
      maxOptions: 6,
    },
    [QuestionType.TRUE_FALSE]: {
      label: 'Đúng/Sai',
      description: 'Câu hỏi với hai lựa chọn: Đúng hoặc Sai',
      icon: 'CheckCircle',
      minOptions: 2,
      maxOptions: 2,
    },
    [QuestionType.MULTIPLE_CHOICE]: {
      label: 'Nhiều lựa chọn',
      description: 'Chọn nhiều đáp án đúng từ các lựa chọn',
      icon: 'CheckSquare',
      minOptions: 2,
      maxOptions: 6,
    },
    [QuestionType.MATCHING]: {
      label: 'Ghép cặp',
      description: 'Ghép các mục bên trái với mục bên phải',
      icon: 'Link',
      minPairs: 2,
      maxPairs: 5,
    },
    [QuestionType.ORDERING]: {
      label: 'Sắp xếp',
      description: 'Sắp xếp các mục theo thứ tự đúng',
      icon: 'ArrowUpDown',
      minItems: 3,
      maxItems: 6,
    },
    [QuestionType.VIDEO]: {
      label: 'Video',
      description: 'Câu hỏi dựa trên video với dấu thời gian',
      icon: 'Video',
      maxDuration: 120, // seconds
    },
    [QuestionType.AUDIO]: {
      label: 'Âm thanh',
      description: 'Câu hỏi dựa trên audio với dấu thời gian',
      icon: 'Volume2',
    },
  },

  // Messages
  MESSAGES: {
    CREATE_SUCCESS: 'Câu hỏi đã được tạo thành công',
    CREATE_FAILED: 'Không thể tạo câu hỏi',
    UPDATE_SUCCESS: 'Câu hỏi đã được cập nhật thành công',
    UPDATE_FAILED: 'Không thể cập nhật câu hỏi',
    DELETE_SUCCESS: 'Câu hỏi đã được xóa thành công',
    DELETE_FAILED: 'Không thể xóa câu hỏi',
    DUPLICATE_SUCCESS: 'Câu hỏi đã được sao chép thành công',
    DUPLICATE_FAILED: 'Không thể sao chép câu hỏi',
    REORDER_SUCCESS: 'Thứ tự câu hỏi đã được cập nhật',
    REORDER_FAILED: 'Không thể cập nhật thứ tự câu hỏi',
    EMPTY_STATE_TITLE: 'Chưa có câu hỏi nào',
    EMPTY_STATE_DESCRIPTION: 'Bắt đầu tạo câu hỏi đầu tiên cho bộ trắc nghiệm của bạn',
    CREATE_FIRST_QUESTION: 'Tạo câu hỏi đầu tiên',
    DELETE_CONFIRM: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
    DELETE_CONFIRM_DESCRIPTION: 'Hành động này không thể hoàn tác.',
  },

  // Validation messages
  VALIDATION: {
    CONTENT_REQUIRED: 'Nội dung câu hỏi là bắt buộc',
    CONTENT_TOO_LONG: 'Nội dung câu hỏi không được vượt quá 2000 ký tự',
    TIME_LIMIT_REQUIRED: 'Thời gian giới hạn là bắt buộc',
    TIME_LIMIT_INVALID: 'Thời gian giới hạn phải từ 5 đến 300 giây',
    TYPE_REQUIRED: 'Loại câu hỏi là bắt buộc',
    OPTIONS_MIN: 'Phải có ít nhất {min} lựa chọn',
    OPTIONS_MAX: 'Không được có quá {max} lựa chọn',
    NO_CORRECT_ANSWER: 'Phải có ít nhất một đáp án đúng',
    OPTION_CONTENT_REQUIRED: 'Nội dung lựa chọn là bắt buộc',
    OPTION_CONTENT_TOO_LONG: 'Nội dung lựa chọn không được vượt quá 1000 ký tự',
    MATCHING_PAIRS_MIN: 'Phải có ít nhất {min} cặp ghép',
    MATCHING_PAIRS_MAX: 'Không được có quá {max} cặp ghép',
    MATCHING_CONTENT_REQUIRED: 'Nội dung ghép cặp là bắt buộc',
    ORDERING_ITEMS_MIN: 'Phải có ít nhất {min} mục để sắp xếp',
    ORDERING_ITEMS_MAX: 'Không được có quá {max} mục để sắp xếp',
    ORDERING_CONTENT_REQUIRED: 'Nội dung mục sắp xếp là bắt buộc',
    VIDEO_URL_REQUIRED: 'URL video là bắt buộc',
    VIDEO_URL_INVALID: 'URL video không hợp lệ',
  },
} as const

