import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { groundAPI } from "../services/api";

const GroundBooking = () => {
  const [formData, setFormData] = useState({
    name: "",
    cnic: "",
    contactNumber: "",
    feeReceiptImage: null,
    date: "",
    timeFrom: "",
    timeTo: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setFormData((prev) => ({ ...prev, feeReceiptImage: imageFile }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate time range
    if (formData.timeFrom >= formData.timeTo) {
      setError("End time must be after start time.");
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("cnic", formData.cnic);
      payload.append("contactNumber", formData.contactNumber);
      payload.append("date", formData.date);
      payload.append("timeFrom", formData.timeFrom);
      payload.append("timeTo", formData.timeTo);

      if (formData.feeReceiptImage) {
        payload.append("feeReceipt", formData.feeReceiptImage);
      }

      await groundAPI.createBooking(payload);
      setSubmitted(true);
      setFormData({
        name: "",
        cnic: "",
        contactNumber: "",
        feeReceiptImage: null,
        date: "",
        timeFrom: "",
        timeTo: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.message || "Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-200 uppercase tracking-[6px] text-sm font-semibold mb-3">
            Ground Booking
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Book Our Ground
          </h1>
          <p className="text-slate-300 mt-4">
            Reserve our football ground for your practice or match. All fields are required.
          </p>
        </div>

        {submitted && (
          <div className="mb-8 bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-4 rounded-lg">
            ✓ Your booking request has been submitted successfully! Our admin team will review and confirm your booking.
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
                CNIC *
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                placeholder="Enter your CNIC number"
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
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={minDate}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Time From *
              </label>
              <input
                type="time"
                name="timeFrom"
                value={formData.timeFrom}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Time To *
              </label>
              <input
                type="time"
                name="timeTo"
                value={formData.timeTo}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-sm font-semibold mb-2">
                Fee Receipt Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-400 file:bg-amber-500 file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:font-semibold file:cursor-pointer"
              />
              {formData.feeReceiptImage && (
                <p className="text-amber-400 text-xs mt-2">✓ Receipt image selected</p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-black font-bold py-3 rounded-lg transition-colors"
            >
              {loading ? "Submitting..." : "Submit Booking Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroundBooking;
