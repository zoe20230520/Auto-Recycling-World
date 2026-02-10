import { useState, useEffect, useRef } from 'react';
import { api, Article, Category } from '../lib/api';
import { Plus, Edit2, Trash2, ArrowLeft, Search, FileImage, FileVideo, Image, Video, Link, X } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'categories' | 'media'>('articles');
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    try {
      await api.deleteArticle(id);
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setShowForm(true);
  };

  const handleSaveArticle = async (articleData: Partial<Article>) => {
    try {
      if (editingArticle) {
        await api.updateArticle(editingArticle.id, articleData);
        await fetchData();
      } else {
        await api.createArticle({
          ...articleData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Article);
        await fetchData();
      }
      setShowForm(false);
      setEditingArticle(null);
    } catch (error) {
      alert('保存失败');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？该分类下的文章将不受影响。')) return;
    // Category delete not implemented in API yet
    alert('分类删除功能暂未实现');
  };

  if (showForm) {
    return (
      <ArticleForm
        article={editingArticle}
        categories={categories}
        onSave={handleSaveArticle}
        onCancel={() => {
          setShowForm(false);
          setEditingArticle(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center space-x-2 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
          <h1 className="text-xl font-bold">后台管理</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'articles'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              文章管理
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              分类管理
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'media'
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              素材库管理
            </button>
          </div>
        </div>

        {activeTab === 'articles' ? (
          <ArticlesList
            articles={articles}
            categories={categories}
            loading={loading}
            onNew={handleNewArticle}
            onEdit={handleEditArticle}
            onDelete={handleDeleteArticle}
          />
        ) : activeTab === 'categories' ? (
          <CategoriesList
            categories={categories}
            loading={loading}
            onDelete={handleDeleteCategory}
          />
        ) : (
          <MediaList />
        )}
      </div>
    </div>
  );
}

function ArticlesList({
  articles,
  categories,
  loading,
  onNew,
  onEdit,
  onDelete,
}: {
  articles: Article[];
  categories: Category[];
  loading: boolean;
  onNew: () => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
}) {
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '无分类';
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || '未知';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">文章列表</h2>
        <button
          onClick={onNew}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新建文章</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">加载中...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-slate-500">暂无文章</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  分类
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  作者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  发布日期
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{article.title}</div>
                    <div className="text-sm text-slate-500">{article.excerpt}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {getCategoryName(article.category_id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{article.author}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{article.published_date}</td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => onEdit(article)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(article.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CategoriesList({
  categories,
  loading,
  onDelete,
}: {
  categories: Category[];
  loading: boolean;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-900">分类列表</h2>

      {loading ? (
        <div className="text-center py-12 text-slate-500">加载中...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-slate-500">暂无分类</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{category.slug}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => onDelete(category.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MediaList() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/media');
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个素材吗？')) return;
    try {
      await fetch(`http://localhost:3001/api/media/${id}`, {
        method: 'DELETE',
      });
      setMedia(media.filter(m => m.id !== id));
    } catch (error) {
      alert('删除失败');
    }
  };

  const handleEdit = (mediaItem: any) => {
    setEditingMedia(mediaItem);
    setShowEditForm(true);
  };

  const handleSaveEdit = async (updatedData: any) => {
    try {
      const response = await fetch(`http://localhost:3001/api/media/${editingMedia.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        await fetchMedia();
        setShowEditForm(false);
        setEditingMedia(null);
      } else {
        alert('更新失败');
      }
    } catch (error) {
      alert('更新失败');
    }
  };

  const handleUpload = async (files: FileList | File[]) => {
    if (!files.length) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('http://localhost:3001/api/media/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          let errorMessage = '上传失败';
          
          if (errorData.includes('不支持的文件格式')) {
            errorMessage = `文件"${file.name}"格式不支持。请上传支持的图片或视频格式。`;
          } else if (errorData.includes('Error:')) {
            const match = errorData.match(/Error: (.+?)<br>/);
            if (match) {
              errorMessage = `文件"${file.name}"上传失败: ${match[1]}`;
            }
          }
          
          throw new Error(errorMessage);
        }
      }
      await fetchMedia();
    } catch (error) {
      alert(error instanceof Error ? error.message : '上传失败');
    } finally {
      setUploading(false);
    }
  };

  const isImage = (mimetype: string) => mimetype?.startsWith('image/');
  const isVideo = (mimetype: string) => mimetype?.startsWith('video/');
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredMedia = media.filter(m =>
    m.original_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showEditForm) {
    return <MediaEditForm media={editingMedia} onSave={handleSaveEdit} onCancel={() => { setShowEditForm(false); setEditingMedia(null); }} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">素材库</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索素材..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
            <span>{uploading ? '上传中...' : '上传素材'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">加载中...</div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-slate-500">{searchTerm ? '没有找到匹配的素材' : '暂无素材'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">预览</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">文件名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">类型</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">大小</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">上传时间</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMedia.map((mediaItem) => (
                <tr key={mediaItem.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                      {isImage(mediaItem.mimetype) ? (
                        <img
                          src={`http://localhost:3001${mediaItem.url}`}
                          alt={mediaItem.original_name}
                          className="w-full h-full object-cover"
                        />
                      ) : isVideo(mediaItem.mimetype) ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                          <FileVideo className="w-8 h-8 text-white" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileImage className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{mediaItem.original_name}</div>
                    <div className="text-sm text-slate-500 font-mono">{mediaItem.id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1">
                      {isImage(mediaItem.mimetype) ? (
                        <>
                          <FileImage className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-slate-600">图片</span>
                        </>
                      ) : isVideo(mediaItem.mimetype) ? (
                        <>
                          <FileVideo className="w-4 h-4 text-purple-500" />
                          <span className="text-sm text-slate-600">视频</span>
                        </>
                      ) : (
                        <span className="text-sm text-slate-600">{mediaItem.mimetype}</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatFileSize(mediaItem.size)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(mediaItem.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(mediaItem)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(mediaItem.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MediaEditForm({
  media,
  onSave,
  onCancel,
}: {
  media: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    original_name: media.original_name || '',
    alt_text: media.alt_text || '',
    description: media.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onCancel} className="flex items-center space-x-2 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold">编辑素材</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">文件名</label>
            <input
              type="text"
              value={formData.original_name}
              onChange={(e) => setFormData({ ...formData, original_name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">替代文本 (Alt Text)</label>
            <input
              type="text"
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="图片的描述文本，用于SEO和无障碍访问"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              placeholder="素材的详细描述"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ArticleForm({
  article,
  categories,
  onSave,
  onCancel,
}: {
  article: Article | null;
  categories: Category[];
  onSave: (article: Partial<Article>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    image_url: article?.image_url || '',
    author: article?.author || '',
    category_id: article?.category_id || '',
    published_date: article?.published_date || new Date().toISOString().split('T')[0],
  });
  const [showMediaSelector, setShowMediaSelector] = useState(false);
  const [mediaSelectionType, setMediaSelectionType] = useState<'image' | 'video'>('image');
  const [mediaSelectionCallback, setMediaSelectionCallback] = useState<((url: string) => void) | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleSelectImage = (url: string) => {
    setFormData({ ...formData, image_url: url });
  };

  const insertAtCursor = (text: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = formData.content.substring(0, start);
    const after = formData.content.substring(end);
    
    const newContent = before + text + after;
    setFormData({ ...formData, content: newContent });
    
    // 设置光标位置
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }
    }, 0);
  };

  const handleInsertImage = () => {
    const url = prompt('请输入图片URL:');
    if (url) {
      insertAtCursor(`\n![图片](${url})\n`);
    }
  };

  const handleInsertVideo = () => {
    const url = prompt('请输入视频URL:');
    if (url) {
      insertAtCursor(`\n<video src="${url}" controls></video>\n`);
    }
  };

  const handleSelectMediaFromLibrary = (type: 'image' | 'video') => {
    setMediaSelectionType(type);
    setMediaSelectionCallback(() => (url: string) => {
      if (type === 'image') {
        insertAtCursor(`\n![图片](${url})\n`);
      } else {
        insertAtCursor(`\n<video src="${url}" controls></video>\n`);
      }
      setShowMediaSelector(false);
    });
    setShowMediaSelector(true);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={onCancel} className="flex items-center space-x-2 hover:text-emerald-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </button>
          <h1 className="text-xl font-bold">{article ? '编辑文章' : '新建文章'}</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">摘要</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">内容</label>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-300 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleInsertImage}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                  title="插入图片"
                >
                  <Image className="w-4 h-4" />
                  <span>图片</span>
                </button>
                <button
                  type="button"
                  onClick={handleInsertVideo}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                  title="插入视频"
                >
                  <Video className="w-4 h-4" />
                  <span>视频</span>
                </button>
                <div className="w-px h-6 bg-slate-300"></div>
                <button
                  type="button"
                  onClick={() => handleSelectMediaFromLibrary('image')}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors"
                  title="从素材库插入图片"
                >
                  <Image className="w-4 h-4" />
                  <span>素材库图片</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMediaFromLibrary('video')}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100 transition-colors"
                  title="从素材库插入视频"
                >
                  <Video className="w-4 h-4" />
                  <span>素材库视频</span>
                </button>
              </div>
              <textarea
                ref={contentRef}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-0 outline-none"
                rows={15}
                required
                placeholder="在这里编写文章内容...支持Markdown格式。使用工具栏插入图片或视频。"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              提示：使用工具栏插入图片和视频。支持Markdown格式：加粗 **文本**，斜体 *文本*，链接 [文本](URL)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">作者</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">发布日期</label>
              <input
                type="date"
                value={formData.published_date}
                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">分类</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">无分类</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">封面图片</label>
            <div className="space-y-2">
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://..."
              />
              <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const url = prompt('请输入图片URL:');
                if (url) handleSelectImage(url);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>输入URL</span>
            </button>
              </div>
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>

      {/* Media Selector Modal */}
      {showMediaSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-slate-900">
                选择{mediaSelectionType === 'image' ? '图片' : '视频'}
              </h2>
              <button
                onClick={() => setShowMediaSelector(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <MediaListForSelection 
                mediaType={mediaSelectionType}
                onSelect={(url) => {
                  if (mediaSelectionCallback) {
                    mediaSelectionCallback(url);
                  }
                  setShowMediaSelector(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaListForSelection({ mediaType, onSelect }: { mediaType: 'image' | 'video', onSelect: (url: string) => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/media');
      const data = await response.json();
      const filtered = mediaType === 'image' 
        ? data.filter((m: any) => m.mimetype?.startsWith('image/'))
        : data.filter((m: any) => m.mimetype?.startsWith('video/'));
      setMedia(filtered);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const isImage = (mimetype: string) => mimetype?.startsWith('image/');

  if (loading) {
    return <div className="text-center py-12 text-slate-500">加载中...</div>;
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p>暂无{mediaType === 'image' ? '图片' : '视频'}素材</p>
        <p className="text-sm mt-2">请先上传一些{mediaType === 'image' ? '图片' : '视频'}到素材库</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {media.map((mediaItem) => (
        <div
          key={mediaItem.id}
          onClick={() => onSelect(`http://localhost:3001${mediaItem.url}`)}
          className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-emerald-500 transition-all"
        >
          {isImage(mediaItem.mimetype) ? (
            <img
              src={`http://localhost:3001${mediaItem.url}`}
              alt={mediaItem.original_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
              <FileVideo className="w-12 h-12 text-white" />
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <p className="text-xs text-white truncate">{mediaItem.original_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

