/**
 * Bangladesh Phone Number Formatting & Validation Utilities
 * Country Dialing Code: +880
 */

/**
 * Standardizes any user-entered Bangladeshi phone number into full +880 format.
 * Examples:
 *   "01712345678" -> "+8801712345678"
 *   "1712345678"  -> "+8801712345678"
 *   "+8801712345678" -> "+8801712345678"
 */
export function normalizeBangladeshPhone(input?: string | null): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Strip everything except digits
  let digits = trimmed.replace(/[^0-9]/g, '');

  if (digits.startsWith('880')) {
    digits = digits.slice(3);
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits ? `+880${digits}` : '';
}

/**
 * Strips the +880 country code prefix so the input field can display the local subscriber digits.
 * e.g. "+8801712345678" -> "1712345678"
 *      "01712345678"    -> "1712345678"
 */
export function extractNationalDigits(input?: string | null): string {
  if (!input) return '';
  let digits = input.trim().replace(/[^0-9]/g, '');
  if (digits.startsWith('880')) {
    digits = digits.slice(3);
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits;
}

/**
 * Formats a phone number for attractive visual display:
 * "+880 1712-345678" or returns local number formatted if country code is separated.
 */
export function formatDisplayPhone(input?: string | null): {
  countryCode: string;
  formattedNumber: string;
  fullInternational: string;
} {
  const digits = extractNationalDigits(input);
  if (!digits) {
    return {
      countryCode: '+880',
      formattedNumber: '',
      fullInternational: ''
    };
  }

  // Format as e.g. 1712-345678 (4 digits - 6 digits)
  let formatted = digits;
  if (digits.length >= 7) {
    formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }

  return {
    countryCode: '+880',
    formattedNumber: formatted,
    fullInternational: `+880 ${formatted}`
  };
}
