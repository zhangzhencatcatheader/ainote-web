import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // PC 端路由
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/WebHomeView.vue'),
    },
    {
      path: '/notes',
      name: 'notes',
      meta: { title: '笔记' },
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/notes/create',
      name: 'create-note',
      meta: { title: '新建笔记' },
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      meta: { title: '搜索' },
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      meta: { title: '设置' },
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/analytics',
      name: 'analytics',
      meta: { title: '数据分析' },
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/team',
      name: 'team',
      meta: { title: '团队协作' },
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/tags',
      name: 'tags',
      meta: { title: '标签管理' },
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/admin/company',
      name: 'admin-company',
      meta: { title: '企业管理', requiresAdmin: true },
      component: () => import('@/views/AdminCompanyView.vue'),
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      meta: { title: '用户管理', requiresAdmin: true },
      component: () => import('@/views/PlaceholderView.vue'),
    },
    {
      path: '/admin/logs',
      name: 'admin-logs',
      meta: { title: '日志管理', requiresAdmin: true },
      component: () => import('@/views/AdminLogsView.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      meta: { title: '个人信息' },
      component: () => import('@/views/ProfileView.vue'),
    },
  ],
})

export default router
