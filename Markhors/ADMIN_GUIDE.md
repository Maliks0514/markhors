# Chitral Markhors Admin Panel - User Guide

## 🔐 Authentication System

### Login Credentials
- **Username**: `admin`
- **Password**: `markhors123`

### Access
- **Login Page**: `/admin-login`
- **Dashboard**: `/admin-dashboard` (Protected - requires login)

## 📋 Admin Dashboard Features

### 1. **Overview Tab** 
   - Quick statistics dashboard showing:
     - Total number of articles
     - Active users count
     - System status
     - Last updated information
   - Display of recent articles

### 2. **Manage News Tab**
   - Complete news management interface with:
     - **Create Articles**: Click "New Article" button to add new news
     - **Edit Articles**: Modify existing articles
     - **Delete Articles**: Remove articles with confirmation
     - **View All Articles**: Table view of all articles organized by:
       - Title
       - Category (Match Reports, Academy, Tournaments, Community)
       - Publication Date

   **Article Fields**:
   - Title (required)
   - Category (dropdown selection)
   - Date (publication date)
   - Image URL
   - Excerpt (summary)
   - Full Content

### 3. **Users Tab**
   - User management (coming soon)

### 4. **Settings Tab**
   - General website settings
   - Site title and description configuration

## 🔄 Data Persistence

- All articles are stored in **browser localStorage**
- Articles persist even after browser refresh
- Changes are automatically synced with the News page

## 🛡️ Security Features

- **Protected Routes**: Admin dashboard requires authentication
- **Session Management**: User stays logged in via localStorage
- **Logout Functionality**: Safely clear session and return to login

## 🌐 Navigation

### Navbar Integration
- "Admin" link in navbar (desktop & mobile)
- Direct access to `/admin-login` from any page
- Admin link only visible in navbar (login/logout handled from dashboard)

## 📱 Responsive Design

- Fully responsive admin interface
- Collapsible sidebar on mobile devices
- Touch-friendly buttons and forms
- Mobile-optimized tables and modals

## 🎨 Theme

- Consistent with Markhors website theme
- Black background with green accents (#22c55e)
- Professional, clean interface
- Dark mode optimized

## 💡 Tips

1. **Default Articles**: If no articles exist in localStorage, default articles will be loaded automatically
2. **Bulk Operations**: Each article can be individually managed
3. **Real-time Updates**: Changes appear immediately on the News page
4. **Modal Forms**: User-friendly popup forms for creating and editing articles
5. **Confirmation Dialogs**: Delete actions require confirmation to prevent accidental removal

## 🚀 Future Enhancements

- Real backend integration (replace localStorage)
- Advanced user management
- Role-based access control (Admin, Editor, Viewer)
- Article scheduling
- Comments management
- Site analytics dashboard
