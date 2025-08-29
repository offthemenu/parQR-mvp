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

// Cache the timezone to avoid repeated detection
let cachedTimezone: string | null = null;

/**
 * Get the device's timezone (cached)
 */
export const getDeviceTimezone = (): string => {
  if (cachedTimezone) {
    return cachedTimezone;
  }
  
  try {
    cachedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(`🌍 Device timezone detected: ${cachedTimezone}`);
    return cachedTimezone;
  } catch (error) {
    console.warn('Could not detect device timezone, falling back to UTC');
    cachedTimezone = 'UTC';
    return cachedTimezone;
  }
};

/**
 * Format timestamp for display using device's actual timezone
 */
export const formatLocalTime = (timeUTC: string): string => {
  // Ensure the timestamp is treated as UTC by adding 'Z' if missing
  const utcTimestamp = timeUTC.endsWith('Z') ? timeUTC : timeUTC + 'Z';
  const date = new Date(utcTimestamp);
  const deviceTimezone = getDeviceTimezone();
  
  // Debug: Log the conversion
  const utcTime = date.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false });
  const localTime = date.toLocaleTimeString('en-US', { timeZone: deviceTimezone, hour12: false });
  console.log(`🕐 Time conversion: ${timeUTC} → ${utcTimestamp} (${utcTime} UTC) → ${localTime} ${deviceTimezone}`);
  
  return date.toLocaleTimeString([], {
    timeZone: deviceTimezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Format timestamp for chat list display (shows time for today, date for older)
 */
export const formatChatListTime = (timeUTC: string): string => {
  // Ensure the timestamp is treated as UTC by adding 'Z' if missing
  const utcTimestamp = timeUTC.endsWith('Z') ? timeUTC : timeUTC + 'Z';
  const date = new Date(utcTimestamp);
  const deviceTimezone = getDeviceTimezone();
  const now = new Date();
  
  // Convert both dates to the device timezone for comparison
  const localDate = new Date(date.toLocaleString('en-US', { timeZone: deviceTimezone }));
  const localNow = new Date(now.toLocaleString('en-US', { timeZone: deviceTimezone }));
  
  const diffInHours = (localNow.getTime() - localDate.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], {
      timeZone: deviceTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else if (diffInHours < 168) { // Less than 7 days
    return date.toLocaleDateString([], { 
      timeZone: deviceTimezone,
      weekday: 'short' 
    });
  } else {
    return date.toLocaleDateString([], {
      timeZone: deviceTimezone,
      month: 'short',
      day: 'numeric'
    });
  }
};