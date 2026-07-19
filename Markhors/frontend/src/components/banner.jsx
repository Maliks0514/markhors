import React, { useEffect, useState } from "react";

const slides = [
  {
    image: "/8.jpg",
    title: "Chitral Markhors",
    subtitle: "Strength From The Mountains",
    button1: "Join The Pride",
    button2: "Explore Team",
  },

  {
    image: "/9.jpg",
    title: "Our Home Our Pride",
    subtitle: "Representing Chitral With Passion",
    button1: "Discover More",
    button2: "Community",
  },

  {
    image: "/11.jpg",
    title: "One Team One Dream",
    subtitle: "Together We Fight Together We Win",
    button1: "Shop Kits",
    button2: "Players",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

                  <div className="flex flex-wrap gap-4 mt-8">
                    <button className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-full transition duration-300">
                      {slide.button1}
                    </button>

                    <button className="border border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full transition duration-300">
                      {slide.button2}
                    </button>
                  </div>
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