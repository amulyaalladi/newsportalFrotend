import { CalendarDays, Clock3 } from "lucide-react";
import { useNavigate } from "react-router";

const NewsCard = ({ news }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    navigate(`/news/${news._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category */}
        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold capitalize">
          {news.category}
        </span>

        {/* Breaking Badge */}
        {news.isBreaking && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-bold animate-pulse">
            BREAKING
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-2 mb-3">{news.title}</h2>

        <p className="text-gray-600 line-clamp-3 mb-4">{news.description}</p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-5">
          <div className="flex items-center gap-1">
            <CalendarDays size={16} />
            <span>{new Date(news.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock3 size={16} />
            <span>{news.readTime || 5} min</span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">By</p>
            <h4 className="font-semibold">{news.author?.name || "Admin"}</h4>
          </div>

          <button
            onClick={handleReadMore}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
