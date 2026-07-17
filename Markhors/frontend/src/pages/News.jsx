import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Calendar, ArrowRight } from "lucide-react";
import { articleAPI } from "../services/api";

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleAPI.getArticles();
        setNewsArticles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setNewsArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const categories = [
    { id: "all", label: "All News" },
    { id: "match", label: "Match Reports" },
    { id: "academy", label: "Academy" },
    { id: "tournament", label: "Tournaments" },
    { id: "community", label: "Community" },
  ];

  const filteredArticles =
    selectedCategory === "all"
      ? newsArticles
      : newsArticles.filter((article) => article.category === selectedCategory);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-16 px-6 lg:px-10 bg-linear-to-b from-black via-black/95 to-black border-b border-amber-400/20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold uppercase mb-4">
            Latest News
          </h1>
          <p className="text-yellow-200 text-lg md:text-xl uppercase tracking-[2px]">
            Stay Updated With Chitral Markhors
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-6 lg:px-10 bg-black/50 border-b border-white/10 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-yellow-200 text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Loading news articles...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <article
                    key={article._id}
                    className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10"
                  >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-linear-to-br from-amber-500/20 to-transparent">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-200 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center gap-2 bg-yellow-200 text-sm mb-3">
                    <Calendar size={16} />
                    <span>{article.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white text-xl font-bold mb-3 group-hover:text-yellow-200 transition-colors duration-300">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  {/* Read More Button */}
                  <button className="inline-flex items-center gap-2 text-yellow-200 hover:text-yellow-300 font-semibold text-sm transition-colors duration-300 group/btn">
                    Read More
                    <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform duration-300"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* No Results Message */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                No news articles found in this category.
              </p>
            </div>
          )}
          </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 lg:px-10 bg-linear-to-r from-amber-500/10 to-transparent border-y border-amber-400/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-gray-300 mb-8">
            Subscribe to our newsletter to get the latest news and updates from Chitral Markhors directly in your inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-200 transition-colors"
            />
            <button className="bg-yellow-200 hover:bg-yellow-300 text-black font-bold px-8 py-3 rounded-full transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-16"></div>
    </div>
  );
};

export default News;
