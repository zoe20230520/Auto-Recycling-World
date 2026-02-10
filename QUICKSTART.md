# Quick Start Scripts

快速启动脚本，用于简化开发和部署流程。

## 脚本说明

### start.bat - 快速启动开发环境
一键启动完整的开发环境，包括前端和后端服务器。

**功能：**
- 自动检查并安装依赖
- 自动清理旧的构建文件
- 同时启动前端开发服务器（端口5173）和后端服务器（端口3001）

**使用方法：**
```bash
start.bat
```

**访问地址：**
- 前端：http://localhost:5173
- 后端：http://localhost:3001

### build.bat - 生产环境构建
构建生产版本的前端代码。

**功能：**
- 自动检查并安装依赖
- 执行生产环境构建
- 输出到 `dist/` 目录

**使用方法：**
```bash
build.bat
```

**预览构建结果：**
```bash
npm run preview
```

### server.bat - 启动后端服务器
仅启动后端服务器，用于测试API或配合生产环境使用。

**功能：**
- 自动检查并安装依赖
- 自动创建uploads目录（如果不存在）
- 启动后端服务器（端口3001）

**使用方法：**
```bash
server.bat
```

**访问地址：**
- API：http://localhost:3001/api

### stat.bat - 项目统计工具
统计项目代码行数、文件数和大小。

**功能：**
- 统计各种类型文件的数量
- 统计代码行数
- 统计文件大小
- 统计目录数量

**使用方法：**
```bash
stat.bat
```

## 使用场景

### 开发阶段
使用 `start.bat` 启动完整的开发环境，同时运行前端和后端。

### 测试API
使用 `server.bat` 仅启动后端服务器，使用Postman或curl测试API。

### 生产部署
1. 使用 `build.bat` 构建生产版本
2. 将 `dist/` 目录上传到服务器
3. 在服务器上使用 `server.bat` 启动后端服务器

### 代码统计
使用 `stat.bat` 查看项目代码统计信息。

## 注意事项

1. **依赖安装**：所有脚本都会自动检查并安装依赖，首次运行可能需要较长时间
2. **端口占用**：确保端口5173和3001未被其他程序占用
3. **文件权限**：确保uploads目录有写入权限
4. **数据库**：后端服务器会自动创建SQLite数据库文件（blog.db）

## 故障排除

### 端口被占用
如果提示端口被占用，可以使用以下命令查找并关闭占用端口的进程：
```bash
# 查找占用5173端口的进程
netstat -ano | findstr :5173

# 查找占用3001端口的进程
netstat -ano | findstr :3001

# 关闭进程（使用上面查到的PID）
taskkill /PID <PID> /F
```

### 依赖安装失败
如果依赖安装失败，尝试手动安装：
```bash
npm install
```

### 数据库错误
如果遇到数据库错误，删除以下文件并重新启动服务器：
```bash
del blog.db
del blog.db-shm
del blog.db-wal
```

## 其他命令

除了快速启动脚本，你也可以直接使用npm命令：

```bash
# 开发环境
npm run dev

# 仅启动后端
npm run server

# 仅启动前端
npm run client

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 类型检查
npm run typecheck
```
