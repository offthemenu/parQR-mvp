# parQR Frontend

React Native mobile application built with Expo for the parQR parking management system.

## Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (installed globally)
- **iOS Simulator** (for iOS development on macOS)
- **Android Studio/Emulator** (for Android development)

## Quick Start

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd parqr-frontend

# Install all dependencies
npm install
```

### 2. Start Development Server

```bash
# Start Expo development server
npm start

# Or run on specific platforms
npm run ios      # iOS Simulator
npm run android  # Android Emulator  
npm run web      # Web browser
```

### 3. Open in Expo Go (Optional)

- Install **Expo Go** app on your mobile device
- Scan the QR code displayed in terminal/browser
- App will load on your device

## Project Structure

```
parqr-frontend/
├── src/
│   ├── config/          # API configuration
│   │   └── api.ts       # Axios client setup
│   ├── screens/         # App screens/pages
│   │   └── RegisterScreen.tsx
│   ├── services/        # API service layer
│   │   └── userService.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   └── utils/           # Utility functions
│       └── validation.ts # Phone number & form validation
├── assets/              # Images, icons, fonts
├── App.tsx             # Root component
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Key Dependencies

### Core Framework
- **expo** (~53.0.20) - React Native framework
- **react** (19.0.0) - UI library
- **react-native** (0.79.5) - Mobile platform

### Navigation & UI
- **@react-navigation/native** (^7.1.17) - Screen navigation
- **@react-navigation/stack** (^7.4.5) - Stack navigator
- **@react-native-picker/picker** (^2.11.1) - Country selection dropdown

### Networking & QR
- **axios** (^1.11.0) - HTTP client for API calls
- **react-native-qrcode-svg** (^6.3.15) - QR code generation

### Safety & Development
- **react-native-safe-area-context** (5.4.0) - Safe area handling
- **typescript** (~5.8.3) - Type safety

## Configuration

### API Configuration

Update `src/config/api.ts` to point to your backend:

```typescript
const API_BASE_URL = 'http://your-backend-url:8000';
```

**Development URLs:**
- **iOS Simulator**: `http://localhost:8000`
- **Android Emulator**: `http://10.0.2.2:8000`
- **Physical Device**: `http://YOUR_COMPUTER_IP:8000`

### Environment Setup

The app expects the parQR backend to be running. See `../parqr-backend/README.md` for backend setup.

## Features

### User Registration
- **Country Selection**: Dropdown with flag emojis
- **Phone Validation**: Country-specific formatting (Korean, US, International)
- **QR Code Generation**: Unique QR code for each user
- **Real-time Validation**: Form validation as user types

### API Integration
- **RESTful API**: Communicates with FastAPI backend
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during API calls

## Development

### File Organization

**Types (`src/types/index.ts`)**
- All TypeScript interfaces and types
- API request/response models
- Navigation parameter types

**Services (`src/services/`)**  
- API integration layer
- UserService class with static methods
- Error handling and response transformation

**Validation (`src/utils/validation.ts`)**
- Phone number validation by country
- Form field validation utilities
- Display formatting functions

**Screens (`src/screens/`)**
- React Native components for each app screen
- Business logic and state management
- UI styling with StyleSheet

### Adding New Features

1. **Add Types**: Define interfaces in `src/types/index.ts`
2. **Create Service**: Add API methods to appropriate service file
3. **Build Screen**: Create React Native component
4. **Add Navigation**: Update navigation stack if needed

### Common Development Tasks

**Add New Dependency:**
```bash
npm install package-name
# For React Native packages, may need:
npx expo install package-name
```

**Type Checking:**
```bash
npx tsc --noEmit
```

**Clear Cache (if issues):**
```bash
npm start -- --clear
# Or
npx expo start -c
```

## Troubleshooting

### Metro/Expo Issues
```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro cache  
npx expo start --reset-cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --showConfig

# Validate types without building
npx tsc --noEmit
```

### Device Connection Issues

**iOS Simulator:**
- Ensure Xcode is installed and simulator is running
- Try: `npx expo run:ios`

**Android Emulator:**
- Ensure Android Studio is installed
- Start emulator before running `npm run android`
- Try: `npx expo run:android`

**Physical Device:**
- Both device and computer on same WiFi network
- Check firewall isn't blocking port 8081
- Use Expo Go app or development build

### API Connection Issues

**Cannot connect to backend:**
1. Verify backend is running (`http://localhost:8000/docs`)
2. Check API_BASE_URL in `src/config/api.ts`
3. For device testing, use computer's IP address instead of localhost

**CORS errors:**
- Backend must include frontend URL in CORS origins
- Check parqr-backend CORS configuration

## Build & Deployment

### Development Build
```bash
# Create development build
npx expo build:ios --type simulator
npx expo build:android --type apk
```

### Production Build
```bash
# Configure app.json for production
# Then build for app stores
npx expo build:ios --type archive
npx expo build:android --type app-bundle
```

## Scripts Reference

```bash
npm start          # Start Expo development server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser
```

## Support

For issues specific to:
- **Expo/React Native**: [Expo Documentation](https://docs.expo.dev/)
- **parQR Backend**: See `../parqr-backend/README.md`
- **Project Issues**: Check project repository issues

## Architecture Notes

- **Service Layer Pattern**: API calls abstracted into service classes
- **Type Safety**: Full TypeScript coverage for API contracts
- **Validation Layer**: Centralized validation with country-specific rules
- **Error Boundaries**: Comprehensive error handling and user feedback
- **Responsive Design**: Optimized for both iOS and Android platforms

The frontend is designed to be maintainable, type-safe, and user-friendly while integrating seamlessly with the parQR backend API.