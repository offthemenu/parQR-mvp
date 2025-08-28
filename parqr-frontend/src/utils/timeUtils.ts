// Utility functions for time formatting and timezone handling

/**
 * Get the locale string based on country ISO code
 */
export const getLocaleFromCountryISO = (countryISO: string): string => {
  const localeMap: Record<string, string> = {
    'KR': 'ko-KR',
    'US': 'en-US',
    'JP': 'ja-JP',
    'CN': 'zh-CN',
    'GB': 'en-GB',
    // Add more as needed
  };
  
  return localeMap[countryISO] || 'en-US'; // fallback to en-US
};

/**
 * Get the timezone based on country ISO code
 */
export const getTimezoneFromCountryISO = (countryISO: string): string => {
  const timezoneMap: Record<string, string> = {
    'KR': 'Asia/Seoul',
    'US': 'America/New_York',
    'JP': 'Asia/Tokyo',
    'CN': 'Asia/Shanghai',
    'GB': 'Europe/London',
    // Add more as needed
  };
  
  return timezoneMap[countryISO] || 'UTC';
};

/**
 * Calculate parking session duration properly handling UTC backend times
 */
export const calculateParkingDuration = (startTimeUTC: string, endTimeUTC?: string): string => {
  const start = new Date(startTimeUTC);
  const end = endTimeUTC ? new Date(endTimeUTC) : new Date();
  
  const durationMs = end.getTime() - start.getTime();
  
  // Handle negative duration (shouldn't happen but just in case)
  if (durationMs < 0) {
    return '0m';
  }
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Format time for display based on user's country
 */
export const formatTimeForCountry = (timeUTC: string, countryISO: string): string => {
  const date = new Date(timeUTC);
  const locale = getLocaleFromCountryISO(countryISO);
  const timezone = getTimezoneFromCountryISO(countryISO);
  
  return date.toLocaleTimeString(locale, {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: countryISO === 'US' // US uses 12-hour format, most others use 24-hour
  });
};