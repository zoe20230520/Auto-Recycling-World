# Vercel Deployment Guide

## 部署方案

由于这是一个全栈应用（React前端 + Express后端），推荐以下两种部署方案：

### 方案1：全栈部署到Vercel（推荐）

将整个应用部署到Vercel，使用Serverless Functions处理API请求。

#### 步骤：

1. **安装Vercel CLI**
```bash
npm install -g vercel
```

2. **登录Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel
```

4. **配置部署选项**
- 项目名称：`auto-recycling-world`
- 构建命令：`npm run build`
- 输出目录：`dist`
- 安装命令：`npm install`

### 方案2：分离部署（更稳定）

将前端和后端分别部署到不同的服务。

#### 前端部署到Vercel：

1. **修改API基础URL**
编辑 `src/lib/api.ts`，将API基础URL改为后端服务的地址：
```typescript
const API_BASE_URL = 'https://your-backend-service.com/api';
```

2. **部署到Vercel**
```bash
vercel --prod
```

#### 后端部署到Railway/Render：

**Railway部署：**
1. 访问 [railway.app](https://railway.app)
2. 连接GitHub仓库
3. 选择项目并部署
4. 配置环境变量（PORT=3001）

**Render部署：**
1. 访问 [render.com](https://render.com)
2. 连接GitHub仓库
3. 创建新的Web Service
4. 配置构建和启动命令

### 方案3：使用Vercel + Supabase（最佳实践）

将后端API迁移到Supabase，前端部署到Vercel。

#### 步骤：

1. **创建Supabase项目**
   - 访问 [supabase.com](https://supabase.com)
   - 创建新项目
   - 获取API密钥和URL

2. **配置前端**
   - 安装Supabase客户端：`npm install @supabase/supabase-js`
   - 修改API调用使用Supabase

3. **部署到Vercel**
   ```bash
   vercel --prod
   ```

## 环境变量配置

在Vercel中配置以下环境变量：

```
NODE_ENV=production
PORT=3001
```

## 数据库配置

### 使用SQLite（简单但有限制）

Vercel的Serverless Functions是无状态的，SQLite文件会在每次函数执行后丢失。

**解决方案：**
1. 使用Vercel KV或其他持久化存储
2. 迁移到外部数据库服务

### 使用外部数据库（推荐）

**PostgreSQL（Supabase/Neon）：**
```bash
npm install pg
```

**MySQL（PlanetScale/PlanetScale）：**
```bash
npm install mysql2
```

## 部署步骤（方案1）

### 1. 准备项目

```bash
# 构建前端
npm run build

# 测试构建
npm run preview
```

### 2. 部署到Vercel

```bash
# 首次部署
vercel

# 生产环境部署
vercel --prod
```

### 3. 配置域名（可选）

1. 在Vercel项目中添加自定义域名
2. 配置DNS记录
3. 等待SSL证书生成

## 常见问题

### 1. API请求失败

**问题：** 前端无法连接到后端API

**解决方案：**
- 检查CORS配置
- 确认API路径正确
- 查看Vercel部署日志

### 2. 文件上传失败

**问题：** 无法上传媒体文件

**解决方案：**
- 使用对象存储服务（如AWS S3、Cloudflare R2）
- 修改文件上传逻辑使用外部存储

### 3. 数据库连接失败

**问题：** 无法连接到数据库

**解决方案：**
- 使用外部数据库服务
- 配置正确的连接字符串
- 检查环境变量设置

## 性能优化

### 1. 启用缓存

```typescript
// 在server.ts中添加缓存中间件
import compression from 'compression';
app.use(compression());
```

### 2. 优化图片

```bash
npm install sharp
```

### 3. 使用CDN

将静态资源上传到CDN，提高加载速度。

## 监控和日志

### Vercel Analytics

```bash
npm install @vercel/analytics
```

### 日志查看

在Vercel控制台中查看实时日志和错误报告。

## 成本估算

### Vercel免费套餐
- 100GB带宽/月
- 6,000分钟构建时间/月
- 无限项目
- 自动HTTPS

### 付费套餐
- Hobby：$20/月
- Pro：$100/月
- Enterprise：定制

## 总结

推荐使用**方案2（分离部署）**，因为：
1. 前端和后端独立部署，互不影响
2. 更容易维护和扩展
3. 可以选择最适合每个部分的服务

如果需要更详细的部署指导，请告诉我你选择的方案。
