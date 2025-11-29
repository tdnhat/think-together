// Quiz feature constants

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
} as const;

export const QUIZ_CONSTANTS = {
  MESSAGES: {
    // Question-related messages can go here
  },
} as const;

export { QUESTION_CONSTANTS } from './question.constants'