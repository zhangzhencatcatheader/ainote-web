# 🛠️ 开发指南

深入理解 AI Note Web 的技术架构和开发实践。

## 🧱 核心技术栈

| 技术 | 版本 | 用途 | 文档 |
|------|------|------|------|
| Vue 3 | ^3.4.0 | 前端框架 | [Vue 官方文档](https://vuejs.org/) |
| TypeScript | ^5.0.0 | 类型系统 | [TS 官方文档](https://www.typescriptlang.org/) |
| Vite | ^5.0.0 | 构建工具 | [Vite 官方文档](https://vitejs.dev/) |
| Pinia | ^2.1.0 | 状态管理 | [Pinia 官方文档](https://pinia.vuejs.org/) |
| Vue Router | ^4.2.0 | 路由管理 | [Vue Router 文档](https://router.vuejs.org/) |

## 🏗️ 架构设计

### 分层架构

```
┌─────────────────────────────────────┐
│           视图层 (Views)             │
│    ├── desktop/ (桌面端页面)         │
│    └── mobile/ (移动端页面)          │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         组件层 (Components)          │
│    ├── base/ (基础组件)             │
│    └── business/ (业务组件)         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│        逻辑层 (Stores/Utils)         │
│    ├── stores/ (状态管理)           │
│    └── utils/ (工具函数)            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│          API 层 (Services)          │
│         (后端生成，禁止修改)         │
└─────────────────────────────────────┘
```

### 组件设计原则

- **单一职责**: 每个组件只负责一个功能
- **类型安全**: 严格的 TypeScript 类型定义
- **可复用性**: 通过 props 和 slots 提供灵活性
- **响应式**: 适配不同屏幕尺寸

## 🎨 UI 组件体系

### 桌面端 - TDesign Vue

```vue
<template>
  <t-button theme="primary" @click="handleSubmit">
    提交
  </t-button>
  <t-dialog v-model:visible="showDialog">
    内容
  </t-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { TButton, TDialog } from 'tdesign-vue-next';
</script>
```

### 移动端 - Vant

```vue
<template>
  <van-button type="primary" @click="handleSubmit">
    提交
  </van-button>
  <van-popup v-model:show="showDialog" position="center">
    内容
  </van-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VanButton, VanPopup } from 'vant';
</script>
```

## 🗂️ 状态管理 - Pinia

### Store 结构

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => !!user.value);

  // Actions
  const login = async (credentials: LoginCredentials) => {
    const response = await AuthService.login(credentials);
    user.value = response.data;
    return response;
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('token');
  };

  return {
    user: readonly(user),
    isLoggedIn,
    login,
    logout
  };
});
```

### 在组件中使用

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 响应式状态
const { user, isLoggedIn } = storeToRefs(userStore);

// 调用 actions
const handleLogin = () => {
  userStore.login(credentials);
};
</script>
```

## 🛣️ 路由系统

### 路由配置

```typescript
// router/index.ts
const routes = [
  {
    path: '/',
    name: 'desktop',
    component: () => import('@/views/desktop/Layout.vue'),
    children: [
      { path: '', component: () => import('@/views/desktop/Home.vue') }
    ]
  },
  {
    path: '/mobile',
    name: 'mobile',
    component: () => import('@/views/mobile/Layout.vue'),
    children: [
      { path: '', component: () => import('@/views/mobile/Home.vue') }
    ]
  }
];
```

### 程序化导航

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

// 页面跳转
const goToHome = () => {
  router.push('/');
};

// 移动端跳转
const goToMobileHome = () => {
  router.push('/mobile');
};
</script>
```

## 🔧 工具函数

### HTTP 客户端

```typescript
// utils/http.ts
export class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const token = localStorage.getItem('token');

    return fetch(`${this.baseURL}${options.url}`, {
      method: options.method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    }).then(res => res.json());
  }
}
```

### 设备检测

```typescript
// utils/device.ts
export const isMobilePath = (path: string): boolean => {
  return path.startsWith('/mobile');
};

export const detectDeviceType = (): 'mobile' | 'desktop' => {
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
};
```

## 🎯 开发最佳实践

### 1. 代码组织

```
src/
├── components/
│   ├── base/          # 基础组件 (Button, Input)
│   └── business/      # 业务组件 (UserProfile, NoteCard)
├── composables/       # 组合式函数
├── stores/           # Pinia stores
├── utils/            # 工具函数
└── views/
    ├── desktop/      # 桌面端页面
    └── mobile/       # 移动端页面
```

### 2. 类型定义

```typescript
// types/index.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

### 3. 错误处理

```vue
<script setup lang="ts">
import { ref } from 'vue';

const error = ref<string | null>(null);
const loading = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = null;

    await submitData();

  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误';
  } finally {
    loading.value = false;
  }
};
</script>
```

## 🔍 调试技巧

### Vue DevTools

安装 [Vue DevTools](https://devtools.vuejs.org/) 浏览器扩展，可以：
- 检查组件层级
- 监控状态变化
- 调试性能问题

### TypeScript 调试

```bash
# 类型检查
pnpm type-check

# 严格模式检查
npx vue-tsc --noEmit --strict
```

### Vite 开发调试

```bash
# 启用详细日志
pnpm dev --debug

# 分析构建包大小
pnpm build --analyze
```

## 📚 相关文档

- [实用教程](../03-guides/) - 具体功能实现
- [参考资料](../04-reference/) - 配置和故障排除
- [开发约束](../../DEVELOPMENT_CONSTRAINTS.md) - 项目规范要求

---

💡 **提示**: 始终遵循项目的 TypeScript 规范和约束要求。