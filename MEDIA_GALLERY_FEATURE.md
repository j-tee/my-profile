# Project Media Gallery Feature

## Overview
Enhanced the project management system to support multiple images and videos per project, including support for YouTube/Vimeo URLs and captions.

## Frontend Implementation (Completed ✅)

### New Types
- **ProjectMedia Interface** (`src/types/project.types.ts`)
  - Supports both image and video types
  - Handles file uploads and external URLs
  - Includes caption and ordering

### Updated Components
- **ProjectForm** (`src/pages/admin/ProjectForm.tsx`)
  - Multiple image upload with preview
  - Multiple video file upload with preview
  - Video URL input (YouTube, Vimeo, direct links)
  - Caption editing for each media item
  - Reordering controls (move up/down)
  - Remove individual media items
  - Thumbnail generation for videos

### Features
1. **Multiple Images**
   - Upload multiple image files simultaneously
   - 5MB max per image
   - Preview thumbnails in grid layout
   - Add captions to each image

2. **Multiple Videos**
   - Upload video files (50MB max each)
   - Add YouTube/Vimeo/direct video URLs
   - Automatic thumbnail extraction for YouTube
   - Play button overlay on video previews

3. **Media Management**
   - Drag-free reordering with up/down buttons
   - Individual removal buttons
   - Caption editing inline
   - Type badges (📷 Image, 🎥 Video)

4. **Form Submission**
   - FormData with multiple file arrays
   - `images`: File[] array
   - `videos`: File[] array
   - `video_urls`: JSON array of strings
   - `media_captions`: JSON object mapping items to captions

### Validation
- **Images**: Accept only image/* mime types, 5MB limit
- **Videos**: Accept video/* mime types, 50MB limit
- **URLs**: Regex validation for YouTube, Vimeo, .mp4, .webm, .mov

## Backend Implementation (Required ⚠️)

### Database Models
Create two models as documented in `BACKEND_API_REQUIREMENTS.md`:
1. **Project** - Main project model (already exists)
2. **ProjectMedia** - New model for media items
   - ForeignKey to Project
   - media_type: 'image' or 'video'
   - file: FileField for uploads
   - url: URLField for external videos
   - caption: CharField
   - order: IntegerField

### API Endpoint
**POST/PATCH /api/projects/**
- Accept `multipart/form-data`
- Process multiple file arrays
- Parse JSON fields for URLs and captions
- Create/update ProjectMedia records

### Required Django Packages
```bash
pip install Pillow  # For image handling
pip install django-cors-headers  # Already installed
```

### Migrations
```bash
python manage.py makemigrations portfolio
python manage.py migrate
```

## Testing Checklist

### Frontend Testing
- [ ] Upload single image - verify preview
- [ ] Upload multiple images - verify all appear
- [ ] Upload video file - verify thumbnail
- [ ] Add YouTube URL - verify thumbnail extraction
- [ ] Add Vimeo URL - verify acceptance
- [ ] Edit captions - verify persistence
- [ ] Reorder media - verify up/down buttons
- [ ] Remove media - verify deletion from state
- [ ] Submit form - verify FormData structure

### Backend Testing
- [ ] Create project with images - verify files saved
- [ ] Create project with videos - verify files saved
- [ ] Create project with video URLs - verify stored
- [ ] Retrieve project - verify media array populated
- [ ] Update project media - verify old media deleted
- [ ] Delete project - verify cascade deletes media
- [ ] Check media file paths - verify accessible

## File Locations

### Frontend Files
- `/src/types/project.types.ts` - Type definitions
- `/src/pages/admin/ProjectForm.tsx` - Form component
- `/src/services/project.service.ts` - API client (uses existing)

### Backend Files (To Create)
- `portfolio/models.py` - Add ProjectMedia model
- `portfolio/serializers.py` - Update serializers
- `portfolio/views.py` - Update ViewSet
- `portfolio/migrations/` - Run migrations

### Documentation
- `/BACKEND_API_REQUIREMENTS.md` - Complete backend guide
- `/MEDIA_GALLERY_FEATURE.md` - This file

## Usage Example

### Creating a Project with Media
```typescript
// User uploads 3 images, 1 video file, and adds 1 YouTube URL
mediaItems = [
  { id: '1', type: 'image', file: File, preview: 'blob:...', caption: 'Dashboard' },
  { id: '2', type: 'image', file: File, preview: 'blob:...', caption: 'Login page' },
  { id: '3', type: 'image', file: File, preview: 'blob:...', caption: 'Profile' },
  { id: '4', type: 'video', file: File, preview: 'placeholder', caption: 'Demo' },
  { id: '5', type: 'video', url: 'https://youtube.com/watch?v=abc', preview: 'thumbnail', caption: 'Tutorial' }
]

// FormData sent to backend:
{
  title: "My Project",
  description: "...",
  images: [File, File, File],
  videos: [File],
  video_urls: '["https://youtube.com/watch?v=abc"]',
  media_captions: '{"image_0": "Dashboard", "image_1": "Login page", "image_2": "Profile", "video_0": "Demo", "video_url_0": "Tutorial"}'
}
```

## Next Steps

1. **Backend Developer**: Implement models and serializers using `BACKEND_API_REQUIREMENTS.md`
2. **Frontend**: Add media gallery display to project list/detail views
3. **Enhancement**: Add drag-and-drop reordering
4. **Enhancement**: Add upload progress indicators
5. **Enhancement**: Add image cropping/resizing tools
