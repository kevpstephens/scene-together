# SceneTogether Project Plan Summary

Concept

SceneTogether is a film community events platform where:
• Staff/admins create and organise both in-person community screenings (by renting local venues for film viewings and discussions) and online watchalong parties for remote film experiences.
• Members participate by browsing events, RSVPing, adding them to their calendar, and engaging in discussions.

To enhance UX, the app integrates rich media from movie databases (OMDb/TMDb): posters, trailers, soundtracks, and metadata embedded directly into event cards and pages.

⸻

Platforms
• Mobile App (React Native / Expo):
• For members to browse events, RSVP, and add them to their calendar.
• Web Dashboard (Next.js):
• For staff/admins to create and manage events, attach movie data via APIs, and view attendance.
• Backend API (Node.js/Express + PostgreSQL):
• Shared backend powering both apps with role-based auth.
• Monorepo Setup: Turborepo + pnpm managing mobile/, web/, api/, and shared/.

⸻

Core MVP Features

Members (mobile):
• Browse upcoming events (with movie metadata).
• RSVP/sign up.
• Add events to calendar (device/Google).

Admins (web):
• Create/manage events with OMDb/TMDb integration. (Note: Only staff/admins can create events; members cannot create events.)
• Upload posters or fetch via API.
• View RSVPs and attendance lists.

⸻

Extensions (Nice-to-Haves)
• Stripe payments (ticketed events or pay-what-you-feel).
• Email confirmations with movie details + discussion links.
• Ratings/reviews after events.
• OAuth login (Google).
• Chat/forum features.
• In future versions, members could be allowed to propose events for staff approval.
• A public voting board where members can vote on proposed movie nights (e.g., LOTR marathon, Star Wars, The Godfather, etc.), which staff can then use to decide which films to schedule as events.
• Once users confirm attendance (via RSVP or payment), they can unlock access to a chatroom/forum for that event where attendees can discuss the film in advance, ask logistical questions (parking, food, bringing friends), and clarify venue policies. This is a community-enhancing optional feature and not part of the MVP.
• **Discord integration:** Staff could optionally link each event to a Discord channel, or in a future version, SceneTogether could integrate with the Discord API to auto-create channels and send invite links to RSVP’d members. This would be an optional community enhancement, not part of the MVP.

⸻

UX Design Enhancements
• Use film posters, trailers, and soundtracks to make the event pages visually immersive.
• Event cards styled like mini film posters.
• Optional embedded trailers for richer event previews.

⸻

Hosting
• Web dashboard: Netlify (scenetogether.netlify.app/admin).
• API: Railway or Render.
• Mobile app: Expo Go (dev) → TestFlight/Play Store (polish).

⸻

4-Week Timeline (TR 40 hours)

Week 1 — Foundations
• Initialise monorepo (Turborepo + pnpm).
• Scaffold mobile/, web/, api/, shared/.
• Define Postgres schema: Users, Events, RSVPs.
• Build API boilerplate (Express + DB connection).
• Placeholder mobile UI (event list) + web dashboard (login page).

Week 2 — Core Features
• Web dashboard: event creation/editing with OMDb/TMDb integration.
• Mobile app: fetch & display real events.
• RSVP flow (link users ↔ events).
• Implement JWT-based auth (roles: member vs. staff).

Week 3 — Integration + Calendar
• Calendar integration on mobile (add to Google/device).
• Admin dashboard: attendance list view.
• UX polish for both apps (use posters/trailers).
• Mid-project review & adjustments.

Week 4 — Testing + Deployment
• Testing:
• API → Jest + Supertest.
• Web/mobile → React Testing Library (basic flows).
• Accessibility review (admin dashboard).
• Deploy: API (Railway/Render), web (Netlify), mobile (Expo).
• Finalise README (non-technical for TR + dev notes for portfolio).
• Buffer: bug fixes + stretch features (Stripe payments, email confirmations).

⸻
