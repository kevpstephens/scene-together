<div align="center">
  <img src="./mobile/assets/logo/logo-dark-cropped.png" alt="SceneTogether Logo" width="400"/>
  
  # SceneTogether
  
  **A community platform for movie lovers to discover and attend local film screenings**
  
  _Tech Returners - Commissioned Project_
  
  [🌐 **Live Demo**](https://scenetogether.netlify.app) • [📡 **API Docs**](https://api-production-c815.up.railway.app/health) • [💻 **GitHub**](https://github.com/kevpstephens/scene-together)
  
</div>

---

## 🚀 Live Deployment

**Frontend:** https://scenetogether.netlify.app  
**Backend API:** https://api-production-c815.up.railway.app

The app is fully deployed and ready to use! Sign up with email or Google OAuth to get started.

---

## What is SceneTogether?

Ever wished there was an easier way to organize movie nights with your community? SceneTogether is a full-stack events platform that lets film enthusiasts discover screenings, RSVP with a tap, and never miss a show. Built from the ground up with React Native (Expo) and Express.js, it works seamlessly on your phone, tablet, or computer.

Whether you're a member looking for your next cinema experience or an organizer managing events, SceneTogether has you covered.

---

## ✨ What You Can Do

### As a Member

- **Browse Screenings** - Find upcoming movie events with beautiful posters and trailers (powered by TMDB)
- **Get the Details** - View cast, runtime, genres, location, and timing at a glance
- **RSVP Instantly** - One tap to reserve your spot
- **Add to Calendar** - Never forget an event with device calendar integration
- **Search & Filter** - Find specific films or organizers quickly
- **Responsive Everywhere** - Works perfectly on any device

### As an Organizer (Admin)

- **Dashboard Overview** - See your events, attendance stats, and upcoming shows
- **Create Events** - Build screenings with auto-populated movie data from TMDB
- **Flexible Pricing** - Free events, fixed price, or pay-what-you-can
- **Attendee Management** - View who's coming and track capacity
- **Stripe Payments** - Secure payment processing for ticketed events
- **Full Control** - Edit or delete events as needed

---

## 🛠️ Built With

### Frontend

- **Expo / React Native** - Write once, deploy to iOS, Android, and Web
- **TypeScript** - Type safety throughout
- **React Navigation** - Smooth navigation with tab and stack navigators
- **Supabase Auth** - Secure authentication with OAuth support
- **Stripe SDK** - Native payment processing
- **Axios** - API communication

### Backend

- **Express.js** - Fast, minimal API server
- **Prisma ORM** - Type-safe database queries
- **PostgreSQL** - Reliable data storage (via Supabase)
- **Zod** - Runtime validation
- **JWT** - Secure token-based auth

### Services

- **Supabase** - Database hosting and authentication
- **TMDB** - Movie data, posters, and trailers
- **Stripe** - Payment processing
- **Netlify** - Frontend hosting
- **Railway** - Backend hosting

---

## 📁 How It's Organized

```
scene-together/
├── api/                      # Express backend
│   ├── src/
│   │   ├── middleware/       # Auth, validation, errors
│   │   ├── modules/          # Features (events, auth, payments, etc.)
│   │   ├── types/            # TypeScript types
│   │   └── server.ts         # App entry point
│   └── prisma/
│       ├── schema.prisma     # Database schema
│       └── migrations/       # Version history
│
├── mobile/                   # Expo app (iOS, Android, Web)
│   ├── src/
│   │   ├── components/       # Reusable UI pieces
│   │   ├── contexts/         # Auth and toast state
│   │   ├── navigation/       # App routing
│   │   ├── screens/          # All app screens
│   │   ├── services/         # API, calendar, payments
│   │   ├── theme/            # Design system
│   │   └── types/            # TypeScript types
│   └── assets/               # Images and logos
│
└── DEPLOYMENT.md             # Deployment instructions
```

---

## 🚀 Running Locally

### What You'll Need

- Node.js 18+
- pnpm (or npm)
- A Supabase account (free tier works great)
- A TMDB API key (also free)
- Expo Go app (optional, for mobile testing)

### Quick Setup

**1. Clone and install**

```bash
git clone <your-repo-url>
cd scene-together
pnpm install
```

**2. Configure the backend**

```bash
cd api
cp .env.example .env
```

Fill in your `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-secret-key-min-32-characters"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_KEY="your-service-key"
TMDB_API_KEY="your-tmdb-key"
PORT=3000
```

**3. Configure the frontend**

```bash
cd mobile
cp .env.example .env
```

Fill in your `.env`:

```env
EXPO_PUBLIC_API_URL="http://localhost:3000"
EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
EXPO_PUBLIC_TMDB_API_KEY="your-tmdb-key"
```

**4. Set up the database**

```bash
cd api
npx prisma generate
npx prisma migrate dev
```

**5. Start everything**

Terminal 1 (Backend):

```bash
cd api
npm run dev
```

Terminal 2 (Frontend):

```bash
cd mobile
npm run web        # For browser
# OR
npm start          # For Expo Go (mobile)
```

**6. Make yourself an admin**

After signing up, update your role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Or use Prisma Studio: `npx prisma studio`

---

## 🌐 Platform Support

| Platform    | Development            | Production           |
| ----------- | ---------------------- | -------------------- |
| **Web**     | ✅ Browser             | ✅ Static PWA        |
| **iOS**     | ✅ Expo Go / Simulator | ⚠️ App Store needed  |
| **Android** | ✅ Expo Go / Emulator  | ⚠️ Play Store needed |

> For this bootcamp project, web deployment is the target. Native builds are optional.

---

## 📚 More Info

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Full deployment guide
- **[mobile/README.md](./mobile/README.md)** - Frontend details
- **[api/README.md](./api/README.md)** - Backend API reference

---

## 🎨 Design Philosophy

The app features a dark theme with teal accents, inspired by modern cinema apps. I wanted something that felt premium but approachable - like you're browsing a curated film festival rather than a corporate booking system. The glassmorphism effects (on web) add depth without overwhelming the content.

---

## 🔐 Security & Roles

The app has three user levels:

- **USER** - Can browse events and RSVP (everyone starts here)
- **ADMIN** - Can create and manage events
- **SUPER_ADMIN** - Reserved for future features

Authentication uses Supabase + JWT, with tokens verified on every API request. Passwords are hashed, sessions are secure, and role checks happen both client and server-side.

---

## 🧪 Manual Testing Checklist

**Basic User Flow:**

- [ ] Sign up with email
- [ ] Browse events list
- [ ] Search for a movie
- [ ] View event details and trailer
- [ ] RSVP to an event
- [ ] Add event to calendar
- [ ] Check profile
- [ ] Sign out

**Admin Flow:**

- [ ] Access admin dashboard
- [ ] Create a new event
- [ ] Search TMDB for a movie
- [ ] Edit an existing event
- [ ] View attendee list
- [ ] Delete an event

**Responsive:**

- [ ] Mobile phone
- [ ] Tablet
- [ ] Desktop browser

---

## 📊 Database Structure

Four main tables power the app:

**Users** - Authentication, profile, role  
**Events** - Screening details, pricing, capacity  
**RSVPs** - User reservations, payment status  
**MovieData** - Cached TMDB data (posters, trailers, etc.)

See `api/prisma/schema.prisma` for the full schema.

---

## 🔄 API Overview

### Public Routes

```
POST   /auth/signup           Create account
POST   /auth/login            Sign in
GET    /events                List all events
GET    /events/:id            Event details
```

### Authenticated Routes

```
GET    /auth/me               Current user info
POST   /events/:id/rsvp       RSVP to event
DELETE /events/:id/rsvp       Cancel RSVP
```

### Admin Routes

```
POST   /events                Create event
PUT    /events/:id            Update event
DELETE /events/:id            Delete event
GET    /events/:id/attendees  View attendees
```

Full API docs in `api/README.md`.

---

## ✅ Project Goals Met

This project was built to meet the Tech Returners bootcamp requirements:

**Functional:**

- ✅ Admin can create movie screening events
- ✅ Users can RSVP to events
- ✅ Calendar integration for confirmed RSVPs
- ✅ TMDB API integration for movie data

**Technical:**

- ✅ TypeScript throughout
- ✅ React Native (Expo) for cross-platform deployment
- ✅ Express.js REST API
- ✅ PostgreSQL with Prisma
- ✅ Secure authentication and authorization
- ✅ Professional documentation

**Non-Functional:**

- ✅ Deployed on free hosting
- ✅ Responsive design
- ✅ Error handling and loading states
- ✅ Clean, maintainable code

---

## 🐛 Known Quirks

**On Web:**

- Calendar integration downloads `.ics` files (browser limitation)
- No haptic feedback (obviously)
- OAuth popups might be blocked by some browsers

**On Mobile:**

- Calendar permissions required
- iOS 13+ recommended
- Push notifications not implemented yet

---

## 📝 License

This is a portfolio project built for and commissioned by Tech Returners.

</div>
