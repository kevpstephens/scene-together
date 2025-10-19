<div align="center">
  <img src="../mobile/assets/logo/logo-transparent.png" alt="SceneTogether Logo" width="350"/>
  
  # Backend API
  
  **Express.js REST API powering SceneTogether**
  
</div>

---

## What's This?

This is the backend that powers SceneTogether. A straightforward Express API that handles authentication, event management, RSVPs, movie data from TMDB, and payments via Stripe.

Built with TypeScript for type safety, Prisma for database access, and Zod for validation. Nothing fancy - just clean, reliable code.

---

## 🎯 What It Does

### Core Features

- **RESTful API** - Predictable endpoints, standard HTTP methods
- **JWT Auth** - Token-based authentication with Supabase integration
- **Role-Based Access** - USER, ADMIN, and SUPER_ADMIN permissions
- **Database** - PostgreSQL with Prisma ORM for type-safe queries
- **Validation** - Zod schemas on all inputs
- **Error Handling** - Centralized middleware for consistent responses

### Integrations

- **TMDB** - Fetch movie data, posters, trailers
- **Stripe** - Process payments and handle webhooks
- **Supabase** - Authentication and database hosting

---

## 🛠️ Tech Stack

| What           | Why                                 |
| -------------- | ----------------------------------- |
| **Express**    | Fast, minimal, battle-tested        |
| **TypeScript** | Catch bugs at compile time          |
| **Prisma**     | Type-safe database queries          |
| **PostgreSQL** | Reliable, powerful, free tier       |
| **Zod**        | Runtime validation that makes sense |
| **JWT**        | Stateless auth tokens               |
| **Stripe**     | Payment processing done right       |
| **Morgan**     | HTTP request logging                |

---

## 📁 Project Structure

```
api/
├── src/
│   ├── middleware/              # Express middleware
│   │   ├── auth.ts              # JWT verification
│   │   ├── errorHandler.ts     # Global error handling
│   │   └── validate.ts          # Zod schema validation
│   │
│   ├── modules/                 # Feature modules
│   │   ├── auth/                # Signup, login
│   │   ├── events/              # Event CRUD
│   │   ├── movies/              # TMDB integration
│   │   ├── payments/            # Stripe handling
│   │   ├── rsvps/               # RSVP management
│   │   └── users/               # User info
│   │
│   ├── types/                   # Shared TypeScript types
│   ├── utils/                   # Helper functions
│   └── server.ts                # Express app setup
│
└── prisma/
    ├── schema.prisma            # Database schema
    └── migrations/              # Version history
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- PostgreSQL database (Supabase works great)
- TMDB API key (free at themoviedb.org)
- Stripe account (optional, for payments)

### Setup

**1. Install dependencies**

```bash
cd api
pnpm install
```

**2. Create your `.env`**

```bash
cp .env.example .env
```

Fill it in:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Auth
JWT_SECRET="your-secret-key-minimum-32-characters"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_KEY="your-service-role-key"

# TMDB
TMDB_API_KEY="your-tmdb-key"
TMDB_BASE_URL="https://api.themoviedb.org/3"

# Stripe (optional)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Server
PORT=3000
NODE_ENV=development
```

**3. Generate Prisma Client**

```bash
npx prisma generate
```

**4. Run migrations**

```bash
npx prisma migrate dev
```

**5. Start the server**

```bash
npm run dev
```

Server runs on `http://localhost:3000` with hot reload.

---

## 📊 Database Schema

Four main tables:

### Users

```prisma
model User {
  id              String   @id @default(uuid())
  email           String   @unique
  displayName     String?
  role            Role     @default(USER)
  supabaseId      String   @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  createdEvents   Event[]
  rsvps           RSVP[]
}
```

### Events

```prisma
model Event {
  id              String   @id @default(uuid())
  title           String
  description     String?
  date            DateTime
  location        String
  capacity        Int?
  price           Decimal?
  payWhatYouCan   Boolean  @default(false)
  minPrice        Decimal?
  createdById     String
  movieId         String?

  createdBy       User
  movieData       MovieData?
  rsvps           RSVP[]
}
```

### RSVPs

```prisma
model RSVP {
  id              String   @id @default(uuid())
  userId          String
  eventId         String
  status          RSVPStatus
  paymentStatus   PaymentStatus @default(PENDING)
  amountPaid      Decimal?
  stripePaymentId String?

  user            User
  event           Event

  @@unique([userId, eventId])
}
```

### MovieData

```prisma
model MovieData {
  id              String   @id @default(uuid())
  tmdbId          Int      @unique
  title           String
  overview        String?
  posterPath      String?
  backdropPath    String?
  releaseDate     String?
  runtime         Int?
  genres          String[]
  voteAverage     Float?
  trailerKey      String?

  events          Event[]
}
```

Full schema: `prisma/schema.prisma`

---

## 🔄 API Endpoints

### Authentication

**Sign Up**

```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123",
  "displayName": "John Doe"
}

→ 200 OK
{
  "user": { "id": "...", "email": "...", "role": "USER" },
  "token": "jwt-token"
}
```

**Sign In**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123"
}

→ 200 OK
{
  "user": { ... },
  "token": "jwt-token"
}
```

**Get Current User**

```http
GET /auth/me
Authorization: Bearer <token>

→ 200 OK
{
  "id": "...",
  "email": "...",
  "displayName": "...",
  "role": "ADMIN"
}
```

---

### Events

**List Events**

```http
GET /events?upcoming=true&limit=20

→ 200 OK
{
  "events": [
    {
      "id": "...",
      "title": "The Matrix Screening",
      "date": "2024-12-25T19:00:00Z",
      "location": "Cinema Room A",
      "capacity": 50,
      "price": "10.00",
      "movieData": { ... },
      "_count": { "rsvps": 25 }
    }
  ]
}
```

**Get Event Details**

```http
GET /events/:id

→ 200 OK
{
  "id": "...",
  "title": "...",
  "movieData": {
    "title": "The Matrix",
    "posterPath": "/path.jpg",
    "trailerKey": "youtube-id"
  }
}
```

**Create Event** (Admin only)

```http
POST /events
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "The Matrix Screening",
  "description": "Special showing",
  "date": "2024-12-25T19:00:00Z",
  "location": "Cinema A",
  "capacity": 50,
  "price": 10.00,
  "tmdbId": 603
}

→ 201 Created
```

**Update Event** (Admin only)

```http
PUT /events/:id
Authorization: Bearer <admin-token>

{ "capacity": 75 }

→ 200 OK
```

**Delete Event** (Admin only)

```http
DELETE /events/:id
Authorization: Bearer <admin-token>

→ 200 OK
```

---

### RSVPs

**Create RSVP**

```http
POST /events/:eventId/rsvp
Authorization: Bearer <token>

{ "status": "GOING" }

→ 200 OK
{
  "status": "GOING",
  "paymentStatus": "PENDING"
}
```

**Get RSVP Status**

```http
GET /events/:eventId/rsvp
Authorization: Bearer <token>

→ 200 OK
{ "status": "GOING", "paymentStatus": "COMPLETED" }
```

**Cancel RSVP**

```http
DELETE /events/:eventId/rsvp
Authorization: Bearer <token>

→ 200 OK
```

**List Attendees** (Admin only)

```http
GET /events/:eventId/attendees
Authorization: Bearer <admin-token>

→ 200 OK
{
  "attendees": [
    {
      "user": { "displayName": "John", "email": "..." },
      "status": "GOING",
      "paymentStatus": "COMPLETED"
    }
  ]
}
```

---

### Movies (TMDB)

**Search Movies**

```http
GET /movies/search?query=matrix

→ 200 OK
{
  "results": [
    {
      "id": 603,
      "title": "The Matrix",
      "poster_path": "/path.jpg",
      "release_date": "1999-03-31"
    }
  ]
}
```

**Get Movie Details**

```http
GET /movies/:tmdbId

→ 200 OK
{
  "id": 603,
  "title": "The Matrix",
  "runtime": 136,
  "genres": [...],
  "videos": { "results": [...] }
}
```

---

### Payments (Stripe)

**Create Payment Intent**

```http
POST /payments/create-payment-intent
Authorization: Bearer <token>

{
  "eventId": "...",
  "amount": 1000
}

→ 200 OK
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

**Webhook** (Stripe -> API)

```http
POST /payments/webhook
Stripe-Signature: <signature>

(Handles payment.succeeded, payment.failed)

→ 200 OK
```

---

## 🔐 Authentication & Roles

### How It Works

All protected routes check for a JWT token:

```
Authorization: Bearer <jwt-token>
```

Tokens contain: user ID, email, and role.

### Role Permissions

| Route                       | USER | ADMIN | SUPER_ADMIN |
| --------------------------- | ---- | ----- | ----------- |
| `GET /events`               | ✅   | ✅    | ✅          |
| `GET /events/:id`           | ✅   | ✅    | ✅          |
| `POST /events/:id/rsvp`     | ✅   | ✅    | ✅          |
| `POST /events`              | ❌   | ✅    | ✅          |
| `PUT /events/:id`           | ❌   | ✅    | ✅          |
| `DELETE /events/:id`        | ❌   | ✅    | ✅          |
| `GET /events/:id/attendees` | ❌   | ✅    | ✅          |

Implementation:

```typescript
app.use("/events", authenticateJWT);
app.post("/events", requireRole(["ADMIN", "SUPER_ADMIN"]), createEvent);
```

---

## 🧪 Testing the API

### With curl

```bash
# Sign up
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","displayName":"Test"}'

# List events
curl http://localhost:3000/events

# Create event (with auth)
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","date":"2024-12-25T19:00:00Z","location":"Test"}'
```

### With Postman/Insomnia

1. Import collection
2. Base URL: `http://localhost:3000`
3. Add `Authorization: Bearer <token>` to protected routes

---

## 🔧 Available Scripts

```bash
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm start            # Start production server
npx prisma studio    # GUI for database
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev --name <name>  # New migration
```

---

## 🐛 Common Issues

### "Can't reach database server"

- Check `DATABASE_URL` in `.env`
- Verify PostgreSQL is running
- Test connection to Supabase

### "Migration failed"

- Run `npx prisma migrate reset` (WARNING: deletes data)
- Check for schema conflicts
- Ensure database user has permissions

### TMDB "401 Unauthorized"

- Verify `TMDB_API_KEY` is correct
- Check key is active on TMDB website

### TMDB "429 Too Many Requests"

- TMDB limit: 40 requests per 10 seconds
- Implement caching or throttling

### Stripe "Webhook signature failed"

- Check `STRIPE_WEBHOOK_SECRET` matches dashboard
- Ensure endpoint is publicly accessible
- Use Stripe CLI for local testing:
  ```bash
  stripe listen --forward-to localhost:3000/payments/webhook
  ```

---

## 🚀 Deployment

### Railway

1. Connect GitHub repo
2. Select `api` directory
3. Add PostgreSQL database
4. Set environment variables
5. Deploy automatically

### Render

1. Create Web Service
2. Root directory: `api`
3. Build: `npm install && npx prisma generate && npm run build`
4. Start: `npm start`
5. Add PostgreSQL database (separate)

### Environment Variables (Production)

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="production-secret-32-chars-min"
SUPABASE_URL="https://..."
SUPABASE_SERVICE_KEY="..."
TMDB_API_KEY="..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
PORT=3000
NODE_ENV=production
```

---

## 📄 License

This is a portfolio project built for and commissioned by Tech Returners.

---

## 🆘 Need Help?

- Full deployment guide: `../DEPLOYMENT.md`
- Prisma docs: https://www.prisma.io/docs
- Express: https://expressjs.com/
- Supabase: https://supabase.com/docs

---

<div align="center">

**Built with Express + copious amounts of Postman testing**

</div>
