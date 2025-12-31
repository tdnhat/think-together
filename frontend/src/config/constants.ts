/**
 * Application Constants
 * 
 * Centralized constants to avoid magic strings and numbers throughout the application.
 * Follow the Options Pattern from backend architecture.
 */

// ============================================================================
// API & NETWORKING
// ============================================================================

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const SOCKET = {
  URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 3000,
} as const;

// ============================================================================
// AUTHENTICATION & SECURITY
// ============================================================================

export const AUTH = {
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    CONFIRM_EMAIL: '/api/auth/confirm-email',
    RESEND_CONFIRMATION: '/api/auth/resend-email-confirmation',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    ACTIVATE_TEACHER: '/api/auth/activate-teacher',
  },
  MESSAGES: {
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGIN_FAILED: 'Đăng nhập thất bại',
    REGISTER_SUCCESS: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.',
    REGISTER_FAILED: 'Đăng ký thất bại',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    EMAIL_SENT: 'Email đã được gửi!',
    PASSWORD_RESET_SUCCESS: 'Mật khẩu đã được đặt lại thành công!',
    TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  },
  TOKEN: {
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
    MAX_RETRY_ATTEMPTS: 3,
  },
  // Legacy keys for backward compatibility
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  TOKEN_EXPIRY_BUFFER: 60000, // 1 minute before actual expiry
  SESSION_TIMEOUT: 3600000, // 1 hour
} as const;

export const SECURITY = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 900000, // 15 minutes
} as const;

// ============================================================================
// ROUTES & NAVIGATION
// ============================================================================

export const ROUTES = {
  // Public routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  DESIGN_SYSTEM: '/design-system',

  // Auth routes (nested structure)
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    CONFIRM_EMAIL: '/confirm-email',
  },

  // Dashboard routes (nested structure)
  DASHBOARD: {
    HOME: '/home',
    MY_QUIZZES: '/creator/quizzes',
    CREATE_QUIZ: '/quiz/create',
    EDIT_QUIZ: (id: string) => `/quiz/${id}/edit`,
    QUIZ_REPORTS: (sessionId: string) => `/reports/${sessionId}`,
  },

  // Game routes (nested structure)
  GAME: {
    HOST: '/host',
    HOST_QUIZ: (quizId: string) => `/host/quizzes/${quizId}`,
    JOIN: '/join',
    PLAY: (pin: string) => `/play/${pin}`,
    CHALLENGE: (id: string) => `/challenge/${id}`,
  },

  // Creator routes
  BECOME_CREATOR: '/become-creator',
} as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD.HOME,
  ROUTES.DASHBOARD.MY_QUIZZES,
  ROUTES.DASHBOARD.CREATE_QUIZ,
  '/creator/quizzes',
  '/quiz/',
  '/reports/',
  '/host/',
] as const;

export const AUTH_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.RESET_PASSWORD,
] as const;

// ============================================================================
// QUIZ & GAME SETTINGS
// ============================================================================

export const QUIZ = {
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 100,
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,

  QUESTION: {
    MIN_TEXT_LENGTH: 5,
    MAX_TEXT_LENGTH: 500,
    MIN_ANSWERS: 2,
    MAX_ANSWERS: 6,
    MIN_ANSWER_LENGTH: 1,
    MAX_ANSWER_LENGTH: 200,
    DEFAULT_TIME_LIMIT: 30, // seconds
    MIN_TIME_LIMIT: 5,
    MAX_TIME_LIMIT: 300,
  },

  TYPES: {
    MULTIPLE_CHOICE: 'multiple_choice',
    TRUE_FALSE: 'true_false',
    SHORT_ANSWER: 'short_answer',
    VIDEO: 'video',
  },
} as const;

export const GAME = {
  PIN_LENGTH: 6,
  MAX_PLAYERS: 100,
  MIN_PLAYERS: 1,
  LOBBY_TIMEOUT: 600000, // 10 minutes
  ANSWER_TIMEOUT: 5000, // 5 seconds after time limit

  SCORING: {
    BASE_POINTS: 1000,
    TIME_BONUS_MULTIPLIER: 0.5,
    STREAK_BONUS: 100,
    MAX_STREAK: 10,
  },

  STATES: {
    LOBBY: 'lobby',
    QUESTION: 'question',
    ANSWER: 'answer',
    LEADERBOARD: 'leaderboard',
    FINISHED: 'finished',
  },
} as const;

// ============================================================================
// FILE UPLOAD
// ============================================================================

export const UPLOAD = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB

  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],

  IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  VIDEO_EXTENSIONS: ['.mp4', '.webm', '.ogg'],
} as const;

// ============================================================================
// UI & UX
// ============================================================================

export const UI = {
  TOAST_DURATION: 5000, // 5 seconds
  TOAST_POSITION: 'top-right',

  DEBOUNCE_DELAY: 300, // milliseconds
  THROTTLE_DELAY: 1000,

  ANIMATION_DURATION: 200, // milliseconds
  TRANSITION_DURATION: 150,

  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  },

  BRAND: {
    ICON_PATH: '/icons/graduation-cap.png',
  },
} as const;

// ============================================================================
// VALIDATION MESSAGES (Vietnamese)
// ============================================================================

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Trường này là bắt buộc',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PASSWORD: 'Mật khẩu phải có ít nhất 8 ký tự',
  PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp',
  INVALID_PHONE: 'Số điện thoại không hợp lệ',
  INVALID_URL: 'URL không hợp lệ',

  MIN_LENGTH: (min: number) => `Tối thiểu ${min} ký tự`,
  MAX_LENGTH: (max: number) => `Tối đa ${max} ký tự`,
  MIN_VALUE: (min: number) => `Giá trị tối thiểu là ${min}`,
  MAX_VALUE: (max: number) => `Giá trị tối đa là ${max}`,

  FILE_TOO_LARGE: (maxSize: number) => `Kích thước file tối đa ${maxSize}MB`,
  INVALID_FILE_TYPE: 'Loại file không được hỗ trợ',
} as const;

// ============================================================================
// ERROR MESSAGES (Vietnamese)
// ============================================================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
  SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập tài nguyên này.',
  NOT_FOUND: 'Không tìm thấy tài nguyên.',
  TIMEOUT: 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.',

  GENERIC: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
} as const;

// ============================================================================
// SUCCESS MESSAGES (Vietnamese)
// ============================================================================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Đăng nhập thành công!',
  SIGNUP: 'Đăng ký thành công!',
  LOGOUT: 'Đăng xuất thành công!',

  QUIZ_CREATED: 'Tạo quiz thành công!',
  QUIZ_UPDATED: 'Cập nhật quiz thành công!',
  QUIZ_DELETED: 'Xóa quiz thành công!',

  PROFILE_UPDATED: 'Cập nhật hồ sơ thành công!',
  PASSWORD_CHANGED: 'Đổi mật khẩu thành công!',
  EMAIL_VERIFIED: 'Xác thực email thành công!',

  FILE_UPLOADED: 'Tải file lên thành công!',

  GENERIC: 'Thao tác thành công!',
} as const;

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: AUTH.TOKEN_KEY,
  REFRESH_TOKEN: AUTH.REFRESH_TOKEN_KEY,
  USER_DATA: AUTH.USER_KEY,
  AUTH_STORAGE: 'auth-storage', // Zustand persist key for auth store

  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',

  QUIZ_DRAFT: 'quiz_draft',
  GAME_STATE: 'game_state',

  ONBOARDING_COMPLETED: 'onboarding_completed',
  TOUR_COMPLETED: 'tour_completed',
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURES = {
  ENABLE_SOCIAL_LOGIN: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true',
  ENABLE_VIDEO_QUESTIONS: process.env.NEXT_PUBLIC_ENABLE_VIDEO_QUESTIONS === 'true',
  ENABLE_AI_GENERATION: process.env.NEXT_PUBLIC_ENABLE_AI_GENERATION === 'true',
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_LIVE_CHAT: process.env.NEXT_PUBLIC_ENABLE_LIVE_CHAT === 'true',

  // Development features
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_MOCK_DATA: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
} as const;

// ============================================================================
// THIRD-PARTY SERVICES
// ============================================================================

export const SERVICES = {
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID,
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  INTERCOM_APP_ID: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
} as const;

// ============================================================================
// REGEX PATTERNS
// ============================================================================

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,11}$/,
  URL: /^https?:\/\/.+/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// ============================================================================
// DATE & TIME
// ============================================================================

export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  FULL: 'dd/MM/yyyy HH:mm:ss',
} as const;

export const TIMEZONE = 'Asia/Ho_Chi_Minh';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type RouteKey = keyof typeof ROUTES;
export type QuizType = typeof QUIZ.TYPES[keyof typeof QUIZ.TYPES];
export type GameState = typeof GAME.STATES[keyof typeof GAME.STATES];

