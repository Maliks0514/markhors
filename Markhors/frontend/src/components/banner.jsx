import React, { useEffect, useState } from "react";
import { bannerAPI } from "../services/api";

const defaultSlides = [
  {
    image: "/8.jpg",
    title: "Chitral Markhors",
    subtitle: "Strength From The Mountains",
  },
  {
    image: "/9.jpg",
    title: "Our Home Our Pride",
    subtitle: "Representing Chitral With Passion",
  },
  {
    image: "/11.jpg",
    title: "One Team One Dream",
    subtitle: "Together We Fight Together We Win",
  },
];

const Banner = () => {
  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const banner = await bannerAPI.getBanner();
        if (banner?.slides?.length) {
          setSlides(
            banner.slides.map((slide) => ({
              image: slide.image || "/main-banner.png",
              title: slide.title || "",
              subtitle: slide.subtitle || "",
            }))
          );
        }
      } catch (error) {
        console.error("Error loading banner slides:", error);
      }
    };

    fetchBanner();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative h-126 overflow-hidden mt-20">
      
      {/* Slider */}
      <div
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${current * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full h-126 shrink-0 relative bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
              width: `${100 / slides.length}%`,
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
                
                <div className="max-w-2xl">
                  <h1 className="text-white text-5xl md:text-7xl font-extrabold uppercase leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-yellow-200 text-lg md:text-2xl mt-5 uppercase tracking-[3px]">
                    {slide.subtitle}
                  </p>

              
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              current === index
                ? "bg-yellow-200 scale-125"
                : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Banner;