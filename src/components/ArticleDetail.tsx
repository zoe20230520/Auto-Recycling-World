import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { Article } from '../lib/api';

// 解析文章内容，将Markdown图片和视频标签转换为HTML
function parseContent(content: string): string {
  // 转换Markdown图片: ![alt](url) -> <img src="url" alt="alt" />
  let parsed = content.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" class="w-full max-w-2xl mx-auto my-6 rounded-lg shadow-md" />');
  
  // 转换视频标签，确保有controls属性，并添加备用内容
  parsed = parsed.replace(/<video\s+src="([^"]+)"(?:\s*controls)?\s*><\/video>/g, 
    '<div class="w-full max-w-2xl mx-auto my-6 rounded-lg shadow-md overflow-hidden">' +
    '<video src="$1" controls class="w-full h-auto">' +
    '<source src="$1">' +
    '您的浏览器不支持视频标签。' +
    '</video>' +
    '</div>'
  );
  
  // 处理没有video标签的裸URL（图片和视频）
  // 对于看起来像图片URL的，自动转换为img标签
  parsed = parsed.replace(
    /(^|[^"'\(])https?:\/\/[^\s\"]+\.(jpg|jpeg|png|gif|webp|svg|tiff|bmp|ico)(?![\w.])/gi,
    '$1<img src="$&" alt="图片" class="w-full max-w-2xl mx-auto my-6 rounded-lg shadow-md" />'
  );
  
  // 对于看起来像视频URL的，自动转换为video标签
  parsed = parsed.replace(
    /(^|[^"'\(])https?:\/\/[^\s\"]+\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)(?![\w.])/gi,
    '$1<div class="w-full max-w-2xl mx-auto my-6 rounded-lg shadow-md overflow-hidden">' +
    '<video src="$&" controls class="w-full h-auto"><source src="$&">您的浏览器不支持视频标签。</video>' +
    '</div>'
  );
  
  return parsed;
}

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

export default function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-600 hover:text-emerald-600 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Articles</span>
        </button>

        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-96 overflow-hidden">
            <img
              src={article.image_url || 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg'}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              {article.categories && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-600 mb-4">
                  <Tag className="w-4 h-4 mr-1" />
                  {article.categories.name}
                </span>
              )}
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center space-x-6 text-slate-200">
                <span className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  {article.author}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {formatDate(article.published_date)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-700 font-medium mb-6 leading-relaxed">
                {article.excerpt}
              </p>
              <div 
                className="text-slate-600 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: parseContent(article.content) }}
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
