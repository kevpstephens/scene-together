<div align="center">
  <img src="./assets/logo/logo-dark-cropped.png" alt="SceneTogether Logo" width="350"/>
  
  # Mobile App
  
  **Universal React Native app powering SceneTogether on iOS, Android, and Web**
  
  [🌐 **Live Web App**](https://scenetogether.netlify.app)
  
</div>

---

## 🚀 Live Deployment

The app is deployed and accessible at: **https://scenetogether.netlify.app**

This Expo Web build is fully functional with all features including authentication, payments, calendar integration, and real-time updates.

---

## What's This?

This is the frontend for SceneTogether - a single Expo app that runs everywhere. Same codebase, same features, whether you're on an iPhone, Android device, or browsing on desktop.

The app is built around making event discovery and RSVPs as smooth as possible. Dark theme, clean animations, and a focus on the content (those beautiful movie posters!).

---

## 🎯 What It Does

### For Everyone

- **Browse Screenings** - Scroll through upcoming events with movie posters
- **Rich Details** - Watch trailers, read descriptions, see cast and runtime
- **Quick Search** - Find events by movie title or organizer
- **One-Tap RSVP** - Reserve your spot instantly
- **Calendar Sync** - Add events straight to your device calendar
- **Payments** - Stripe integration for paid events

### For Admins

- **Dashboard** - See stats and quick actions at a glance
- **Event Creator** - Search TMDB, add details, set pricing
- **Attendee Lists** - Check who's coming to your events
- **Full Management** - Edit or delete events as needed

### The Experience

- Dark theme that's easy on the eyes
- Blur effects on web (glassmorphism vibes)
- Smooth animations and haptic feedback (mobile)
- Responsive design that adapts to any screen size
- Toast notifications for feedback
- Loading skeletons for better perceived performance

---

## 🛠️ Tech Choices

| What           | Why                                           |
| -------------- | --------------------------------------------- |
| **Expo**       | Write once, deploy everywhere                 |
| **TypeScript** | Catch bugs before they happen                 |
| **React Nav**  | Smooth navigation with tab + stack            |
| **Context**    | Simple state management, no overkill          |
| **Supabase**   | Auth that just works                          |
| **Stripe SDK** | Native payment flows                          |
| **Axios**      | Clean API calls with interceptors             |
| **StyleSheet** | Platform-optimized styling with design system |

---

## 📁 Project Layout

```
mobile/
├── src/
│   ├── components/              # Reusable bits
│   │   ├── AnimatedButton       # Spring animations
│   │   ├── DateTimePicker       # Cross-platform picker
│   │   ├── GradientBackground   # Animated gradient
│   │   ├── SkeletonLoader       # Loading states
│   │   └── Toast                # Notifications
│   │
│   ├── contexts/
│   │   ├── auth/                # Auth state + actions
│   │   └── toast/               # Toast notifications
│   │
│   ├── navigation/              # All the routing
│   │   ├── RootNavigator        # Main router
│   │   ├── AuthNavigator        # Login/signup flow
│   │   ├── MainTabNavigator     # Bottom tabs
│   │   └── ...Stack navigators
│   │
│   ├── screens/                 # All the pages
│   │   ├── admin/               # Admin-only screens
│   │   ├── auth/                # Login + signup
│   │   ├── EventDetailScreen/
│   │   ├── EventsListScreen/
│   │   ├── ProfileScreen/
│   │   └── ...
│   │
│   ├── services/
│   │   ├── api.ts               # Axios + interceptors
│   │   ├── calendar/            # Calendar integration
│   │   └── payment.ts           # Stripe handling
│   │
│   ├── theme/                   # Design system
│   │   ├── index.ts             # Colors, spacing, etc.
│   │   └── styles.ts            # Helper functions
│   │
│   └── types/                   # TypeScript defs
│
├── assets/                      # Images and logos
├── app.json                     # Expo config
└── netlify.toml                 # Web deployment
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- Expo Go app (for mobile testing)
- Xcode (Mac only, for iOS dev)
- Android Studio (for Android dev)

### Setup

**1. Install dependencies**

```bash
cd mobile
pnpm install
```

**2. Create your `.env`**

```bash
cp .env.example .env
```

Fill it in:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_TMDB_API_KEY=your-tmdb-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**3. Start developing**

```bash
npm start           # Opens Expo dev server
npm run web         # Launch in browser
npm run ios         # iOS simulator (Mac only)
npm run android     # Android emulator
```

Scan the QR code with Expo Go to test on your actual phone.

---

## 🎨 The Design System

Everything's centralized in `src/theme/index.ts`. No magic numbers scattered around.

### Colors

```typescript
primary: "#46D4AF"        // Teal accent
background: "#0F1419"     // Very dark blue-gray
surface: "#151C23"        // Card backgrounds
text.primary: "#E8EAED"   // Light gray
text.secondary: "#9CA3AF" // Medium gray
```

### Spacing

```typescript
xs: 4, sm: 8, md: 12, base: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64
```

All multiples of 4 for consistency.

### Typography

```typescript
fontSize: { xs: 12, sm: 14, base: 16, lg: 20, xl: 24, xxl: 30, xxxl: 36 }
fontWeight: { light: "300", normal: "400", semibold: "600", bold: "700" }
```

### Using It

```typescript
import { theme } from "../theme";

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.base,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
});
```

---

## 🔐 Auth Flow

The `AuthContext` handles everything:

```typescript
import { useAuth } from "../contexts/auth";

function MyComponent() {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();

  if (loading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Hi, {user?.displayName}!</Text>
      {isAdmin && <AdminButton />}
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}
```

**Roles:**

- `USER` - Browse and RSVP
- `ADMIN` - Full event management
- `SUPER_ADMIN` - Everything (future use)

---

## 📡 API Integration

All API calls go through `src/services/api.ts`:

```typescript
import { api } from "../services/api";

// GET
const events = await api.get("/events");

// POST
const response = await api.post("/events", eventData);

// With params
const event = await api.get(`/events/${id}`);
```

The Axios instance automatically injects auth tokens from Supabase.

---

## 📱 Platform Differences

### Native-Only

- **Haptic feedback** via `expo-haptics`
- **Full calendar access** (read/write)
- **Native share** via `expo-sharing`
- **App icons & splash screens**

### Web-Only

- **Glassmorphism** (backdrop blur)
- **Browser calendar** (.ics downloads)
- **URL-based routing**

### Detecting Platform

```typescript
import { Platform } from "react-native";

if (Platform.OS === "web") {
  // Web-specific code
} else {
  // Native code (iOS/Android)
}
```

---

## 🌐 Deploying to Web

Expo can export a static website that works anywhere:

```bash
npx expo export:web
```

This creates `web-build/` with optimized static files.

### Deploy to Netlify

**Via CLI:**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=web-build
```

**Via Git:**

1. Push to GitHub
2. Connect repo in Netlify
3. Build command: `cd mobile && npx expo export:web`
4. Publish directory: `mobile/web-build`
5. Set environment variables in dashboard

---

## 🧪 Testing Checklist

**User Journey:**

- [ ] Sign up / sign in
- [ ] Browse events
- [ ] Search for a movie
- [ ] View event details
- [ ] Watch a trailer
- [ ] RSVP to an event
- [ ] Add to calendar
- [ ] Check profile
- [ ] Sign out

**Admin Journey:**

- [ ] Access dashboard
- [ ] Create event with TMDB search
- [ ] Edit event
- [ ] View attendees
- [ ] Delete event

**Responsiveness:**

- [ ] iPhone (portrait)
- [ ] iPad (landscape)
- [ ] Desktop browser
- [ ] Large displays

---

## 🐛 Quirks & Limitations

### Web

- Calendar integration is limited to `.ics` file downloads
- No haptic feedback (obviously)
- OAuth popups might be blocked by strict browser settings

### Mobile

- Calendar permissions are required
- iOS 13+ recommended for best experience
- Push notifications aren't implemented yet

### General

- TMDB has rate limits (40 requests per 10 seconds)
- Stripe is in test mode during development

---

## 🔧 Troubleshooting

### "Unable to resolve module"

```bash
rm -rf node_modules .expo
pnpm install
npx expo start --clear
```

### "Network request failed"

- Check `EXPO_PUBLIC_API_URL` in `.env`
- Make sure backend is running
- Verify device is on same network as dev machine

### "Calendar permissions denied"

- Go to device Settings → Privacy → Calendar
- Grant permissions to Expo Go (or your app)

### Build issues

Clear everything and start fresh:

```bash
npx expo start --clear
```

---

## 🤝 Contributing

If you're building on this:

1. Use the theme system, don't hardcode colors/spacing
2. Add proper TypeScript types
3. Wrap native-only features in `Platform.OS` checks
4. Add JSDoc comments for complex functions
5. Use `React.memo` for expensive components

---

## 🆘 Need Help?

- Deployment issues? Check `../DEPLOYMENT.md`
- Expo docs: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/
- Supabase: https://supabase.com/docs

---

## 📄 License

This is a portfolio project built for and commissioned by Tech Returners.

---
