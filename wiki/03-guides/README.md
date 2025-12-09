# 📚 实用教程

常见开发任务的分步指南和最佳实践。

## 🎯 快速导航

| 教程 | 难度 | 耗时 | 描述 |
|------|------|------|------|
| [添加新页面](./01-adding-pages.md) | ⭐⭐ | 15分钟 | 创建桌面端和移动端页面 |
| [创建组件](./02-creating-components.md) | ⭐⭐⭐ | 20分钟 | 开发可复用的 Vue 组件 |
| [状态管理](./03-state-management.md) | ⭐⭐ | 10分钟 | 使用 Pinia 管理应用状态 |
| [样式开发](./04-styling.md) | ⭐⭐ | 15分钟 | Tailwind CSS 和组件样式 |
| [API 集成](./05-api-integration.md) | ⭐⭐⭐ | 25分钟 | 与后端 API 交互 |
| [表单处理](./06-form-handling.md) | ⭐⭐⭐ | 20分钟 | 表单验证和数据处理 |

## 🚀 推荐学习路径

### 新手开发者
1. [添加新页面](./01-adding-pages.md) - 了解路由结构
2. [创建组件](./02-creating-components.md) - 学习组件开发
3. [样式开发](./04-styling.md) - 掌握样式系统
4. [表单处理](./06-form-handling.md) - 实践常见功能

### 有经验开发者
1. [状态管理](./03-state-management.md) - 理解状态架构
2. [API 集成](./05-api-integration.md) - 掌握数据流
3. 根据需要阅读其他教程

## 🛠️ 实用代码片段

### 基础组件模板

```vue
<!-- components/base/BaseButton.vue -->
<template>
  <component
    :is="isMobile ? 'van-button' : 't-button'"
    :class="buttonClass"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDevice } from '@/composables/useDevice';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium'
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const { isMobile } = useDevice();

const buttonClass = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`
]);

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>
```

### Store 模板

```typescript
// stores/example.ts
export const useExampleStore = defineStore('example', () => {
  // State
  const items = ref<Item[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const itemCount = computed(() => items.value.length);
  const sortedItems = computed(() =>
    [...items.value].sort((a, b) => a.id - b.id)
  );

  // Actions
  const fetchItems = async () => {
    try {
      loading.value = true;
      error.value = null;

      const response = await ExampleService.getItems();
      items.value = response.data;

    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取失败';
    } finally {
      loading.value = false;
    }
  };

  const addItem = async (item: Omit<Item, 'id'>) => {
    const response = await ExampleService.create(item);
    items.value.push(response.data);
    return response.data;
  };

  const removeItem = async (id: number) => {
    await ExampleService.delete(id);
    items.value = items.value.filter(item => item.id !== id);
  };

  return {
    // State (readonly)
    items: readonly(items),
    loading: readonly(loading),
    error: readonly(error),

    // Getters
    itemCount,
    sortedItems,

    // Actions
    fetchItems,
    addItem,
    removeItem
  };
});
```

### API 调用模板

```typescript
// services/example.ts
export class ExampleService {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient(import.meta.env.VITE_API_BASE_URL);
  }

  async getItems(): Promise<ApiResponse<Item[]>> {
    return this.http.request<ApiResponse<Item[]>>({
      method: 'GET',
      url: '/api/items'
    });
  }

  async create(item: CreateItemRequest): Promise<ApiResponse<Item>> {
    return this.http.request<ApiResponse<Item>>({
      method: 'POST',
      url: '/api/items',
      body: item
    });
  }

  async update(id: number, item: UpdateItemRequest): Promise<ApiResponse<Item>> {
    return this.http.request<ApiResponse<Item>>({
      method: 'PUT',
      url: `/api/items/${id}`,
      body: item
    });
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return this.http.request<ApiResponse<void>>({
      method: 'DELETE',
      url: `/api/items/${id}`
    });
  }
}
```

## 🎨 样式指南

### Tailwind 实用类

```vue
<template>
  <!-- 响应式布局 -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold mb-2">标题</h3>
      <p class="text-gray-600 text-sm">描述文本</p>
    </div>
  </div>

  <!-- 按钮样式 -->
  <button class="
    px-4 py-2 rounded-md font-medium transition-colors
    bg-blue-600 text-white hover:bg-blue-700
    focus:outline-none focus:ring-2 focus:ring-blue-500
  ">
    按钮文本
  </button>
</template>
```

### CSS 变量

```css
/* styles/variables.css */
:root {
  /* 颜色系统 */
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;

  /* 间距系统 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;

  /* 字体系统 */
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
}
```

## 🔧 调试技巧

### 开发工具

```bash
# Vue DevTools
# 安装浏览器扩展，可查看组件状态、性能等

# Vite 开发服务器调试
pnpm dev --debug --open

# TypeScript 类型检查
pnpm type-check --watch
```

### 控制台调试

```vue
<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const data = ref<User[]>([]);

// 调试响应式数据
watchEffect(() => {
  console.log('Data updated:', data.value);
});

// 开发环境调试
if (import.meta.env.DEV) {
  window.$debug = {
    data,
    reloadData: () => fetchData()
  };
}
</script>
```

## ❓ 常见问题

### Q: 组件样式冲突怎么办？
A: 使用 scoped CSS 或 CSS Modules，避免全局污染

### Q: 如何优化性能？
A: 使用 `v-memo`、懒加载组件、合理使用计算属性

### Q: TypeScript 类型报错？
A: 确保所有变量都有类型定义，避免使用 `any`

### Q: 移动端适配问题？
A: 使用 rem/vw 单位，meta viewport 设置，响应式断点

---

🎯 **提示**: 选择与当前任务匹配的教程，按步骤操作，遇到问题查看 [参考资料](../04-reference/)。