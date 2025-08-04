import { ValidationResult, PhoneValidationOptions } from '../types';

/**
 * Validate phone number format based on country
 */
export const validatePhoneNumber = (
  phone: string, 
  options: PhoneValidationOptions = {}
): ValidationResult => {
  const { countryCode = 'KR', allowInternational = false } = options;
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (!cleanPhone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  
  // Country-specific validation
  switch (countryCode.toUpperCase()) {
    case 'KR': // South Korea
      return validateKoreanPhoneNumber(cleanPhone);
    default:
      return validateInternationalPhoneNumber(cleanPhone, allowInternational);
  }
};

/**
 * Validate Korean mobile phone number format
 */
const validateKoreanPhoneNumber = (cleanPhone: string): ValidationResult => {
  if (cleanPhone.length !== 11) {
    return { isValid: false, message: 'Phone number must be 11 digits' };
  }
  
  if (!cleanPhone.startsWith('010')) {
    return { isValid: false, message: 'Invalid mobile phone number format' };
  }
  
  return { isValid: true };
};

/**
 * Validate international phone number format
 */
const validateInternationalPhoneNumber = (
  cleanPhone: string, 
  allowInternational: boolean
): ValidationResult => {
  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    return { 
      isValid: false, 
      message: 'Phone number must be between 10 and 15 digits' 
    };
  }
  
  return { isValid: true };
};

/**
 * Simple phone number validation (legacy)
 */
export const validatePhoneNumberSimple = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

/**
 * Format phone number for display based on country
 */
export const formatPhoneNumber = (
  phone: string, 
  countryCode: string = 'KR'
): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  switch (countryCode.toUpperCase()) {
    case 'KR': // South Korea format: 010-1234-5678
      if (cleanPhone.length === 11 && cleanPhone.startsWith('010')) {
        return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 7)}-${cleanPhone.slice(7)}`;
      }
      break;
    case 'US': // US format: (123) 456-7890
      if (cleanPhone.length === 10) {
        return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
      }
      break;
    default:
      // For other countries, just return with basic formatting
      if (cleanPhone.length >= 10) {
        return cleanPhone.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
      }
  }
  
  return phone; // Return original if not standard format
};

/**
 * Clean phone number for API submission
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Format phone number for API submission based on country
 */
export const formatPhoneForAPI = (
  phone: string, 
  countryCode: string = 'KR'
): string => {
  const cleanPhone = cleanPhoneNumber(phone);
  
  switch (countryCode.toUpperCase()) {
    case 'KR': // South Korea - convert to international format
      if (cleanPhone.startsWith('010')) {
        // Remove leading 0 and add +82
        return `+82${cleanPhone.substring(1)}`;
      }
      return cleanPhone;
    default:
      // For other countries, return as-is for now
      return phone;
  }
};

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true };
};

/**
 * Validate country ISO code format
 */
export const validateCountryISO = (countryISO: string): ValidationResult => {
  if (!countryISO || countryISO.length !== 2) {
    return { isValid: false, message: 'Invalid country code' };
  }
  return { isValid: true };
};