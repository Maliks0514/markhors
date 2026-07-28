import React from "react";
import { Link } from "react-router-dom";

const FooterSection = () => {
  return (
    <footer className="bg-black border-t border-amber-400/20 text-white py-12 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3">
        <div>
          <img src="/logo.jpg" alt="Chitral Markhors logo" className="w-32 mb-4" />
          <p className="text-gray-300 text-sm leading-relaxed">
            Chitral Markhors brings together passion, discipline, and mountain pride through football, academy development, and unforgettable experiences.
          </p>
        </div>

        <div>
          <h3 className="text-yellow-200 text-lg font-bold uppercase mb-4">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <Link to="/" className="hover:text-yellow-200">Home</Link>
            <Link to="/news" className="hover:text-yellow-200">News</Link>
            <Link to="/players" className="hover:text-yellow-200">Players</Link>
            <Link to="/academy" className="hover:text-yellow-200">Academy</Link>
            <Link to="/tours" className="hover:text-yellow-200">Tours</Link>
          </div>
        </div>

        <div>
          <h3 className="text-yellow-200 text-lg font-bold uppercase mb-4">Connect</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <a href="mailto:contact@markhors.com" className="hover:text-yellow-200">Email: contact@markhors.com</a>
            <a href="https://wa.me/923441041872" target="_blank" rel="noreferrer" className="hover:text-yellow-200">WhatsApp Chat</a>
            <a href="https://www.instagram.com/chitral_markhors?igsh=MTk3enVoMWg2eXJibw==" target="_blank" rel="noreferrer" className="hover:text-yellow-200">Instagram</a>
            <a href="https://www.facebook.com/share/1G2HT64fFu/" target="_blank" rel="noreferrer" className="hover:text-yellow-200">Facebook</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-400">
        © 2026 Chitral Markhors. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterSection;
