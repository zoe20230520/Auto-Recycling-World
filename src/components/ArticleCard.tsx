import { Calendar, User, Tag } from 'lucide-react';
import { Article } from '../lib/api';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

export default function ArticleCard({ article, onClick }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={article.image_url || 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg'}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {article.categories && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 text-white shadow-lg">
              <Tag className="w-3 h-3 mr-1" />
              {article.categories.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {article.title}
        </h2>

        <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {article.author}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(article.published_date)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
