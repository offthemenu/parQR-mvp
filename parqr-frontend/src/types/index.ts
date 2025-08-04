// User related types
export interface User {
  id: number;
  signup_country_iso: string;
  phone_number: string;
  user_code: string;
  qr_code_id: string;
  created_at: string;
}

// Car related types
export interface Car {
  id: number;
  owner_id: number;
  license_plate: string;
  car_brand?: string;
  car_model?: string;
  created_at: string;
}

// Parking session related types
export interface ParkingSession {
  id: number;
  user_id: number;
  car_id: number;
  start_time: string;
  end_time?: string;
  note_location?: string;
  longitude?: number;
  latitude?: number;
}

// API Request/Response types
export interface RegisterUserRequest {
  phone_number: string;
  signup_country_iso: string;
}

export interface RegisterUserResponse {
  id: number;
  user_code: string;
  qr_code_id: string;
  created_at: string;
  signup_country_iso: string;
}

export interface ServicingCountriesResponse {
  countries: CountryInfo[];
}

export interface CountryInfo {
  country_name: string;
  iso_code: string;
  flag_emoji: string;
}

// Navigation types
export type RootStackParamList = {
  Register: undefined;
  Profile: { user: User };
};

// Validation types
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface PhoneValidationOptions {
  countryCode?: string;
  allowInternational?: boolean;
}

// API Error type
export interface ApiError {
  message: string;
  status: number;
}