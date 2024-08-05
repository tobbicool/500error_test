import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes a given string, which can be either a URL or HTML content.
 * 
 * @param {string} input - The string to sanitize
 * @param {string} type - The type of content to sanitize: 'url' or 'html'
 * @returns {string} The sanitized string
 */
export function sanitize(input, type = 'html') {
  if (typeof input !== 'string') {
    console.error('Input must be a string');
    return '';
  }

  if (type === 'url') {
    // For URLs, we first sanitize it as a URI, then validate it
    const sanitizedUrl = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    try {
      const url = new URL(sanitizedUrl);
      // Only allow http and https protocols
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return url.href;
      }
    } catch (e) {
      // If URL is invalid, log error and return empty string
      console.error('Invalid URL:', input);
    }
    return '';
  } else if (type === 'html') {
    // For HTML content, use DOMPurify's default sanitization
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target']
    });
  } else {
    console.error('Invalid sanitization type. Use "url" or "html".');
    return '';
  }
}