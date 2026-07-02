/**
 * @description Validates an email address
 * @param {string} email
 * @returns {string|null} Error message or null if valid
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Please enter a valid email address.';
  return null;
}

/**
 * @description Validates a password (minimum 6 characters)
 * @param {string} password
 * @returns {string|null} Error message or null if valid
 */
export function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password should be at least 6 characters.';
  return null;
}

/**
 * @description Validates that a value is non-empty
 * @param {any} value
 * @param {string} fieldName
 * @returns {string|null} Error message or null if valid
 */
export function validateRequired(value, fieldName) {
  if (value === undefined || value === null) return `${fieldName} is required.`;
  if (typeof value === 'string' && value.trim().length === 0) return `${fieldName} is required.`;
  return null;
}

/**
 * @description Optional URL validation
 * @param {string} url
 * @returns {string|null} Error message or null if valid
 */
export function validateUrl(url) {
  if (!url || url.trim().length === 0) return null;
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL.';
  }
}

/**
 * @description Validates a display name (min 2 chars, no special chars)
 * @param {string} name
 * @returns {string|null} Error message or null if valid
 */
export function validateDisplayName(name) {
  if (!name || name.trim().length < 2) return 'Display name must be at least 2 characters.';
  if (/[^a-zA-Z0-9_ ]/.test(name)) return 'Display name cannot contain special characters.';
  return null;
}
