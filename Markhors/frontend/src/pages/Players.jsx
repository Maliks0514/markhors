import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { playerAPI } from "../services/api";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlayerId, setExpandedPlayerId] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await playerAPI.getPlayers();
        setPlayers(data);
      } catch (error) {
        console.error("Unable to load players", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-200 uppercase tracking-[6px] text-sm font-semibold mb-3">
            Meet the Team
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            Our Players
          </h1>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
            Discover the squad behind the Chitral Markhors. Each player has the skill,
            passion, and dedication to represent the club on the field.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-yellow-200">Loading players...</div>
        ) : players.length === 0 ? (
          <div className="text-center py-20 text-slate-300">No players available yet.</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => {
              const isExpanded = expandedPlayerId === player._id;
              const showToggle = player.description?.length > 160;
              const descriptionText = showToggle && !isExpanded
                ? `${player.description.slice(0, 160).trim()}...`
                : player.description;

              return (
                <div
                  key={player._id}
                  className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-amber-400/40"
                >
                  <div className="h-72 overflow-hidden bg-slate-950">
                    <img
                      src={player.imageUrl}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-yellow-200 uppercase tracking-[2px] text-xs mb-2">{player.position}</p>
                    <h2 className="text-2xl font-semibold mb-3">{player.name}</h2>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                      {descriptionText}
                    </p>
                    {showToggle && (
                      <button
                        type="button"
                        onClick={() => setExpandedPlayerId(isExpanded ? null : player._id)}
                        className="mt-4 text-amber-300 hover:text-amber-100 font-semibold text-sm"
                      >
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
