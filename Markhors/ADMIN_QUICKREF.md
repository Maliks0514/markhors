# Admin Panel Quick Reference

## 🚀 Quick Start

### Access the Admin Panel
1. Go to: `http://localhost:5174/admin-login`
2. Or click **"Admin"** button in the navbar

### Login
- **Username**: `admin`
- **Password**: `markhors123`

## 📊 Admin Dashboard Tabs

### 1️⃣ Overview
- Dashboard statistics
- Total articles count
- System status
- Recent articles list

### 2️⃣ Manage News
**Create New Article**
- Click "+ New Article" button
- Fill in title, category, date, excerpt, content
- Click "Create Article"

**Edit Article**
- Click "Edit" button on any article
- Modify fields
- Click "Update Article"

**Delete Article**
- Click "Delete" button
- Confirm deletion
- Article removed from all views

**Categories Available**
- Match Reports
- Academy
- Tournaments
- Community

### 3️⃣ Users (Coming Soon)

### 4️⃣ Settings
- Configure site title
- Update site description

## 🔑 Key Credentials

```
Username: admin
Password: markhors123
```

## 📍 Important URLs

| Page | URL |
|------|-----|
| Login | `/admin-login` |
| Dashboard | `/admin-dashboard` |
| News (Public) | `/news` |
| Home | `/` |

## 🎯 Features

✅ Create, Read, Update, Delete news articles
✅ Category-based organization
✅ Real-time sync with public News page
✅ Persistent data storage
✅ Responsive design (mobile-friendly)
✅ Secure authentication
✅ User session management
✅ Logout functionality

## 🔐 Security

- Protected routes require login
- Session persists via localStorage
- Automatic redirect to login if not authenticated
- Logout clears all session data

## 💾 Data Storage

- **Storage Type**: Browser localStorage
- **Persistence**: Data survives page refreshes
- **Sync**: Changes immediately reflect on News page
- **Backup**: Make browser backups of localStorage if needed

## 📱 Mobile Access

- Collapsible sidebar on mobile devices
- Touch-friendly interface
- Mobile-optimized forms and tables
- Full functionality on all devices

## 🎨 Design

- Dark theme matching website
- Green accent color (#22c55e)
- Professional, clean interface
- Responsive layout

## ⚙️ Configuration

### Default Admin Credentials
Located in: `src/context/AuthContext.jsx`
```javascript
const validCredentials = {
  username: "admin",
  password: "markhors123",
};
```

### Update Credentials
To change admin credentials:
1. Open `src/context/AuthContext.jsx`
2. Modify `validCredentials` object
3. Restart development server

### Add New Categories
1. Update in `AdminDashboard.jsx` NewsTab component
2. Update in `News.jsx` categories array
3. Articles will automatically support new category

## 🔄 Workflow

1. **Create Article** → AdminDashboard News tab → New Article form
2. **Edit Article** → Click Edit → Modify → Update
3. **Delete Article** → Click Delete → Confirm
4. **View Public** → Go to `/news` → See all published articles
5. **Logout** → Click Logout button → Redirected to login

## 📈 Analytics

- View total article count in Overview
- See recent articles activity
- Monitor system status
- User session tracking

## 🆘 Support

### Common Issues

**Q: Can't login?**
- Check username and password (admin/markhors123)
- Clear browser cache
- Try incognito/private window

**Q: Articles not showing?**
- Refresh the page
- Check localStorage in browser dev tools
- Ensure articles were saved before navigating away

**Q: Lost session after refresh?**
- Check if localStorage is enabled
- Verify browser privacy settings
- Try clearing cache and logging in again

**Q: Can't see admin link?**
- Check navbar - "Admin" button should be visible
- On mobile, it's in the hamburger menu
- Or navigate directly to `/admin-login`

---

**Version**: 1.0.0
**Last Updated**: May 8, 2026
**Developed for**: Chitral Markhors Football Club
