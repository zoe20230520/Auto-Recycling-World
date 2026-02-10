import { Article } from '../lib/api';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export default function ArticleList({ articles, onArticleClick }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No articles found</h3>
        <p className="text-slate-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onClick={() => onArticleClick(article)}
        />
      ))}
    </div>
  );
}
