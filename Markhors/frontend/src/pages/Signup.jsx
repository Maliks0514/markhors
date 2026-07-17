import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);

    setTimeout(() => {
      const result = register({ name, email, password });
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || "Signup failed");
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold">Create Account</h1>
          <p className="text-gray-400 text-sm">Sign up to access booking and features</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
          {error && <div className="text-red-400 text-sm">{error}</div>}

          <div>
            <label className="block text-white text-sm mb-2">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full px-3 py-2 rounded bg-white/5 border border-white/20 text-white"
            />
          </div>

          <button disabled={isLoading} className="w-full bg-amber-500 text-black font-bold py-2 rounded">
            {isLoading ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account? <Link to="/login" className="text-amber-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
