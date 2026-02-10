# WebBlog 部署指南

## 部署方式

本项目包含前端（React + Vite）和后端（Express + SQLite），支持以下两种部署方式：

---

## 方式一：FTP部署（推荐新手）

### 1. 修改部署脚本

编辑 `deploy.sh` 文件，修改以下配置：

```bash
HOST="your-host.com"          # 你的主机地址
USER="your-username"           # FTP用户名
PASSWORD="your-password"         # FTP密码
REMOTE_DIR="/public_html"        # 远程目录（根据主机配置）
REMOTE_PORT="21"               # FTP端口
SSH_PORT="22"                 # SSH端口
```

### 2. 安装必要工具

本地需要安装：
- `lftp` (用于FTP上传)
- `ssh` (用于远程命令执行)

### 3. 执行部署

```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. 手动FTP上传（如果脚本不工作）

你也可以手动通过FTP客户端（如FileZilla）上传：

**需要上传的文件/目录：**
- `dist/` - 构建后的前端文件
- `uploads/` - 上传的素材文件
- `server.ts` - 后端服务器
- `package.json` - 依赖配置
- `tsconfig*.json` - TypeScript配置

**不需要上传：**
- `node_modules/` - 依赖包
- `.git/` - Git文件
- `src/` - 源代码（已构建到dist）

---

## 方式二：SSH部署（推荐有经验者）

### 1. 使用SSH上传项目

```bash
# 压缩项目
tar -czf webblog.tar.gz dist/ uploads/ server.ts package.json tsconfig*.json

# 上传到服务器
scp -P 22 webblog.tar.gz user@host.com:~/

# SSH到服务器
ssh -p 22 user@host.com
```

### 2. 在服务器上解压和部署

```bash
# 进入网站目录
cd public_html  # 或你的网站根目录

# 备份现有文件（可选）
tar -czf backup_$(date +%Y%m%d).tar.gz *

# 删除旧文件
rm -rf * .htaccess

# 解压新文件
tar -xzf ~/webblog.tar.gz -C .

# 安装生产环境依赖
npm install --production

# 启动服务器
node server.js  # 或使用PM2
```

---

## 服务器配置

### 1. 安装Node.js和npm

SSH到服务器，执行：

```bash
# 检查Node.js版本
node --version
npm --version

# 如果未安装，使用nvm安装：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### 2. 使用PM2管理进程（推荐）

PM2可以确保Node.js进程一直运行，崩溃自动重启：

```bash
# 全局安装PM2
npm install -g pm2

# 启动应用
pm2 start server.ts --name webblog

# 查看状态
pm2 status

# 查看日志
pm2 logs webblog

# 设置开机自启
pm2 startup
pm2 save
```

### 3. 配置反向代理（Apache/Nginx）

如果你的主机有Apache或Nginx，需要配置反向代理：

**Apache配置 (`.htaccess`):**
```apache
RewriteEngine On
RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
RewriteRule ^uploads/(.*)$ http://localhost:3001/uploads/$1 [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /dist/index.html [L]
```

**Nginx配置:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /path/to/your/project;
        try_files $uri $uri/ /dist/index.html;
    }
    
    # API反向代理
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
    
    # 上传文件反向代理
    location /uploads/ {
        proxy_pass http://localhost:3001;
    }
}
```

---

## 端口配置

默认后端端口是 `3001`，如果被占用可以在 `server.ts` 中修改：

```typescript
const PORT = process.env.PORT || 3001;
```

可以通过环境变量设置：
```bash
export PORT=8080
node server.js
```

---

## 数据库注意事项

项目使用SQLite数据库：
- 数据库文件：`blog.db`
- 上传时需要同时上传 `blog.db`、`blog.db-shm`、`blog.db-wal`

**重要：**
- SQLite文件需要写入权限
- 确保服务器上的uploads目录可写
- 建议定期备份数据库文件

---

## 故障排查

### 1. 500错误
- 检查数据库文件权限：`chmod 666 blog.db`
- 检查uploads目录权限：`chmod 755 uploads`

### 2. 无法访问API
- 检查后端服务是否运行：`pm2 status`
- 检查端口是否开放：`netstat -tlnp | grep 3001`
- 检查防火墙规则

### 3. 静态资源404
- 确认dist目录已上传
- 检查Apache/Nginx配置是否正确

### 4. 上传文件失败
- 确认uploads目录存在且可写：`mkdir -p uploads && chmod 755 uploads`
- 检查文件大小限制

---

## 安全建议

1. **修改默认管理员密码**：登录后立即修改admin密码
2. **HTTPS部署**：使用SSL证书加密传输
3. **设置防火墙**：只开放必要的端口
4. **定期备份**：备份数据库和uploads目录
5. **更新依赖**：定期运行 `npm update` 安全补丁

---

## 环境变量配置（可选）

创建 `.env` 文件：

```env
PORT=3001
NODE_ENV=production
```

---

## 部署检查清单

- [ ] 修改deploy.sh中的主机信息
- [ ] 本地构建测试通过：`npm run build`
- [ ] 确认服务器Node.js版本 >= 18
- [ ] 确认服务器有足够的磁盘空间
- [ ] 上传所有必要文件
- [ ] 设置正确的文件权限
- [ ] 配置反向代理（如需要）
- [ ] 使用PM2启动服务
- [ ] 测试前端访问
- [ ] 测试API接口
- [ ] 测试文件上传功能
- [ ] 设置开机自启

---

## 技术支持

如遇问题，检查：
1. 服务器日志：`pm2 logs webblog`
2. 应用日志：查看终端输出
3. 浏览器控制台：F12查看前端错误
