/**
 * Route Configuration
 * 
 * Type-safe route definitions and utilities.
 * Prevents hardcoded route strings throughout the application.
 */

// ============================================================================
// ROUTE DEFINITIONS
// ============================================================================

const routes = {
  // ========== PUBLIC ROUTES ==========
  public: {
    home: '/',
    about: '/about',
    contact: '/contact',
    designSystem: '/design-system',
    pricing: '/pricing',
    features: '/features',
  },
  
  // ========== AUTH ROUTES ==========
  auth: {
    login: '/login',
    signup: '/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
    confirmEmail: '/confirm-email',
    logout: '/logout',
  },
  
  // ========== DASHBOARD ROUTES ==========
  dashboard: {
    home: '/home',
    profile: '/profile',
    settings: '/settings',
  },
  
  // ========== QUIZ ROUTES ==========
  quiz: {
    list: '/my-quizzes',
    create: '/quiz/create',
    edit: (id: string) => `/quiz/${id}/edit` as const,
    view: (id: string) => `/quiz/${id}` as const,
    duplicate: (id: string) => `/quiz/${id}/duplicate` as const,
  },
  
  // ========== GAME ROUTES ==========
  game: {
    host: (quizId: string) => `/host/quizzes/${quizId}` as const,
    join: '/join',
    play: (pin: string) => `/play/${pin}` as const,
    challenge: (id: string) => `/challenge/${id}` as const,
    results: (sessionId: string) => `/game/${sessionId}/results` as const,
  },
  
  // ========== REPORT ROUTES ==========
  reports: {
    list: '/reports',
    view: (sessionId: string) => `/reports/${sessionId}` as const,
    export: (sessionId: string) => `/reports/${sessionId}/export` as const,
  },
  
  // ========== CREATOR ROUTES ==========
  creator: {
    becomeCreator: '/become-creator',
    dashboard: '/creator/dashboard',
    analytics: '/creator/analytics',
    earnings: '/creator/earnings',
  },
  
  // ========== ADMIN ROUTES ==========
  admin: {
    dashboard: '/admin',
    users: '/admin/users',
    quizzes: '/admin/quizzes',
    reports: '/admin/reports',
    settings: '/admin/settings',
  },
} as const;

// ============================================================================
// ROUTE GUARDS
// ============================================================================

/**
 * Routes that require authentication
 */
export const protectedRoutes = [
  routes.dashboard.home,
  routes.dashboard.profile,
  routes.dashboard.settings,
  routes.quiz.list,
  routes.quiz.create,
  '/quiz/', // Matches all quiz routes
  '/reports/',
  '/host/',
  '/creator/',
  '/admin/',
] as const;

/**
 * Routes that should redirect to dashboard if already authenticated
 */
export const authOnlyRoutes = [
  routes.auth.login,
  routes.auth.signup,
  routes.auth.forgotPassword,
  routes.auth.resetPassword,
] as const;

/**
 * Routes that require creator role
 */
export const creatorRoutes = [
  routes.creator.dashboard,
  routes.creator.analytics,
  routes.creator.earnings,
] as const;

/**
 * Routes that require admin role
 */
export const adminRoutes = [
  routes.admin.dashboard,
  routes.admin.users,
  routes.admin.quizzes,
  routes.admin.reports,
  routes.admin.settings,
] as const;

// ============================================================================
// ROUTE UTILITIES
// ============================================================================

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => {
    if (typeof route === 'string') {
      return pathname === route || pathname.startsWith(route);
    }
    return false;
  });
}

/**
 * Check if a route is auth-only (should redirect if authenticated)
 */
export function isAuthOnlyRoute(pathname: string): boolean {
  return authOnlyRoutes.some((route) => pathname === route);
}

/**
 * Check if a route requires creator role
 */
export function isCreatorRoute(pathname: string): boolean {
  return creatorRoutes.some((route) => pathname === route || pathname.startsWith(route));
}

/**
 * Check if a route requires admin role
 */
export function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some((route) => pathname === route || pathname.startsWith(route));
}

/**
 * Get the redirect path after login based on user role
 */
export function getRedirectAfterLogin(userRole?: string): string {
  switch (userRole) {
    case 'admin':
      return routes.admin.dashboard;
    case 'creator':
      return routes.creator.dashboard;
    default:
      return routes.dashboard.home;
  }
}

/**
 * Get the login redirect path with return URL
 */
export function getLoginPath(returnUrl?: string): string {
  if (returnUrl) {
    return `${routes.auth.login}?returnUrl=${encodeURIComponent(returnUrl)}`;
  }
  return routes.auth.login;
}

/**
 * Parse return URL from query parameters
 */
export function parseReturnUrl(searchParams: URLSearchParams): string | null {
  const returnUrl = searchParams.get('returnUrl');
  
  // Validate return URL to prevent open redirect vulnerabilities
  if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
    return returnUrl;
  }
  
  return null;
}

// ============================================================================
// ROUTE METADATA
// ============================================================================

export interface RouteMetadata {
  title: string;
  description?: string;
  requiresAuth?: boolean;
  requiresRole?: string[];
}

export const routeMetadata: Record<string, RouteMetadata> = {
  [routes.public.home]: {
    title: 'Trang chủ - ThinkTogether',
    description: 'Nền tảng học tập thông minh với quiz tương tác',
  },
  [routes.auth.login]: {
    title: 'Đăng nhập - ThinkTogether',
    description: 'Đăng nhập vào tài khoản của bạn',
  },
  [routes.auth.signup]: {
    title: 'Đăng ký - ThinkTogether',
    description: 'Tạo tài khoản mới',
  },
  [routes.dashboard.home]: {
    title: 'Bảng điều khiển - ThinkTogether',
    requiresAuth: true,
  },
  [routes.quiz.list]: {
    title: 'Quiz của tôi - ThinkTogether',
    requiresAuth: true,
  },
};

/**
 * Get metadata for a route
 */
export function getRouteMetadata(pathname: string): RouteMetadata | undefined {
  return routeMetadata[pathname];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default routes;
export const ROUTES = routes;

export type Routes = typeof routes;
export type PublicRoutes = typeof routes.public;
export type AuthRoutes = typeof routes.auth;
export type DashboardRoutes = typeof routes.dashboard;
export type QuizRoutes = typeof routes.quiz;
export type GameRoutes = typeof routes.game;
export type ReportRoutes = typeof routes.reports;
export type CreatorRoutes = typeof routes.creator;
export type AdminRoutes = typeof routes.admin;

