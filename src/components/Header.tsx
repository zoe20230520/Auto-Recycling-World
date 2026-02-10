import { Search, Menu, X, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onAdmin?: () => void;
  onLogout?: () => void;
}

export default function Header({ onSearch, onAdmin, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Auto Recycling World</h1>
              <p className="text-sm text-slate-300">Industry News & Insights</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {onAdmin && (
              <button
                onClick={onAdmin}
                className="flex items-center space-x-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>后台管理</span>
              </button>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-slate-300 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>退出</span>
              </button>
            )}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 text-white placeholder-slate-400 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </form>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 text-white placeholder-slate-400 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
