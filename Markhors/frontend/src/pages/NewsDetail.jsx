import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import { articleAPI } from "../services/api";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articleAPI.getArticleById(id);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-32 px-6 lg:px-10">
          <p className="text-center text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-32 px-6 lg:px-10 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-amber-400 mb-6"
          >
            <ArrowLeft size={18} />
            Back to news
          </button>
          <p className="text-gray-400">Article not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="pt-32 pb-16 px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8"
          >
            <ArrowLeft size={18} />
            Back to news
          </button>

          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl shadow-amber-500/10">
            <img
              src={article.image || "/main-banner.png"}
              alt={article.title}
              className="w-full h-72 md:h-96 object-cover"
            />
            <div className="p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  {article.category}
                </span>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar size={16} />
                  <span>{article.date}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
                {article.title}
              </h1>
              <p className="text-lg text-amber-200 mb-8">{article.excerpt}</p>
              <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-line">
                {article.content}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDetail;
