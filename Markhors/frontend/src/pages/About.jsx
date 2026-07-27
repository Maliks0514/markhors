import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  const sections = [
    {
      title: "Our Vision",
      text: "To become a respected football club that nurtures talent, promotes discipline, and inspires the youth of Chitral through the beautiful game.",
    },
    {
      title: "Our Mission",
      text: "To provide a platform for young players to develop their skills, build character, and represent the community with pride through quality coaching and competitive opportunities.",
    },
    {
      title: "Background History",
      text: "Chitral Markhors was formed to strengthen football culture in the region by creating opportunities for local talent, encouraging teamwork, and bringing the community together through matches, training, and events.",
    },
    {
      title: "Contact",
      text: "Phone# +92 344 1041872",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-yellow-200 uppercase tracking-[6px] text-sm font-semibold mb-3">About Us</p>
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">The story behind Chitral Markhors</h1>
          <p className="text-slate-300 mt-4 max-w-3xl mx-auto">
            We are committed to building a stronger football community through passion, discipline, and opportunity.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title} className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">{section.title}</h2>
              <p className="text-slate-300 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
