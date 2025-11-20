# Quick Start: Testing Projects CRUD

## Start Backend (Terminal 1)

```bash
cd /home/teejay/Documents/Projects/PeronalProfile/backend
source venv/bin/activate
python manage.py runserver
```

**Backend will be available at:** http://localhost:8000

### Verify Backend is Running
- API Docs: http://localhost:8000/api/docs/
- Admin Panel: http://localhost:8000/admin/
  - Login: juliustetteh@gmail.com / pa$$word123

---

## Start Frontend (Terminal 2)

```bash
cd /home/teejay/Documents/Projects/PeronalProfile/my-profile
npm run dev
```

**Frontend will be available at:** http://localhost:5173

---

## Test Flow

### 1. Login
- Navigate to: http://localhost:5173/login
- Email: `juliustetteh@gmail.com`
- Password: `pa$$word123`

### 2. Access Admin Dashboard
- Click "Admin" link in navbar
- Navigate to Projects section

### 3. Create Project

**Required Fields:**
- Title: "E-Commerce Platform"
- Description: "Full-stack online shopping solution"
- Role: "Full Stack Developer"
- Start Date: 2024-01-15
- Technologies: React, Django, PostgreSQL (add via Enter key)

**Optional Fields:**
- Long Description: Detailed project info
- Team Size: 5
- End Date: 2024-06-30 (or check "Current")
- Highlights: "Reduced load time by 60%" (add via Enter key)
- Challenges: "Scaling for high traffic"
- Outcomes: "Processed $2M+ transactions"
- Project URL: https://example.com
- GitHub URL: https://github.com/user/repo
- Demo URL: https://youtube.com/watch?v=xyz
- Images: Upload multiple screenshots
- Video: Upload demo video (max 100MB)
- Featured: Check to feature on homepage
- Order: 1 (display order)

**Click "Save Project"**

### 4. Expected Behaviors

✅ **Success Case:**
- Alert: "Project saved successfully!"
- Redirect to /admin/projects
- Project appears in list

❌ **Error Cases:**
- Missing required fields → Alert with validation message
- Image > 10MB → Alert: "Image too large"
- Video > 100MB → Alert: "Video too large"
- End date before start date → Server validation error
- Current=true with end_date → End date cleared automatically

---

## API Testing with cURL

### Create Project (Minimal)
```bash
curl -X POST http://localhost:8000/api/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "profile=PROFILE_UUID" \
  -F "title=Test Project" \
  -F "description=Short description" \
  -F "role=Developer" \
  -F "start_date=2024-01-01" \
  -F "current=true" \
  -F 'technologies=["Python", "Django"]'
```

### Create Project (Full with Media)
```bash
curl -X POST http://localhost:8000/api/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profile=PROFILE_UUID" \
  -F "title=Full Project" \
  -F "description=Short desc" \
  -F "long_description=Detailed description..." \
  -F 'technologies=["React", "Django", "PostgreSQL"]' \
  -F "role=Full Stack Developer" \
  -F "team_size=5" \
  -F "start_date=2024-01-15" \
  -F "end_date=2024-06-30" \
  -F "current=false" \
  -F "project_url=https://example.com" \
  -F "github_url=https://github.com/user/repo" \
  -F "demo_url=https://youtube.com/watch?v=xyz" \
  -F 'highlights=["Achievement 1", "Achievement 2"]' \
  -F "challenges=Main challenge..." \
  -F "outcomes=Results achieved..." \
  -F "featured=true" \
  -F "order=1" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "video=@/path/to/demo.mp4"
```

### List Projects
```bash
curl http://localhost:8000/api/projects/
```

### Get Project Details
```bash
curl http://localhost:8000/api/projects/{PROJECT_UUID}/
```

### Get Featured Projects
```bash
curl http://localhost:8000/api/projects/featured/
```

### Update Project
```bash
curl -X PATCH http://localhost:8000/api/projects/{PROJECT_UUID}/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Updated Title" \
  -F "description=Updated description"
```

### Delete Project
```bash
curl -X DELETE http://localhost:8000/api/projects/{PROJECT_UUID}/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Upload More Images
```bash
curl -X POST http://localhost:8000/api/projects/{PROJECT_UUID}/upload_images/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "images=@/path/to/image3.jpg" \
  -F "images=@/path/to/image4.jpg" \
  -F "caption_0=Screenshot 1" \
  -F "caption_1=Screenshot 2"
```

---

## Get Auth Token

### Option 1: Via API
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juliustetteh@gmail.com",
    "password": "pa$$word123"
  }'
```

Response includes `tokens.access` - use this as Bearer token.

### Option 2: From Browser DevTools
1. Login to frontend
2. Open DevTools (F12) → Application → Local Storage
3. Copy value of `authToken`

---

## Common Issues & Solutions

### Issue: "Profile ID required"
**Solution:** Update `ProjectForm.tsx` line ~41:
```typescript
const profileId = 'your-actual-profile-uuid'; // Get from auth context
```

### Issue: CORS Error
**Solution:** Check backend `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
]
```

### Issue: 401 Unauthorized
**Solution:** Token expired. Login again to get new token.

### Issue: "Field is required"
**Solution:** Check all required fields marked with `*` in form.

### Issue: Media upload fails
**Solution:** 
- Check file size (images: 10MB max, video: 100MB max)
- Check file format (images: jpg/png/gif/webp, videos: mp4/mov/avi/webm/mkv)
- Check Django `MEDIA_ROOT` directory exists and is writable

### Issue: Database errors
**Solution:** Run migrations:
```bash
cd backend
python manage.py migrate
```

---

## Expected Database Structure

### Project Table Fields
- `id` (UUID)
- `profile` (UUID, foreign key)
- `title` (string)
- `description` (text)
- `long_description` (text, nullable)
- `technologies` (JSON array)
- `role` (string)
- `team_size` (integer, nullable)
- `start_date` (date)
- `end_date` (date, nullable)
- `current` (boolean)
- `project_url` (URL, nullable)
- `github_url` (URL, nullable)
- `demo_url` (URL, nullable)
- `video` (file, nullable)
- `highlights` (JSON array)
- `challenges` (text, nullable)
- `outcomes` (text, nullable)
- `featured` (boolean)
- `order` (integer)
- `created_at` (datetime)
- `updated_at` (datetime)

### ProjectImage Table Fields
- `id` (UUID)
- `project` (UUID, foreign key)
- `image` (file)
- `caption` (string, nullable)
- `order` (integer)
- `uploaded_at` (datetime)

---

## Next Steps After Testing

1. ✅ Verify CRUD operations work
2. ✅ Test image uploads
3. ✅ Test video uploads
4. ⏳ Implement ProjectsList component with new service
5. ⏳ Implement ProjectDetail view
6. ⏳ Add image management UI (reorder, delete)
7. ⏳ Integrate profile context for automatic UUID
8. ⏳ Add loading states and error handling
9. ⏳ Add success/error toast notifications
10. ⏳ Deploy to production

---

**Quick Reference:**
- Backend API Docs: http://localhost:8000/api/docs/
- Backend Admin: http://localhost:8000/admin/
- Frontend Dev: http://localhost:5173
- Super Admin: juliustetteh@gmail.com / pa$$word123
