import React from "react";
import { Link } from "react-router-dom";

const JoinAcademy = () => {
  return (
    <section className="relative h-126 overflow-hidden">
      <div className="absolute inset-0 bg-black" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] items-center gap-10">
            <div className="max-w-2xl">
              <p className="text-yellow-200 text-sm md:text-base uppercase tracking-[3px] mb-4">
                Build your future
              </p>
              <h2 className="text-white text-4xl md:text-6xl font-extrabold uppercase leading-tight">
                Join Academy
              </h2>
              <p className="text-white/90 text-lg md:text-2xl mt-4 uppercase tracking-[2px]">
                Train with discipline, grow with confidence, and become part of the Markhors pathway.
              </p>

              <Link
                to="/academy"
                className="inline-flex items-center mt-8 bg-yellow-200 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-full transition-colors duration-300"
              >
                Join Now
              </Link>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="/9.jpg"
                alt="Chitral Markhors academy"
                className="w-full max-w-md lg:max-w-lg h-105 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinAcademy;
