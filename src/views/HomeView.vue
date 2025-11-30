<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { showDialog } from 'vant'

const router = useRouter()
const appStore = useAppStore()
const activeTab = ref(0)

// 检查是否已登录
const isLoggedIn = computed(() => {
  return !!localStorage.getItem('auth_token')
})

// 获取用户信息
const userId = computed(() => localStorage.getItem('user_id') || '未登录')
const userRole = computed(() => localStorage.getItem('user_role') || '游客')

const onClickLeft = () => {
  console.log('Click left')
}

// 跳转到登录页
const goToAuth = () => {
  router.push('/auth')
}

// 退出登录
const handleLogout = () => {
  showDialog({
    title: '确认退出',
    message: '确定要退出登录吗？',
  }).then(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('user_role')
    router.push('/auth')
  }).catch(() => {
    // 用户取消
  })
}
</script>

<template>
  <div class="home-view min-h-screen flex flex-col">
    <van-nav-bar
      :title="appStore.title"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="flex-1 p-4">
      <!-- 用户信息卡片 -->
      <van-cell-group inset class="mb-4">
        <van-cell title="登录状态" :value="isLoggedIn ? '已登录' : '未登录'" />
        <van-cell v-if="isLoggedIn" title="用户ID" :value="userId" />
        <van-cell v-if="isLoggedIn" title="角色" :value="userRole" />
      </van-cell-group>

      <van-cell-group inset>
        <van-cell title="欢迎使用 AI Note" />
        <van-cell title="Vue 3 + Vite + TypeScript" />
        <van-cell title="Vant 4 + Tailwind CSS" />
      </van-cell-group>

      <div class="mt-4 space-y-3">
        <van-button v-if="!isLoggedIn" type="primary" block @click="goToAuth">
          立即登录
        </van-button>
        <van-button v-else type="danger" block @click="handleLogout">
          退出登录
        </van-button>
      </div>
    </div>

    <van-tabbar v-model="activeTab">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="search">搜索</van-tabbar-item>
      <van-tabbar-item icon="setting-o">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.home-view {
  background-color: #f5f5f5;
}
</style>
