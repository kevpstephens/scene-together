# SceneTogether Mobile App

A React Native mobile application (with web support) for community movie screening events.

## 🎯 Features

### For All Users

- **Browse Events**: View upcoming movie screenings with beautiful movie posters
- **Event Details**: See full event information, movie details from TMDB
- **RSVP**: Reserve your spot at events
- **Calendar Integration**: Add events to your device calendar
- **Responsive Design**: Works on mobile, tablet, and web browsers
- **Authentication**: Secure login with Supabase Auth

### For Admin Users

- **Dashboard**: View event statistics and quick actions
- **Manage Events**: Create, edit, and delete screening events
- **TMDB Integration**: Search and add movie data automatically
- **View Attendees**: See who has RSVP'd to each event
- **Capacity Tracking**: Monitor event attendance in real-time

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Authentication**: Supabase Auth
- **API Client**: Axios
- **Styling**: StyleSheet (React Native)
- **Icons**: react-native-heroicons
- **Design System**: Shared theme from `../shared`

## 📱 Supported Platforms

- ✅ iOS (via Expo Go or standalone build)
- ✅ Android (via Expo Go or standalone build)
- ✅ Web (deployed as PWA)
- ✅ Desktop (via Expo Web)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Expo Go app (for mobile testing)

### Installation

1. **Install dependencies**:

   ```bash
   cd mobile
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file:

   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

### Running on Different Platforms

**Web**:

```bash
npm run web
# Opens http://localhost:8081
```

**iOS** (Mac only):

```bash
npm run ios
# Opens in iOS Simulator
```

**Android**:

```bash
npm run android
# Opens in Android Emulator
```

**Mobile Device**:

```bash
npm start
# Scan QR code with Expo Go app
```

## 📁 Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AnimatedButton.tsx
│   │   ├── EventCardSkeleton.tsx
│   │   ├── GradientBackground.tsx
│   │   └── Toast.tsx
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   ├── navigation/          # Navigation configuration
│   │   ├── AdminStackNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── EventsStackNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   ├── ProfileStackNavigator.tsx
│   │   └── RootNavigator.tsx
│   ├── screens/             # App screens
│   │   ├── admin/           # Admin-only screens
│   │   │   ├── AdminDashboardScreen.tsx
│   │   │   ├── AdminEventsScreen.tsx
│   │   │   ├── AdminEventCreateScreen.tsx
│   │   │   ├── AdminEventEditScreen.tsx
│   │   │   └── AdminEventAttendeesScreen.tsx
│   │   ├── auth/            # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   ├── EventDetailScreen.tsx
│   │   ├── EventsListScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/            # API and services
│   │   ├── api.ts
│   │   └── calendarService.ts
│   ├── theme/               # Theme configuration
│   │   └── index.ts
│   └── types/               # TypeScript types
│       └── index.ts
├── assets/                  # Images and static assets
├── app.json                 # Expo configuration
├── netlify.toml            # Netlify deployment config
├── vercel.json             # Vercel deployment config
└── package.json
```

## 🎨 Design System

The app uses a centralized design system from `src/theme/index.ts`:

```typescript
const theme = {
  colors: {
    primary: "#46D4AF", // Turquoise
    accent: "#FF6B9D", // Pink
    background: "#EFF0EF", // Light grey
    surface: "#FFFFFF", // White
    text: {
      primary: "#000102",
      secondary: "#4A5568",
      tertiary: "#A0AEC0",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  // ... more theme properties
};
```

## 🔐 Authentication & Authorization

### User Roles

- **USER**: Can browse events and RSVP
- **ADMIN**: Can create, edit, delete events and view attendees
- **SUPER_ADMIN**: Full access (future expansion)

### Role-Based UI

The app conditionally shows admin features:

- Admin tab only visible to ADMIN/SUPER_ADMIN users
- Role is fetched from `/auth/me` endpoint on login
- Stored in AuthContext for easy access

### Implementation

```typescript
// In any component
const { isAdmin } = useAuth();

{isAdmin && (
  <AdminButton onPress={handleAdminAction} />
)}
```

## 📡 API Integration

The app communicates with the Express backend via REST API:

**Base URL**: Configured via `EXPO_PUBLIC_API_URL`

**Key Endpoints**:

- `GET /events` - List all events
- `GET /events/:id` - Get event details
- `POST /events` - Create event (admin only)
- `PUT /events/:id` - Update event (admin only)
- `DELETE /events/:id` - Delete event (admin only)
- `POST /events/:id/rsvp` - RSVP to event
- `GET /events/:id/attendees` - List attendees (admin only)
- `GET /auth/me` - Get current user info

**Authentication**: Uses Supabase session tokens automatically via Axios interceptors.

## 🌐 Web Deployment

This Expo app can be deployed as a static website:

### Build for Web

```bash
npx expo export:web
```

This creates a `web-build/` directory with static files.

### Deploy Options

**Netlify** (Recommended):

```bash
netlify deploy --prod --dir=web-build
```

**Vercel**:

```bash
vercel --prod
```

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

### Manual Testing Checklist

**User Flow**:

- [ ] Sign up new account
- [ ] Log in
- [ ] View events list
- [ ] View event details
- [ ] RSVP to event
- [ ] Add event to calendar
- [ ] View profile
- [ ] Log out

**Admin Flow**:

- [ ] Log in as admin
- [ ] View admin dashboard
- [ ] Create new event
- [ ] Search movie on TMDB
- [ ] Edit existing event
- [ ] View attendees list
- [ ] Delete event

**Responsive Design**:

- [ ] Test on iPhone (small screen)
- [ ] Test on iPad (tablet)
- [ ] Test on web browser (desktop)
- [ ] Test landscape orientation

## 🐛 Known Issues & Limitations

### Web Compatibility

- **Haptic Feedback**: Not available on web (gracefully handled)
- **Calendar Integration**: Limited on web browsers
- **OAuth**: May require additional configuration for production

### Mobile

- **Calendar Permissions**: Must be granted by user
- **Push Notifications**: Not yet implemented

## 🔧 Development Tips

### Hot Reload

Changes auto-reload in development. If issues occur:

```bash
# Clear cache
rm -rf .expo node_modules
npm install
npm start --clear
```

### Debugging

**React Native Debugger**:

```bash
npm start
# Press 'j' to open debugger
```

**Web Console**:

```bash
npm run web
# Open browser DevTools (F12)
```

**Logs**:

```typescript
console.log(); // Shows in terminal and browser console
```

### Common Issues

**"Unable to resolve module"**:

```bash
npm install
npx expo start --clear
```

**"Network request failed"**:

- Check API URL in `.env`
- Ensure backend is running
- Check network connectivity

**"Expo Go is not supported"** warnings:

- These are normal for certain packages
- App still works in Expo Go for most features

## 📦 Building for Production

### Web (Static Site)

```bash
npx expo export:web
```

### iOS (requires Mac)

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

See [Expo EAS Build documentation](https://docs.expo.dev/build/introduction/) for details.

## 🤝 Contributing

When adding new features:

1. **Follow the design system** - Use theme values from `../shared`
2. **Type safety** - Add TypeScript types
3. **Web compatibility** - Wrap native-only features with Platform checks
4. **Accessibility** - Add accessible labels
5. **Performance** - Use React.memo for expensive components

## 📄 License

This project is part of a Skills Bootcamp portfolio submission.

## 🆘 Support

- See [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment help
- Check [Expo documentation](https://docs.expo.dev/)
- Review application logs for errors

---

**Built with ❤️ using Expo and React Native**
