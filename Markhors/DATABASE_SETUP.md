# Database Setup Guide - Chitral Markhors

## Overview
Your application now has a full-stack backend with MongoDB database support. This allows you to store unlimited videos and news articles without localStorage limitations.

## Architecture
```
Frontend (React) 
    ↓
API Server (Express.js on port 5000)
    ↓
Database (MongoDB)
```

## Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas cloud)
- npm or yarn

## Installation Steps

### 1. **Install MongoDB**

#### Option A: Local MongoDB (Windows)
```bash
# Download and install from: https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb-community

# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Cloud - Recommended)
1. Visit https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get connection string (looks like): 
   `mongodb+srv://username:password@cluster.mongodb.net/markhors`

### 2. **Setup Backend Server**

```bash
cd server
npm install
```

### 3. **Create Environment File**

Create `.env` file in `server/` directory:
```
MONGODB_URI=mongodb://localhost:27017/markhors
PORT=5000
NODE_ENV=development
```

Or for MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/markhors
PORT=5000
NODE_ENV=development
```

### 4. **Create Frontend Environment File**

Create `.env.local` in root `Markhors/` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. **Start MongoDB** (if using local)

```bash
# Windows
mongod

# Mac/Linux
brew services start mongodb-community
```

### 6. **Start Backend Server**

In a new terminal:
```bash
cd server
npm start
# Or for development with auto-reload:
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ Connected to MongoDB successfully
```

### 7. **Start Frontend** (in different terminal)

```bash
npm run dev
```

## API Endpoints

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos?category=match` - Get videos by category
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Create new video
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### Articles
- `GET /api/articles` - Get all articles
- `GET /api/articles?category=match` - Get articles by category
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Health Check
- `GET /api/health` - Check server and database status

## Video/Article Data Structure

### Video Object
```json
{
  "_id": "ObjectId",
  "title": "Markhors vs Northern Region",
  "category": "match",
  "date": "May 5, 2026",
  "duration": "12:34",
  "description": "Full match highlights",
  "videoUrl": "base64 or URL",
  "thumbnailUrl": "base64 or URL",
  "fileSize": 15728640,
  "views": 0,
  "createdAt": "2026-05-09T10:00:00Z",
  "updatedAt": "2026-05-09T10:00:00Z"
}
```

### Article Object
```json
{
  "_id": "ObjectId",
  "title": "Markhors Secure Victory",
  "category": "match",
  "date": "May 5, 2026",
  "excerpt": "Short summary",
  "content": "Full article content",
  "image": "URL or path",
  "views": 0,
  "createdAt": "2026-05-09T10:00:00Z",
  "updatedAt": "2026-05-09T10:00:00Z"
}
```

## Usage in Frontend

### In React Components

```javascript
import { videoAPI, articleAPI } from '../services/api';

// Fetch all videos
const videos = await videoAPI.getVideos();

// Fetch videos by category
const matchVideos = await videoAPI.getVideos('match');

// Create new video
await videoAPI.createVideo({
  title: "New Video",
  category: "match",
  date: "May 9, 2026",
  duration: "10:00",
  description: "Video description",
  videoUrl: "base64 data",
  thumbnailUrl: "base64 data",
  fileSize: 15728640
});

// Update video
await videoAPI.updateVideo(videoId, updatedData);

// Delete video
await videoAPI.deleteVideo(videoId);

// Same pattern for articles
const articles = await articleAPI.getArticles();
```

## File Size Limits

### Current Limits (Updated)
- **Video file**: No storage limit on server (depends on your database)
- **Thumbnail file**: No storage limit on server
- **API payload**: 50MB per request

### Recommended Sizes
- **Videos**: Compress to under 500MB for good performance
- **Thumbnails**: Keep under 5MB
- **Total per video**: ~50MB recommended

## Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB connection error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongod

# Or check MongoDB service (Windows)
net start MongoDB
```

### API Server Won't Start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process using port 5000 or change PORT in .env
```

### Frontend Can't Connect to API
1. Check `.env.local` has correct `REACT_APP_API_URL`
2. Make sure backend server is running
3. Check browser console for CORS errors
4. Verify `cors` is enabled in Express (it is in server.js)

### CORS Errors
Already handled in `server.js` with:
```javascript
app.use(cors());
```

## Production Deployment

### Deploy Backend to Heroku
```bash
cd server
heroku create markhors-api
git push heroku main
```

Set environment variables:
```bash
heroku config:set MONGODB_URI=your_atlas_connection_string
heroku config:set PORT=5000
```

### Deploy Frontend to Vercel
```bash
# In root directory
vercel --prod

# Set environment variable in Vercel dashboard
REACT_APP_API_URL=https://markhors-api.herokuapp.com/api
```

## Database Management

### View Data in MongoDB

#### Local MongoDB
```bash
# Open MongoDB Shell
mongosh

# Use database
use markhors

# View collections
show collections

# View videos
db.videos.find()

# View articles
db.articles.find()
```

#### MongoDB Atlas
Use MongoDB Atlas UI in dashboard to view data

## Next Steps

1. ✅ Install backend dependencies: `cd server && npm install`
2. ✅ Create `.env` files in server and root directories
3. ✅ Start MongoDB service
4. ✅ Start backend server: `npm start` in server folder
5. ✅ Update AdminDashboard.jsx to use API instead of localStorage
6. ✅ Update Videos.jsx to use API instead of localStorage
7. ✅ Update News.jsx to use API instead of localStorage
8. ✅ Test the system

## Support Files

The following files have been created:
- `server/server.js` - Main Express server
- `server/models/Video.js` - MongoDB Video schema
- `server/models/Article.js` - MongoDB Article schema
- `server/routes/videos.js` - Video API routes
- `server/routes/articles.js` - Article API routes
- `src/services/api.js` - Frontend API client
- `server/.env.example` - Environment template
- `server/package.json` - Dependencies

All ready to use! 🚀
