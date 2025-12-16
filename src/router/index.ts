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
      component: () => import('@/views/NotesView.vue'),
    },
    {
      path: '/notes/create',
      name: 'create-note',
      meta: { title: '新建笔记' },
      component: () => import('@/views/NoteCreateView.vue'),
    },
    {
      path: '/notes/:id',
      name: 'note-detail',
      meta: { title: '笔记详情' },
      component: () => import('@/views/NoteDetailView.vue'),
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
      path: '/templates',
      name: 'templates',
      meta: { title: '模板管理' },
      component: () => import('@/views/TemplateManageView.vue'),
    },
    {
      path: '/templates/:id/edit',
      name: 'template-edit',
      meta: { title: '编辑模板' },
      component: () => import('@/views/TemplateEditView.vue'),
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
      component: () => import('@/views/AdminUsersView.vue'),
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

router.beforeEach((to) => {
  const requiresAdmin = Boolean(to.meta?.requiresAdmin)
  if (!requiresAdmin) return true

  const token = localStorage.getItem('auth_token')
  if (!token) {
    return { path: '/auth' }
  }

  const role = localStorage.getItem('user_role')
  if (role !== 'ADMIN') {
    return { path: '/' }
  }

  return true
})

export default router
