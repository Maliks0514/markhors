import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu, X, BarChart3, FileText, Play, Users, Settings } from "lucide-react";
import { videoAPI, articleAPI, playerAPI, academyAPI, groundAPI, tourAPI } from "../services/api";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "news", label: "Manage News", icon: FileText },
    { id: "videos", label: "Manage Videos", icon: Play },
    { id: "players", label: "Manage Players", icon: Users },
    { id: "academy", label: "Academy Enrollments", icon: Users },
    { id: "ground", label: "Ground Bookings", icon: Users },
    { id: "tours", label: "Tours", icon: Settings },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-30 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] h-screen bg-black border-r border-white/10 shadow-2xl transform transition-transform duration-300 z-40 lg:static lg:w-64 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 relative">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Markhors"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h2 className="text-white font-bold text-sm">Markhors Admin</h2>
              <p className="text-amber-400 text-xs">Control Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-3 right-3 p-2 rounded-md text-white/90 hover:bg-white/5"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 sm:p-4 space-y-2 overflow-y-auto pb-28">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-start gap-2 sm:gap-3 min-h-[44px] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-all whitespace-normal ${
                  activeTab === item.id
                    ? "bg-amber-500/20 border border-amber-500/50 text-amber-400 shadow-sm"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className="text-sm sm:text-base font-medium leading-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white/5 border-b border-white/10 px-4 py-4 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Mobile menu button + title */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-white/90 p-2 rounded-md hover:bg-white/5"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-white font-bold text-lg">Admin Dashboard</h1>
          </div>

          {/* User Info & Logout */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="text-white text-sm font-semibold">{user?.username}</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "news" && <NewsTab />}
          {activeTab === "videos" && <VideosTab />}
          {activeTab === "players" && <PlayersTab />}
          {activeTab === "academy" && <AcademyEnrollmentsTab />}
          {activeTab === "ground" && <GroundBookingsTab />}
          {activeTab === "tours" && <ToursTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab = () => {
  const [articles, setArticles] = React.useState([]);
  const [videos, setVideos] = React.useState([]);
  const [players, setPlayers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, videosData, playersData] = await Promise.all([
          articleAPI.getArticles(),
          videoAPI.getVideos(),
          playerAPI.getPlayers(),
        ]);
        setArticles(Array.isArray(articlesData) ? articlesData : []);
        setVideos(Array.isArray(videosData) ? videosData : []);
        setPlayers(Array.isArray(playersData) ? playersData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setArticles([]);
        setVideos([]);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl">
      <h2 className="text-white text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Articles</p>
          <p className="text-amber-400 text-4xl font-bold">{articles.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Videos</p>
          <p className="text-amber-400 text-4xl font-bold">{videos.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Players</p>
          <p className="text-amber-400 text-4xl font-bold">{players.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">System Status</p>
          <p className="text-amber-400 text-lg font-bold">Operational</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg font-bold mb-4">Recent Articles</h3>
          <div className="space-y-3">
            {articles.slice(0, 5).map((article) => (
              <div key={article._id} className="bg-white/5 p-3 rounded-lg">
                <p className="text-white font-semibold">{article.title}</p>
                <p className="text-gray-400 text-sm">{article.date}</p>
              </div>
            ))}
            {articles.length === 0 && (
              <p className="text-gray-400">No articles yet</p>
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-white text-lg font-bold mb-4">Recent Videos</h3>
          <div className="space-y-3">
            {videos.slice(0, 5).map((video) => (
              <div key={video._id} className="bg-white/5 p-3 rounded-lg">
                <p className="text-white font-semibold">{video.title}</p>
                <p className="text-gray-400 text-sm">{video.date}</p>
              </div>
            ))}
            {videos.length === 0 && (
              <p className="text-gray-400">No videos yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsTab = () => {
  const [articles, setArticles] = React.useState([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    title: "",
    category: "match",
    date: "",
    image: "/main-banner.png",
    imageFile: null,
    excerpt: "",
    content: "",
  });

  const categories = [
    { id: "match", label: "Match Reports" },
    { id: "academy", label: "Academy" },
    { id: "tournament", label: "Tournaments" },
    { id: "community", label: "Community" },
  ];

  // Fetch articles on component mount
  React.useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleAPI.getArticles();
        setArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content) {
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("date", formData.date);
      payload.append("excerpt", formData.excerpt);
      payload.append("content", formData.content);

      if (formData.imageFile) {
        payload.append("image", formData.imageFile);
      } else {
        payload.append("image", formData.image || "/main-banner.png");
      }

      if (editingId) {
        const updatedArticle = await articleAPI.updateArticle(editingId, payload);
        setArticles(
          articles.map((a) => (a._id === editingId ? { ...a, ...updatedArticle } : a))
        );
      } else {
        const newArticle = await articleAPI.createArticle(payload);
        setArticles([newArticle, ...articles]);
      }

      setFormData({
        title: "",
        category: "match",
        date: "",
        image: "/main-banner.png",
        imageFile: null,
        excerpt: "",
        content: "",
      });
      setIsFormOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  const handleEdit = (article) => {
    setFormData(article);
    setEditingId(article._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this article?")) {
      try {
        await articleAPI.deleteArticle(id);
        setArticles(articles.filter((a) => a._id !== id));
      } catch (error) {
        console.error("Error deleting article:", error);
      }
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      category: "match",
      date: "",
      image: "/main-banner.png",
      imageFile: null,
      excerpt: "",
      content: "",
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      image: previewUrl,
    }));
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold">Manage News</h2>
          <p className="text-gray-400">Create and manage news articles for the website.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full lg:w-auto min-h-[44px] bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-2.5 rounded-lg transition-colors"
        >
          + New Article
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white/5 border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black/50 border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-white text-2xl font-bold">
                {editingId ? "Edit Article" : "New Article"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Date *
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Excerpt *
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  required
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400"
                />
                {formData.image && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded-lg"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="block sm:table min-w-180 w-full text-sm sm:text-base">
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Title</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Category</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Date</th>
                <th className="px-3 py-3 sm:px-6 sm:py-4 text-center text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article._id} className="block sm:table-row border-b border-white/10 hover:bg-white/5">
                  <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-white max-w-55 wrap-break-word">
                    <span className="sm:hidden text-gray-400 text-xs block mb-1">Title</span>
                    {article.title}
                  </td>
                  <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4">
                    <span className="sm:hidden text-gray-400 text-xs block mb-1">Category</span>
                    <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full">{article.category}</span>
                  </td>
                  <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-gray-300">
                    <span className="sm:hidden text-gray-400 text-xs block mb-1">Date</span>
                    {article.date}
                  </td>
                  <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-center">
                    <span className="sm:hidden text-gray-400 text-xs block mb-1">Actions</span>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                      <button onClick={() => handleEdit(article)} className="text-blue-400 hover:text-blue-300">Edit</button>
                      <button onClick={() => handleDelete(article._id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const VideosTab = () => {
  const [videos, setVideos] = React.useState([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [uploadError, setUploadError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    title: "",
    category: "match",
    date: "",
    thumbnailUrl: "",
    videoUrl: "",
    videoFile: null,
    thumbnailFile: null,
    description: "",
    duration: "",
  });

  const categories = [
    { id: "match", label: "Match Highlights" },
    { id: "training", label: "Training" },
    { id: "academy", label: "Academy" },
    { id: "interview", label: "Interviews" },
    { id: "event", label: "Events" },
  ];

  // Fetch videos on component mount
  React.useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await videoAPI.getVideos();
        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setUploadError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.videoUrl || !formData.thumbnailUrl) {
      setUploadError("Please fill in all required fields");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("date", formData.date);
      payload.append("duration", formData.duration);
      payload.append("description", formData.description);
      payload.append("videoUrl", formData.videoUrl);
      payload.append("thumbnailUrl", formData.thumbnailUrl);

      if (formData.videoFile) {
        payload.append("video", formData.videoFile);
      }
      if (formData.thumbnailFile) {
        payload.append("thumbnail", formData.thumbnailFile);
      }

      if (editingId) {
        const updatedVideo = await videoAPI.updateVideo(editingId, payload);
        setVideos(
          videos.map((v) => (v._id === editingId ? updatedVideo : v))
        );
      } else {
        const newVideo = await videoAPI.createVideo(payload);
        setVideos([newVideo, ...videos]);
      }
      
      setFormData({
        title: "",
        category: "match",
        date: "",
        thumbnailUrl: "",
        videoUrl: "",
        videoFile: null,
        thumbnailFile: null,
        description: "",
        duration: "",
      });
      setIsFormOpen(false);
      setEditingId(null);
    } catch (error) {
      setUploadError(error.message || "Failed to save video");
    }
  };

  const handleEdit = (video) => {
    setFormData(video);
    setEditingId(video._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this video?")) {
      try {
        await videoAPI.deleteVideo(id);
        setVideos(videos.filter((v) => v._id !== id));
      } catch (error) {
        setUploadError("Failed to delete video");
      }
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setUploadError("");
    setFormData({
      title: "",
      category: "match",
      date: "",
      thumbnailUrl: "",
      videoUrl: "",
      description: "",
      duration: "",
    });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    setUploadError("");
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        videoFile: file,
        videoUrl: previewUrl,
      }));
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    setUploadError("");
    
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        thumbnailFile: file,
        thumbnailUrl: previewUrl,
      }));
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-bold">Manage Videos</h2>
          <p className="text-gray-400">Upload and manage video content for the site.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full lg:w-auto min-h-[44px] bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-2.5 rounded-lg transition-colors"
        >
          + New Video
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white/5 border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black/50 border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-white text-2xl font-bold">
                {editingId ? "Edit Video" : "New Video"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {uploadError && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Date *
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Video File (MP4) *
                </label>
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={handleVideoUpload}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 file:bg-amber-500 file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:font-semibold file:cursor-pointer"
                />
                {formData.videoUrl && (
                  <p className="text-amber-400 text-xs mt-2">✓ Video selected</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Thumbnail Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 file:bg-amber-500 file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:font-semibold file:cursor-pointer"
                />
                {formData.thumbnailUrl && (
                  <p className="text-amber-400 text-xs mt-2">✓ Thumbnail selected</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  placeholder="12:34"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="2"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!formData.videoUrl || !formData.thumbnailUrl}
                  className="w-full sm:flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold py-2 rounded-lg transition-colors"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Videos Table */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="block sm:table min-w-215 w-full text-sm sm:text-base">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Thumbnail</th>
              <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Title</th>
              <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Category</th>
              <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Date</th>
              <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Duration</th>
              <th className="px-3 py-3 sm:px-6 sm:py-4 text-center text-white font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video._id} className="block sm:table-row border-b border-white/10 hover:bg-white/5">
                <td className="block sm:table-cell px-6 py-4">
                  <span className="sm:hidden text-gray-400 text-xs block mb-1">Thumbnail</span>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-white max-w-55 wrap-break-word">
                  <span className="sm:hidden text-gray-400 text-xs block mb-1">Title</span>
                  {video.title}
                </td>
                <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4">
                  <span className="sm:hidden text-gray-400 text-xs block mb-1">Category</span>
                  <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full">
                    {video.category}
                  </span>
                </td>
                <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-gray-300">
                  <span className="sm:hidden text-gray-400 text-xs block mb-1">Date</span>
                  {video.date}
                </td>
                <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-gray-300">
                  <span className="sm:hidden text-gray-400 text-xs block mb-1">Duration</span>
                  {video.duration}
                </td>
                <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-center">
                  <span className="sm:hidden text-gray-400 text-xs block mb-1">Actions</span>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    <button
                      onClick={() => handleEdit(video)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

const PlayersTab = () => {
  const [players, setPlayers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [newPlayer, setNewPlayer] = React.useState({
    name: "",
    position: "",
    description: "",
    imageFile: null,
  });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await playerAPI.getPlayers();
        setPlayers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching players:", err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPlayer((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setNewPlayer((prev) => ({ ...prev, imageFile }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPlayer.name || !newPlayer.description || !newPlayer.imageFile) {
      setError("Please complete all fields and upload an image.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", newPlayer.name);
      payload.append("position", newPlayer.position || "Player");
      payload.append("description", newPlayer.description);
      payload.append("image", newPlayer.imageFile);

      const created = await playerAPI.createPlayer(payload);
      setPlayers((prev) => [created, ...prev]);
      setNewPlayer({ name: "", position: "", description: "", imageFile: null });
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error adding player:", err);
      setError("Unable to add player. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this player?")) return;
    try {
      await playerAPI.deletePlayer(id);
      setPlayers((prev) => prev.filter((player) => player._id !== id));
    } catch (err) {
      console.error("Error deleting player:", err);
      setError("Unable to delete player.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-white text-xl sm:text-2xl font-bold leading-tight">Manage Players</h2>
          <p className="mt-1 text-sm sm:text-base text-gray-400 leading-relaxed">
            Add new squad members and remove players from the roster.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full sm:w-auto min-h-[44px] self-stretch sm:self-auto bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 sm:px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap"
        >
          + New Player
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white/5 border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black/50 border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-white text-2xl font-bold">New Player</h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setError("");
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newPlayer.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Position</label>
                <input
                  type="text"
                  name="position"
                  value={newPlayer.position}
                  onChange={handleChange}
                  placeholder="e.g. Forward, Midfielder"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={newPlayer.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">Picture *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 file:bg-amber-500 file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:font-semibold file:cursor-pointer"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  className="w-full sm:flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded-lg"
                >
                  Add Player
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setError("");
                  }}
                  className="w-full sm:flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-yellow-200">Loading players...</div>
        ) : players.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No players added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="block sm:table min-w-195 w-full text-sm sm:text-base">
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Player</th>
                  <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Position</th>
                  <th className="px-3 py-3 sm:px-6 sm:py-4 text-left text-white font-semibold">Description</th>
                  <th className="px-3 py-3 sm:px-6 sm:py-4 text-center text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player._id} className="block sm:table-row border-b border-white/10 hover:bg-white/5">
                    <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Player</span>
                      <div className="flex items-center gap-4">
                        <img
                          src={player.imageUrl}
                          alt={player.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-semibold">{player.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-gray-300">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Position</span>
                      {player.position || "Player"}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-gray-300 max-w-65 wrap-break-word">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Description</span>
                      {player.description}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-6 sm:py-4 text-center">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Actions</span>
                      <button
                        onClick={() => handleDelete(player._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const AcademyEnrollmentsTab = () => {
  const [enrollments, setEnrollments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await academyAPI.getEnrollments();
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        setEnrollments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await academyAPI.updateEnrollmentStatus(id, newStatus);
      setEnrollments((prev) =>
        prev.map((enrollment) => (enrollment._id === id ? updated : enrollment))
      );
    } catch (err) {
      console.error("Error updating enrollment status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enrollment?")) return;
    try {
      await academyAPI.deleteEnrollment(id);
      setEnrollments((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting enrollment:", err);
    }
  };

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-6">Academy Enrollments</h2>

      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-yellow-200">Loading enrollments...</div>
        ) : enrollments.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No enrollments yet.</div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Name</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Father's Name</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Contact</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Position</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Age</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">CNIC/B-Form</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Address</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Status</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-center text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment._id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-white">{enrollment.name}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300">{enrollment.fatherName}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300">{enrollment.contactNumber}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300">{enrollment.position}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300">{enrollment.age}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300">{enrollment.cnicBForm}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300 max-w-45 wrap-break-word">{enrollment.address}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">
                        <select
                          value={enrollment.status}
                          onChange={(e) => handleStatusChange(enrollment._id, e.target.value)}
                          className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleDelete(enrollment._id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-white/10">
              {enrollments.map((enrollment) => (
                <div key={enrollment._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold">{enrollment.name}</p>
                      <p className="text-amber-400 text-sm">{enrollment.position}</p>
                    </div>
                    <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                      {enrollment.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-gray-400">Father:</span> {enrollment.fatherName}</p>
                    <p><span className="text-gray-400">Contact:</span> {enrollment.contactNumber}</p>
                    <p><span className="text-gray-400">Age:</span> {enrollment.age}</p>
                    <p><span className="text-gray-400">CNIC/B-Form:</span> {enrollment.cnicBForm}</p>
                    <p><span className="text-gray-400">Address:</span> {enrollment.address}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <select
                      value={enrollment.status}
                      onChange={(e) => handleStatusChange(enrollment._id, e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleDelete(enrollment._id)}
                      className="w-full rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const GroundBookingsTab = () => {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await groundAPI.getBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await groundAPI.updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((booking) => (booking._id === id ? updated : booking))
      );
    } catch (err) {
      console.error("Error updating booking status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await groundAPI.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  return (
    <div>
      <h2 className="text-white text-2xl font-bold mb-6">Ground Bookings</h2>

      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-yellow-200">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No bookings yet.</div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Name</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">CNIC</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Contact</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Date</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Time</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Receipt</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Status</th>
                    <th className="px-3 py-3 sm:px-4 sm:py-4 text-center text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-white">{booking.name}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300">{booking.cnic}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300">{booking.contactNumber}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4 text-gray-300">{booking.timeFrom} - {booking.timeTo}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">
                        <a
                          href={booking.feeReceiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 underline text-sm"
                        >
                          View Receipt
                        </a>
                      </td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-white/10">
              {bookings.map((booking) => (
                <div key={booking._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold">{booking.name}</p>
                      <p className="text-amber-400 text-sm">{booking.cnic}</p>
                    </div>
                    <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-300">
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-300">
                    <p><span className="text-gray-400">Contact:</span> {booking.contactNumber}</p>
                    <p><span className="text-gray-400">Date:</span> {new Date(booking.date).toLocaleDateString()}</p>
                    <p><span className="text-gray-400">Time:</span> {booking.timeFrom} - {booking.timeTo}</p>
                    <p>
                      <span className="text-gray-400">Receipt:</span>{" "}
                      <a
                        href={booking.feeReceiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:text-amber-300 underline"
                      >
                        View Receipt
                      </a>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => handleDelete(booking._id)}
                      className="w-full rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ToursTab = () => {
  const [tours, setTours] = React.useState([]);
  const [bookings, setBookings] = React.useState([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [formData, setFormData] = React.useState({
    title: "",
    venueName: "",
    description: "",
    advancePaymentDetails: "",
    images: [],
  });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchTours = async () => {
      try {
        const [tourData, bookingData] = await Promise.all([tourAPI.getTours(), tourAPI.getTourBookings()]);
        setTours(Array.isArray(tourData) ? tourData : []);
        setBookings(Array.isArray(bookingData) ? bookingData : []);
      } catch (err) {
        console.error("Error loading tours", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.venueName || !formData.description || !formData.advancePaymentDetails) {
      setError("Please complete all tour fields.");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("venueName", formData.venueName);
      payload.append("description", formData.description);
      payload.append("advancePaymentDetails", formData.advancePaymentDetails);

      formData.images.forEach((image) => {
        payload.append("images", image);
      });

      if (editingId) {
        const updatedTour = await tourAPI.updateTour(editingId, payload);
        setTours((prev) => prev.map((tour) => (tour._id === editingId ? updatedTour : tour)));
      } else {
        const createdTour = await tourAPI.createTour(payload);
        setTours((prev) => [createdTour, ...prev]);
      }

      setFormData({ title: "", venueName: "", description: "", advancePaymentDetails: "", images: [] });
      setIsFormOpen(false);
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Unable to save tour.");
    }
  };

  const handleEdit = (tour) => {
    setFormData({
      title: tour.title,
      venueName: tour.venueName,
      description: tour.description,
      advancePaymentDetails: tour.advancePaymentDetails,
      images: tour.images || [],
    });
    setEditingId(tour._id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tour and its bookings?")) return;
    try {
      await tourAPI.deleteTour(id);
      setTours((prev) => prev.filter((tour) => tour._id !== id));
      setBookings((prev) => prev.filter((booking) => booking.tourId !== id));
    } catch (err) {
      console.error("Error deleting tour", err);
    }
  };

  const handleBookingStatusChange = async (id, status) => {
    try {
      const updated = await tourAPI.updateTourBookingStatus(id, status);
      setBookings((prev) => prev.map((booking) => (booking._id === id ? updated : booking)));
    } catch (err) {
      console.error("Error updating tour booking status", err);
    }
  };

  const handleBookingDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await tourAPI.deleteTourBooking(id);
      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch (err) {
      console.error("Error deleting booking", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Manage Tours</h2>
          <p className="text-gray-400">Create tour listings and monitor tour booking requests from users.</p>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(true);
            setEditingId(null);
            setError("");
            setFormData({ title: "", venueName: "", description: "", advancePaymentDetails: "", images: [] });
          }}
          className="w-full lg:w-auto bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-2 rounded-lg transition-colors"
        >
          + New Tour
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white/5 border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black/50 border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-white text-2xl font-bold">{editingId ? "Edit Tour" : "New Tour"}</h2>
              <button onClick={() => { setIsFormOpen(false); setEditingId(null); setError(""); }} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Tour Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Venue Name *</label>
                <input type="text" name="venueName" value={formData.venueName} onChange={handleInputChange} required className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 resize-none" />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Advance Payment Details *</label>
                <textarea name="advancePaymentDetails" value={formData.advancePaymentDetails} onChange={handleInputChange} required rows="4" className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 resize-none" />
              </div>
              <div>
                <label className="block text-white text-sm font-semibold mb-2">Tour Images</label>
                <input type="file" multiple accept="image/*" onChange={handleImagesChange} className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 file:bg-amber-500 file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:font-semibold file:cursor-pointer" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button type="submit" className="w-full sm:flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded-lg">{editingId ? "Update Tour" : "Create Tour"}</button>
                <button type="button" onClick={() => { setIsFormOpen(false); setEditingId(null); setError(""); }} className="w-full sm:flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-yellow-200">Loading tours...</div>
        ) : tours.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No tours available yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="block sm:table w-full text-sm">
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Tour</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Venue</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Advance Payment</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-center text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((tour) => (
                  <tr key={tour._id} className="block sm:table-row border-b border-white/10 hover:bg-white/5">
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-white">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Tour</span>
                      {tour.title}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-gray-300">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Venue</span>
                      {tour.venueName}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-gray-300 max-w-55 wrap-break-word">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Advance Payment</span>
                      {tour.advancePaymentDetails}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-center">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Actions</span>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                        <button onClick={() => handleEdit(tour)} className="text-blue-400 hover:text-blue-300">Edit</button>
                        <button onClick={() => handleDelete(tour._id)} className="text-red-400 hover:text-red-300">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-white text-xl font-bold">Tour Booking Requests</h3>
        </div>
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No tour booking requests yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="block sm:table w-full text-sm">
              <thead className="hidden sm:table-header-group">
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Tour</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Name</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Phone</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">ID Card</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Address</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Receipt</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-left text-white font-semibold">Status</th>
                  <th className="px-3 py-3 sm:px-4 sm:py-4 text-center text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="block sm:table-row border-b border-white/10 hover:bg-white/5">
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-white">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Tour</span>
                      {booking.tourTitle}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-gray-300">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Name</span>
                      {booking.name}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-gray-300">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Phone</span>
                      {booking.phoneNumber}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-gray-300">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">ID Card</span>
                      {booking.idCardNumber}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-gray-300 max-w-45 wrap-break-word">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Address</span>
                      {booking.address}
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Receipt</span>
                      <a href={booking.paymentReceiptUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">View</a>
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Status</span>
                      <select value={booking.status} onChange={(e) => handleBookingStatusChange(booking._id, e.target.value)} className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 text-sm">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="block sm:table-cell px-3 py-3 sm:px-4 sm:py-4 text-center">
                      <span className="sm:hidden text-gray-400 text-xs block mb-1">Actions</span>
                      <button onClick={() => handleBookingDelete(booking._id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};


export default AdminDashboard;
