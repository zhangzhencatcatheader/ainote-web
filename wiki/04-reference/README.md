# 🔧 参考资料

配置文件、工具命令和故障排除指南。

## 📋 快速导航

| 类别 | 文档 | 描述 |
|------|------|------|
| [📁 项目配置](./01-configuration.md) | 详细配置说明 | Vite、TypeScript、Tailwind 配置 |
| [🚀 常用命令](./02-commands.md) | 开发命令大全 | 开发、构建、调试命令 |
| [🐛 故障排除](./03-troubleshooting.md) | 问题解决方案 | 常见问题和解决方法 |
| [📖 API 参考](./04-api-reference.md) | 核心 API 文档 | 工具函数和核心接口 |
| [📏 代码规范](./05-code-standards.md) | 编码规范 | ESLint、Prettier、TypeScript 规范 |

## ⚡ 常用问题快速解决

### 开发环境问题

**Q: 启动失败，提示端口被占用？**
```bash
# 使用其他端口
pnpm dev --port 3000

# 或杀死占用进程
lsof -ti:5173 | xargs kill
```

**Q: TypeScript 编译错误？**
```bash
# 检查类型错误
pnpm type-check

# 重新生成类型声明
pnpm build --types
```

**Q: 样式不生效？**
```bash
# 检查 Tailwind 配置
npx tailwindcss --help

# 重新构建 CSS
pnpm build && pnpm preview
```

### 构建和部署

**Q: 构建失败怎么办？**
```bash
# 清理缓存
rm -rf node_modules/.cache
rm -rf dist

# 重新安装依赖
pnpm install

# 重新构建
pnpm build
```

**Q: 生产环境 API 连接失败？**
1. 检查 `.env` 文件配置
2. 确认 API 服务可访问
3. 检查 CORS 设置

### 性能优化

**Q: 页面加载慢？**
- 检查依赖包大小：`pnpm build --analyze`
- 启用代码分割
- 优化图片资源

**Q: 组件渲染性能差？**
- 使用 `v-memo` 优化列表渲染
- 合理使用计算属性
- 避免不必要的响应式数据

## 🛠️ 开发工具配置

### VS Code 推荐插件

```json
{
  "recommendations": [
    "vue.volar",
    "vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VS Code 设置

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "vue": "html"
  }
}
```

## 📦 依赖管理

### 核心依赖版本

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "pinia": "^2.1.0",
    "vue-router": "^4.2.0",
    "tdesign-vue-next": "^1.9.0",
    "vant": "^4.8.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.0",
    "typescript": "^5.0.0",
    "vue-tsc": "^1.8.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0"
  }
}
```

### 安装新依赖

```bash
# 安装生产依赖
pnpm add package-name

# 安装开发依赖
pnpm add -D package-name

# 安装特定版本
pnpm add package-name@1.2.3
```

## 🔍 调试技巧

### 浏览器调试

```javascript
// 开发环境调试
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}

// Vue DevTools 检查组件
window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app;

// 性能监控
console.time('render');
// 渲染逻辑
console.timeEnd('render');
```

### 网络请求调试

```typescript
// 拦截请求日志
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log('Request:', args[0]);
  const response = await originalFetch(...args);
  console.log('Response:', response.status);
  return response;
};
```

## 📊 性能监控

### 开发环境性能分析

```bash
# 启动性能分析
pnpm dev --profile

# 分析构建包大小
pnpm build --analyze

# 生成构建报告
pnpm build --report
```

### 运行时性能监控

```typescript
// 性能监控工具
class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static start(label: string) {
    this.timers.set(label, performance.now());
  }

  static end(label: string) {
    const start = this.timers.get(label);
    if (start) {
      const duration = performance.now() - start;
      console.log(`${label}: ${duration.toFixed(2)}ms`);
      this.timers.delete(label);
    }
  }
}

// 使用示例
PerformanceMonitor.start('data-fetch');
await fetchData();
PerformanceMonitor.end('data-fetch');
```

## 🔒 安全检查

### 代码安全扫描

```bash
# 检查依赖漏洞
pnpm audit

# 修复安全漏洞
pnpm audit fix

# 代码安全扫描
npm install -g auditjs
auditjs ossi
```

### 环境变量安全

```typescript
// 环境变量类型检查
interface EnvVars {
  VITE_API_BASE_URL: string;
  VITE_APP_TITLE: string;
  VITE_ENABLE_MOCK?: string;
}

// 运行时验证
function validateEnv(): EnvVars {
  const required = ['VITE_API_BASE_URL', 'VITE_APP_TITLE'];
  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }

  return import.meta.env as EnvVars;
}
```

## 📚 外部资源

### 官方文档

- [Vue 3 文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

### 组件库文档

- [TDesign Vue Next](https://tdesign.tencent.com/vue-next/overview)
- [Vant 4](https://vant-contrib.gitee.io/vant/#/zh-CN)

### 工具文档

- [Vue Router](https://router.vuejs.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

---

💡 **提示**: 遇到问题时，首先查看控制台错误信息，然后参考本指南或查阅官方文档。