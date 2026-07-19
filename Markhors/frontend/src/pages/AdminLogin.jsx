import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";
import logo from "../assets/logo.jpg";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        navigate("/admin-dashboard");
      } else {
        setError(result.message || "Login failed");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src={logo}
              alt="Chitral Markhors"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-white text-4xl font-extrabold uppercase">
            Admin Portal
          </h1>
          <p className="text-amber-400 text-sm uppercase tracking-[2px] mt-2">
            Chitral Markhors Management
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
              placeholder="Enter username"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
