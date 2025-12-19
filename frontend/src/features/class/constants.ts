/**
 * Class Feature Constants
 * Messages, limits, and default values for class feature
 */

export const CLASS_CONSTANTS = {
  MESSAGES: {
    // Success messages
    CREATE_SUCCESS: 'Lớp học đã được tạo thành công',
    UPDATE_SUCCESS: 'Lớp học đã được cập nhật thành công',
    DELETE_SUCCESS: 'Lớp học đã được xóa thành công',
    JOIN_SUCCESS: 'Đã tham gia lớp học thành công',
    LEAVE_SUCCESS: 'Đã rời khỏi lớp học',
    CREATE_HOMEWORK_SUCCESS: 'Bài tập về nhà đã được tạo thành công',
    UPDATE_HOMEWORK_SUCCESS: 'Bài tập về nhà đã được cập nhật thành công',
    DELETE_HOMEWORK_SUCCESS: 'Bài tập về nhà đã được xóa thành công',

    // Error messages
    CREATE_FAILED: 'Không thể tạo lớp học',
    UPDATE_FAILED: 'Không thể cập nhật lớp học',
    DELETE_FAILED: 'Không thể xóa lớp học',
    JOIN_FAILED: 'Không thể tham gia lớp học',
    LEAVE_FAILED: 'Không thể rời khỏi lớp học',
    LOAD_FAILED: 'Không thể tải lớp học',
    CREATE_HOMEWORK_FAILED: 'Không thể tạo bài tập về nhà',
    UPDATE_HOMEWORK_FAILED: 'Không thể cập nhật bài tập về nhà',
    DELETE_HOMEWORK_FAILED: 'Không thể xóa bài tập về nhà',

    // Confirmations
    CONFIRM_DELETE: 'Bạn có chắc chắn muốn xóa lớp học này không?',
    CONFIRM_LEAVE: 'Bạn có chắc chắn muốn rời khỏi lớp học này không?',
    CONFIRM_DELETE_HOMEWORK: 'Bạn có chắc chắn muốn xóa bài tập về nhà này không?',

    // Empty states
    NO_CLASSES: 'Chưa có lớp học nào',
    NO_CLASSES_DESCRIPTION: 'Tạo lớp học đầu tiên để bắt đầu quản lý học sinh',
    NO_HOMEWORKS: 'Chưa có bài tập về nhà nào',
    NO_HOMEWORKS_DESCRIPTION: 'Tạo bài tập về nhà đầu tiên cho lớp học này',
    NO_MEMBERS: 'Chưa có thành viên nào',
    NO_MEMBERS_DESCRIPTION: 'Mời học sinh tham gia lớp học bằng mã tham gia',
  },

  LIMITS: {
    NAME_MAX_LENGTH: 255,
    DESCRIPTION_MAX_LENGTH: 2000,
    JOIN_CODE_LENGTH: 8,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },

  PLACEHOLDERS: {
    NAME: 'Ví dụ: Toán học lớp 10A',
    DESCRIPTION: 'Mô tả về lớp học...',
    JOIN_CODE: 'Nhập mã tham gia (8 ký tự)',
  },
} as const

// Submission status labels
export const SUBMISSION_STATUS_LABELS: Record<string, string> = {
  NotSubmitted: 'Chưa nộp',
  Submitted: 'Đã nộp',
  Late: 'Nộp muộn',
}
