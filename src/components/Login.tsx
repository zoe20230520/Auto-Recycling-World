import { useState } from 'react';
import { Lock, User as UserIcon, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (user: { username: string; role: string }) => void;
}

interface User {
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 获取所有用户
  const getUsers = (): User[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  // 保存用户
  const saveUsers = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('用户名或密码错误');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = getUsers();

      // 检查用户名是否已存在
      if (users.find(u => u.username === username)) {
        setError('用户名已存在');
        setLoading(false);
        return;
      }

      // 检查邮箱是否已存在
      if (users.find(u => u.email === email)) {
        setError('邮箱已被注册');
        setLoading(false);
        return;
      }

      // 创建新用户
      const newUser: User = {
        username,
        email,
        password,
        role: 'user', // 普通用户
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      // 自动登录
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      onLogin(newUser);
    }, 1000);
  };

  const handleSubmit = isLogin ? handleLogin : handleRegister;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景渐变 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600"></div>
      
      {/* 装饰性背景元素 */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full blur-xl"></div>
      
      {/* 登录/注册框 */}
      <div className="relative z-10 w-full max-w-2xl">
        <div 
          className="p-8 sm:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {isLogin ? '欢迎回来' : '创建账户'}
            </h2>
            <p className="text-white/80 text-sm">
              {isLogin ? '登录以访问所有功能' : '注册以开始您的创作之旅'}
            </p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex bg-white/10 rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 rounded-md text-sm font-medium transition-all ${
                isLogin 
                  ? 'bg-white/30 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 rounded-md text-sm font-medium transition-all ${
                !isLogin 
                  ? 'bg-white/30 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              注册
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  邮箱地址
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/60" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                    placeholder="请输入邮箱地址"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                  placeholder="请输入用户名"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/60" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                  placeholder="请输入密码"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-100 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? '登录中...' : '注册中...'}</span>
                </>
              ) : (
                <>
                  <UserIcon className="w-5 h-5" />
                  <span>{isLogin ? '登录' : '注册'}</span>
                </>
              )}
            </button>

            {/* Test Credentials - Only show in login mode */}
            {isLogin && (
              <div className="pt-4 border-t border-white/20">
                <div className="bg-white/10 rounded-lg p-4 text-white/80 text-sm">
                  <p className="font-semibold text-white mb-2">测试账号：</p>
                  <p>管理员：admin / admin123</p>
                  <p className="text-xs text-white/60 mt-1">（可创建文章、管理素材）</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

