# Admin Dashboard Setup Guide

This guide will help you set up and test the SceneTogether admin dashboard with role-based access control.

## 🎯 Quick Start (Portfolio Demo)

The **easiest way** to test the admin dashboard:

1. Start the web server:

   ```bash
   cd web
   pnpm dev
   ```

2. Visit `http://localhost:3000/login`

3. Click **"← Click to auto-fill"** on the demo credentials box

4. Credentials will auto-populate:
   - Email: `demo@scenetogether.com`
   - Password: `DemoPassword123!`

5. Click **"Sign In"**

> **Note**: You'll need to create this demo user in Supabase first (see below).

---

## 🔐 Role-Based Access Control (RBAC)

The system now uses a three-tier role system:

| Role          | Description    | Access Level                      |
| ------------- | -------------- | --------------------------------- |
| `USER`        | Regular users  | Mobile app, event viewing         |
| `ADMIN`       | Event managers | Full dashboard access, event CRUD |
| `SUPER_ADMIN` | System admins  | Future: user management, settings |

---

## 📝 Creating the Demo Admin Account

### Step 1: Create Supabase Auth User

1. Go to your Supabase Dashboard
2. Navigate to **Authentication → Users**
3. Click **"Add User"**
4. Fill in:
   - Email: `demo@scenetogether.com`
   - Password: `DemoPassword123!`
   - Email Confirm: ✅ (check this)
5. Click **"Create User"**

### Step 2: Upgrade to Admin Role

Run this SQL in your Supabase **SQL Editor**:

```sql
-- Set demo user as ADMIN
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'demo@scenetogether.com';
```

---

## 🧪 Testing the Dashboard

### 1. Test Login

- ✅ Demo credentials visible on login page
- ✅ Auto-fill button works
- ✅ Successful login redirects to `/admin`

### 2. Test Role Checking

- ✅ Demo banner shows: "Demo Mode: This is a portfolio demonstration"
- ✅ Regular users see "Access Denied" page
- ✅ Admin users can access dashboard

### 3. Test Event Management

- ✅ Create new event (admin only)
- ✅ Edit existing event (admin only)
- ✅ Delete event (admin only)
- ✅ View attendees

### 4. Test TMDB Integration

- ✅ Search for movies
- ✅ Auto-populate event details

---

## 🔧 Creating Additional Admin Users

### Method 1: Via Supabase Dashboard (Easiest)

1. Create user in **Authentication → Users**
2. Go to **Table Editor → User**
3. Find the user row
4. Change `role` column from `USER` to `ADMIN`
5. Save changes

### Method 2: Via SQL

```sql
-- Create a new admin user
-- First create the auth user in Supabase dashboard, then run:
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'your-email@example.com';
```

### Method 3: Via API (Future Enhancement)

```typescript
// POST /auth/admin/promote-user
{
  "userId": "uuid-here",
  "role": "ADMIN"
}
```

---

## 🛡️ Security Features Implemented

### Frontend Protection

- ✅ `checkIsAdmin()` helper verifies role
- ✅ Admin layout shows "Access Denied" for non-admins
- ✅ Demo banner clearly indicates portfolio mode

### Backend Protection

- ✅ `requireAdmin` middleware on all event CRUD routes
- ✅ Database role stored in `User.role` (enum)
- ✅ JWT verification + database role lookup
- ✅ API returns 403 for unauthorized access

### Database Schema

```prisma
enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}

model User {
  // ...
  role  Role  @default(USER)
}
```

---

## 📱 Portfolio Presentation Tips

### What Recruiters Will See:

1. **Login Page** - Professional UI with visible demo credentials
2. **Demo Banner** - Clear indication it's a demonstration
3. **Role-Based Access** - Shows understanding of security patterns
4. **Clean Code** - Well-structured middleware and route protection

### Talking Points:

- "Implemented **role-based access control** with three user levels"
- "Added **JWT verification** with database role lookup for security"
- "Created **demo-friendly** login with visible test credentials for recruiters"
- "Protected all **event CRUD operations** with admin middleware"

---

## 🐛 Troubleshooting

### Issue: "Access Denied" even with admin account

**Solution**: Verify the role in the database:

```sql
SELECT id, email, role FROM "User" WHERE email = 'demo@scenetogether.com';
```

If role is `USER`, update it:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'demo@scenetogether.com';
```

### Issue: "User not found in database"

**Cause**: Supabase auth trigger didn't create the `User` record.

**Solution**: Check if trigger is set up (see `supabase-user-trigger.sql`).

### Issue: Demo credentials don't work

**Cause**: Demo user not created in Supabase.

**Solution**: Follow Step 1 above to create the auth user.

---

## 🎨 UI Features

- 🎭 **Demo credentials box** - Blue banner with auto-fill button
- 🟡 **Demo mode banner** - Yellow banner on all admin pages
- 🚫 **Access denied page** - Professional error state for non-admins
- ✨ **Smooth animations** - Hover effects and transitions

---

## 🚀 Next Steps

Optional enhancements:

1. ✅ **User Management UI** - Admin panel to promote/demote users
2. ✅ **Audit Logging** - Track admin actions
3. ✅ **Email Notifications** - Alert on role changes
4. ✅ **Super Admin Features** - System settings, user analytics
5. ✅ **Data Reset Script** - Periodically reset demo data

---

## 📚 Related Files

- `web/src/lib/checkAdmin.ts` - Admin checking helper
- `api/src/middleware/auth.ts` - Auth middleware with role checking
- `api/src/modules/auth/auth.routes.ts` - Auth endpoints
- `web/src/app/admin/layout.tsx` - Admin layout with role checking
- `web/src/app/login/page.tsx` - Login page with demo credentials
- `shared/src/types.ts` - Shared type definitions

---

## 💡 Tips for Portfolio

- Keep demo account credentials visible on login page
- Mention RBAC in your project description
- Highlight the security architecture in README
- Consider adding a "Features" section showcasing role system

---

**Ready to test?** Follow the Quick Start guide above! 🎬
