# SceneTogether 🎬

A community movie screening events platform built with React Native (Expo) and Express.js. Users can browse upcoming movie screenings, RSVP to events, and add them to their calendar. Administrators can manage events, view attendees, and integrate movie data from TMDB.

## 📱 Live Demo

- **Web App**: [Your deployment URL]
- **Repository**: [Your GitHub URL]

## ✨ Features

### For Users

- 🎥 Browse upcoming movie screening events
- 🎬 View detailed event information with movie posters
- ✅ RSVP to events (Going/Interested)
- 📅 Add events to device calendar
- 🔐 Secure authentication via Supabase
- 📱 Fully responsive (mobile, tablet, desktop)

### For Admins

- 📊 Admin dashboard with event statistics
- ➕ Create and manage screening events
- 🎞️ Search and integrate TMDB movie data
- 👥 View event attendees and capacity tracking
- ✏️ Edit and delete events
- 🔒 Role-based access control

## 🏗️ Architecture

This is a **consolidated single-app architecture** using Expo's universal platform capabilities:

```
┌─────────────────────────────────────────────────────┐
│  Frontend: Expo React Native                        │
│  - iOS & Android apps (via Expo Go)                │
│  - Web app (deployed as static site)               │
│  - Unified codebase with role-based routing        │
│  - Local theme and types (no external dependencies)│
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  Backend: Express.js API                            │
│  - RESTful API                                       │
│  - Prisma ORM                                        │
│  - JWT authentication                                │
│  - Standalone with local types                      │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  Database: PostgreSQL (Supabase)                    │
│  - User management                                   │
│  - Events & RSVPs                                    │
│  - Role-based access control                         │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Frontend (Universal App)

- **Framework**: Expo / React Native
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Authentication**: Supabase Auth
- **API Client**: Axios
- **Styling**: StyleSheet with shared design system
- **Icons**: react-native-heroicons
- **Calendar**: expo-calendar

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth + JWT
- **Validation**: Zod

### External Services

- **Database/Auth**: Supabase
- **Movie Data**: TMDB (The Movie Database) API
- **Hosting**:
  - Frontend: Netlify/Vercel (static site)
  - Backend: Railway/Render
  - Database: Supabase

## 📁 Project Structure

```
scene-together/
├── api/                    # Express.js backend
│   ├── src/
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── modules/        # Feature modules (events, auth, etc.)
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Shared utilities
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── package.json
│
├── mobile/                 # Expo React Native app (mobile + web)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, Toast)
│   │   ├── navigation/     # Navigation stacks (Events, Admin, Profile)
│   │   ├── screens/        # App screens
│   │   │   ├── admin/      # Admin-only screens
│   │   │   ├── auth/       # Login & signup
│   │   │   └── ...         # User screens
│   │   ├── services/       # API client, calendar service
│   │   ├── theme/          # Design system (local)
│   │   └── types/          # TypeScript types (local)
│   ├── app.json            # Expo configuration
│   ├── metro.config.js     # Metro bundler config
│   ├── netlify.toml        # Netlify deployment config
│   ├── vercel.json         # Vercel deployment config
│   └── package.json
│
├── DEPLOYMENT.md           # Comprehensive deployment guide
├── CONSOLIDATION_SUMMARY.md # Consolidation documentation
├── package.json            # Workspace root
├── pnpm-workspace.yaml     # PNPM workspace config
└── turbo.json              # Turborepo config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- PostgreSQL database (Supabase account)
- Expo Go app (for mobile testing)

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd scene-together
```

### 2. Install Dependencies

```bash
pnpm install
# or: npm install
```

### 3. Set Up Environment Variables

**Backend (`api/.env`)**:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_KEY="your-service-role-key"
PORT=3000
```

**Frontend (`mobile/.env`)**:

```env
EXPO_PUBLIC_API_URL="http://localhost:3000"
EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 4. Set Up Database

```bash
cd api
npx prisma generate
npx prisma migrate dev
```

### 5. Start Development Servers

**Terminal 1 - Backend**:

```bash
cd api
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Frontend (Web)**:

```bash
cd mobile
npm run web
# Opens http://localhost:8081
```

**OR - Frontend (Mobile)**:

```bash
cd mobile
npm start
# Scan QR code with Expo Go app
```

### 6. Create Admin User

After signing up, manually set your role to ADMIN in the database:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:

```bash
cd api
npx prisma studio
```

## 📱 Platform Support

### Development

- ✅ iOS (Expo Go / Simulator)
- ✅ Android (Expo Go / Emulator)
- ✅ Web (Browser)

### Production

- ✅ Web (Deployed as static PWA)
- ⚠️ iOS/Android (Requires App Store submission - not required for this project)

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

### Quick Deploy

**Frontend (Netlify)**:

```bash
cd mobile
npx expo export:web
netlify deploy --prod --dir=web-build
```

**Backend (Railway)**:

1. Connect GitHub repo to Railway
2. Select `api` directory
3. Add PostgreSQL database
4. Set environment variables
5. Deploy automatically

## 🎨 Design System

The app uses a consistent design system with:

- **Colors**: Turquoise primary, pink accent
- **Typography**: System fonts with defined sizes
- **Spacing**: 8px base unit
- **Animations**: Smooth transitions and micro-interactions
- **Components**: Reusable, accessible UI components

## 🔐 Authentication & Authorization

### User Roles

- **USER**: Browse events, RSVP (default)
- **ADMIN**: Full event management
- **SUPER_ADMIN**: Future expansion

### Flow

1. User signs up via Supabase Auth
2. Backend creates user record with default `USER` role
3. Auth tokens validated on every API request
4. Role determines UI visibility and API permissions

## 🧪 Testing

### Manual Testing

```bash
# Web
cd mobile && npm run web

# iOS
cd mobile && npm run ios

# Android
cd mobile && npm run android
```

### Features to Test

- ✅ User signup/login
- ✅ Event browsing
- ✅ RSVP functionality
- ✅ Calendar integration
- ✅ Admin dashboard (as admin user)
- ✅ Event creation with TMDB search
- ✅ Responsive design on different screen sizes

## 📊 Database Schema

Key entities:

- **Users**: Authentication and profile data
- **Events**: Movie screening event details
- **RSVPs**: User event reservations
- **MovieData**: Cached TMDB movie information

See `api/prisma/schema.prisma` for full schema.

## 🔄 API Endpoints

### Public

- `POST /auth/signup` - Create account
- `POST /auth/login` - Login
- `GET /events` - List events
- `GET /events/:id` - Event details

### Authenticated

- `GET /auth/me` - Current user
- `POST /events/:id/rsvp` - RSVP to event
- `GET /events/:id/rsvp` - Get user's RSVP status

### Admin Only

- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `GET /events/:id/attendees` - List attendees

## 🎯 Project Requirements Met

✅ **Functional Requirements**:

- Events creation by staff (admin)
- Event signup by non-staff (users)
- Google Calendar integration for RSVP'd events
- TMDB API integration for movie data

✅ **Non-Functional Requirements**:

- Built with TypeScript
- Responsive design (mobile-first)
- Accessibility considerations
- Secure authentication (Supabase + JWT)
- Hosted on free platforms (Netlify/Vercel + Railway)
- Comprehensive documentation

✅ **Performance**:

- Loading states and skeletons
- Error handling with user-friendly messages
- Optimized images and caching

## 🤝 Contributing

This is a portfolio project for Tech Returners Skills Bootcamp submission.

## 📄 License

Educational/Portfolio Project - Tech Returners Skills Bootcamp

## 🙏 Acknowledgments

- **Tech Returners** - Skills Bootcamp Program
- **TMDB** - Movie data and posters
- **Supabase** - Backend as a Service
- **Expo** - Universal React Native platform

## 📞 Contact

Kevin Stephenson - [Your contact info]

---

**Built with passion as part of Tech Returners Software Engineering Bootcamp** 🚀
