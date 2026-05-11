import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Calendar, Play } from "lucide-react";
import { videoAPI } from "../services/api";

const Videos = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await videoAPI.getVideos();
        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const categories = [
    { id: "all", label: "All Videos" },
    { id: "match", label: "Match Highlights" },
    { id: "training", label: "Training" },
    { id: "academy", label: "Academy" },
    { id: "interview", label: "Interviews" },
    { id: "event", label: "Events" },
  ];

  const filteredVideos =
    selectedCategory === "all"
      ? videos
      : videos.filter((video) => video.category === selectedCategory);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 px-6 lg:px-10 bg-linear-to-b from-black via-black/95 to-black border-b border-amber-400/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-yellow-200" />
            </div>
            <h1 className="text-white text-5xl md:text-6xl font-extrabold uppercase">
              Videos
            </h1>
          </div>
          <p className="text-yellow-200 text-lg md:text-xl uppercase tracking-[2px]">
            Match Highlights, Training & Behind The Scenes
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-6 lg:px-10 bg-black/50 border-b border-white/10 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-yellow-200 text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Loading videos...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>

              {/* No Results Message */}
              {filteredVideos.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg">
                    No videos found in this category.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-10 bg-linear-to-r from-green-500/10 to-transparent border-y border-green-400/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-200 mb-2">
                {videos.length}+
              </div>
              <p className="text-gray-300 text-lg">Total Videos</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-200 mb-2">
                {categories.length - 1}
              </div>
              <p className="text-gray-300 text-lg">Categories</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-200 mb-2">HD</div>
              <p className="text-gray-300 text-lg">Quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
};

// Video Card Component
const VideoCard = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState(video.videoUrl || "");
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);

  const getCategoryBadgeColor = (category) => {
    const colors = {
      match: "bg-red-500/20 text-red-400",
      training: "bg-blue-500/20 text-blue-400",
      academy: "bg-purple-500/20 text-purple-400",
      interview: "bg-yellow-500/20 text-yellow-400",
      event: "bg-pink-500/20 text-pink-400",
    };
    return colors[category] || "bg-yellow-200 text-black";
  };

  const handleCardClick = async () => {
    if (!resolvedVideoUrl) {
      setIsLoadingVideo(true);
      try {
        const data = await videoAPI.getVideoById(video._id);
        setResolvedVideoUrl(data?.videoUrl || "");
      } catch (error) {
        console.error("Failed to load video URL:", error);
      } finally {
        setIsLoadingVideo(false);
      }
    }
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
      {/* Thumbnail Container */}
      <div
        className="relative h-48 bg-black cursor-pointer overflow-hidden"
        onClick={handleCardClick}
      >
        {!isPlaying ? (
          <>
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center group-hover:bg-yellow-300 transition-colors">
                <Play size={32} className="text-black ml-1" />
              </div>
            </div>
          </>
        ) : isLoadingVideo ? (
          <div className="w-full h-full flex items-center justify-center text-white text-sm">
            Loading video...
          </div>
        ) : (
          <video
            width="100%"
            height="100%"
            controls
            preload="metadata"
            poster={video.thumbnailUrl}
            autoPlay
            className="w-full h-full bg-black"
          >
            <source src={resolvedVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
          {video.duration}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${getCategoryBadgeColor(
              video.category
            )}`}
          >
            {video.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center gap-2 text-yellow-200 text-sm mb-3">
          <Calendar size={16} />
          <span>{video.date}</span>
        </div>

        {/* Title */}
        <h3 className="text-white text-lg font-bold mb-2 group-hover:text-yellow-200 transition-colors duration-300 line-clamp-2">
          {video.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
          {video.description}
        </p>

        {/* Watch Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="inline-flex items-center gap-2 text-yellow-200 hover:text-yellow-300 font-semibold text-sm transition-colors duration-300 group/btn"
        >
          {isPlaying ? "Close Player" : "Watch Now"}
          <Play size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default Videos;
