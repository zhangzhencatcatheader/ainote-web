<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { showConfirm } from '@/utils/message'
import { BaseButton } from '@/components/base'
import { useDevice } from '@/utils/device'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const { isMobile } = useDevice()

// 判断当前是否为移动端路由
const isMobilePath = route.path.startsWith('/mobile')

// 检查是否已登录
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('auth_token')
})

// 获取用户信息
const userId = computed(() => localStorage.getItem('user_id') || '未登录')
const userRole = computed(() => localStorage.getItem('user_role') || '游客')

// 跳转到登录页（保持移动端/PC端路由）
const goToAuth = () => {
  router.push(isMobilePath ? '/mobile/auth' : '/auth')
}

// 退出登录
const handleLogout = async () => {
  const confirmed = await showConfirm({
    title: '确认退出',
    content: '确定要退出登录吗？',
  })
  
  if (confirmed) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_role')
    router.push(isMobilePath ? '/mobile/auth' : '/auth')
  }
}
</script>

<template>
  <div class="home-view min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航栏 -->
    <div class="bg-white shadow-sm px-4 py-3 sm:px-6 sm:py-4">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-lg sm:text-xl font-bold text-gray-800">{{ appStore.title }}</h1>
      </div>
    </div>

    <div class="flex-1 p-4 sm:p-6 md:p-8">
      <!-- PC端内容居中，限制最大宽度 -->
      <div class="max-w-3xl mx-auto space-y-4">
        <!-- 用户信息卡片 -->
        <div class="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 class="text-base sm:text-lg font-semibold text-gray-800 mb-4">用户信息</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm sm:text-base text-gray-600">登录状态</span>
              <span class="text-sm sm:text-base font-medium" :class="isLoggedIn ? 'text-green-600' : 'text-gray-400'">
                {{ isLoggedIn ? '已登录' : '未登录' }}
              </span>
            </div>
            <div v-if="isLoggedIn" class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm sm:text-base text-gray-600">用户ID</span>
              <span class="text-sm sm:text-base font-medium text-gray-800">{{ userId }}</span>
            </div>
            <div v-if="isLoggedIn" class="flex justify-between items-center py-2">
              <span class="text-sm sm:text-base text-gray-600">角色</span>
              <span class="text-sm sm:text-base font-medium text-blue-600">{{ userRole }}</span>
            </div>
          </div>
        </div>

        <!-- 项目信息卡片 -->
        <div class="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 class="text-base sm:text-lg font-semibold text-gray-800 mb-4">项目信息</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm sm:text-base text-gray-600">项目名称</span>
              <span class="text-sm sm:text-base font-medium text-gray-800">AI Note</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm sm:text-base text-gray-600">技术栈</span>
              <span class="text-sm sm:text-base font-medium text-gray-800">Vue 3 + TypeScript + Vite</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm sm:text-base text-gray-600">UI 库</span>
              <span class="text-sm sm:text-base font-medium text-gray-800">TDesign {{ isMobile ? 'Mobile' : 'Vue Next' }}</span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="space-y-3">
          <BaseButton v-if="!isLoggedIn" type="primary" block @click="goToAuth">
            立即登录
          </BaseButton>
          <BaseButton v-else type="danger" block @click="handleLogout">
            退出登录
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  /* 默认样式由 Tailwind 处理 */
}
</style>
