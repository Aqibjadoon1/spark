/**
 * @description Maps Firebase error codes to user-friendly messages
 * @param {string} errorCode - Firebase auth error code
 * @returns {string} User-friendly error message
 */
export function getFirebaseErrorMessage(errorCode) {
  const messages = {
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };
  return messages[errorCode] || 'An unexpected error occurred. Please try again.';
}

/**
 * @description Strips HTML tags and trims whitespace
 * @param {string} str
 * @returns {string}
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * @description Generates a simple random ID
 * @param {number} length
 * @returns {string}
 */
export function generateId(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
