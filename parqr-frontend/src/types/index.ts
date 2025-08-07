// User related types
export interface User {
  id: number;
  signup_country_iso: string;
  phone_number: string;
  user_code: string;
  qr_code_id: string;
  created_at: string;
}

export interface UserWithCarsResponse {
  id: number;
  user_code: string;
  qr_code_id: string;
  created_at: string;
  signup_country_iso: string;
  cars: CarResponse[];
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

// Car response type for owner context (includes license plate)
export interface CarOwnerResponse {
  id: number;
  license_plate: string;
  car_brand: string;
  car_model: string;
  created_at: string;
  // Note: owner_id excluded for privacy
}

// Car response type (privacy-preserving - matches backend UserWithCarsResponse)
export interface CarResponse {
  id: number;
  car_brand: string;
  car_model: string;
  created_at: string;
  // Note: license_plate and owner_id excluded for privacy
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
  phone_number: string; // Raw format: 010XXXXXXXX
  signup_country_iso?: string; // Defaults to 'KR' for South Korea MVP
}

// Car Registration Types
export interface CarRegistrationRequest {
  license_plate: string;
  car_brand: string;
  car_model: string;
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
  Splash: undefined;
  SignIn: undefined;
  Register: undefined;
  CarRegistration: {
    user: UserWithCarsResponse;
  };
  Home: {
    user: RegisterUserResponse | UserWithCarsResponse;
  };
  Profile: {
    user: RegisterUserResponse | UserWithCarsResponse;
  };
};

// Phone number formatting types
export interface PhoneFormatting {
  raw: string;      // 010XXXXXXXX (sent to API)
  display: string;  // 010-XXXX-XXXX (shown to user)
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export interface PhoneValidationOptions {
  countryCode?: string; // Default: 'KR' for MVP
  allowInternational?: boolean;
}

// Korean phone number constants
export const KOREAN_PHONE_CONFIG = {
  COUNTRY_ISO: 'KR',
  PHONE_PREFIX: '010',
  RAW_LENGTH: 11, // 010XXXXXXXX
  DISPLAY_FORMAT: 'XXX-XXXX-XXXX'
} as const;

// API Error type
export interface ApiError {
  message: string;
  status: number;
}

// Korean Car Brands for Dropdown
export const KOREAN_CAR_BRANDS = [
  'Hyundai',
  'Kia',
  'Genesis',
  'SsangYong',
  'Toyota',
  'Honda',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
  'Nissan',
  'Mazda',
  'Ford',
  'Chevrolet'
] as const;

// License Plate Validation
export const KOREAN_LICENSE_PLATE_REGEX = /^\d{2,3}[가-힣]\d{4}$/;