# 部署说明文档

## 🚀 完整部署流程

### 1. Firebase 项目设置

#### 创建 Firebase 项目
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"添加项目"
3. 输入项目名称：`simple-x-social`
4. 按照向导完成项目创建

#### 配置 Authentication
1. 在 Firebase 控制台中，选择 "Authentication"
2. 点击 "开始使用"
3. 在 "Sign-in method" 标签页中启用 "电子邮件地址/密码"
4. 可选：配置其他登录方式

#### 配置 Firestore
1. 在 Firebase 控制台中，选择 "Firestore Database"
2. 点击 "创建数据库"
3. 选择 "以测试模式启动"（稍后会部署安全规则）
4. 选择数据库位置（推荐选择离用户最近的区域）

#### 获取 Firebase 配置
1. 在项目设置中找到 "您的应用" 部分
2. 点击 "Web" 图标添加 Web 应用
3. 复制配置对象，替换 `src/config/firebase.js` 中的配置

### 2. 本地开发环境

#### 安装 Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

#### 初始化 Firebase 项目
```bash
cd X
firebase init

# 选择以下服务：
# - Firestore: Configure security rules and indexes files
# - Hosting: Configure files for Firebase Hosting

# 配置选项：
# - 使用现有项目：选择刚创建的项目
# - Firestore rules file: firestore.rules
# - Public directory: dist
# - Single-page app: Yes
```

#### 部署 Firestore 安全规则
```bash
firebase deploy --only firestore:rules
```

### 3. 服务器部署准备

#### 服务器要求
- Ubuntu 20.04+ 或 CentOS 7+
- Node.js 18+
- Nginx 1.18+
- SSL 证书（推荐使用 Let's Encrypt）

#### 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx

# 启动并启用 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 配置 SSL 证书（Let's Encrypt）
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d hylong-llm.com -d www.hylong-llm.com

# 自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. GitHub Actions 部署

#### 设置 GitHub Secrets
在 GitHub 仓库设置中添加以下 Secrets：

```
SERVER_SSH_KEY: 服务器 SSH 私钥内容
SERVER_HOST: 服务器 IP 地址或域名
SERVER_USER: 服务器用户名（如 ubuntu, root）
SERVER_PATH: 部署路径（如 /var/www/simple-x-social）
```

#### 生成 SSH 密钥对
```bash
# 在本地生成密钥对
ssh-keygen -t rsa -b 4096 -C "deploy@simple-x-social"

# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/id_rsa.pub user@server-ip

# 将私钥内容复制到 GitHub Secrets
cat ~/.ssh/id_rsa
```

#### 服务器目录准备
```bash
# 创建部署目录
sudo mkdir -p /var/www/simple-x-social
sudo chown -R $USER:$USER /var/www/simple-x-social

# 创建 Nginx 配置
sudo cp nginx/nginx.conf /etc/nginx/sites-available/simple-x-social
sudo ln -s /etc/nginx/sites-available/simple-x-social /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Cloudflare 配置

#### 域名设置
1. 在 Cloudflare 中添加您的域名
2. 更新域名服务器到 Cloudflare 提供的 NS 记录
3. 添加 A 记录指向服务器 IP

#### DNS 记录配置
```
Type: A
Name: @
Content: YOUR_SERVER_IP
Proxy: Enabled (橙色云朵)

Type: A  
Name: www
Content: YOUR_SERVER_IP
Proxy: Enabled (橙色云朵)
```

#### SSL/TLS 设置
1. 在 SSL/TLS 标签页选择 "Full (strict)"
2. 启用 "Always Use HTTPS"
3. 启用 "HTTP Strict Transport Security (HSTS)"

#### 性能优化
1. 在 "Speed" 标签页启用 "Auto Minify"
2. 启用 "Brotli" 压缩
3. 设置 "Browser Cache TTL" 为 4 hours

### 6. 监控和维护

#### 日志监控
```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/simple-x-social.access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/simple-x-social.error.log

# 系统日志
sudo journalctl -u nginx -f
```

#### 性能监控
```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 检查服务器资源
htop
df -h
free -h
```

#### 备份策略
```bash
# 创建备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backup/simple-x-social_$DATE.tar.gz /var/www/simple-x-social
find /backup -name "simple-x-social_*.tar.gz" -mtime +7 -delete
```

### 7. 故障排除

#### 常见问题

**部署失败**
```bash
# 检查 SSH 连接
ssh user@server-ip

# 检查权限
ls -la /var/www/simple-x-social
```

**Firebase 连接问题**
- 检查 Firebase 配置是否正确
- 确认域名已添加到 Firebase 授权域名列表
- 检查浏览器控制台错误信息

**Nginx 配置问题**
```bash
# 测试配置文件
sudo nginx -t

# 重新加载配置
sudo systemctl reload nginx

# 检查端口占用
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### 8. 安全检查清单

- [ ] Firebase 安全规则已部署
- [ ] HTTPS 强制重定向已启用
- [ ] 安全头部已配置
- [ ] SSH 密钥认证已配置
- [ ] 防火墙规则已设置
- [ ] 定期备份已配置
- [ ] 日志监控已启用

### 9. 性能优化建议

- 启用 Gzip/Brotli 压缩
- 配置静态资源缓存
- 使用 CDN 加速
- 优化图片资源
- 启用 HTTP/2
- 配置数据库索引

---

完成以上步骤后，您的简易版 X.com 应用就可以正常访问了！

