import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { academyAPI, groundAPI, tourAPI } from "../services/api";

const StatusBadge = ({ status }) => {
  const colors = {
    pending: "bg-yellow-400 text-black",
    approved: "bg-green-500 text-white",
    confirmed: "bg-green-500 text-white",
    rejected: "bg-red-500 text-white",
    cancelled: "bg-red-500 text-white",
  };
  return <span className={`inline-block px-3 py-1 rounded-full text-sm ${colors[status] || "bg-gray-500 text-white"}`}>{status}</span>;
};

const MyBookings = () => {
  const { user } = useAuth();
  const [academy, setAcademy] = useState([]);
  const [ground, setGround] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [a, g, t] = await Promise.all([
        academyAPI.getEnrollments(),
        groundAPI.getBookings(),
        tourAPI.getTourBookings(),
      ]);

      setAcademy(Array.isArray(a) ? a : []);
      setGround(Array.isArray(g) ? g : []);
      setTours(Array.isArray(t) ? t : []);
    } catch (e) {
      console.error("Error fetching user bookings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 10000);
    return () => clearInterval(id);
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-slate-300">Overview of your bookings and their current status.</p>
        </div>

        {loading && <div className="text-center text-yellow-200">Loading your bookings...</div>}

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Academy Enrollments</h2>
          {academy.length === 0 ? (
            <div className="text-slate-400">No academy enrollments found.</div>
          ) : (
            <div className="space-y-3">
              {academy.map((item) => (
                <div key={item._id} className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-slate-300">Contact: {item.contactNumber}</div>
                    <div className="text-sm text-slate-400">Submitted: {new Date(item.createdAt).toLocaleString()}</div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Ground Bookings</h2>
          {ground.length === 0 ? (
            <div className="text-slate-400">No ground bookings found.</div>
          ) : (
            <div className="space-y-3">
              {ground.map((b) => (
                <div key={b._id} className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{b.name} — {new Date(b.date).toLocaleDateString()}</div>
                    <div className="text-sm text-slate-300">Time: {b.timeFrom} — {b.timeTo}</div>
                    <div className="text-sm text-slate-400">Submitted: {new Date(b.createdAt).toLocaleString()}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tour Bookings</h2>
          {tours.length === 0 ? (
            <div className="text-slate-400">No tour bookings found.</div>
          ) : (
            <div className="space-y-3">
              {tours.map((t) => (
                <div key={t._id} className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t.tourTitle}</div>
                    <div className="text-sm text-slate-300">Name: {t.name} — Phone: {t.phoneNumber}</div>
                    <div className="text-sm text-slate-400">Submitted: {new Date(t.createdAt).toLocaleString()}</div>
                  </div>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyBookings;
