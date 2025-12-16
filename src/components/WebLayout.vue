<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { showConfirm } from '@/utils/message'
import { clearAuthInfo } from '@/utils/tenant'
import { HeadMenu, MenuItem, Space, Avatar, Tag, Button } from 'tdesign-vue-next'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const isLoggedIn = computed(() => !!localStorage.getItem('auth_token'))
const userId = computed(() => localStorage.getItem('user_id') || '未登录')

const profile = computed(() => userStore.profile)

const buildFileUrl = (fileId?: string, filePath?: string): string => {
  if (filePath) return filePath
  if (!fileId) return ''
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  return `${API_BASE_URL}/file/${fileId}`
}

const userName = computed(() => profile.value?.username || localStorage.getItem('user_name') || userId.value)
const userRole = computed(() => profile.value?.role || localStorage.getItem('user_role') || '游客')
const isAdmin = computed(() => userRole.value === 'ADMIN')
const avatarText = computed(() => (userName.value || 'AI').substring(0, 1).toUpperCase())
const userAvatarUrl = computed(() => buildFileUrl(profile.value?.avatar?.id, profile.value?.avatar?.filePath))

const baseMenu = [
  { value: '/', label: '首页', path: '/' },
  { value: '/notes', label: '笔记', path: '/notes' },
  { value: '/templates', label: '模板管理', path: '/templates' },
]

const adminMenu = [
  { value: '/admin/company', label: '企业管理', path: '/admin/company' },
  { value: '/admin/users', label: '用户管理', path: '/admin/users' },
  { value: '/admin/logs', label: '日志管理', path: '/admin/logs' },
]

const menuItems = computed(() => (isAdmin.value ? [...baseMenu, ...adminMenu] : baseMenu))
const activeMenu = ref(route.path || '/')

const navigateTo = (path: string) => {
  if (!isLoggedIn.value && path !== '/auth') {
    showConfirm({
      title: '需要登录',
      content: '请先登录后继续操作，是否前往登录？',
    }).then((ok) => ok && router.push('/auth'))
    return
  }
  router.push(path)
}

watch(
  () => route.path,
  (val) => {
    activeMenu.value = val || '/'
  },
  { immediate: true }
)

const handleMenuChange = (value: string) => {
  const target = menuItems.value.find((item) => item.value === value)
  if (target?.path) {
    activeMenu.value = value
    navigateTo(target.path)
  }
}

const handleLogout = async () => {
  const confirmed = await showConfirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
  })
  if (confirmed) {
    clearAuthInfo()
    userStore.clearProfile()
    router.push('/auth')
  }
}

const fetchProfile = async () => {
  if (!isLoggedIn.value) return
  try {
    await userStore.fetchProfile()
  } catch (error) {
    console.warn('获取用户信息失败', error)
  }
}

watch(isLoggedIn, (val) => {
  if (val) {
    fetchProfile()
  } else {
    userStore.clearProfile()
  }
})

onMounted(() => {
  fetchProfile()
})
</script>

<template>
  <div class="web-layout">
    <HeadMenu v-model="activeMenu" theme="light" @change="handleMenuChange">
      <template #logo>
        <Space size="small" align="center">
          <Avatar size="large">{{ avatarText }}</Avatar>
          <span class="brand">{{ appStore.title }}</span>
        </Space>
      </template>
      <MenuItem v-for="item in menuItems" :key="item.value" :value="item.value">
        {{ item.label }}
      </MenuItem>
      <template #operations>
        <Space size="small" align="center">
          <Tag v-if="isLoggedIn" theme="success" variant="light-outline">已登录</Tag>
          <Tag v-else theme="warning" variant="light-outline">游客</Tag>
          <Avatar
            v-if="isLoggedIn"
            size="medium"
            shape="circle"
            :image="userAvatarUrl"
            style="cursor: pointer;"
            @click="navigateTo('/profile')"
          >
            {{ avatarText }}
          </Avatar>
          <Tag
            v-if="isLoggedIn"
            theme="primary"
            variant="light-outline"
            style="cursor: pointer;"
            @click="navigateTo('/profile')"
          >
            {{ userName }}
          </Tag>
          <Button
            v-if="isLoggedIn"
            class="logout-btn"
            theme="primary"
            variant="outline"
            size="small"
            shape="round"
            @click="handleLogout"
          >
            退出
          </Button>
          <Button v-else theme="primary" size="small" shape="round" @click="navigateTo('/auth')">登录</Button>
        </Space>
      </template>
    </HeadMenu>

    <main class="layout-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.web-layout {
  min-height: 100vh;
  background: #f6f9ff;
}

.brand {
  font-weight: 700;
  font-size: 16px;
  color: #0b60ff;
}

.layout-content {
  min-height: calc(100vh - 56px);
}

.logout-btn {
  height: 30px;
  padding: 0 14px;
}
</style>
