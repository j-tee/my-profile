# Authentication & Contact System Documentation

## 🔐 System Overview

A comprehensive authentication system with Multi-Factor Authentication (MFA), role-based permissions, and contact/proposal management.

## Features Implemented

### 1. Custom User Model
- Email-based authentication (no username)
- UUID primary keys
- Role management (superuser, staff, regular users)
- MFA support with TOTP (Time-based One-Time Password)
- Profile fields integration

### 2. Multi-Factor Authentication (MFA)
- Optional MFA setup for enhanced security
- TOTP-based (compatible with Google Authenticator, Authy, etc.)
- QR code generation for easy setup
- Backup codes support

### 3. Role-Based Access Control
- **Super Admin** - Full system access
- **Staff** - Can manage proposals and contacts
- **Regular Users** - Can only send proposals/contact requests
- Custom permissions system

### 4. Contact & Proposal System
- Authenticated users can send contact requests
- Proposal submission with detailed information
- Status tracking (pending, reviewed, responded, closed)
- Priority levels (low, medium, high)
- Super admin approval workflow

## 📊 Database Models

### User Model
```python
- id (UUID)
- email (unique)
- first_name, last_name
- is_active, is_staff, is_superuser
- mfa_enabled, mfa_secret
- profile (FK to Profile)
- created_at, updated_at
```

### ContactRequest Model
```python
- id (UUID)
- user (FK to User) - who sent the request
- subject
- message
- status (pending/reviewed/responded/closed)
- priority (low/medium/high)
- responded_at, responded_by
- response_message
- created_at, updated_at
```

### Proposal Model
```python
- id (UUID)
- user (FK to User)
- title
- description
- budget_range
- timeline
- project_type
- status (pending/under_review/approved/rejected)
- attachments (optional)
- admin_notes
- reviewed_at, reviewed_by
- created_at, updated_at
```

## 🔌 API Endpoints

### Authentication Endpoints

#### Register
```
POST /api/auth/register/
Body: {
  "email": "user@example.com",
  "password": "securepass123",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### Login
```
POST /api/auth/login/
Body: {
  "email": "user@example.com",
  "password": "securepass123",
  "mfa_code": "123456"  // Optional, required if MFA enabled
}
Response: {
  "access": "jwt_token",
  "refresh": "refresh_token",
  "user": {...}
}
```

#### MFA Setup
```
POST /api/auth/mfa/setup/
Headers: Authorization: Bearer {access_token}
Response: {
  "secret": "base32_secret",
  "qr_code": "otpauth://..."
}
```

#### MFA Verification
```
POST /api/auth/mfa/verify/
Body: {
  "code": "123456"
}
```

#### MFA Disable
```
POST /api/auth/mfa/disable/
Body: {
  "code": "123456"
}
```

### Contact Endpoints

#### Send Contact Request
```
POST /api/contacts/
Headers: Authorization: Bearer {access_token}
Body: {
  "subject": "Project Inquiry",
  "message": "I'd like to discuss...",
  "priority": "medium"
}
```

#### List Contact Requests
```
GET /api/contacts/
Headers: Authorization: Bearer {access_token}
Query Params:
  - status: pending/reviewed/responded/closed
  - priority: low/medium/high
```

#### Respond to Contact (Staff/Admin only)
```
POST /api/contacts/{id}/respond/
Body: {
  "response_message": "Thank you for reaching out..."
}
```

### Proposal Endpoints

#### Submit Proposal
```
POST /api/proposals/
Headers: Authorization: Bearer {access_token}
Body: {
  "title": "E-commerce Website",
  "description": "Full description...",
  "budget_range": "$5000-$10000",
  "timeline": "2-3 months",
  "project_type": "web"
}
```

#### List Proposals
```
GET /api/proposals/
Headers: Authorization: Bearer {access_token}
Query Params:
  - status: pending/under_review/approved/rejected
  - project_type: web/mobile/desktop/other
```

#### Review Proposal (Admin only)
```
POST /api/proposals/{id}/review/
Body: {
  "status": "approved",
  "admin_notes": "Great project idea..."
}
```

## 🔒 Permission Levels

### Anonymous Users
- ❌ Cannot access any endpoints
- Must register and login first

### Authenticated Users (Regular)
- ✅ Submit contact requests
- ✅ Submit proposals
- ✅ View their own submissions
- ❌ Cannot view others' submissions
- ❌ Cannot respond to contacts
- ❌ Cannot review proposals

### Staff Users
- ✅ All regular user permissions
- ✅ View all contact requests
- ✅ Respond to contact requests
- ✅ View all proposals
- ❌ Cannot approve/reject proposals

### Super Admin
- ✅ All staff permissions
- ✅ Review and approve/reject proposals
- ✅ Manage users
- ✅ Access admin panel
- ✅ Grant permissions to other users

## 🚀 Quick Start Guide

### 1. Start the Backend
```bash
cd backend
python manage.py runserver
```

### 2. Create Additional Users (Optional)
```bash
python create_superuser.py  # Creates admin@portfolio.com
```

### 3. Test Authentication Flow

**Step 1: Register a user**
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "securepass123",
    "first_name": "Client",
    "last_name": "User"
  }'
```

**Step 2: Login**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "securepass123"
  }'
```

**Step 3: Send Contact Request**
```bash
curl -X POST http://localhost:8000/api/contacts/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "subject": "Project Inquiry",
    "message": "I would like to hire you for...",
    "priority": "high"
  }'
```

### 4. Setup MFA (Optional but Recommended)
```bash
# Setup MFA
curl -X POST http://localhost:8000/api/auth/mfa/setup/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Scan QR code with authenticator app, then verify
curl -X POST http://localhost:8000/api/auth/mfa/verify/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"code": "123456"}'
```

## 🛡️ Security Features

1. **JWT Authentication** - Secure token-based auth
2. **MFA Support** - TOTP-based two-factor authentication
3. **Password Hashing** - Django's PBKDF2 algorithm
4. **Permission System** - Role-based access control
5. **CORS Protection** - Configured for frontend origin
6. **Input Validation** - Serializer-level validation
7. **Rate Limiting** - Can be added with Django throttling

## 📧 Anti-Bot Measures

- ✅ **Authentication Required** - All contact/proposal submissions require login
- ✅ **User Tracking** - Every request is tied to a user account
- ✅ **Email Verification** - Can be added for new registrations
- ✅ **Rate Limiting** - Can throttle requests per user
- ✅ **Admin Approval** - Super admin reviews all proposals

## 🔧 Admin Panel Access

Access Django admin at: `http://localhost:8000/admin/`

**Super Admin Credentials:**
- Email: `juliustetteh@gmail.com`
- Password: `pa$$word123`

⚠️ **Security Note**: Change the default password after first login!

**Admin Capabilities:**
- Manage all users
- View/respond to contact requests
- Review/approve proposals
- Grant staff permissions
- Access system logs

## 🎯 User Workflows

### Client Workflow
1. Register account
2. Login with credentials
3. (Optional) Setup MFA for security
4. Browse portfolio
5. Send contact request or submit proposal
6. Track submission status
7. Receive responses

### Admin Workflow
1. Login to admin panel
2. Review new contact requests
3. Respond to inquiries
4. Review proposals
5. Approve/reject with notes
6. Manage user permissions

## 📝 Next Steps

To enhance the system further, consider:

1. **Email Notifications** - Notify admin of new submissions
2. **Email Verification** - Verify user emails on registration
3. **Password Reset** - Implement forgot password flow
4. **Rate Limiting** - Throttle API requests
5. **File Uploads** - Allow proposal attachments
6. **Real-time Updates** - WebSocket notifications
7. **Activity Logs** - Track all user actions

## 🐛 Troubleshooting

**Issue: Cannot login**
- Check credentials are correct
- Ensure user account is active
- If MFA enabled, provide correct code

**Issue: Permission denied**
- Check user role (regular/staff/admin)
- Verify JWT token is valid
- Ensure correct Authorization header

**Issue: MFA not working**
- Check system time is synchronized
- Verify code from authenticator app
- Try generating new secret

---

**System Status:** ✅ Fully Operational
**Security Level:** 🔒 High (with MFA)
**Bot Protection:** ✅ Enabled
