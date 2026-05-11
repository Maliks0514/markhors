# Admin Panel - Implementation Details

## 🏗️ Architecture Overview

### File Structure
```
src/
├── context/
│   └── AuthContext.jsx          # Authentication context & hooks
├── components/
│   └── ProtectedRoute.jsx       # Route protection wrapper
├── pages/
│   ├── AdminLogin.jsx           # Login page
│   ├── AdminDashboard.jsx       # Main admin panel
│   ├── Home.jsx                 # Existing
│   └── News.jsx                 # Updated to use localStorage
└── App.jsx                      # Updated with auth setup
```

## 🔐 Authentication Flow

### AuthContext (React Context API)
- **State Management**:
  - `user`: Current authenticated user data
  - `isLoading`: Loading state during auth check
  
- **Methods**:
  - `login(username, password)`: Validates credentials and sets user state
  - `logout()`: Clears user session and localStorage
  
- **Storage**: Uses browser `localStorage` to persist user session

### ProtectedRoute Component
- Wrapper component for protected routes
- Redirects unauthenticated users to `/admin-login`
- Shows loading state while checking authentication
- Used in `App.jsx` to wrap the AdminDashboard route

## 🔄 Data Flow

### News Management
1. **Admin Dashboard** → Creates/Updates/Deletes articles
2. Articles stored in browser `localStorage` (key: `markhorsNewsArticles`)
3. **News Page** reads from same localStorage
4. Real-time sync between admin and public news pages

### Authentication
1. User enters credentials on **AdminLogin** page
2. Validated against hardcoded credentials (admin/markhors123)
3. On success: User stored in `AuthContext` and `localStorage`
4. Protected route checks `AuthContext` for user
5. If authenticated, user can access `/admin-dashboard`

## 📦 Components Breakdown

### 1. **AuthContext.jsx**
```jsx
- AuthProvider (wrapper component)
- useAuth (custom hook for accessing auth context)
- Handles login/logout logic
- Manages session persistence
```

### 2. **ProtectedRoute.jsx**
```jsx
- Checks if user exists
- Shows loading state
- Redirects to login if no user
- Wraps protected components
```

### 3. **AdminLogin.jsx**
```jsx
- Login form with username/password fields
- Error handling and display
- Loading state during login
- Demo credentials display
- Styled to match Markhors theme
```

### 4. **AdminDashboard.jsx**
```jsx
Main container with:
- Sidebar navigation (collapsible on mobile)
- Top header with user info and logout
- Tab-based interface:
  * OverviewTab: Stats and recent activity
  * NewsTab: Full news CRUD management
  * UsersTab: Placeholder (future)
  * SettingsTab: Site configuration options
```

## 🎯 Key Features

### Security
- ✅ Protected routes requiring authentication
- ✅ Session persistence
- ✅ Logout functionality
- ✅ Redirect to login for unauthorized access

### User Experience
- ✅ Responsive sidebar (collapsible on mobile)
- ✅ Modal forms for article creation/editing
- ✅ Confirmation dialogs for delete actions
- ✅ Real-time form validation
- ✅ Visual feedback for actions

### Data Management
- ✅ Create new articles
- ✅ Edit existing articles
- ✅ Delete articles
- ✅ Filter articles by category
- ✅ View article details
- ✅ Persistent storage (localStorage)

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Color Scheme**: 
  - Background: Black (`#000000`)
  - Primary Accent: Green (`#22c55e`)
  - Text: White/Gray
  - Borders: White 10% opacity
- **Icons**: Lucide React

## 🔧 Technical Stack

- **React**: UI framework
- **React Router**: Navigation & routing
- **Context API**: State management
- **localStorage**: Data persistence
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Vite**: Build tool

## 📝 Code Examples

### Using Auth Context
```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout } = useAuth();
  
  if (!user) {
    return <div>Not logged in</div>;
  }
  
  return <div>Welcome {user.username}</div>;
}
```

### Protecting a Route
```jsx
<Route
  path='/admin-dashboard'
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## 🚀 Deployment Considerations

### Production Checklist
- [ ] Replace hardcoded credentials with backend authentication
- [ ] Implement JWT tokens instead of localStorage
- [ ] Add HTTPS/SSL
- [ ] Implement proper error boundaries
- [ ] Add logging and monitoring
- [ ] Set up backup system for articles
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Implement proper session timeouts
- [ ] Add email verification for accounts

### Backend Integration
Replace the login validation in AuthContext with:
```jsx
const response = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

const data = await response.json();
if (data.token) {
  // Store JWT token
  localStorage.setItem('authToken', data.token);
  setUser(data.user);
}
```

## 📊 Local Storage Structure

### markhorsAdminUser
```json
{
  "username": "admin",
  "id": 1234567890
}
```

### markhorsNewsArticles
```json
[
  {
    "id": 1,
    "title": "Article Title",
    "category": "match",
    "date": "May 8, 2026",
    "image": "/main-banner.png",
    "excerpt": "Short summary...",
    "content": "Full article content..."
  }
]
```

## 🐛 Troubleshooting

### User gets logged out after refresh
- Check if localStorage is enabled
- Verify browser privacy settings allow localStorage
- Clear browser cache and try again

### Articles not appearing on News page
- Verify localStorage key: `markhorsNewsArticles`
- Check browser console for errors
- Ensure articles are being saved from admin panel

### Protected route not working
- Verify AuthProvider wraps the entire app
- Check that ProtectedRoute is properly imported
- Verify useAuth hook is called in correct context

---

**Last Updated**: May 8, 2026
**Version**: 1.0.0
