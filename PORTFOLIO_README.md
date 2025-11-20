# Professional Portfolio Application

A LinkedIn-inspired professional portfolio application showcasing fullstack development expertise with React + TypeScript frontend and Django REST Framework backend.

## 🏗️ Architecture Overview

This project follows **Separation of Concerns** and **Clean Architecture** principles, demonstrating enterprise-level software engineering practices.

### Frontend Architecture (React + TypeScript)

```
src/
├── components/        # Reusable UI components (Atomic Design)
│   ├── common/       # Generic components (Button, Input, Card)
│   └── layout/       # Layout components (Header, Footer, Sidebar)
├── features/         # Feature-based modules
├── pages/            # Page components (route containers)
├── services/         # API communication layer
│   ├── apiClient.ts  # Axios instance with interceptors
│   └── *.service.ts  # Domain-specific API services
├── store/            # Redux Toolkit state management
│   ├── slices/       # Redux slices per feature domain
│   └── middleware/   # Custom middleware
├── types/            # TypeScript type definitions
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── constants/        # Application constants
└── layouts/          # Page layouts
```

**Key Frontend Patterns:**
- **Redux Toolkit** for state management with typed slices
- **Async Thunks** for handling API calls
- **Service Layer Pattern** for API abstraction
- **Type-safe** API calls with comprehensive TypeScript interfaces
- **Axios interceptors** for request/response handling
- **Centralized error handling**

### Backend Architecture (Django REST Framework)

```
backend/
├── portfolio_api/       # Main Django project
│   ├── settings.py     # Configuration with DRF, CORS
│   ├── urls.py         # Root URL configuration
│   └── utils.py        # Custom utilities
├── profiles/           # Profile management app
├── experiences/        # Work experience app
├── education/          # Education records app
├── skills/            # Skills management app
├── projects/          # Portfolio projects app
└── certifications/    # Certifications app
```

**Key Backend Patterns:**
- **Django Apps** for modular organization
- **REST API** following RESTful conventions
- **ViewSets & Serializers** for CRUD operations
- **Django Filters** for query filtering
- **Pagination** for efficient data retrieval
- **UUID primary keys** for security
- **Custom exception handler** for consistent error responses
- **CORS configuration** for cross-origin requests

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Django 5.2** - Web framework
- **Django REST Framework 3.15** - API framework
- **PostgreSQL/SQLite** - Database
- **Pillow** - Image processing
- **django-cors-headers** - CORS handling
- **django-filter** - Advanced filtering
- **drf-spectacular** - API documentation

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- pip and virtualenv

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

## 🔧 Environment Variables

Create `.env` file in project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📊 Data Models

### Profile
Core user profile with personal information, location, and images.

### Experience
Professional work history with employment details, responsibilities, and technologies.

### Education
Academic background with institutions, degrees, and achievements.

### Skills
Technical and soft skills with proficiency levels and categories.

### Projects
Portfolio projects with detailed descriptions, technologies, and URLs.

### Certifications
Professional certifications with validation and expiration tracking.

## 🎯 Key Features

- ✅ **Type-Safe API Communication** - Full TypeScript coverage
- ✅ **State Management** - Redux Toolkit with async thunks
- ✅ **Modular Architecture** - Separation of concerns throughout
- ✅ **RESTful API** - Following REST best practices
- ✅ **Error Handling** - Centralized error management
- ✅ **Image Upload** - Profile pictures and project images
- ✅ **Filtering & Pagination** - Efficient data retrieval
- ✅ **CORS Configuration** - Secure cross-origin requests

## 🏃 Development Workflow

1. **Frontend Development**: `npm run dev` (runs on http://localhost:5173)
2. **Backend Development**: `python manage.py runserver` (runs on http://localhost:8000)
3. **API Documentation**: Available at http://localhost:8000/api/docs/

## 📁 Project Structure Highlights

### Services Layer (Frontend)
Each backend endpoint has a corresponding service module:
- `profileService` - Profile CRUD operations
- `experienceService` - Experience management
- `educationService` - Education records
- `skillService` - Skills with endorsements
- `projectService` - Projects with featured status
- `certificationService` - Certification verification

### Redux Slices (Frontend)
Feature-based state management:
- `profileSlice` - Profile state and thunks
- `experienceSlice` - Experience with pagination
- `projectSlice` - Projects with featured filtering

### Django Apps (Backend)
Domain-driven app organization:
- Each app has models, serializers, views, and URLs
- Follows Django best practices
- Clean separation of concerns

## 🔐 API Endpoints

```
/api/profiles/          - Profile management
/api/experiences/       - Work experience
/api/education/         - Education records
/api/skills/           - Skills management
/api/projects/         - Portfolio projects
/api/certifications/   - Certifications
```

## 🛠️ Future Enhancements

- Authentication & Authorization
- Real-time updates with WebSockets
- Advanced search functionality
- Analytics dashboard
- PDF resume generation
- Social sharing features

## 📝 License

This is a portfolio project demonstrating fullstack development capabilities.

---

**Built with technical excellence and attention to detail** 🚀
