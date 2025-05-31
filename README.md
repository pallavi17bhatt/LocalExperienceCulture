# Lokly - Local Cultural Experiences App

A React-based mobile application for booking Indian cultural experiences, connecting travelers with local hosts through short-format cultural activities like pottery classes, food walks, and dance sessions.

## Features

- **Experience Discovery**: Browse and search local cultural experiences by category, location, and date
- **Detailed Experience Views**: View host information, reviews, pricing, and detailed descriptions
- **Availability Selection**: Choose dates, time slots, and packages for experiences
- **Complete Booking Flow**: Enter attendee details, select payment method, and complete bookings
- **Booking Confirmation**: Receive booking confirmations with all details
- **Mobile-First Design**: Optimized for iOS and Android devices with responsive layouts

## Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling and responsive design
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Lucide React** for icons

### Backend
- **Express.js** server with TypeScript
- **Drizzle ORM** for database schema and operations
- **In-memory storage** for development and prototyping
- **Zod** for API validation

### UI Components
- **shadcn/ui** component library
- **Radix UI** primitives for accessibility
- Custom mobile-optimized components

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lokly-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Running Backend Only

If you need to run just the backend server (for API testing or separate frontend development):

```bash
# Install dependencies
npm install

# Start only the Express backend server
npx tsx server/index.ts
```

The backend API will be available at `http://localhost:5000`

### Running Frontend Only

To run the frontend separately (connecting to an external backend):

```bash
# Install dependencies
npm install

# Start Vite development server
npx vite --config vite.config.ts
```

Update the API base URL in your environment configuration to point to your backend server.

## Development Features

- **Hot Module Replacement (HMR)** for instant updates during development
- **TypeScript** for type safety across frontend and backend
- **In-memory storage** for rapid prototyping without database setup
- **Mobile-first responsive design** optimized for iOS and Android

## Project Structure

```
lokly-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages/routes
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and API client
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   └── storage.ts         # In-memory data storage
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── components.json        # shadcn/ui configuration
```

## User Flow

The application follows this booking flow:
1. **Home** - Browse featured experiences and categories
2. **Search** - Filter and search experiences by location, category, date
3. **Experience Detail** - View host information, reviews, and pricing
4. **Availability** - Select dates, time slots, and packages
5. **Checkout** - Enter attendee details and payment information
6. **Confirmation** - Receive booking confirmation with details

## Mobile App Development

### Prerequisites for Mobile Development

- **Node.js 18+** and npm
- **React Native CLI** or **Expo CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Converting to React Native

To convert this web application to a native mobile app:

#### Option 1: Using React Native CLI

1. Initialize a new React Native project:
```bash
npx react-native init LoklyMobile
cd LoklyMobile
```

2. Install required dependencies:
```bash
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @tanstack/react-query
npm install react-hook-form @hookform/resolvers
npm install zod react-native-vector-icons
```

3. For iOS (macOS only):
```bash
cd ios && pod install && cd ..
```

4. Copy and adapt components from `client/src/` to React Native equivalents:
   - Replace `div` with `View`
   - Replace `img` with `Image`
   - Replace CSS classes with StyleSheet
   - Use React Navigation instead of Wouter

#### Option 2: Using Expo (Recommended for beginners)

1. Install Expo CLI:
```bash
npm install -g @expo/cli
```

2. Create new Expo project:
```bash
npx create-expo-app LoklyMobile
cd LoklyMobile
```

3. Install dependencies:
```bash
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npm install @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npx expo install expo-vector-icons
```

4. Start development:
```bash
npx expo start
```

### Building for Production

#### Web Build

To build the web application for production:

```bash
npm run build
```

The production build will be available in the `dist/` directory.

#### Android Build

1. For React Native CLI:
```bash
cd android
./gradlew assembleRelease
```
   Build output: `android/app/build/outputs/apk/release/app-release.apk`

2. For Expo:
```bash
npx expo build:android
```
   Build output: Downloaded from Expo servers or available in Expo dashboard

3. For Expo with EAS Build:
```bash
npx eas build --platform android
```
   Build output: `android/app/build/outputs/apk/release/` or `android/app/build/outputs/bundle/release/`

#### iOS Build

1. For React Native CLI (macOS only):
```bash
cd ios
xcodebuild -workspace LoklyMobile.xcworkspace -scheme LoklyMobile archive
```
   Build output: Xcode Archives (accessible via Xcode Organizer)

2. For Expo:
```bash
npx expo build:ios
```
   Build output: Downloaded IPA file from Expo servers

3. For Expo with EAS Build:
```bash
npx eas build --platform ios
```
   Build output: IPA file available for download from EAS dashboard

#### Build Outputs Summary

- **Web**: `dist/` directory
- **Android APK**: `android/app/build/outputs/apk/release/app-release.apk`
- **Android Bundle**: `android/app/build/outputs/bundle/release/app-release.aab`
- **iOS**: `.ipa` file (location varies by build method)

### Key Adaptations for Mobile

When converting to React Native, consider these adaptations:

1. **Navigation**: Replace Wouter with React Navigation
2. **Styling**: Convert Tailwind classes to StyleSheet objects
3. **Icons**: Use react-native-vector-icons or Expo vector icons
4. **API Calls**: Ensure proper network handling for mobile
5. **Storage**: Use AsyncStorage for local data persistence
6. **Push Notifications**: Integrate for booking confirmations
7. **Maps**: Add react-native-maps for location features
8. **Camera**: For profile pictures and experience photos

### Environment Configuration

Create environment files for different stages:

**.env.development**
```
API_BASE_URL=http://localhost:5000
```

**.env.production**
```
API_BASE_URL=https://your-production-api.com
```

## API Documentation

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/search?q=query&category=category` - Search experiences
- `GET /api/experiences/:id` - Get experience by ID
- `GET /api/experiences/:id/timeslots` - Get available time slots
- `GET /api/experiences/:id/packages` - Get pricing packages

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details

## Deployment

### Web Deployment
The application can be deployed to any Node.js hosting platform:
- Vercel
- Netlify
- Heroku
- Railway
- DigitalOcean App Platform

### Mobile App Stores
- **Google Play Store**: Follow React Native or Expo build guides
- **Apple App Store**: Requires Apple Developer account and macOS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile (if applicable)
5. Submit a pull request

## License

[Add your license information here]

## Support

For technical support or questions about mobile development setup, please contact the development team.
