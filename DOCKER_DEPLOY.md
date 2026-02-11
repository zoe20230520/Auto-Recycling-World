# Docker部署指南

## 前提条件

- Docker 18.0+
- Docker Compose 2.0+
- 服务器端口3001开放

## 快速开始

### 1. 上传项目到服务器

```bash
# 方法1：使用Git克隆
git clone https://github.com/zoe20230520/Auto-Recycling-World.git
cd Auto-Recycling-World

# 方法2：使用SCP上传
scp -r ./webblog root@your-server:/root/
```

### 2. 构建并启动容器

```bash
# 构建镜像
docker-compose build

# 启动服务（后台运行）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 3. 访问应用

- **前端**：http://your-server-ip:3001
- **API**：http://your-server-ip:3001/api/articles

## 常用命令

```bash
# 查看运行中的容器
docker ps

# 查看容器日志
docker logs webblog

# 进入容器
docker exec -it webblog sh

# 重启容器
docker-compose restart

# 更新应用
git pull
docker-compose up -d --build
```

## 数据持久化

- **uploads目录**：映射到宿主机，文件不会丢失
- **blog.db**：SQLite数据库文件持久化

## 故障排除

### 端口被占用
```bash
# 检查端口占用
netstat -tlnp | grep 3001

# 修改端口
# 编辑docker-compose.yml，将3001改为其他端口
```

### 容器无法启动
```bash
# 查看详细日志
docker-compose logs

# 重新构建
docker-compose up -d --force-recreate
```

### 权限问题
```bash
# 修改uploads目录权限
chmod -R 755 uploads

# 修改数据库文件权限
chmod 644 blog.db
```

## 生产环境建议

1. **使用Nginx反向代理**
2. **配置SSL证书**
3. **设置自动重启策略**
4. **配置日志轮转**
5. **监控容器健康状态**
