# SceneTogether Web Admin Dashboard

A Next.js web application for managing film screening events.

## Features

- 🔐 **Authentication**: Supabase-powered admin login with role-based access control
- 🛡️ **RBAC**: Three-tier role system (USER, ADMIN, SUPER_ADMIN)
- 📊 **Dashboard**: Overview of events, RSVPs, and statistics
- 🎬 **Event Management**: Create, edit, and delete events (admin only)
- 🔍 **Movie Search**: Integrated TMDb API for fetching movie data
- 👥 **Attendee Management**: View RSVPs and export attendee lists to CSV
- 🎨 **Modern UI**: Built with Tailwind CSS matching the mobile app theme
- 🎭 **Demo Mode**: Portfolio-friendly with visible demo credentials

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase project (URL and anon key)
- TMDb API key (optional, for movie search)

### Environment Setup

1. Create a `.env.local` file in the `web/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Creating an Admin User

The dashboard uses role-based access control (RBAC) with three roles:

- `USER` - Regular users (mobile app)
- `ADMIN` - Can manage events (admin dashboard)
- `SUPER_ADMIN` - Full system access

#### Option 1: Use the Demo Account (Easiest)

The login page displays demo credentials that you can use immediately:

- **Email**: demo@scenetogether.com
- **Password**: DemoPassword123!

Simply click "Click to auto-fill" on the login page to test the dashboard.

#### Option 2: Create Your Own Admin Account

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **"Add User"** and create an account with email/password
4. Go to **Table Editor > User**
5. Find your newly created user and change their `role` from `USER` to `ADMIN`
6. Use these credentials to log in at `http://localhost:3000/login`

#### Option 3: Create Demo Account via SQL

Run this SQL in your Supabase SQL Editor:

```sql
-- Insert demo user (Supabase will auto-create via trigger)
-- First, create the auth user in Supabase dashboard, then update role:
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'demo@scenetogether.com';
```

### Security Notes

- **Role Checking**: The dashboard verifies admin role on both frontend and backend
- **Protected Routes**: All event creation/editing requires `ADMIN` or `SUPER_ADMIN` role
- **Demo Mode**: A banner indicates this is a portfolio demonstration
- **JWT Validation**: All API requests verify Supabase JWT tokens

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── login/          # Login page
│   │   ├── admin/          # Admin dashboard
│   │   │   ├── page.tsx    # Dashboard overview
│   │   │   ├── layout.tsx  # Admin layout with nav
│   │   │   └── events/     # Event management
│   │   │       ├── page.tsx              # Events list
│   │   │       ├── create/page.tsx       # Create event
│   │   │       └── [id]/
│   │   │           ├── edit/page.tsx     # Edit event
│   │   │           └── attendees/page.tsx # Attendee list
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/
│   │   └── useRequireAuth.ts # Protected route hook
│   └── lib/
│       ├── supabase.ts     # Supabase client
│       └── api.ts          # API client with auth
└── package.json
```

## Key Pages

### Dashboard (`/admin`)

- Event statistics
- Quick action cards
- Overview metrics

### Events List (`/admin/events`)

- View all events in a table
- Edit, delete, and view attendees
- Capacity tracking with progress bars
- Status badges (Active, Full, Past)

### Create Event (`/admin/events/create`)

- Search movies on TMDb
- Auto-populate movie details
- Set date, location, capacity, and price
- Form validation with Zod

### Edit Event (`/admin/events/[id]/edit`)

- Update event details
- Maintain movie association

### Attendees (`/admin/events/[id]/attendees`)

- View all RSVPs with status
- Export attendee list to CSV
- Capacity tracking
- RSVP statistics

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **API Integration**: TMDb API (movies)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Cloudflare Pages
- AWS Amplify
- Railway

## Color Palette

Matching the mobile app:

- Primary: `#46D4AF` (Turquoise)
- Secondary: `#23797E` (Teal)
- Dark: `#000102` (Almost Black)
- Light: `#EFF0EF` (Off-White)

## Next Steps

- [ ] Add admin role checking (currently any authenticated user can access)
- [ ] Implement user profile management
- [ ] Add event analytics dashboard
- [ ] Implement email notifications for RSVPs
- [ ] Add event templates for faster creation
- [ ] Implement batch operations for events

## Support

For issues or questions, please open an issue in the repository.
