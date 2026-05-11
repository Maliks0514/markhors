const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Video API Functions
export const videoAPI = {
  // Get all videos or by category
  getVideos: async (category = "all") => {
    try {
      const url = category === "all" 
        ? `${API_BASE_URL}/videos`
        : `${API_BASE_URL}/videos?category=${category}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch videos");
      return await response.json();
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
  },

  // Get single video by ID
  getVideoById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`);
      if (!response.ok) throw new Error("Failed to fetch video");
      return await response.json();
    } catch (error) {
      console.error("Error fetching video:", error);
      return null;
    }
  },

  // Create new video
  createVideo: async (videoData) => {
    try {
      const isFormData = videoData instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/videos`, {
        method: "POST",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        body: isFormData ? videoData : JSON.stringify(videoData),
      });
      if (!response.ok) throw new Error("Failed to create video");
      return await response.json();
    } catch (error) {
      console.error("Error creating video:", error);
      throw error;
    }
  },

  // Update video
  updateVideo: async (id, videoData) => {
    try {
      const isFormData = videoData instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: "PUT",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        body: isFormData ? videoData : JSON.stringify(videoData),
      });
      if (!response.ok) throw new Error("Failed to update video");
      return await response.json();
    } catch (error) {
      console.error("Error updating video:", error);
      throw error;
    }
  },

  // Delete video
  deleteVideo: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete video");
      return await response.json();
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  },
};

// Article API Functions
export const articleAPI = {
  // Get all articles or by category
  getArticles: async (category = "all") => {
    try {
      const url = category === "all"
        ? `${API_BASE_URL}/articles`
        : `${API_BASE_URL}/articles?category=${category}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch articles");
      return await response.json();
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  },

  // Get single article by ID
  getArticleById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`);
      if (!response.ok) throw new Error("Failed to fetch article");
      return await response.json();
    } catch (error) {
      console.error("Error fetching article:", error);
      return null;
    }
  },

  // Create new article
  createArticle: async (articleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      });
      if (!response.ok) throw new Error("Failed to create article");
      return await response.json();
    } catch (error) {
      console.error("Error creating article:", error);
      throw error;
    }
  },

  // Update article
  updateArticle: async (id, articleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleData),
      });
      if (!response.ok) throw new Error("Failed to update article");
      return await response.json();
    } catch (error) {
      console.error("Error updating article:", error);
      throw error;
    }
  },

  // Delete article
  deleteArticle: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete article");
      return await response.json();
    } catch (error) {
      console.error("Error deleting article:", error);
      throw error;
    }
  },
};

export const playerAPI = {
  getPlayers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/players`);
      if (!response.ok) throw new Error("Failed to fetch players");
      return await response.json();
    } catch (error) {
      console.error("Error fetching players:", error);
      return [];
    }
  },

  createPlayer: async (playerData) => {
    try {
      const isFormData = playerData instanceof FormData;
      const response = await fetch(`${API_BASE_URL}/players`, {
        method: "POST",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        body: isFormData ? playerData : JSON.stringify(playerData),
      });
      if (!response.ok) throw new Error("Failed to create player");
      return await response.json();
    } catch (error) {
      console.error("Error creating player:", error);
      throw error;
    }
  },

  deletePlayer: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete player");
      return await response.json();
    } catch (error) {
      console.error("Error deleting player:", error);
      throw error;
    }
  },
};

export const academyAPI = {
  getEnrollments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/academy`);
      if (!response.ok) throw new Error("Failed to fetch enrollments");
      return await response.json();
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return [];
    }
  },

  submitEnrollment: async (enrollmentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/academy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enrollmentData),
      });
      if (!response.ok) throw new Error("Failed to submit enrollment");
      return await response.json();
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      throw error;
    }
  },

  updateEnrollmentStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/academy/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update enrollment status");
      return await response.json();
    } catch (error) {
      console.error("Error updating enrollment:", error);
      throw error;
    }
  },

  deleteEnrollment: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/academy/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete enrollment");
      return await response.json();
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      throw error;
    }
  },
};

export const groundAPI = {
  getBookings: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ground`);
      if (!response.ok) throw new Error("Failed to fetch bookings");
      return await response.json();
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return [];
    }
  },

  createBooking: async (bookingData) => {
    try {
      const isFormData = bookingData instanceof FormData;
      console.log("Creating booking with FormData:", isFormData);
      if (isFormData) {
        for (let pair of bookingData.entries()) {
          console.log(pair[0] + ":", pair[1]);
        }
      }
      const response = await fetch(`${API_BASE_URL}/ground`, {
        method: "POST",
        headers: isFormData ? undefined : { "Content-Type": "application/json" },
        body: isFormData ? bookingData : JSON.stringify(bookingData),
      });
      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);
      if (!response.ok) throw new Error(responseData.message || "Failed to create booking");
      return responseData;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ground/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update booking status");
      return await response.json();
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  },

  deleteBooking: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ground/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete booking");
      return await response.json();
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  },
};

// File conversion utilities
export const fileUtils = {
  // Convert file to Base64 (for now, before uploading to backend)
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Get file size in MB
  getFileSizeInMB: (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  },
};
