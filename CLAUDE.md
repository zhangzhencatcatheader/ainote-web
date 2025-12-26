# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

AI Note Web 是一个基于 Vue 3、TypeScript 和 TDesign 组件库构建的智能台账/笔记管理系统。支持多租户架构、用户认证、企业管理、笔记/模板管理以及后台管理功能。

## 命令

### 开发
```bash
# 启动开发服务器
pnpm dev    # 或 npm run dev

# 构建生产版本
pnpm build  # 先运行 vue-tsc 类型检查，然后执行 vite build

# 预览生产构建
pnpm preview
```

### 类型检查
构建命令包含类型检查（`vue-tsc -b`）。单独检查类型而不构建：
```bash
npx vue-tsc -b --noEmit
```

## 架构

### API 层（关键 - 禁止修改）
`src/api/` 目录由**后端自动生成**，任何手动修改都会被覆盖。
- `src/api/Api.ts` - 主 API 客户端
- `src/api/services/` - 服务类（AuthService、NoteService、TemplateService 等）
- `src/api/model/` - TypeScript 模型和 DTO

**如需扩展 API 功能**，请在 `src/utils/` 创建包装函数或使用 Pinia stores。禁止修改 `src/api/`。

### HTTP 与认证
- `src/utils/http.ts` - HTTP 执行器，处理：
  - 从 `localStorage.getItem('auth_token')` 注入 JWT token
  - 从 `localStorage.getItem('auth_tenant')` 注入租户 header
  - 401/UNAUTHORIZED 错误自动跳转到 `/auth`
  - 结构化错误响应（基于 code 的错误消息）
- `src/utils/tenant.ts` - 多租户管理（获取/设置/清除租户、认证信息）
- `src/utils/api.ts` - 导出单例 `api` 实例供所有 API 调用使用

### 状态管理（Pinia）
- `src/stores/user.ts` - 用户信息、认证状态、带缓存的 `fetchProfile()`
- `src/stores/app.ts` - 应用级状态（标题等）

### 路由
- `src/router/index.ts` - Vue Router 配置
- 路由守卫保护管理路由（`requiresAdmin: true`）
- 管理员必须拥有 `localStorage` 中 `user_role === 'ADMIN'`
- HTTP 客户端中的 401 错误触发自动跳转到 `/auth`

### 组件架构
- `src/components/WebLayout.vue` - PC 端主布局：
  - HeadMenu 导航
  - 用户信息展示
  - 基于角色的菜单（管理员可见额外菜单项）
  - 登录/登出操作

### UI 组件库
- **PC 端**：TDesign Vue Next (`tdesign-vue-next`)
- **移动端**：TDesign Mobile Vue (`tdesign-mobile-vue`)
- 额外使用：Vant 组件、Tailwind CSS

### 环境变量
```env
VITE_API_BASE_URL=http://localhost:8080  # 后端 API 地址
VITE_APP_TITLE=AI Note Web                # 应用标题
```

## 核心模式

### 调用 API
```typescript
import { api } from '@/utils/api'

// 所有服务方法都可在 api 实例上调用
const user = await api.accountService.me()
const notes = await api.noteService.list()
```

### 用户认证
- Token 存储在 `localStorage.getItem('auth_token')`
- 用户信息同步到 localStorage（`user_id`、`user_role`、`user_name`）
- 通过 `useUserStore().fetchProfile()` 获取用户信息
- 通过 tenant header 支持多租户

### 文件 URL
文件通过后端服务：`${API_BASE_URL}/file/{fileId}`，或直接使用 `filePath`（如果可用）。

### 管理员权限
检查 `localStorage.getItem('user_role') === 'ADMIN'` 或在组件中使用 computed。

## TypeScript 严格性
- 启用严格模式
- 禁止使用 `any` 类型（除非有充分理由）
- 所有组件使用 `<script setup lang="ts">`
- 正确定义 props、emits 和 refs 的类型
