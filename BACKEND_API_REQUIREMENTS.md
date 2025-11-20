# Backend API Requirements for Portfolio Frontend

The frontend expects the following API endpoints to be available. Your Django backend currently only has `/api/auth/` and `/api/contacts/` configured.

## Missing Endpoints

### Projects API (`/api/projects/`)

**Required Endpoints:**

1. **List Projects** - `GET /api/projects/`
   - Query params: `page`, `search`, `status`, `is_featured`
   - Returns paginated list of projects

2. **Get Project** - `GET /api/projects/{id}/`
   - Returns single project details

3. **Create Project** - `POST /api/projects/`
   - Accepts: `multipart/form-data` (required for media uploads)
   - Fields:
     ```json
     {
       "title": "string (required)",
       "description": "text (required)",
       "technologies": ["array of strings"],
       "status": "in_progress|completed|on_hold (required)",
       "start_date": "date (required)",
       "end_date": "date (optional)",
       "github_url": "url (optional)",
       "live_url": "url (optional)",
       "image_url": "url (optional, deprecated - use media instead)",
       "image": "file (optional, deprecated - use images[] instead)",
       "is_featured": "boolean (default: false)",
       "images": "file[] (multiple image files)",
       "videos": "file[] (multiple video files)",
       "video_urls": "JSON array of strings (YouTube/Vimeo/direct URLs)",
       "media_captions": "JSON object {type_index: caption} e.g. {'image_0': 'Screenshot', 'video_1': 'Demo'}"
     }
     ```
   - Example FormData structure:
     ```
     title: "My Project"
     description: "Project description"
     images: [File, File, File]  // Multiple image files
     videos: [File]               // Multiple video files
     video_urls: '["https://youtube.com/watch?v=xyz", "https://vimeo.com/123"]'
     media_captions: '{"image_0": "Login page", "image_1": "Dashboard", "video_0": "Demo video"}'
     ```

4. **Update Project** - `PATCH /api/projects/{id}/`
   - Same fields as create

5. **Delete Project** - `DELETE /api/projects/{id}/`
   - Returns 204 No Content

### Experience API (`/api/experiences/`)

1. `GET /api/experiences/` - List experiences
2. `GET /api/experiences/{id}/` - Get experience
3. `POST /api/experiences/` - Create experience
4. `PATCH /api/experiences/{id}/` - Update experience
5. `DELETE /api/experiences/{id}/` - Delete experience

### Education API (`/api/education/`)

1. `GET /api/education/` - List education records
2. `GET /api/education/{id}/` - Get education
3. `POST /api/education/` - Create education
4. `PATCH /api/education/{id}/` - Update education
5. `DELETE /api/education/{id}/` - Delete education

### Skills API (`/api/skills/`)

1. `GET /api/skills/` - List skills
2. `GET /api/skills/{id}/` - Get skill
3. `POST /api/skills/` - Create skill
4. `PATCH /api/skills/{id}/` - Update skill
5. `DELETE /api/skills/{id}/` - Delete skill

### Certifications API (`/api/certifications/`)

1. `GET /api/certifications/` - List certifications
2. `GET /api/certifications/{id}/` - Get certification
3. `POST /api/certifications/` - Create certification
4. `PATCH /api/certifications/{id}/` - Update certification
5. `DELETE /api/certifications/{id}/` - Delete certification

### Users API (`/api/users/`)

1. `GET /api/users/` - List users (super_admin only)
2. `GET /api/users/stats/` - Get user statistics
3. `GET /api/users/{id}/` - Get user details
4. `POST /api/users/` - Create user (super_admin only)
5. `PATCH /api/users/{id}/` - Update user (super_admin only)
6. `DELETE /api/users/{id}/` - Delete user (super_admin only)
7. `POST /api/users/{id}/activate/` - Activate user
8. `POST /api/users/{id}/deactivate/` - Deactivate user
9. `POST /api/users/{id}/reset-password/` - Reset password
10. `POST /api/users/{id}/verify-email/` - Verify email

## Django URL Configuration

Add to your `portfolio_api/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API Endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/users/', include('accounts.user_urls')),  # Add this
    path('api/projects/', include('portfolio.project_urls')),  # Add this
    path('api/experiences/', include('portfolio.experience_urls')),  # Add this
    path('api/education/', include('portfolio.education_urls')),  # Add this
    path('api/skills/', include('portfolio.skill_urls')),  # Add this
    path('api/certifications/', include('portfolio.certification_urls')),  # Add this
    path('api/contacts/', include('contacts.urls')),
]

# Media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## Media Gallery Support

### Django Models for Project Media

Create models to support multiple images and videos per project:

```python
# portfolio/models.py

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Project(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    technologies = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)  # Deprecated, kept for backward compatibility
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class ProjectMedia(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='media')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES)
    file = models.FileField(upload_to='projects/%Y/%m/', null=True, blank=True)
    url = models.URLField(blank=True, null=True)  # For YouTube/Vimeo URLs
    caption = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name_plural = 'Project Media'
    
    def __str__(self):
        return f"{self.project.title} - {self.media_type} #{self.order}"
```

### Django Serializers with Nested Media

```python
# portfolio/serializers.py

from rest_framework import serializers
from .models import Project, ProjectMedia

class ProjectMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMedia
        fields = ['id', 'media_type', 'file', 'url', 'caption', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProjectSerializer(serializers.ModelSerializer):
    media = ProjectMediaSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'technologies', 'status',
            'start_date', 'end_date', 'github_url', 'live_url',
            'image_url', 'is_featured', 'media', 'created_by',
            'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    videos = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )
    video_urls = serializers.JSONField(write_only=True, required=False)
    media_captions = serializers.JSONField(write_only=True, required=False)
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'technologies', 'status',
            'start_date', 'end_date', 'github_url', 'live_url',
            'image_url', 'is_featured', 'images', 'videos',
            'video_urls', 'media_captions'
        ]
    
    def create(self, validated_data):
        # Extract media data
        images = validated_data.pop('images', [])
        videos = validated_data.pop('videos', [])
        video_urls = validated_data.pop('video_urls', [])
        media_captions = validated_data.pop('media_captions', {})
        
        # Create project
        project = Project.objects.create(**validated_data)
        
        # Create image media
        for idx, image_file in enumerate(images):
            caption = media_captions.get(f'image_{idx}', '')
            ProjectMedia.objects.create(
                project=project,
                media_type='image',
                file=image_file,
                caption=caption,
                order=idx
            )
        
        # Create video media (files)
        for idx, video_file in enumerate(videos):
            caption = media_captions.get(f'video_{idx}', '')
            ProjectMedia.objects.create(
                project=project,
                media_type='video',
                file=video_file,
                caption=caption,
                order=len(images) + idx
            )
        
        # Create video media (URLs)
        for idx, video_url in enumerate(video_urls):
            caption = media_captions.get(f'video_url_{idx}', '')
            ProjectMedia.objects.create(
                project=project,
                media_type='video',
                url=video_url,
                caption=caption,
                order=len(images) + len(videos) + idx
            )
        
        return project
    
    def update(self, instance, validated_data):
        # Extract media data
        images = validated_data.pop('images', None)
        videos = validated_data.pop('videos', None)
        video_urls = validated_data.pop('video_urls', None)
        media_captions = validated_data.pop('media_captions', {})
        
        # Update project fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # If media is provided, replace existing media
        if images is not None or videos is not None or video_urls is not None:
            instance.media.all().delete()
            
            order = 0
            if images:
                for idx, image_file in enumerate(images):
                    caption = media_captions.get(f'image_{idx}', '')
                    ProjectMedia.objects.create(
                        project=instance,
                        media_type='image',
                        file=image_file,
                        caption=caption,
                        order=order
                    )
                    order += 1
            
            if videos:
                for idx, video_file in enumerate(videos):
                    caption = media_captions.get(f'video_{idx}', '')
                    ProjectMedia.objects.create(
                        project=instance,
                        media_type='video',
                        file=video_file,
                        caption=caption,
                        order=order
                    )
                    order += 1
            
            if video_urls:
                for idx, video_url in enumerate(video_urls):
                    caption = media_captions.get(f'video_url_{idx}', '')
                    ProjectMedia.objects.create(
                        project=instance,
                        media_type='video',
                        url=video_url,
                        caption=caption,
                        order=order
                    )
                    order += 1
        
        return instance
```

### ViewSet Update

```python
# portfolio/views.py

from rest_framework import viewsets, filters, parsers
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Project
from .serializers import ProjectSerializer, ProjectCreateUpdateSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'technologies']
    ordering_fields = ['created_at', 'start_date', 'title']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectCreateUpdateSerializer
        return ProjectSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
```

### Django Settings

Add to `settings.py`:

```python
# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB for videos
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
```

### Model Example (Projects)

```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Project(models.Model):
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    github_url = models.URLField(max_length=500, blank=True)
    live_url = models.URLField(max_length=500, blank=True)
    image = models.ImageField(upload_to='projects/', null=True, blank=True)
    image_url = models.URLField(max_length=500, blank=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
```

### Serializer Example

```python
from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'technologies', 'status',
            'start_date', 'end_date', 'github_url', 'live_url',
            'image', 'image_url', 'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return obj.image_url or None
```

### ViewSet Example

```python
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_featured']
    search_fields = ['title', 'description', 'technologies']
    ordering_fields = ['created_at', 'start_date', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Project.objects.filter(user=self.request.user)
        return Project.objects.filter(is_featured=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
```

### URL Configuration (portfolio/project_urls.py)

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet

router = DefaultRouter()
router.register(r'', ProjectViewSet, basename='project')

urlpatterns = router.urls
```

## Testing the API

### Using curl

```bash
# Create project with JSON
curl -X POST http://localhost:8000/api/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "Test description",
    "technologies": ["React", "Django"],
    "status": "in_progress",
    "start_date": "2025-01-01",
    "is_featured": true
  }'

# Create project with file upload
curl -X POST http://localhost:8000/api/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Project" \
  -F "description=Test description" \
  -F "technologies=[\"React\", \"Django\"]" \
  -F "status=in_progress" \
  -F "start_date=2025-01-01" \
  -F "is_featured=true" \
  -F "image=@/path/to/image.jpg"
```

## Required Python Packages

Install these if not already installed:

```bash
pip install Pillow  # For image handling
pip install django-filter  # For filtering
pip install drf-spectacular  # For API documentation
```

## Next Steps

1. Create the missing models in your Django app
2. Create serializers for each model
3. Create viewsets for each model
4. Register URL patterns
5. Run migrations
6. Test endpoints with Postman or curl
7. Update CORS settings to allow frontend requests

## CORS Configuration

Make sure CORS is configured in `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "https://profile.alphalogiquetechnologies.com",  # Production
]

CORS_ALLOW_CREDENTIALS = True
```
