# 🚨 CRITICAL BACKEND CHANGES - Profile Merged Into User Model

> **Last Updated:** November 21, 2025  
> **Status:** ✅ COMPLETED - Profile model removed, integrated into User model

---

## ⚡ TL;DR - What Changed

**OLD ARCHITECTURE (Before):**
- Separate `Profile` model with relationship to `User`
- Content (projects, experiences, etc.) linked to `Profile`
- API used `?profile={uuid}` filter parameter
- Endpoints: `/api/projects/by_profile/{profile_id}/`

**NEW ARCHITECTURE (Now):**
- **Profile fields integrated directly into User model**
- Content (projects, experiences, etc.) linked to `User` directly
- API uses `?user={uuid}` filter parameter
- Endpoints: `/api/projects/by_user/{user_id}/`
- **NO separate Profile model anymore**

---

## 🎯 The Actual Use Case

### This is a PERSONAL PORTFOLIO WEBSITE, not a multi-user profile platform!

**Think LinkedIn vs Personal Blog:**
- ❌ NOT like LinkedIn (where every user has a profile)
- ✅ Like a personal blog (one owner, multiple visitors)

### Roles Explained:

#### **Site Owner/Portfolio Owner (You):**
- **ONE portfolio profile** exists (created manually in Django admin)
- Contains: projects, experience, education, skills, certifications
- This profile is **public** and read-only to visitors
- Managed by admin/editor users only

#### **Visitors/Users (People who register):**
- Register to: send contact messages, comment on projects (future)
- **DO NOT get portfolio profiles**
- **DO NOT have a profile completion flow**
- They are just authenticated users for interaction purposes

---

## 📋 What This Means for Frontend

### 1. Authentication Response Structure

**❌ OLD (WRONG) - Don't expect this anymore:**
```json
{
  "message": "Login successful",
  "user": {...},
  "tokens": {...},
  "profile": {  // ❌ THIS NO LONGER EXISTS
    "id": "...",
    "headline": "...",
    "is_complete": false
  }
}
```

**✅ NEW (CORRECT) - This is what you get:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "visitor@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "phone": "+233501234567",
    "role": "viewer",  // <-- They are just a viewer
    "is_verified": false,
    "is_active": true,
    "mfa_enabled": false,
    "created_at": "2025-11-21T10:30:00Z",
    "updated_at": "2025-11-21T10:30:00Z"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### 2. Remove These Features from Frontend

**DELETE or DISABLE these:**
- ❌ Profile completion page/flow
- ❌ Redirect to "complete your profile" after registration
- ❌ Profile completeness checks for regular users
- ❌ `isProfileComplete()` checks in auth flow
- ❌ Any UI prompting users to "complete their profile"
- ❌ Profile progress bars/indicators for visitors

### 3. How to Display Portfolio Content

**For Homepage, Projects Page, Experience Page, etc.:**

```typescript
// ✅ CORRECT - Fetch the site owner's profile by ID
const SITE_OWNER_PROFILE_ID = 'bcd91fdc-d398-42f5-87b3-f7699fd50eae';

// This is a PUBLIC endpoint - no authentication needed
const profile = await fetch(
  `https://profileapi.alphalogiquetechnologies.com/api/profiles/${SITE_OWNER_PROFILE_ID}/`
);

const projects = await fetch(
  `https://profileapi.alphalogiquetechnologies.com/api/projects/?profile=${SITE_OWNER_PROFILE_ID}`
);
```

**DO NOT try to fetch "current user's profile" for display purposes!**

---

## 🔐 Backend API Endpoints - What Works How

### Public Endpoints (No Auth Required)

These are for **displaying the portfolio** to visitors:

```bash
# Get the site owner's portfolio profile
GET /api/profiles/{profile_id}/

# Get all projects for the portfolio
GET /api/projects/?profile={profile_id}

# Get all experiences
GET /api/experiences/?profile={profile_id}

# Get education
GET /api/education/?profile={profile_id}

# Get skills
GET /api/skills/?profile={profile_id}

# Get certifications
GET /api/certifications/?profile={profile_id}

# Submit contact form (visitors can send messages)
POST /api/contacts/submit/
```

### Authenticated Endpoints (For Logged-In Visitors)

```bash
# Get current user info (NOT portfolio profile!)
GET /api/auth/profile/
# Returns: User object (email, name, role)
# Does NOT return: Portfolio profile

# Update own user info
PATCH /api/auth/profile/
# Can update: first_name, last_name, phone
# Cannot update: email, role

# View own contact messages
GET /api/contacts/messages/
# Visitors only see messages THEY sent
```

### Admin/Editor Endpoints (For Managing Portfolio)

```bash
# Create/Update/Delete portfolio content
POST   /api/profiles/
PATCH  /api/profiles/{id}/
DELETE /api/profiles/{id}/

POST   /api/projects/
PATCH  /api/projects/{id}/
DELETE /api/projects/{id}/

# ... same for experiences, education, skills, certifications
```

---

## 🐛 Current Error Explained

**Error you're seeing:**
```
OperationalError at /api/profiles/bcd91fdc-d398-42f5-87b3-f7699fd50eae/
no such column: profiles_profile.user_id
```

**What it means:**
The backend database has a schema issue. The `profiles_profile` table is missing the `user_id` column or the migration hasn't been run properly.

**This is a BACKEND DATABASE ISSUE, not a frontend issue.**

**Backend needs to:**
1. Run migrations: `python manage.py migrate`
2. Verify the profile table schema
3. Create the portfolio profile if it doesn't exist

---

## ✅ Frontend Checklist - What You Need to Fix

### Step 1: Update Auth Response Handling

**File: `src/services/auth.service.ts` or equivalent**

```typescript
// ❌ REMOVE THIS
interface AuthResponse {
  user: User;
  tokens: Tokens;
  profile: Profile;  // ❌ DELETE THIS
}

// ✅ USE THIS
interface AuthResponse {
  message: string;
  user: User;
  tokens: Tokens;
  // No profile!
}
```

### Step 2: Remove Profile Completion Logic

**Delete these files:**
- `CompleteProfilePage.tsx`
- `ProfileProgressBar.tsx`
- `useProfile.ts` (if it's for visitor profile completion)

**Remove these from auth flow:**
```typescript
// ❌ DELETE THESE CHECKS
if (authResponse.profile) {
  if (!authResponse.profile.is_complete) {
    navigate('/complete-profile');
  }
}

// ✅ AFTER LOGIN, JUST GO HOME
if (authResponse.tokens) {
  navigate('/');
}
```

### Step 3: Use Hardcoded Portfolio ID

**File: `src/constants.ts`**

```typescript
// The site owner's portfolio profile ID (ONE profile for the whole site)
export const PORTFOLIO_OWNER_PROFILE_ID = 'bcd91fdc-d398-42f5-87b3-f7699fd50eae';
```

**Important:** Once backend fixes the database, verify this ID exists by visiting:
```
https://profileapi.alphalogiquetechnologies.com/api/profiles/bcd91fdc-d398-42f5-87b3-f7699fd50eae/
```

### Step 4: Update All Pages

**Every page that displays portfolio content:**

```typescript
// ❌ DON'T DO THIS
const { profile } = useAuth(); // Wrong - this is visitor user, not portfolio
const projects = await getMyProjects(); // Wrong - visitors don't have projects

// ✅ DO THIS
import { PORTFOLIO_OWNER_PROFILE_ID } from '@/constants';

const profile = await profileService.getProfile(PORTFOLIO_OWNER_PROFILE_ID);
const projects = await projectService.getProjectsByProfile(PORTFOLIO_OWNER_PROFILE_ID);
```

### Step 5: Update Context/State Management

**File: `AuthContext.tsx` or equivalent**

```typescript
// ❌ REMOVE THESE
const [portfolioProfile, setPortfolioProfile] = useState<Profile | null>(null);
const [isProfileComplete, setIsProfileComplete] = useState(false);

// ✅ ONLY KEEP USER STATE
const [user, setUser] = useState<User | null>(null);
const [tokens, setTokens] = useState<Tokens | null>(null);
```

---

## 🎨 UI/UX Guidelines

### For Visitors (After Login/Register)

**✅ Show them:**
- "Welcome back, John!"
- "You can now send messages to the site owner"
- "Browse projects and leave comments" (if implemented)

**❌ DON'T show:**
- "Complete your profile"
- "Profile is X% complete"
- "Add your work experience"
- Any profile editing forms

### For Admin/Editor Users

**✅ Show them:**
- Admin dashboard link
- "Manage Portfolio" section
- Content management options

---

## 📞 Common Scenarios

### Scenario 1: User registers on the site
```
User registers → Gets User account (viewer role) → Can send contact messages
NO portfolio profile is created!
```

### Scenario 2: Visitor views homepage
```
Homepage loads → Fetches SITE_OWNER_PROFILE_ID profile → Displays portfolio content
User authentication is NOT required to view!
```

### Scenario 3: Admin creates a new project
```
Admin logs in → Navigates to admin panel → Creates project
Project is linked to SITE_OWNER_PROFILE_ID
Visible to all visitors immediately
```

---

## 🔧 Quick Fix Summary

1. **Remove** all code expecting `profile` in auth responses
2. **Remove** profile completion flows
3. **Use** `PORTFOLIO_OWNER_PROFILE_ID` constant everywhere
4. **Fetch** portfolio data using public endpoints
5. **Stop** trying to manage visitor profiles (they don't have any!)

---

## ❓ FAQ

**Q: Why can't visitors have profiles?**  
A: This is YOUR personal portfolio site, not a social network. Visitors are just viewers who can interact (messages, comments), not showcase their own work.

**Q: What if we want visitors to have profiles in the future?**  
A: Then the backend would need to be restructured as a multi-tenant platform. That's a completely different use case.

**Q: How do we get the PORTFOLIO_OWNER_PROFILE_ID?**  
A: Backend admin creates one profile in Django admin and provides the UUID. It's hardcoded in frontend since there's only ONE.

**Q: What about the /auth/profile/ endpoint?**  
A: That returns the logged-in USER's info (name, email, role), NOT a portfolio profile. Users ≠ Portfolio Profiles.

**Q: The profile endpoint returns 500 error!**  
A: Backend database issue. Backend team needs to run migrations and fix schema.

---

## 🚀 Expected Flow After Fixes

### Visitor Journey:
```
1. Visit site → See portfolio content (public, no auth)
2. Register → Create user account
3. Login → Get auth tokens
4. Navigate site → Still see same portfolio content
5. Want to contact → Send message via contact form
6. Logout → Portfolio still visible to everyone
```

### Admin Journey:
```
1. Login with admin credentials
2. Access admin panel
3. Manage portfolio content (projects, experience, etc.)
4. Changes visible to all visitors immediately
```

---

## 📝 Backend Team: Please Confirm

- [ ] Migrations run successfully
- [ ] Portfolio profile with ID `bcd91fdc-d398-42f5-87b3-f7699fd50eae` exists
- [ ] `GET /api/profiles/{id}/` returns 200 OK
- [ ] Profile table has all required columns
- [ ] No more automatic profile creation on user registration

---

**This is the new reality. Update your code accordingly.**

If you have questions, refer to the official API documentation:
https://profileapi.alphalogiquetechnologies.com/api/schema/swagger-ui/
