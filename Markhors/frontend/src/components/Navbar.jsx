import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.jpg";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: "Videos", path: "/videos" },
    { name: "Academy", path: "/academy" },
    { name: "Book Ground", path: "/ground-booking" },
    { name: "Players", path: "/players" },
    { name: "Tours", path: "/tours" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-black backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Chitral Markhors"
              className="w-12 h-12 object-contain"
            />

            <div>
              <h1 className="text-white text-xl font-bold tracking-wide">
                Chitral Markhors
              </h1>

              <p className="text-yellow-200 text-xs uppercase tracking-[3px]">
                Football Club
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-white text-sm font-medium hover:text-yellow-200 transition duration-300 relative group"
              >
                {link.name}

                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right Button */}
          <div className="hidden lg:flex items-center gap-4 relative">
            <Link to="/admin-login">
              <button className="text-yellow-200 hover:text-yellow-300 font-semibold px-4 py-2 rounded-full transition duration-300 border border-yellow-200/50 hover:border-yellow-200">
                Admin
              </button>
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-white/90 hover:text-white font-semibold px-5 py-2 rounded-full transition duration-300 border border-white/10 bg-white/5"
                >
                  Account
                  <span className="text-xs">▾</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-black border border-white/10 shadow-xl overflow-hidden z-50">
                    <Link
                      to="/my-bookings"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-white hover:bg-white/5"
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-yellow-200 hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signup">
                <button className="bg-yellow-200 hover:bg-yellow-300 text-black font-semibold px-5 py-2 rounded-full transition duration-300">
                  Sign Up
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
          
          <div className="flex flex-col px-6 py-6 gap-5">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                onClick={() => setMobileMenu(false)}
                className="text-white text-lg hover:text-yellow-200 transition"
              >
                {link.name}
              </Link>
            ))}

            <Link to="/admin-login" onClick={() => setMobileMenu(false)}>
              <button className="text-yellow-200 hover:text-yellow-300 font-semibold py-3 rounded-full w-full border border-yellow-200/50 transition">
                Admin Portal
              </button>
            </Link>

            {user ? (
              <>
                <div className="border border-white/10 rounded-xl overflow-hidden bg-black/90">
                  <Link to="/my-bookings" onClick={() => { setMobileMenu(false); }}>
                    <button className="w-full text-left px-4 py-3 text-white hover:bg-white/5">
                      My Bookings
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenu(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-3 text-yellow-200 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/signup">
                <button className="bg-yellow-200 hover:bg-yellow-300 text-black font-semibold py-3 rounded-full mt-4 w-full">
                  Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;