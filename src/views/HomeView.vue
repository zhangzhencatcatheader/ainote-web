<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const activeTab = ref(0)

const onClickLeft = () => {
  console.log('Click left')
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
      <van-cell-group inset>
        <van-cell title="欢迎使用 AI Note" />
        <van-cell title="Vue 3 + Vite + TypeScript" />
        <van-cell title="Vant 4 + Tailwind CSS" />
      </van-cell-group>

      <div class="mt-4">
        <van-button type="primary" block>开始使用</van-button>
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
