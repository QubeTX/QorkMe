/**
 * Reserved words that cannot be used as short codes
 * These are common routes and system paths
 */

export const RESERVED_WORDS = new Set([
  // System routes
  'api',
  'app',
  'admin',
  'auth',
  'callback',
  'dashboard',
  'login',
  'logout',
  'register',
  'signup',
  'signin',

  // Pages
  'about',
  'contact',
  'help',
  'support',
  'terms',
  'privacy',
  'policy',
  'settings',
  'profile',
  'account',
  'home',

  // Features
  'result',
  'results',
  'analytics',
  'stats',
  'statistics',
  'qr',
  'qrcode',
  'export',
  'import',
  'bulk',
  'batch',

  // HTTP status codes
  '404',
  '500',
  '403',
  '401',

  // File extensions (if someone tries these)
  'css',
  'js',
  'json',
  'xml',
  'html',
  'txt',
  'pdf',

  // Common tech terms
  'test',
  'demo',
  'example',
  'sample',
  'docs',
  'documentation',
  'guide',

  // Brand protection
  'qork',
  'qorkme',
  'geeksquad',
  'geek',

  // Security
  'hack',
  'hacked',
  'security',
  'exploit',

  // Miscellaneous
  'undefined',
  'null',
  'void',
  'new',
  'delete',
  'edit',
  'update',
  'create',
  'list',
  'view',
  'show',
]);

/**
 * Check if a word is reserved (case-insensitive)
 */
export function isReservedWord(word: string): boolean {
  return RESERVED_WORDS.has(word.toLowerCase());
}

/**
 * Get all reserved words as an array
 */
export function getReservedWords(): string[] {
  return Array.from(RESERVED_WORDS);
}
