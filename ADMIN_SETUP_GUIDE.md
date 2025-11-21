# Admin Dashboard Setup Guide

## For Portfolio Owner/Admin

### Step 1: Create Your Admin Account (Backend)

If you haven't already created an admin account in the backend, do this:

1. **Go to your backend directory** and run:
   ```bash
   python manage.py createsuperuser
   ```

2. **Enter your details:**
   - Email: `juliustetteh@gmail.com` (or your preferred email)
   - Password: (choose a strong password)
   - The system will create a superuser with `role='super_admin'`

### Step 2: Login to Frontend

1. **Open the portfolio website**: `http://localhost:5173`
2. **Click "Login"** button in the top right
3. **Enter your credentials:**
   - Email: The email you used when creating superuser
   - Password: Your password
4. **Click Login**

### Step 3: Access Admin Dashboard

After logging in:
- An **"Admin"** button will appear in the navigation bar (top right)
- Click it to access the admin dashboard
- Or navigate directly to: `http://localhost:5173/admin`

### Step 4: Manage Your Portfolio Content

In the Admin Dashboard, you can:

#### **Projects Management**
- View all your projects
- Add new projects with:
  - Title, description, technologies used
  - Project URLs, GitHub links
  - Images/screenshots
  - Start/end dates
  - Mark as featured/current
- Edit existing projects
- Delete projects

#### **Experience Management**
- Add your work experience
- Include: company, title, employment type
- Add responsibilities and achievements
- Mark current positions
- Reorder experiences

#### **Education Management**
- Add degrees and certifications
- Include institution details
- Add activities and achievements
- Mark current education

#### **Skills Management**
- Add technical and soft skills
- Set proficiency levels (Beginner → Expert)
- Categorize skills (Programming, Framework, Database, etc.)
- Track years of experience
- Manage endorsements

#### **Certifications Management**
- Add professional certifications
- Include issuer, credential ID
- Add verification URLs
- Track expiration dates
- Upload certificate images

#### **Profile Management**
- Update your headline and summary
- Add profile picture and cover image
- Update location (city, state, country)
- Manage social links (GitHub, LinkedIn, etc.)

### Step 5: View Your Public Portfolio

After adding content:
1. Click "Home" in the navbar to see your public portfolio
2. Your projects, experience, skills, etc. will be displayed
3. Visitors can view this without logging in

---

## Important Notes

### User Roles
- **Super Admin**: Full access (you)
- **Editor**: Can manage content but not users
- **Viewer**: Regular visitors (can register to send messages)

### Authentication Flow
```
1. Admin logs in → Gets JWT tokens → Authenticated
2. Navigate to /admin → Protected route → Requires admin role
3. Manage content → API calls use JWT token for authorization
4. Public pages → No auth required → Anyone can view
```

### Backend API Endpoints Used

**Authentication:**
- `POST /api/auth/login/` - Login
- `POST /api/auth/token/refresh/` - Refresh token
- `GET /api/auth/profile/` - Get current user info

**Content Management (Admin only):**
- `GET/POST /api/projects/` - List/Create projects
- `GET/PATCH/DELETE /api/projects/{id}/` - View/Update/Delete project
- Similar endpoints for experiences, education, skills, certifications

**Public Access:**
- `GET /api/projects/?user={user_id}` - View projects (no auth)
- Similar for all content types

---

## Troubleshooting

### Can't See Admin Button After Login?
- Check that your account has `role='super_admin'` or `role='editor'`
- Verify in Django admin: `/admin/accounts/user/`
- Or check backend database directly

### 401 Unauthorized Errors?
- Your JWT token may have expired
- Logout and login again
- Check that backend is running on `http://localhost:8000`

### Admin Dashboard Not Loading?
- Ensure you're logged in
- Check browser console for errors
- Verify the admin route exists: `/admin`
- Check that `AdminRoute` component is protecting the route

### Content Not Showing on Public Pages?
- Ensure you've added content in the admin dashboard
- Check that the `user` field matches your user ID
- Verify backend API returns data: `GET /api/projects/?user={your_user_id}`

---

## Next Steps

1. **Fill in your profile** with headline, summary, location
2. **Add social links** (GitHub, LinkedIn, etc.)
3. **Create projects** showcasing your work
4. **Add work experience** and education
5. **List your skills** and certifications
6. **Upload a profile picture** and cover image
7. **Mark important projects as featured**
8. **Preview your public portfolio** (logout to see visitor view)

---

## Security Reminders

- Use a strong password for your admin account
- Don't share your credentials
- Keep your JWT tokens secure (stored in browser)
- Enable MFA for additional security (if implemented)
- Regularly review user accounts if you add other admins/editors

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify database has your user with correct role
4. Ensure backend and frontend are both running
5. Try clearing browser cache and cookies

**Backend running on:** `http://localhost:8000`  
**Frontend running on:** `http://localhost:5173`  
**Admin Dashboard:** `http://localhost:5173/admin`
