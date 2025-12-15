# Repository Guidelines（仓库指南）

## 项目结构与模块
- 前端代码位于 `src/`：入口 `main.ts`，路由 `src/router/`，全局状态 `src/stores/`，通用 UI 包装组件在 `src/components/base/`，工具方法在 `src/utils/`，接口 SDK 在 `src/api/`。桌面/移动/认证视图在 `src/views/`。静态资源在 `public/` 与 `src/assets/`。
- 配置文件：Vite（`vite.config.ts`）、TypeScript（`tsconfig*.json`）、Tailwind（`tailwind.config.js`）、PostCSS（`postcss.config.js`），根 HTML 为 `index.html`。

## 构建、测试与开发命令
- `npm install`（或 `pnpm install`）：安装依赖。
- `npm run dev`：启动 Vite 开发服务器。
- `npm run build`：先用 `vue-tsc -b` 做类型检查，再用 Vite 产出构建。
- `npm run preview`：本地预览生产构建。
- 目前未配置自动化测试，见下方测试建议。

## 编码风格与命名
- 语言：TypeScript + Vue 3 `<script setup>`，优先组合式 API，并将可复用逻辑封装为 `src/utils/` 中的 composable/工具。
- 缩进 2 空格，保持 ASCII 文本。
- 组件文件用帕斯卡命名（如 `BaseButton.vue`），工具/composable 用小驼峰（如 `useDevice`、`httpExecutor`），视图文件以 `*View.vue` 结尾。
- 桌面/移动适配统一使用封装的 TDesign 组件（`BaseButton/BaseInput/BaseDialog`），避免直接混用原生组件。
- 不修改 TDesign 内部样式，不使用 `:deep`/`::v-deep` 等方式覆盖其内部类；样式需求优先用组件属性或自定义容器解决。
- 认证与租户信息读写统一走 `src/utils/tenant.ts`，避免重复实现。
- 带分页的表单/列表类页面沿用 `src/views/AdminCompanyView.vue` 的现有布局样式：`WebLayout` + `Card` 容器，顶部工具栏/筛选行，`Table` 使用 `bordered` `stripe` `size="medium"`，分页器右对齐，浅灰背景与 24px 内边距保持一致。

## 测试指南
- 尚无测试框架；如需新增，建议采用 Vitest（与 Vite 默认对齐），测试文件命名为 `*.spec.ts` 并与源码同级。
- 手动回归重点：登录/注册（`/auth`、`/mobile/auth`）、桌面首页（`/`）、移动首页（`/mobile`），以及依赖 `VITE_API_BASE_URL` 的接口调用。

## 提交与 PR 规范
- 提交信息使用简洁祈使句（例：“Add mobile auth guard”），相近变更归并一次提交。
- PR 请包含：变更摘要、动机/关联需求、已执行的测试（命令或手测说明）、UI 可见改动的截图，并在有任务/Issue 时进行关联。

## 安全与配置提示
- 接口基础地址来自 `VITE_API_BASE_URL`，请勿硬编码密钥；认证与租户信息存于 `localStorage`，可用 `clearAuthInfo` 清除。
- 新增网络请求应通过统一的 API 客户端（`src/utils/api.ts` + `src/api/services/*`），以复用 token/租户头及错误处理逻辑。
- 分页接口约定：后端 `pageIndex` 从 0 开始，UI 分页控件通常从 1 开始，调用接口时请记得减 1（本项目在企业管理页已按此处理）。
