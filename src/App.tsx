import { useEffect, useState } from 'react';
import { api, Article, Category } from './lib/api';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { Loader2, Settings } from 'lucide-react';

interface User {
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

// 初始化默认管理员账户
function initDefaultAdmin() {
  const users = localStorage.getItem('users');
  if (!users) {
    const defaultAdmin = {
      username: 'admin',
      email: 'admin@auto-recycling.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('users', JSON.stringify([defaultAdmin]));
  }
}

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // 初始化默认管理员
    initDefaultAdmin();

    // 检查登录状态
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchData();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, selectedCategory, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [articlesData, categoriesData] = await Promise.all([
        api.getArticles(),
        api.getCategories(),
      ]);

      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = [...articles];

    if (selectedCategory) {
      filtered = filtered.filter(article => article.category_id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setShowAdmin(false);
    setSelectedArticle(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (selectedArticle) {
    return (
      <>
        <Header onSearch={handleSearch} onAdmin={() => setShowAdmin(true)} onLogout={handleLogout} />
        <ArticleDetail article={selectedArticle} onBack={handleBack} />
      </>
    );
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => { setShowAdmin(false); handleLogout(); }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onSearch={handleSearch} onAdmin={() => setShowAdmin(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Latest Industry News
          </h2>
          <p className="text-slate-600">
            Stay updated with the latest trends and developments in auto recycling
          </p>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <ArticleList
            articles={filteredArticles}
            onArticleClick={handleArticleClick}
          />
        )}
      </main>

      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-slate-300 leading-relaxed">
                Auto Recycling World is your trusted source for industry news,
                market insights, and technological advancements in automotive recycling.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      className="text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <p className="text-slate-300 mb-4">
                Subscribe to our newsletter for the latest updates.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Auto Recycling World. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
