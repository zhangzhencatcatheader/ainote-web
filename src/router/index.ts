import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // PC 端路由
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
    },
    
    // 移动端路由（/mobile 前缀）
    {
      path: '/mobile',
      name: 'mobile-home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/mobile/auth',
      name: 'mobile-auth',
      component: () => import('@/views/AuthView.vue'),
    },
  ],
})

export default router
