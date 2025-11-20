# User Account Management - Quick Reference

## Current Super Admin

**Email**: juliustetteh@gmail.com  
**Password**: pa$$word123  
**Role**: Super Admin  
**Access**: Full system control

⚠️ **Security**: Change the default password after first login!

---

## Login Methods

### 1. Frontend Login

**Production URL**: https://profile.alphalogiquetechnologies.com/login  
**Development URL**: http://localhost:5173/login

Login with: juliustetteh@gmail.com / pa$$word123

### 2. API Login (for applications)

```bash
# Production
curl -X POST https://profile.alphalogiquetechnologies.com/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juliustetteh@gmail.com",
    "password": "pa$$word123"
  }'

# Development
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juliustetteh@gmail.com",
    "password": "pa$$word123"
  }'
```

**Response** includes JWT tokens for authenticated requests.

### 3. Admin Panel (for web interface)

**Production URL**: https://profile.alphalogiquetechnologies.com/admin  
**Development URL**: http://localhost:8000/admin/

Login with: juliustetteh@gmail.com / pa$$word123

---

## Managing Users

### Via Frontend Admin Panel (Recommended)

1. Login at https://profile.alphalogiquetechnologies.com/login
2. Navigate to **Admin → Users**
3. Manage users through the UI:
   - Create new users
   - Edit user details
   - Change user roles
   - Activate/deactivate users
   - Reset passwords
   - Verify emails

### Interactive Script (Backend)

```bash
source venv/bin/activate
python manage_users.py
```

**Menu Options:**
1. List all users
2. Create new user
3. Update user role
4. Verify user email
5. Activate user
6. Deactivate user
7. Reset user password
8. Delete user

### Quick Commands

#### Create a new Editor

```bash
python manage.py shell -c "
from accounts.models import User, UserRole
User.objects.create_user(
    email='editor@example.com',
    password='password123',
    first_name='Editor',
    last_name='User',
    role=UserRole.EDITOR
)
print('Editor created successfully')
"
```

#### Create a new Viewer

```bash
python manage.py shell -c "
from accounts.models import User, UserRole
User.objects.create_user(
    email='viewer@example.com',
    password='password123',
    first_name='Viewer',
    last_name='User',
    role=UserRole.VIEWER
)
print('Viewer created successfully')
"
```

#### Change User Role to Editor

```bash
python manage.py shell -c "
from accounts.models import User, UserRole
user = User.objects.get(email='viewer@example.com')
user.role = UserRole.EDITOR
user.save()
print(f'User {user.email} is now an Editor')
"
```

#### Deactivate a User

```bash
python manage.py shell -c "
from accounts.models import User
user = User.objects.get(email='user@example.com')
user.is_active = False
user.save()
print(f'User {user.email} deactivated')
"
```

---

## User Roles & Permissions

| Role | Permissions | Use Case |
|------|-------------|----------|
| **Super Admin** | Full system access, user management, all CRUD operations | Site owner, primary administrator |
| **Editor** | Edit content, respond to messages, manage portfolio | Content managers, collaborators |
| **Viewer** | Read content, send messages, manage own profile | Regular users, visitors |

### Permission Matrix

| Action | Super Admin | Editor | Viewer |
|--------|-------------|--------|--------|
| View content | ✅ | ✅ | ✅ |
| Edit profile | ✅ | ✅ | ✅ |
| Manage projects | ✅ | ✅ | ❌ |
| Manage experience | ✅ | ✅ | ❌ |
| Manage education | ✅ | ✅ | ❌ |
| Manage skills | ✅ | ✅ | ❌ |
| Manage certifications | ✅ | ✅ | ❌ |
| View messages | ✅ | ✅ | ❌ |
| User management | ✅ | ❌ | ❌ |
| System settings | ✅ | ❌ | ❌ |

---

## API Endpoints for User Management

All endpoints require Super Admin authentication.

### List Users
```bash
GET /api/users/
Authorization: Bearer <access_token>
Query Parameters:
  - page: Page number (default: 1)
  - search: Search by name or email
  - role: Filter by role (super_admin, editor, viewer)
  - is_active: Filter by status (true, false)
```

### Get User Statistics
```bash
GET /api/users/stats/
Authorization: Bearer <access_token>
```

### Get User Details
```bash
GET /api/users/{user_id}/
Authorization: Bearer <access_token>
```

### Create User
```bash
POST /api/users/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "role": "editor",
  "is_active": true,
  "send_welcome_email": true
}
```

### Update User
```bash
PATCH /api/users/{user_id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "Jane",
  "role": "editor",
  "is_active": true,
  "is_verified": true
}
```

### Delete User
```bash
DELETE /api/users/{user_id}/
Authorization: Bearer <access_token>
```

### Activate User
```bash
POST /api/users/{user_id}/activate/
Authorization: Bearer <access_token>
```

### Deactivate User
```bash
POST /api/users/{user_id}/deactivate/
Authorization: Bearer <access_token>
```

### Reset User Password
```bash
POST /api/users/{user_id}/reset-password/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "new_password": "newSecurePassword123"
}
```

### Verify User Email
```bash
POST /api/users/{user_id}/verify-email/
Authorization: Bearer <access_token>
```

---

## Security Best Practices

### 1. Change Default Password Immediately

**Via Frontend:**
1. Login at https://profile.alphalogiquetechnologies.com/login
2. Go to Profile
3. Change password

**Via Backend:**
```bash
python manage_users.py
# Select option 7 (Reset user password)
# Enter: juliustetteh@gmail.com
# Set new strong password
```

### 2. Use Strong Passwords
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, symbols
- Avoid common words
- Use a password manager

### 3. Limit Super Admin Accounts
- Create only necessary Super Admin accounts
- Use Editor role for content managers
- Use Viewer role for regular users
- Regular audit of user permissions

### 4. Regular Security Audits

**Via Frontend:**
- Navigate to Admin → Users
- Review user list regularly
- Deactivate unused accounts
- Check last login dates

**Via Backend:**
```bash
python manage_users.py
# Select option 1 to review all users
# Deactivate unused accounts
```

### 5. Enable MFA for Super Admins

1. Login to the application
2. Go to Profile
3. Enable Two-Factor Authentication
4. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
5. Save backup codes securely
6. Test MFA before logging out

---

## Troubleshooting

### Forgot Super Admin Password?

**Option 1: Reset via Backend**
```bash
python manage.py shell -c "
from accounts.models import User
user = User.objects.get(email='juliustetteh@gmail.com')
user.set_password('new_password_here')
user.save()
print('Password reset successfully')
"
```

**Option 2: Use Django Admin**
1. Access Django admin panel
2. Navigate to Users
3. Click on user
4. Use "Change password" option

### User Can't Login?

**Check user status:**
```bash
python manage.py shell -c "
from accounts.models import User
user = User.objects.get(email='user@example.com')
print(f'Active: {user.is_active}')
print(f'Verified: {user.is_verified}')
print(f'Role: {user.role}')
"
```

**Common issues:**
- Account not activated (`is_active = False`)
- Email not verified (`is_verified = False`)
- Wrong password
- Account locked (too many failed attempts)

### Need to Create Emergency Super Admin?

```bash
python manage.py createsuperuser
# Follow prompts to create new super admin
```

### User Management Not Working?

**Check permissions:**
```bash
python manage.py shell -c "
from accounts.models import User
user = User.objects.get(email='juliustetteh@gmail.com')
print(f'Role: {user.role}')
print(f'Is Super Admin: {user.role == \"super_admin\"}")
"
```

Only users with `role = "super_admin"` can access user management.

---

## Common Tasks

### Add a New Team Member (Editor)

**Via Frontend:**
1. Login as Super Admin
2. Navigate to Admin → Users
3. Click "Add User"
4. Fill in details:
   - Email: team@example.com
   - First Name / Last Name
   - Password (they can change it later)
   - Role: Editor
   - Active: ✓
   - Send Welcome Email: ✓
5. Click "Create User"

**Via API:**
```bash
curl -X POST https://profile.alphalogiquetechnologies.com/api/users/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "team@example.com",
    "password": "tempPassword123",
    "first_name": "Team",
    "last_name": "Member",
    "role": "editor",
    "send_welcome_email": true
  }'
```

### Remove User Access (Keep Account)

1. Login as Super Admin
2. Navigate to Admin → Users
3. Find the user
4. Click the deactivate button (✗)
5. Confirm deactivation

The user account is preserved but cannot login.

### Permanently Delete a User

1. Login as Super Admin
2. Navigate to Admin → Users
3. Find the user
4. Click the delete button (🗑️)
5. Confirm deletion

⚠️ **Warning**: This action cannot be undone!

---

## Additional Resources

- **Frontend Admin Panel**: https://profile.alphalogiquetechnologies.com/admin
- **API Documentation**: `API_INTEGRATION_GUIDE.md`
- **Authentication System**: `AUTHENTICATION_SYSTEM.md`
- **Main README**: `README.md`
- **Deployment Guide**: `DEPLOYMENT.md`

---

**Last Updated**: November 20, 2025  
**Maintained By**: Julius Tetteh (juliustetteh@gmail.com)
