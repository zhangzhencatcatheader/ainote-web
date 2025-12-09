# 添加新页面

为 AI Note Web 添加新的页面，支持桌面端和移动端。

## 📋 前置要求

- 熟悉 Vue Router 基础
- 了解项目目录结构
- 已完成 [快速开始](../01-getting-started/) 指南

## 🎯 本教程目标

创建一个"设置"页面，包含：
- 桌面端设置页面 (`/settings`)
- 移动端设置页面 (`/mobile/settings`)
- 基本的设置选项界面

## 🚀 实现步骤

### 1. 创建桌面端页面

```bash
# 创建桌面端页面目录和文件
mkdir -p src/views/desktop/settings
touch src/views/desktop/settings/index.vue
```

编辑桌面端页面文件：

```vue
<!-- src/views/desktop/settings/index.vue -->
<template>
  <div class="settings-page">
    <div class="settings-header">
      <h1>设置</h1>
      <p>管理您的应用偏好设置</p>
    </div>

    <div class="settings-content">
      <t-card class="settings-section">
        <h3>账户设置</h3>
        <div class="setting-item">
          <t-form-item label="用户名">
            <t-input v-model="settings.username" placeholder="请输入用户名" />
          </t-form-item>
        </div>
        <div class="setting-item">
          <t-form-item label="邮箱">
            <t-input v-model="settings.email" placeholder="请输入邮箱" />
          </t-form-item>
        </div>
      </t-card>

      <t-card class="settings-section">
        <h3>偏好设置</h3>
        <div class="setting-item">
          <t-form-item label="主题">
            <t-select v-model="settings.theme" placeholder="选择主题">
              <t-option value="light" label="浅色模式" />
              <t-option value="dark" label="深色模式" />
            </t-select>
          </t-form-item>
        </div>
        <div class="setting-item">
          <t-form-item label="语言">
            <t-select v-model="settings.language" placeholder="选择语言">
              <t-option value="zh-CN" label="简体中文" />
              <t-option value="en-US" label="English" />
            </t-select>
          </t-form-item>
        </div>
      </t-card>

      <div class="settings-actions">
        <t-button theme="primary" @click="saveSettings" :loading="saving">
          保存设置
        </t-button>
        <t-button theme="default" @click="resetSettings">
          重置
        </t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

// 设置数据
const settings = reactive({
  username: '',
  email: '',
  theme: 'light',
  language: 'zh-CN'
});

const saving = ref(false);

// 保存设置
const saveSettings = async () => {
  saving.value = true;

  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    MessagePlugin.success('设置保存成功');
  } catch (error) {
    MessagePlugin.error('设置保存失败');
  } finally {
    saving.value = false;
  }
};

// 重置设置
const resetSettings = () => {
  settings.username = '';
  settings.email = '';
  settings.theme = 'light';
  settings.language = 'zh-CN';

  MessagePlugin.info('设置已重置');
};
</script>

<style scoped>
.settings-page {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: 32px;
  text-align: center;
}

.settings-header h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

.settings-header p {
  color: var(--td-text-color-secondary);
  font-size: 16px;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-section {
  padding: 24px;
}

.settings-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--td-text-color-primary);
}

.setting-item {
  margin-bottom: 16px;
}

.settings-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}
</style>
```

### 2. 创建移动端页面

```bash
# 创建移动端页面目录和文件
mkdir -p src/views/mobile/settings
touch src/views/mobile/settings/index.vue
```

编辑移动端页面文件：

```vue
<!-- src/views/mobile/settings/index.vue -->
<template>
  <div class="settings-page">
    <van-nav-bar
      title="设置"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <div class="settings-content">
      <!-- 账户设置 -->
      <van-cell-group inset title="账户设置">
        <van-field
          v-model="settings.username"
          label="用户名"
          placeholder="请输入用户名"
        />
        <van-field
          v-model="settings.email"
          label="邮箱"
          placeholder="请输入邮箱"
          type="email"
        />
      </van-cell-group>

      <!-- 偏好设置 -->
      <van-cell-group inset title="偏好设置">
        <van-cell
          title="主题"
          :value="themeLabel"
          is-link
          @click="showThemePicker = true"
        />
        <van-cell
          title="语言"
          :value="languageLabel"
          is-link
          @click="showLanguagePicker = true"
        />
      </van-cell-group>

      <!-- 操作按钮 -->
      <div class="settings-actions">
        <van-button
          type="primary"
          block
          @click="saveSettings"
          :loading="saving"
        >
          保存设置
        </van-button>
        <van-button
          type="default"
          block
          @click="resetSettings"
          style="margin-top: 12px;"
        >
          重置
        </van-button>
      </div>
    </div>

    <!-- 主题选择器 -->
    <van-popup v-model:show="showThemePicker" position="bottom">
      <van-picker
        :columns="themeColumns"
        @confirm="onThemeConfirm"
        @cancel="showThemePicker = false"
      />
    </van-popup>

    <!-- 语言选择器 -->
    <van-popup v-model:show="showLanguagePicker" position="bottom">
      <van-picker
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { showToast, showSuccessToast, showFailToast } from 'vant';

// 设置数据
const settings = reactive({
  username: '',
  email: '',
  theme: 'light',
  language: 'zh-CN'
});

const saving = ref(false);
const showThemePicker = ref(false);
const showLanguagePicker = ref(false);

// 选择器配置
const themeColumns = [
  { text: '浅色模式', value: 'light' },
  { text: '深色模式', value: 'dark' }
];

const languageColumns = [
  { text: '简体中文', value: 'zh-CN' },
  { text: 'English', value: 'en-US' }
];

// 计算显示文本
const themeLabel = computed(() => {
  const theme = themeColumns.find(item => item.value === settings.theme);
  return theme?.text || '选择主题';
});

const languageLabel = computed(() => {
  const language = languageColumns.find(item => item.value === settings.language);
  return language?.text || '选择语言';
});

// 选择器确认回调
const onThemeConfirm = ({ selectedValues }: any) => {
  settings.theme = selectedValues[0];
  showThemePicker.value = false;
};

const onLanguageConfirm = ({ selectedValues }: any) => {
  settings.language = selectedValues[0];
  showLanguagePicker.value = false;
};

// 保存设置
const saveSettings = async () => {
  saving.value = true;

  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    showSuccessToast('设置保存成功');
  } catch (error) {
    showFailToast('设置保存失败');
  } finally {
    saving.value = false;
  }
};

// 重置设置
const resetSettings = () => {
  settings.username = '';
  settings.email = '';
  settings.theme = 'light';
  settings.language = 'zh-CN';

  showToast('设置已重置');
};
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.settings-content {
  padding: 16px 0;
}

.settings-actions {
  padding: 24px 16px;
}
</style>
```

### 3. 配置路由

编辑 `src/router/index.ts`，添加新的路由：

```typescript
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 现有路由...

  // 桌面端设置路由
  {
    path: '/settings',
    name: 'desktop-settings',
    component: () => import('@/views/desktop/Layout.vue'),
    children: [
      {
        path: '',
        name: 'settings',
        component: () => import('@/views/desktop/settings/index.vue')
      }
    ]
  },

  // 移动端设置路由
  {
    path: '/mobile/settings',
    name: 'mobile-settings',
    component: () => import('@/views/mobile/Layout.vue'),
    children: [
      {
        path: '',
        name: 'mobile-settings',
        component: () => import('@/views/mobile/settings/index.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

### 4. 添加导航链接

在桌面端和移动端的布局组件中添加导航链接。

桌面端导航 (`src/views/desktop/Layout.vue`):

```vue
<template>
  <div class="desktop-layout">
    <nav class="desktop-nav">
      <router-link to="/">首页</router-link>
      <router-link to="/settings">设置</router-link>
    </nav>
    <main class="desktop-main">
      <router-view />
    </main>
  </div>
</template>
```

移动端导航 (`src/views/mobile/Layout.vue`):

```vue
<template>
  <div class="mobile-layout">
    <main class="mobile-main">
      <router-view />
    </main>
    <van-tabbar v-model="activeTab">
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/mobile/settings" icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeTab = ref(0);

// 根据路由更新活动标签
watch(() => route.path, (path) => {
  activeTab.value = path === '/mobile/settings' ? 1 : 0;
}, { immediate: true });
</script>
```

## 🎯 测试效果

1. 启动开发服务器：
```bash
pnpm dev
```

2. 访问测试：
- 桌面端：http://localhost:5173/settings
- 移动端：http://localhost:5173/mobile/settings

3. 验证功能：
- ✅ 页面正确加载
- ✅ 表单输入正常
- ✅ 保存/重置功能
- ✅ 导航链接工作

## 📝 总结

通过本教程，您学会了：

- ✅ 创建桌面端和移动端页面
- ✅ 使用相应的 UI 组件库
- ✅ 配置 Vue Router
- ✅ 添加导航链接
- ✅ 实现基本的表单交互

## 🔗 相关教程

- [创建组件](./02-creating-components.md) - 学习组件开发
- [状态管理](./03-state-management.md) - 管理页面状态
- [API 集成](./05-api-integration.md) - 连接后端数据

---

💡 **提示**: 遵循项目约束，确保代码类型安全。