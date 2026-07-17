import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { academyAPI } from "../services/api";

const Academy = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    address: "",
    contactNumber: "",
    age: "",
    position: "",
    cnicBForm: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await academyAPI.submitEnrollment(formData);
      setSubmitted(true);
      setFormData({
        name: "",
        fatherName: "",
        address: "",
        contactNumber: "",
        age: "",
        position: "",
        cnicBForm: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message || "Failed to submit enrollment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-200 uppercase tracking-[6px] text-sm font-semibold mb-3">
            Join Our Academy
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Academy Enrollment
          </h1>
          <p className="text-slate-300 mt-4">
            Fill out the form below to apply for our academy program. All fields are required.
          </p>
        </div>

        {submitted && (
          <div className="mb-8 bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-4 rounded-lg">
            ✓ Your enrollment form has been submitted successfully! Our admin team will review your application.
          </div>
        )}

        {error && (
          <div className="mb-8 bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-lg">
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Father's Name *
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                placeholder="Enter father's name"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                placeholder="Enter your contact number"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="5"
                max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                placeholder="Enter your age"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-sm font-semibold mb-2">
                Position (Playing Position) *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                placeholder="e.g. Forward, Midfielder, Defender, Goalkeeper"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-sm font-semibold mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 resize-none"
                placeholder="Enter your complete address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-sm font-semibold mb-2">
                CNIC/B-Form Number *
              </label>
              <input
                type="text"
                name="cnicBForm"
                value={formData.cnicBForm}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                placeholder="Enter your CNIC or B-Form number"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? "Submitting..." : "Submit Enrollment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Academy;
