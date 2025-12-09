# 🚀 快速开始

本指南将帮助您快速搭建和运行 AI Note Web 项目。

## 📋 前置要求

- **Node.js**: >= 16.0.0
- **包管理器**: pnpm (推荐) 或 npm
- **开发工具**: VS Code + Vue 插件

## 🛠️ 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd ainote-web
```

### 2. 安装依赖

```bash
# 推荐使用 pnpm
pnpm install

# 或使用 npm
npm install
```

### 3. 环境配置

创建环境变量文件：

```bash
# 复制示例文件
cp .env.example .env
```

编辑 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=AI Note Web
```

### 4. 启动开发服务器

```bash
pnpm dev
```

## 🌐 访问应用

启动成功后，可以访问：

- **桌面端**: http://localhost:5173
- **移动端**: http://localhost:5173/mobile
- **登录页**: http://localhost:5173/auth
- **移动登录**: http://localhost:5173/mobile/auth

## 📱 双端体验

### 桌面端特性
- TDesign Vue 组件库
- 完整功能展示
- 鼠标交互优化

### 移动端特性
- Vant 移动组件库
- 触摸手势优化
- 移动端适配布局

## 🔍 项目结构概览

```
src/
├── api/           # API 层 (禁止修改)
├── components/    # 可复用组件
├── router/        # 路由配置
├── stores/        # 状态管理
├── utils/         # 工具函数
└── views/         # 页面组件
```

## ⚡ 常用命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 类型检查
pnpm type-check
```

## 🎯 下一步

开始开发后，建议阅读：

1. [开发指南](../02-development/) - 了解核心概念
2. [实用教程](../03-guides/) - 学习具体功能实现
3. [参考资料](../04-reference/) - 查看配置和故障排除

## ❓ 常见问题

**Q: 为什么无法访问 API？**
A: 检查 `.env` 文件中的 `VITE_API_BASE_URL` 配置

**Q: 如何切换移动端/桌面端？**
A: 通过 URL 路径区分，`/mobile` 前缀为移动端

**Q: TypeScript 报错怎么办？**
A: 确保所有代码都有类型定义，查看 [开发约束](../../DEVELOPMENT_CONSTRAINTS.md)

---

🎉 恭喜！您已经成功运行了 AI Note Web 项目。