const API_BASE_URL = 'http://localhost:3001/api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  author: string;
  category_id: string | null;
  published_date: string;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
}

export const api = {
  // 获取所有分类
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // 获取所有文章
  getArticles: async (): Promise<Article[]> => {
    const response = await fetch(`${API_BASE_URL}/articles`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  },

  // 根据 ID 获取文章
  getArticleById: async (id: string): Promise<Article> => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch article');
    return response.json();
  },

  // 创建新分类
  createCategory: async (category: Omit<Category, 'id' | 'created_at'>): Promise<Category> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...category, id: Date.now().toString() }),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  // 创建新文章
  createArticle: async (article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article> => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...article, id: Date.now().toString() }),
    });
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  },

  // 更新文章
  updateArticle: async (id: string, article: Partial<Article>): Promise<Article> => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  },

  // 删除文章
  deleteArticle: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete article');
  },
};
