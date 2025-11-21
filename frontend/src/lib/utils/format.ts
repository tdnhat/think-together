/**
 * Format Utilities
 * 
 * Helper functions for formatting numbers, strings, and other data.
 */

/**
 * Format number with thousand separators
 * 
 * @param num - Number to format
 * @param locale - Locale (default: 'vi-VN')
 * @returns Formatted number string
 * 
 * @example
 * ```typescript
 * formatNumber(1000) // "1.000"
 * formatNumber(1234567) // "1.234.567"
 * ```
 */
export function formatNumber(num: number, locale: string = 'vi-VN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format currency in VND
 * 
 * @param amount - Amount to format
 * @returns Formatted currency string
 * 
 * @example
 * ```typescript
 * formatCurrency(1000000) // "1.000.000 ₫"
 * formatCurrency(50000) // "50.000 ₫"
 * ```
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

/**
 * Format percentage
 * 
 * @param value - Value to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @param isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @returns Formatted percentage string
 * 
 * @example
 * ```typescript
 * formatPercentage(0.75) // "75%"
 * formatPercentage(75, 1, false) // "75.0%"
 * formatPercentage(0.7545, 2) // "75.45%"
 * ```
 */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  isDecimal: boolean = true
): string {
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Format file size
 * 
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 * 
 * @example
 * ```typescript
 * formatFileSize(1024) // "1.00 KB"
 * formatFileSize(1048576) // "1.00 MB"
 * formatFileSize(1073741824) // "1.00 GB"
 * ```
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Truncate text with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 * 
 * @example
 * ```typescript
 * truncate('Hello World', 5) // "Hello..."
 * truncate('Short', 10) // "Short"
 * ```
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 * 
 * @param text - Text to capitalize
 * @returns Capitalized text
 * 
 * @example
 * ```typescript
 * capitalize('hello') // "Hello"
 * capitalize('HELLO') // "HELLO"
 * ```
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalize each word
 * 
 * @param text - Text to capitalize
 * @returns Title cased text
 * 
 * @example
 * ```typescript
 * titleCase('hello world') // "Hello World"
 * titleCase('HELLO WORLD') // "Hello World"
 * ```
 */
export function titleCase(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert to slug
 * 
 * @param text - Text to convert
 * @returns Slugified text
 * 
 * @example
 * ```typescript
 * slugify('Hello World') // "hello-world"
 * slugify('Xin chào Việt Nam') // "xin-chao-viet-nam"
 * ```
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize unicode
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
}

/**
 * Format phone number (Vietnamese format)
 * 
 * @param phone - Phone number
 * @returns Formatted phone number
 * 
 * @example
 * ```typescript
 * formatPhone('0901234567') // "090 123 4567"
 * formatPhone('84901234567') // "+84 90 123 4567"
 * ```
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('84')) {
    // International format
    return `+84 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  // Local format
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
}

/**
 * Mask email address
 * 
 * @param email - Email to mask
 * @returns Masked email
 * 
 * @example
 * ```typescript
 * maskEmail('user@example.com') // "u***@example.com"
 * ```
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username[0] + '***';
  return `${maskedUsername}@${domain}`;
}

/**
 * Mask phone number
 * 
 * @param phone - Phone to mask
 * @returns Masked phone
 * 
 * @example
 * ```typescript
 * maskPhone('0901234567') // "090***4567"
 * ```
 */
export function maskPhone(phone: string): string {
  if (phone.length < 7) return phone;
  return phone.slice(0, 3) + '***' + phone.slice(-4);
}

/**
 * Format score/points with commas
 * 
 * @param score - Score to format
 * @returns Formatted score
 * 
 * @example
 * ```typescript
 * formatScore(1000) // "1,000"
 * formatScore(1234567) // "1,234,567"
 * ```
 */
export function formatScore(score: number): string {
  return score.toLocaleString('en-US');
}

/**
 * Pluralize word based on count
 * 
 * @param count - Count
 * @param singular - Singular form
 * @param plural - Plural form (optional, adds 's' by default)
 * @returns Pluralized string
 * 
 * @example
 * ```typescript
 * pluralize(1, 'quiz') // "1 quiz"
 * pluralize(2, 'quiz', 'quizzes') // "2 quizzes"
 * ```
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
}

/**
 * Generate initials from name
 * 
 * @param name - Full name
 * @param maxLength - Maximum length (default: 2)
 * @returns Initials
 * 
 * @example
 * ```typescript
 * getInitials('John Doe') // "JD"
 * getInitials('John Michael Doe', 3) // "JMD"
 * ```
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, maxLength);
}

/**
 * Format array to comma-separated string
 * 
 * @param items - Array of items
 * @param conjunction - Conjunction word (default: 'và')
 * @returns Formatted string
 * 
 * @example
 * ```typescript
 * formatList(['A', 'B', 'C']) // "A, B và C"
 * formatList(['A', 'B']) // "A và B"
 * formatList(['A']) // "A"
 * ```
 */
export function formatList(items: string[], conjunction: string = 'và'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const last = items[items.length - 1];
  const rest = items.slice(0, -1);
  return `${rest.join(', ')} ${conjunction} ${last}`;
}

