#!/bin/bash

# WebBlog 部署脚本
# 使用方式：./deploy.sh

# 配置信息（请根据你的实际情况修改）
HOST="your-host.com"          # 主机地址
USER="your-username"           # SSH用户名
PASSWORD="your-password"         # FTP密码
REMOTE_DIR="/public_html"        # 远程目录（根据主机配置修改）
REMOTE_PORT="21"               # FTP端口，通常是21
SSH_PORT="22"                 # SSH端口，通常是22

echo "开始部署 WebBlog..."

# 1. 构建项目
echo "正在构建项目..."
npm run build

# 2. 复制必要的文件到临时目录
echo "准备部署文件..."
mkdir -p deploy_temp
cp -r dist/* deploy_temp/
cp -r uploads deploy_temp/
cp package.json deploy_temp/
cp package-lock.json deploy_temp/
cp server.ts deploy_temp/
cp tsconfig*.json deploy_temp/

# 3. 上传文件（使用FTP）
echo "上传文件中..."
lftp -u $USER,$PASSWORD $HOST -p $REMOTE_PORT <<EOF
set ftp:ssl-allow no
set ftp:list-options ""
cd $REMOTE_DIR
mrm -r *
mput -r deploy_temp/*
bye
EOF

# 4. 清理临时文件
echo "清理临时文件..."
rm -rf deploy_temp

# 5. SSH到服务器安装依赖和启动
echo "远程部署配置..."
ssh -p $SSH_PORT $USER@$HOST <<'ENDSSH'
cd $REMOTE_DIR
npm install --production
# 使用PM2管理进程（如果没有安装，可以改为使用node直接运行）
# pm2 restart blog-server || pm2 start server.ts --name blog-server
ENDSSH

echo "部署完成！"
echo "请访问: http://$HOST"
