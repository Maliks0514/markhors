import React from "react";
import { Link } from "react-router-dom";

const ToursHero = () => {
  return (
    <section className="relative min-h-112 md:h-126 overflow-hidden py-8 md:py-0">
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 h-full flex items-center py-4 md:py-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1.2fr_0.8fr] items-center gap-4 md:gap-10">
            <div className="max-w-2xl min-w-0">
              <p className="text-yellow-200 text-xs sm:text-sm md:text-base uppercase tracking-[3px] mb-3 md:mb-4">
                Explore the journey
              </p>
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-tight">
                Tours
              </h2>
              <p className="text-white/90 text-sm sm:text-base md:text-lg lg:text-2xl mt-3 md:mt-4 uppercase tracking-[2px]">
                Experience unforgettable travel moments and support the club on every destination.
              </p>

              <Link
                to="/tours"
                className="inline-flex items-center mt-6 md:mt-8 bg-yellow-200 hover:bg-yellow-300 text-black font-bold px-5 py-2.5 md:px-6 md:py-3 rounded-full transition-colors duration-300"
              >
                Explore Tours
              </Link>
            </div>

            <div className="flex justify-end">
              <img
                src="/14.jpg"
                alt="Chitral Markhors tours"
                className="w-28 sm:w-36 md:w-52 lg:w-full max-w-md lg:max-w-lg h-auto aspect-4/5 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToursHero;
