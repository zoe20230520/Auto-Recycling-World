import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer 配置 - 支持多种图片和视频格式
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|tiff|tif|bmp|ico|mp4|webm|ogg|mov|avi|wmv|flv|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('不支持的文件格式！支持的格式：JPEG, PNG, GIF, WEBP, SVG, TIFF, BMP, ICO, MP4, WEBM, OGG, MOV, AVI, WMV, FLV, MKV'));
  }
});

// 数据库连接
const db = new Database('blog.db');
db.pragma('journal_mode = WAL');

// 初始化数据库表
function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT,
      author TEXT NOT NULL,
      category_id TEXT,
      published_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mimetype TEXT NOT NULL,
      size INTEGER NOT NULL,
      url TEXT NOT NULL,
      alt_text TEXT,
      description TEXT,
      uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      user_id TEXT,
      username TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized');
}

// 初始化默认管理员
function seedAdminUser() {
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin') as { count: number };

  if (adminCount.count === 0) {
    console.log('Creating default admin user...');
    const admin = {
      id: '1',
      username: 'admin',
      email: 'admin@auto-recycling.com',
      password: 'admin123', // 实际应用中应该使用哈希
      role: 'admin',
      created_at: new Date().toISOString()
    };

    const stmt = db.prepare(`
      INSERT INTO users (id, username, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(admin.id, admin.username, admin.email, admin.password, admin.role);
    console.log('Default admin user created: admin / admin123');
  }
}

// 初始化示例数据
function seedDatabase() {
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };

  if (categoryCount.count === 0) {
    console.log('Seeding database with sample data...');

    const categories = [
      { id: '1', name: 'Industry News', slug: 'industry-news' },
      { id: '2', name: 'Technology', slug: 'technology' },
      { id: '3', name: 'Sustainability', slug: 'sustainability' },
      { id: '4', name: 'Market Analysis', slug: 'market-analysis' },
      { id: '5', name: 'Best Practices', slug: 'best-practices' },
    ];

    const insertCategory = db.prepare('INSERT INTO categories (id, name, slug) VALUES (@id, @name, @slug)');
    const insertManyCategories = db.transaction((cats) => {
      for (const cat of cats) insertCategory.run(cat);
    });
    insertManyCategories(categories);

    const articles = [
      {
        id: '1',
        title: 'Automotive Recycling Industry Sees Record Growth in 2025',
        slug: 'automotive-recycling-industry-record-growth-2025',
        excerpt: 'The global automotive recycling industry has experienced unprecedented growth this year, driven by increasing environmental regulations and consumer awareness.',
        content: `The global automotive recycling industry has experienced unprecedented growth in 2025, driven by increasing environmental regulations and consumer awareness about sustainability. According to recent reports, the market has expanded by over 15% compared to the previous year, with projections indicating continued momentum through the next decade.

Key factors contributing to this growth include:
- Stricter environmental regulations worldwide
- Rising demand for recycled materials in manufacturing
- Advancements in recycling technologies
- Growing consumer preference for sustainable products

Industry experts predict that the automotive recycling sector will continue to evolve, with new opportunities emerging in electric vehicle battery recycling and advanced material recovery processes.`,
        image_url: null,
        author: 'Sarah Johnson',
        category_id: '1',
        published_date: '2025-02-01',
      },
      {
        id: '2',
        title: 'New AI Technology Revolutionizes Parts Sorting',
        slug: 'new-ai-technology-revolutionizes-parts-sorting',
        excerpt: 'Artificial intelligence is transforming how automotive recyclers identify and sort parts, improving efficiency and accuracy across the industry.',
        content: `Artificial intelligence is transforming how automotive recyclers identify and sort parts, improving efficiency and accuracy across the industry. This groundbreaking technology uses machine learning algorithms to recognize and categorize components with near-perfect accuracy.

The benefits of AI-powered sorting include:
- 95% accuracy in part identification
- 40% reduction in processing time
- Lower labor costs
- Improved material recovery rates

Leading recycling facilities have reported significant improvements in their operations after implementing these systems. The technology is particularly effective in distinguishing between similar-looking parts and identifying valuable components that might otherwise be missed.`,
        image_url: null,
        author: 'Michael Chen',
        category_id: '2',
        published_date: '2025-01-28',
      },
      {
        id: '3',
        title: 'Electric Vehicle Battery Recycling: Challenges and Opportunities',
        slug: 'electric-vehicle-battery-recycling-challenges-opportunities',
        excerpt: 'As EV adoption accelerates, the recycling industry faces new challenges in handling lithium-ion batteries while discovering valuable opportunities.',
        content: `As electric vehicle adoption accelerates worldwide, the recycling industry faces new challenges in handling lithium-ion batteries while discovering valuable opportunities in this emerging market. The first wave of mass-produced EVs is now reaching end-of-life, creating urgent needs for effective recycling solutions.

Current challenges include:
- Complex battery chemistries requiring specialized processing
- Safety concerns during dismantling and transport
- Evolving regulatory frameworks
- Infrastructure requirements for large-scale recycling

However, these challenges also present significant opportunities:
- Recovery of valuable materials (lithium, cobalt, nickel)
- Development of new recycling technologies
- Growing market for recycled battery materials
- Potential for circular economy in EV manufacturing

Industry leaders are investing heavily in R&D to develop efficient and cost-effective recycling processes.`,
        image_url: null,
        author: 'Emily Rodriguez',
        category_id: '3',
        published_date: '2025-01-25',
      },
      {
        id: '4',
        title: 'Market Analysis: Steel Prices Impact on Recycling Margins',
        slug: 'market-analysis-steel-prices-impact-recycling-margins',
        excerpt: 'Fluctuating steel prices are significantly affecting profit margins for automotive recyclers, requiring strategic adjustments in operations.',
        content: `Fluctuating steel prices are significantly affecting profit margins for automotive recyclers, requiring strategic adjustments in operations. The past year has seen steel prices experience substantial volatility, creating both challenges and opportunities for the recycling sector.

Market analysts note several key trends:
- Steel prices have varied by over 30% in the past 12 months
- Global supply chain disruptions continue to impact pricing
- Demand from construction and manufacturing sectors remains strong
- Trade policies and tariffs add complexity to price forecasts

Successful recyclers are adapting by:
- Diversifying their material recovery focus
- Implementing better inventory management
- Building strategic partnerships with buyers
- Investing in processing efficiency improvements

Looking ahead, experts recommend careful market monitoring and flexible operational strategies to navigate the uncertain pricing environment.`,
        image_url: null,
        author: 'David Thompson',
        category_id: '4',
        published_date: '2025-01-20',
      },
      {
        id: '5',
        title: 'Best Practices: Implementing Sustainable Operations',
        slug: 'best-practices-implementing-sustainable-operations',
        excerpt: 'Learn how leading recycling facilities are adopting sustainable practices that benefit both the environment and their bottom line.',
        content: `Leading recycling facilities are increasingly adopting sustainable practices that benefit both the environment and their bottom line. These best practices demonstrate how environmental responsibility can align with business success.

Key sustainable practices include:
- Energy-efficient processing equipment
- Water conservation and recycling systems
- Renewable energy adoption (solar, wind)
- Waste reduction programs
- Sustainable transportation for logistics

Success stories from industry leaders show:
- Up to 40% reduction in energy consumption
- Significant cost savings from efficiency improvements
- Enhanced brand reputation and customer loyalty
- Compliance advantage with environmental regulations
- Improved employee satisfaction and retention

Implementation strategies:
1. Conduct baseline sustainability assessments
2. Set measurable goals and targets
3. Invest in proven technologies
4. Train staff on new procedures
5. Monitor and report progress regularly

The path to sustainability requires commitment and investment, but the returns in efficiency, cost savings, and market positioning make it a wise business decision.`,
        image_url: null,
        author: 'Lisa Park',
        category_id: '5',
        published_date: '2025-01-15',
      },
      {
        id: '6',
        title: 'Breakthrough in Aluminum Recovery Technology',
        slug: 'breakthrough-aluminum-recovery-technology',
        excerpt: 'A new technology for aluminum recovery is changing the economics of automotive recycling, offering higher yields and lower costs.',
        content: `A revolutionary new technology for aluminum recovery is changing the economics of automotive recycling, offering significantly higher yields and lower operational costs. This breakthrough could reshape how the industry handles aluminum-rich components from end-of-life vehicles.

The technology features:
- Advanced separation techniques for aluminum alloys
- Near-100% recovery rates for pure aluminum
- Lower energy consumption than traditional methods
- Ability to process mixed metal streams effectively

Industry impact:
- 25% increase in overall aluminum recovery
- 30% reduction in processing costs
- Improved quality of recovered aluminum
- New opportunities for value-added products

Early adopters of this technology report substantial improvements in their bottom line. The system pays for itself within 18 months through increased revenue and reduced operational expenses.

As the automotive industry increases its use of aluminum to improve fuel efficiency, this technology becomes increasingly valuable. Analysts predict widespread adoption over the next five years as facilities upgrade their capabilities.`,
        image_url: null,
        author: 'Robert Williams',
        category_id: '2',
        published_date: '2025-01-10',
      },
    ];

    const insertArticle = db.prepare(`
      INSERT INTO articles (id, title, slug, excerpt, content, image_url, author, category_id, published_date)
      VALUES (@id, @title, @slug, @excerpt, @content, @image_url, @author, @category_id, @published_date)
    `);
    const insertManyArticles = db.transaction((arts) => {
      for (const art of arts) insertArticle.run(art);
    });
    insertManyArticles(articles);

    console.log('Sample data seeded');
  }
}

// 初始化数据库
initDatabase();
seedAdminUser();
seedDatabase();

// API 路由

// 获取所有分类
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// 获取所有文章（带分类信息）
app.get('/api/articles', (req, res) => {
  try {
    const articles = db.prepare(`
      SELECT 
        a.*,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c.created_at as category_created_at
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      ORDER BY a.published_date DESC
    `).all().map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      image_url: row.image_url,
      author: row.author,
      category_id: row.category_id,
      published_date: row.published_date,
      created_at: row.created_at,
      updated_at: row.updated_at,
      categories: row.category_id ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        created_at: row.category_created_at,
      } : null,
    }));

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// 根据 ID 获取文章
app.get('/api/articles/:id', (req, res) => {
  try {
    const row = db.prepare(`
      SELECT 
        a.*,
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c.created_at as category_created_at
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?
    `).get(req.params.id) as any;

    if (!row) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = {
      id: row.id,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: row.content,
      image_url: row.image_url,
      author: row.author,
      category_id: row.category_id,
      published_date: row.published_date,
      created_at: row.created_at,
      updated_at: row.updated_at,
      categories: row.category_id ? {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
        created_at: row.category_created_at,
      } : null,
    };

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// 创建新分类
app.post('/api/categories', (req, res) => {
  try {
    const { id, name, slug } = req.body;
    const stmt = db.prepare('INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)');
    stmt.run(id, name, slug);
    res.json({ id, name, slug });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// 创建新文章
app.post('/api/articles', (req, res) => {
  try {
    const { id, title, slug, excerpt, content, image_url, author, category_id, published_date } = req.body;
    const stmt = db.prepare(`
      INSERT INTO articles (id, title, slug, excerpt, content, image_url, author, category_id, published_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, title, slug, excerpt, content, image_url, author, category_id, published_date);
    res.json({ id, title, slug });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// 更新文章
app.put('/api/articles/:id', (req, res) => {
  try {
    const { title, slug, excerpt, content, image_url, author, category_id } = req.body;
    const stmt = db.prepare(`
      UPDATE articles
      SET title = ?, slug = ?, excerpt = ?, content = ?, image_url = ?, author = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(title, slug, excerpt, content, image_url, author, category_id, req.params.id);
    res.json({ id: req.params.id, title, slug });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// 删除文章
app.delete('/api/articles/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM articles WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// 媒体文件 API

// 上传文件
app.post('/api/media/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const media = {
      id: Date.now().toString(),
      filename: req.file.filename,
      original_name: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    };

    const stmt = db.prepare(`
      INSERT INTO media (id, filename, original_name, mimetype, size, url)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(media.id, media.filename, media.original_name, media.mimetype, media.size, media.url);

    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// 获取所有媒体文件
app.get('/api/media', (req, res) => {
  try {
    const media = db.prepare('SELECT * FROM media ORDER BY uploaded_at DESC').all();
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// 获取单个媒体文件
app.get('/api/media/:id', (req, res) => {
  try {
    const media = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// 删除媒体文件
app.delete('/api/media/:id', (req, res) => {
  try {
    const media = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id) as any;
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // 删除文件
    const filePath = path.join(uploadsDir, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 删除数据库记录
    const stmt = db.prepare('DELETE FROM media WHERE id = ?');
    stmt.run(req.params.id);

    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

// 更新媒体文件
app.put('/api/media/:id', (req, res) => {
  try {
    const { original_name, alt_text, description } = req.body;
    const stmt = db.prepare(`
      UPDATE media
      SET original_name = ?, alt_text = ?, description = ?
      WHERE id = ?
    `);
    stmt.run(original_name, alt_text, description, req.params.id);
    res.json({ id: req.params.id, original_name, alt_text, description });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update media' });
  }
});


// 用户 API

// 用户登录
app.post('/api/users/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password) as any;
    
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 不返回密码
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: '登录失败' });
  }
});

// 用户注册
app.post('/api/users/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    const id = Date.now().toString();
    const role = 'user'; // 默认为普通用户

    const stmt = db.prepare(`
      INSERT INTO users (id, username, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, username, email, password, role);

    const user = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?').get(id);
    res.json(user);
  } catch (error) {
    if ((error as any).message?.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: '用户名或邮箱已存在' });
    }
    res.status(500).json({ error: '注册失败' });
  }
});

// 获取当前用户信息
app.get('/api/users/me', (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: '未登录' });
  }

  const user = db.prepare('SELECT id, username, email, role, created_at FROM users WHERE id = ?').get(userId) as any;
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }

  res.json(user);
});

// 评论 API

// 获取文章的所有评论
app.get('/api/articles/:id/comments', (req, res) => {
  try {
    const comments = db.prepare('SELECT * FROM comments WHERE article_id = ? ORDER BY created_at ASC').all(req.params.id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: '获取评论失败' });
  }
});

// 添加评论
app.post('/api/articles/:id/comments', (req, res) => {
  try {
    const { username, content, user_id } = req.body;
    const id = Date.now().toString();
    
    const stmt = db.prepare(`
      INSERT INTO comments (id, article_id, user_id, username, content)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, req.params.id, user_id || null, username, content);

    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: '添加评论失败' });
  }
});

// 删除评论
app.delete('/api/comments/:id', (req, res) => {
  try {
    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id) as any;
    if (!comment) {
      return res.status(404).json({ error: '评论不存在' });
    }

    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    stmt.run(req.params.id);

    res.json({ message: '评论已删除' });
  } catch (error) {
    res.status(500).json({ error: '删除评论失败' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
