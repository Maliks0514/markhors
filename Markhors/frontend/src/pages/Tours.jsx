import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { tourAPI } from "../services/api";

const getImageUrl = (image) => {
  if (!image) return "/main-banner.png";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/uploads/")) {
    const apiBaseUrl = (import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "https://your-backend-project.vercel.app/api").replace(/\/$/, "");
    const baseUrl = apiBaseUrl.replace(/\/api$/, "");
    return `${baseUrl}${image}`;
  }
  return image;
};

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phoneNumber: "",
    idCardNumber: "",
    address: "",
    paymentReceipt: null,
  });
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourAPI.getTours();
        setTours(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const toggleBooking = (tour) => {
    setSelectedTour((prevSelectedTour) => {
      if (prevSelectedTour?._id === tour._id) {
        return null;
      }
      return tour;
    });
    setBookingForm({
      name: "",
      phoneNumber: "",
      idCardNumber: "",
      address: "",
      paymentReceipt: null,
    });
    setBookingMessage("");
    setBookingError("");
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    setBookingForm((prev) => ({ ...prev, paymentReceipt: file }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTour) return;

    setSubmitting(true);
    setBookingError("");

    try {
      const payload = new FormData();
      payload.append("name", bookingForm.name);
      payload.append("phoneNumber", bookingForm.phoneNumber);
      payload.append("idCardNumber", bookingForm.idCardNumber);
      payload.append("address", bookingForm.address);
      if (bookingForm.paymentReceipt) {
        payload.append("paymentReceipt", bookingForm.paymentReceipt);
      }

      await tourAPI.submitTourBooking(selectedTour._id, payload);
      setBookingMessage("Your tour request has been submitted successfully. Admin will review it shortly.");
      setBookingForm({
        name: "",
        phoneNumber: "",
        idCardNumber: "",
        address: "",
        paymentReceipt: null,
      });
    } catch (error) {
      setBookingError(error.message || "Unable to submit tour request.");
    } finally {
      setSubmitting(false);
    }
  };

  const heroImage = useMemo(() => {
    if (tours.length > 0 && tours[0].images?.length) {
      return tours[0].images[0];
    }
    return "/main-banner.png";
  }, [tours]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-200 uppercase tracking-[6px] text-sm font-semibold mb-3">Tours</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">Book a memorable tour with Chitral Markhors</h1>
          <p className="text-slate-300 mt-4 max-w-3xl mx-auto">
            Discover upcoming tours, review the advance payment details, and reserve your place with a simple booking form.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-yellow-200">Loading tours...</div>
            ) : tours.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-gray-400">No tours available right now.</div>
            ) : (
              tours.map((tour) => (
                <div key={tour._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <img
                    src={getImageUrl(tour.images?.[0] || heroImage)}
                    alt={tour.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">{tour.title}</h2>
                        <p className="text-amber-400 text-sm mt-1">Venue: {tour.venueName}</p>
                      </div>
                      <button
                        onClick={() => toggleBooking(tour)}
                        className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg"
                      >
                        {selectedTour?._id === tour._id ? "Hide Booking Form" : "Book This Tour"}
                      </button>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{tour.description}</p>
                    <div className="mt-4 rounded-xl bg-black/30 border border-white/10 p-4">
                      <p className="text-sm font-semibold text-white mb-2">Advance Payment Details</p>
                      <p className="text-sm text-slate-300 whitespace-pre-line">{tour.advancePaymentDetails}</p>
                    </div>
                    {tour.images?.length > 1 && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {tour.images.slice(1).map((image, index) => (
                          <img key={`${tour._id}-${index}`} src={getImageUrl(image)} alt={`${tour.title} ${index + 2}`} className="h-24 w-full rounded-lg object-cover" />
                        ))}
                      </div>
                    )}

                    {selectedTour?._id === tour._id && (
                      <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
                        <h3 className="text-xl font-semibold text-white mb-2">Booking Form</h3>
                        <p className="text-sm text-slate-300 mb-4">
                          {selectedTour ? `Fill the form for ${selectedTour.title}.` : "Choose a tour to continue."}
                        </p>

                        {bookingMessage && (
                          <div className="mb-4 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                            {bookingMessage}
                          </div>
                        )}

                        {bookingError && (
                          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {bookingError}
                          </div>
                        )}

                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                          <input
                            type="text"
                            name="name"
                            value={bookingForm.name}
                            onChange={handleBookingChange}
                            required
                            placeholder="Full Name"
                            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-slate-400"
                          />
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={bookingForm.phoneNumber}
                            onChange={handleBookingChange}
                            required
                            placeholder="Phone Number"
                            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-slate-400"
                          />
                          <input
                            type="text"
                            name="idCardNumber"
                            value={bookingForm.idCardNumber}
                            onChange={handleBookingChange}
                            required
                            placeholder="ID Card Number"
                            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-slate-400"
                          />
                          <textarea
                            name="address"
                            value={bookingForm.address}
                            onChange={handleBookingChange}
                            required
                            rows="3"
                            placeholder="Address"
                            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder:text-slate-400"
                          />
                          <div>
                            <label className="mb-2 block text-sm font-semibold text-white">Upload Payment Receipt *</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleReceiptChange}
                              required
                              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white file:mr-3 file:rounded file:border-0 file:bg-amber-500 file:px-3 file:py-1 file:font-semibold file:text-black"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-black transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-amber-500/50"
                          >
                            {submitting ? "Submitting..." : "Submit Booking Request"}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tours;
