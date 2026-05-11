# API Integration Guide

This guide explains how to update your React components to use the backend API instead of localStorage.

## Quick Summary

**Old Way (localStorage):** Data stored in browser only (~5-10MB limit)
**New Way (API + MongoDB):** Data stored on server (unlimited storage)

## Frontend Updates Required

### 1. AdminDashboard.jsx - News Tab

**Replace NewsTab useState:**
```javascript
// OLD: Load from localStorage
const [articles, setArticles] = React.useState([]);

React.useEffect(() => {
  const savedArticles = localStorage.getItem("markhorsNewsArticles");
  if (savedArticles) {
    setArticles(JSON.parse(savedArticles));
  }
}, []);

// NEW: Load from API
import { articleAPI } from '../services/api';

const [articles, setArticles] = React.useState([]);
const [loading, setLoading] = React.useState(false);

React.useEffect(() => {
  const loadArticles = async () => {
    setLoading(true);
    const data = await articleAPI.getArticles();
    setArticles(data);
    setLoading(false);
  };
  loadArticles();
}, []);
```

**Replace handleSubmit for Articles:**
```javascript
// OLD: localStorage
const handleSubmit = (e) => {
  e.preventDefault();
  if (editingId) {
    setArticles(articles.map(a => a.id === editingId ? {...a, ...formData} : a));
  } else {
    const newArticle = {...formData, id: Math.max(...articles.map(a => a.id), 0) + 1};
    setArticles([newArticle, ...articles]);
  }
  // localStorage.setItem("markhorsNewsArticles", JSON.stringify(articles));
};

// NEW: API
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editingId) {
      await articleAPI.updateArticle(editingId, formData);
    } else {
      await articleAPI.createArticle(formData);
    }
    // Reload articles
    const updated = await articleAPI.getArticles();
    setArticles(updated);
    setIsFormOpen(false);
    setEditingId(null);
  } catch (error) {
    alert("Error saving article: " + error.message);
  }
};
```

**Replace handleDelete for Articles:**
```javascript
// OLD
const handleDelete = (id) => {
  if (window.confirm("Delete this article?")) {
    setArticles(articles.filter(a => a.id !== id));
  }
};

// NEW
const handleDelete = async (id) => {
  if (window.confirm("Delete this article?")) {
    try {
      await articleAPI.deleteArticle(id);
      setArticles(articles.filter(a => a._id !== id)); // Use _id from MongoDB
    } catch (error) {
      alert("Error deleting article: " + error.message);
    }
  }
};
```

### 2. AdminDashboard.jsx - Videos Tab

**Similar updates:**

```javascript
// OLD: localStorage
React.useEffect(() => {
  const savedVideos = localStorage.getItem("markhorsVideos");
  if (savedVideos) {
    setVideos(JSON.parse(savedVideos));
  }
}, []);

React.useEffect(() => {
  if (videos.length > 0) {
    localStorage.setItem("markhorsVideos", JSON.stringify(videos));
  }
}, [videos]);

// NEW: API
import { videoAPI } from '../services/api';

React.useEffect(() => {
  const loadVideos = async () => {
    setLoading(true);
    const data = await videoAPI.getVideos();
    setVideos(data);
    setLoading(false);
  };
  loadVideos();
}, []);

// Remove the localStorage save effect
```

**Update handleSubmit for Videos:**
```javascript
// NEW: Convert file to base64 and send via API
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const videoData = {
      ...formData,
      fileSize: formData.videoUrl ? formData.videoUrl.length : 0,
    };
    
    if (editingId) {
      await videoAPI.updateVideo(editingId, videoData);
    } else {
      await videoAPI.createVideo(videoData);
    }
    
    // Reload videos
    const updated = await videoAPI.getVideos();
    setVideos(updated);
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({...initialFormData});
  } catch (error) {
    setUploadError("Error saving video: " + error.message);
  }
};
```

### 3. News.jsx Page

**Replace data loading:**
```javascript
// OLD
React.useEffect(() => {
  const savedArticles = localStorage.getItem("markhorsNewsArticles");
  if (savedArticles) {
    setNewsArticles(JSON.parse(savedArticles));
  } else {
    // Default articles...
  }
}, []);

// NEW
import { articleAPI } from '../services/api';

React.useEffect(() => {
  const loadArticles = async () => {
    const data = await articleAPI.getArticles();
    setNewsArticles(data);
  };
  loadArticles();
}, []);
```

### 4. Videos.jsx Page

**Replace data loading:**
```javascript
// OLD
React.useEffect(() => {
  const savedVideos = localStorage.getItem("markhorsVideos");
  if (savedVideos) {
    setVideos(JSON.parse(savedVideos));
  }
}, []);

// NEW
import { videoAPI } from '../services/api';

React.useEffect(() => {
  const loadVideos = async () => {
    const data = await videoAPI.getVideos();
    setVideos(data);
  };
  loadVideos();
}, []);
```

## Important Notes

1. **MongoDB IDs**: MongoDB uses `_id` instead of `id`
   - Change `article.id` to `article._id`
   - Change `video.id` to `video._id`

2. **Timestamps**: MongoDB adds `createdAt` and `updatedAt` automatically
   - You can use these instead of manual date tracking

3. **Error Handling**: Always wrap API calls in try-catch
   ```javascript
   try {
     const result = await videoAPI.createVideo(data);
   } catch (error) {
     alert("Error: " + error.message);
   }
   ```

4. **Loading States**: Add loading indicators while fetching
   ```javascript
   const [loading, setLoading] = React.useState(false);
   
   React.useEffect(() => {
     const load = async () => {
       setLoading(true);
       const data = await videoAPI.getVideos();
       setVideos(data);
       setLoading(false);
     };
     load();
   }, []);
   
   if (loading) return <div>Loading...</div>;
   ```

## File Size Handling

**No more 15MB limits!** Videos can now be:
- Video files: Up to 500MB+ (depends on your database)
- Thumbnails: Up to 100MB+ (practical limit ~10MB)

The API handles:
```javascript
// Sending large base64 files
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
```

## Testing

1. Start backend: `cd server && npm start`
2. Test health: `http://localhost:5000/api/health`
3. Create video via API
4. Refresh page - video should persist
5. Delete video - should update immediately

## Rollback to localStorage

If you need to temporarily go back to localStorage:
```javascript
// Keep both mechanisms
const saveToLocal = (data) => {
  localStorage.setItem("markhorsVideos", JSON.stringify(data));
};

const saveToDB = async (data) => {
  await videoAPI.createVideo(data);
};

// Call both
await saveToDB(newVideo);
saveToLocal([...videos, newVideo]);
```

---

**Ready?** Start implementing these changes in your components!
