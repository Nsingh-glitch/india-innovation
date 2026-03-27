import { useEffect, useState } from "react";
import "./newspage.css";
import newsLogo from "../../media/logo9.jpeg";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    try {
      const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

      if (!API_KEY) {
        console.error("API key missing");
        return;
      }

      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          "india water OR electricity OR roads OR sanitation OR healthcare OR pensions OR public issues"
        )}&sortBy=publishedAt&pageSize=12&language=en&apiKey=${API_KEY}`
      );

      const data = await res.json();
      setArticles(data.articles || []);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="news-page">

      {/* HEADER */}
      <h1 className="news-title">
        <img src={newsLogo} alt="news" className="news-img" />
        Latest News
      </h1>

      {/* GRID */}
      <div className="news-grid">
        {articles.map((news, i) => (
          <div key={i} className="news-card">

            <img
              src={news.urlToImage || "https://via.placeholder.com/300"}
              alt=""
            />

            <div className="news-content">
              <h3>{news.title || "No Title Available"}</h3>

              <p>{news.source?.name || "Unknown Source"}</p>

              <a
                href={news.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read More →
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}