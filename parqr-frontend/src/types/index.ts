import { InteractionManager } from "react-native";

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  SignIn: undefined;
  Register: undefined;
  CarRegistration: {
    user: UserLookupResponse | RegisterUserResponse;
  };
  Home: {
    user: UserLookupResponse | RegisterUserResponse;
  };
  Profile: {
    user: UserLookupResponse | RegisterUserResponse;
  };
  PublicProfilePage: {
    scannedUserCode: string;
    showMoveRequestForm?: boolean;
  };
  ParkOutHistory: {
    userCode: string;
  };
  ParkingHistory: {
    userCode: string;
  };
  QRScanner: undefined; 
  PublicProfile: { 
    userCode: string;
    userData: UserWithCarsResponse; // Privacy-safe type (no phone_number)
    isWebView?: boolean;
  };
  Chat: { 
    recipientUserCode: string;
    recipientDisplayName: string;
    sendMoveCarRequest?: boolean;
  };
  ChatList: undefined;
};

// User related types
export interface User {
  id: number;
  signup_country_iso: string;
  phone_number: string;
  user_code: string;
  qr_code_id: string;
  created_at: string;
  user_tier: string;
}

export interface UserWithCarsResponse {
  id: number;
  user_code: string;
  qr_code_id: string;
  created_at: string;
  signup_country_iso: string;
  cars: CarResponse[];
  // Public profile fields (safe for public viewing)
  profile_deep_link?: string;
  profile_bio?: string;
  profile_display_name?: string;
  qr_image_path?: string;
}

export interface UserLookupResponse {
  id: number;
  phone_number: string;
  user_code: string;
  qr_code_id: string;
  created_at: string;
  cars: CarResponse[];
  profile_deep_link?: string;
  profile_bio?: string;
  profile_display_name?: string;
  qr_image_path?: string;
  signup_country_iso: string;
  user_tier: string;
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
  latitude?: number;
  longitude?: number;
  note_location?: string;
}

export interface StartParkingRequest {
  car_id: number;
  latitude?: number;
  longitude?: number;
  note_location?: string;
}

// Move Request Types
export interface MoveRequest {
  id: number;
  target_user_id: number;
  license_plate: string;
  requester_info: string | null;
  ip_address: string;
  created_at: string;
  viewed_at: string | null;
  is_read: boolean;
}

// Chat Message Types
export interface ChatMessageCreate {
  recipient_user_code: string;
  message_content: string;
  message_type: 'text' | 'move_car_request';
}

export interface ChatMessageResponse {
  id: number;
  sender_user_code: string;
  recipient_user_code: string;
  message_content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface ChatConversationResponse {
  participant_user_code: string;
  participant_display_name?: string;
  last_message?: ChatMessageResponse;
  unread_count: number;
  last_activity: string;
}

export interface MarkAsReadRequest {
  message_ids: number[];
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
  user_tier: string;
}

export interface ServicingCountriesResponse {
  countries: CountryInfo[];
}

export interface CountryInfo {
  country_name: string;
  iso_code: string;
  flag_emoji: string;
}

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
export const MOVE_CAR_REQUEST_MESSAGE = "A verified user has requested you to move your car!"
