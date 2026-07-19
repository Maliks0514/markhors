import React from "react";
import { Link } from "react-router-dom";

const News = () => {
  return (
    <section className="relative h-126 mt-5 overflow-hidden">
     
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="max-w-2xl">
            <p className="text-yellow-200 text-sm md:text-base uppercase tracking-[3px] mb-4">
              Stay connected
            </p>
            <h2 className="text-white text-4xl md:text-6xl font-extrabold uppercase leading-tight">
              Latest News
            </h2>
            <p className="text-white/90 text-lg md:text-2xl mt-4 uppercase tracking-[2px]">
              Follow match updates, club stories, and the latest from Chitral Markhors.
            </p>

            <Link
              to="/news"
              className="inline-flex items-center mt-8 bg-yellow-200 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-full transition-colors duration-300"
            >
              View News
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
