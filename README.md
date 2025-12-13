# AI Note Web

一个现代化的智能台账管理系统，支持用户绑定企业、上传台账模板、通过AI辅助生成笔记、并生成标准化台账文档。

## ✨ 功能特性

### 核心功能
- 🔐 **用户认证系统** - 登录/注册，JWT Token 管理
- 🏢 **企业管理** - 企业列表、创建、删除、多租户支持
- 📊 **日志管理** - 系统日志查看、筛选、分页查询
- 👤 **个人信息** - 用户信息编辑、头像上传
- 🔒 **权限管理** - 基于角色的访问控制（RBAC）

### 技术特性
- 📱 **双端支持** - PC端和移动端独立界面
- 🎨 **现代化UI** - TDesign Vue Next（PC端）+ TDesign Mobile Vue（移动端）
- ⚡ **高性能** - Vite 构建，快速热更新
- 🔒 **类型安全** - 完整的 TypeScript 支持
- 🎯 **组件化** - 模块化架构，易于维护

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm (推荐) 或 npm

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 环境配置

创建 `.env` 文件（如果不存在）：

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=AI Note Web
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

启动成功后访问：
- **桌面端**: http://localhost:5173
- **移动端**: http://localhost:5173/mobile
- **登录页**: http://localhost:5173/auth

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 🏗️ 技术栈

### 前端框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vue Router** - 官方路由管理器
- **Pinia** - 状态管理库

### UI 组件库
- **TDesign Vue Next** - PC端组件库
- **TDesign Mobile Vue** - 移动端组件库
- **Tailwind CSS** - 实用优先的 CSS 框架

### 构建工具
- **Vite** - 下一代前端构建工具
- **vue-tsc** - Vue 3 TypeScript 类型检查

## 📁 项目结构

```
src/
├── api/              # API 层（自动生成，禁止修改）
│   ├── model/        # 数据模型
│   └── services/     # 服务接口
├── components/       # 可复用组件
│   └── WebLayout.vue # 页面布局组件
├── router/           # 路由配置
├── stores/           # Pinia 状态管理
├── utils/            # 工具函数
│   ├── api.ts       # API 实例
│   ├── http.ts      # HTTP 请求封装
│   ├── message.ts   # 消息提示工具
│   ├── tenant.ts    # 租户管理工具
│   └── device.ts    # 设备检测工具
└── views/            # 页面组件
    ├── AuthView.vue          # 登录/注册页
    ├── WebHomeView.vue        # PC端首页
    ├── ProfileView.vue        # 个人信息页
    ├── AdminCompanyView.vue  # 企业管理页
    └── AdminLogsView.vue      # 日志管理页
```

## 🎯 主要功能

### 用户认证
- 用户注册和登录
- JWT Token 自动管理
- 401 错误自动跳转登录
- 用户信息本地存储

### 企业管理
- 企业列表展示（分页）
- 企业创建和删除
- 企业信息搜索和筛选
- 多租户支持

### 日志管理
- 系统日志查看
- 多条件筛选（方法、状态、关键词）
- 分页查询
- 日志详情展示

### 个人信息
- 用户信息编辑
- 头像上传（OSS）
- 用户名和手机号修改

## 🔧 开发指南

### 代码规范
- 使用 TypeScript 严格模式
- 组件使用 `<script setup>` 语法
- 遵循 Vue 3 组合式 API 最佳实践
- 使用 TDesign 组件，避免直接修改内部样式

### API 调用
所有 API 调用通过统一的 `api` 实例：

```typescript
import { api } from '@/utils/api'

// 调用服务
const data = await api.accountService.me()
```

### 错误处理
- 401 错误自动清除认证信息并跳转登录
- 使用 `showError` 和 `showSuccess` 显示消息提示

### 路由配置
- PC端路由在 `src/router/index.ts` 中配置
- 移动端路由使用 `/mobile` 前缀

## 📝 开发计划

详细开发计划请查看 [开发计划.md](./开发计划.md)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目为私有项目。

## 📞 联系方式

如有问题或建议，请提交 Issue 或联系项目维护者。

---

**版本**: 0.0.0  
**最后更新**: 2024-12-11
