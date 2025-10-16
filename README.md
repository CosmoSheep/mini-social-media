# 简易版 X.com - 社交媒体应用

这是一个基于 React + Firebase 的简易社交媒体应用，实现了用户注册登录、消息发布、编辑和删除等核心功能。

## 🚀 功能特性

### 用户系统
- ✅ 用户注册和登录（Firebase Authentication）
- ✅ 用户退出登录
- ✅ 登录状态持久化
- ✅ 只有登录用户才能发布、编辑、删除消息

### 消息系统
- ✅ 发布新消息（标题 + 内容）
- ✅ 实时查看所有消息
- ✅ 编辑自己的消息
- ✅ 删除自己的消息
- ✅ 消息按时间倒序排列
- ✅ 登录和未登录用户都能浏览消息

### 界面设计
- ✅ 响应式设计，支持移动端
- ✅ 现代化卡片布局
- ✅ 实时更新，无需手动刷新
- ✅ 友好的用户交互体验

## 📦 技术栈

- **前端框架**: React 18 + Vite
- **样式**: 纯 CSS（响应式设计）
- **图标**: Lucide React
- **后端服务**: Firebase
  - Authentication（用户认证）
  - Firestore（数据库）
- **部署**: GitHub Actions + Nginx + Cloudflare

## 🛠️ 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd AI_native_product/X
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置 Firebase**
   - 在 [Firebase Console](https://console.firebase.google.com/) 创建新项目
   - 启用 Authentication 和 Firestore
   - 复制项目配置到 `src/config/firebase.js`
   - 部署 Firestore 安全规则：`firebase deploy --only firestore:rules`

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   - 打开浏览器访问 `http://localhost:3000`

## 🔧 Firebase 配置

### 1. Authentication 设置
- 启用邮箱/密码登录方式
- 可选：配置其他登录方式（Google、GitHub 等）

### 2. Firestore 数据库
- 创建 `messages` 集合
- 部署安全规则（已包含在 `firestore.rules` 文件中）

### 3. 安全规则说明
```javascript
// 允许所有人读取消息
allow read: if true;

// 只有认证用户可以创建消息
allow create: if request.auth != null;

// 只有作者可以编辑/删除自己的消息
allow update, delete: if request.auth.uid == resource.data.authorId;
```

## 🚀 部署配置

### 1. GitHub Actions
项目包含自动部署配置（`.github/workflows/deploy.yml`），需要设置以下 Secrets：
- `SERVER_SSH_KEY`: 服务器 SSH 私钥
- `SERVER_HOST`: 服务器地址
- `SERVER_USER`: 服务器用户名
- `SERVER_PATH`: 部署路径

### 2. Nginx 配置
- 使用提供的 `nginx/nginx.conf` 配置文件
- 支持 HTTPS 和 HTTP/2
- 包含安全头部和缓存优化
- 支持 SPA 路由

### 3. Cloudflare 配置
- 配置域名解析
- 启用 HTTPS/SSL
- 可选：启用 CDN 加速

## 📁 项目结构

```
X/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React 组件
│   │   ├── AuthForm.jsx   # 登录/注册表单
│   │   ├── Header.jsx     # 头部导航
│   │   ├── MessageCard.jsx # 消息卡片
│   │   ├── MessageForm.jsx # 消息发布表单
│   │   └── MessageList.jsx # 消息列表
│   ├── services/          # 业务逻辑
│   │   ├── auth.js        # 用户认证服务
│   │   └── messages.js    # 消息管理服务
│   ├── config/
│   │   └── firebase.js    # Firebase 配置
│   ├── App.jsx           # 主应用组件
│   ├── App.css           # 全局样式
│   └── main.jsx          # 应用入口
├── .github/
│   └── workflows/
│       └── deploy.yml     # 自动部署配置
├── nginx/
│   └── nginx.conf        # Nginx 服务器配置
├── firestore.rules       # Firestore 安全规则
├── package.json          # 项目依赖
└── README.md            # 项目说明
```

## 🎯 核心功能实现

### 用户认证流程
1. 用户输入邮箱密码进行注册/登录
2. Firebase Authentication 验证用户身份
3. 登录成功后保存用户状态
4. 用户可以发布、编辑、删除自己的消息

### 消息管理流程
1. 登录用户可以发布新消息
2. 所有消息存储在 Firestore 数据库
3. 实时监听数据变化，自动更新界面
4. 只有消息作者可以编辑/删除自己的消息

### 实时更新机制
- 使用 Firestore 的 `onSnapshot` 实现实时数据同步
- 无需手动刷新页面即可看到最新消息
- 支持多用户同时在线协作

## 🔒 安全特性

- 前端路由保护（只有登录用户可以发布内容）
- Firestore 安全规则保护数据
- 用户只能编辑删除自己的消息
- 输入验证和错误处理
- HTTPS 强制重定向
- 安全头部配置

## 📱 响应式设计

- 支持桌面端、平板和移动端
- 流畅的用户交互动画
- 现代化的卡片式布局
- 友好的错误提示和加载状态

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交 Pull Request

## 📄 许可证

MIT License

## 📞 支持

如有问题或建议，请创建 Issue 或联系项目维护者。

---

**课后作业项目** - 简易版 X.com 社交媒体应用
