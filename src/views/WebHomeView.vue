<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { showConfirm, showError } from '@/utils/message'
import { getCurrentTenant } from '@/utils/tenant'
import { Card, Row, Col, Button, Divider, Space, Dialog, Form, FormItem, Input, Select, Option, MessagePlugin } from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'
import { api } from '@/utils/api'

const router = useRouter()
const appStore = useAppStore()

const isLoggedIn = computed(() => !!localStorage.getItem('auth_token'))
const userId = computed(() => localStorage.getItem('user_id') || '未登录')
const userRole = computed(() => localStorage.getItem('user_role') || '游客')
const tenantId = computed(() => getCurrentTenant() || '未指定')
const isAdmin = computed(() => userRole.value === 'ADMIN')

const companyName = ref<string>('')
const companyRole = ref<string>('')
const needJoinCompany = ref(false)

type CompanyNameRow = {
  id: string
  name: string
}

const joinDialogVisible = ref(false)
const joinLoading = ref(false)
const joinSelectedCompanyId = ref('')
const companyOptions = ref<CompanyNameRow[]>([])

const filteredCompanyOptions = computed(() => {
  return companyOptions.value
})

const fetchCompanyNames = async () => {
  joinLoading.value = true
  try {
    companyOptions.value = (await api.companyService.allCompanyNames()) as CompanyNameRow[]
  } catch (e) {
    console.error('获取企业名称列表失败', e)
    showError('获取企业列表失败，请稍后再试')
  } finally {
    joinLoading.value = false
  }
}

const openJoinDialog = async () => {
  joinDialogVisible.value = true
  joinSelectedCompanyId.value = ''
  if (!companyOptions.value.length) {
    await fetchCompanyNames()
  }
}

const handleJoinCompany = async () => {
  if (!joinSelectedCompanyId.value) {
    showError('请选择企业')
    return
  }

  joinLoading.value = true
  try {
    await api.accountService.joinCompany({
      body: {
        accountCompanies: [
          {
            companyId: joinSelectedCompanyId.value,
            role: 'USER',
          },
        ],
      },
    })
    MessagePlugin.success('加入成功')
    await loadCompanyState()
    joinDialogVisible.value = false
  } catch (e) {
    console.error('加入企业失败', e)
    const msg = e instanceof Error ? e.message : '加入企业失败'
    showError(msg)
  } finally {
    joinLoading.value = false
  }
}

const loadCompanyState = async () => {
  if (!isLoggedIn.value) {
    companyName.value = ''
    companyRole.value = ''
    needJoinCompany.value = false
    joinDialogVisible.value = false
    return
  }

  try {
    const me = await api.accountService.me()
    // 后端异常或未返回 me 时，不做“强制加入企业”的判断，避免误弹窗
    if (!me) {
      joinDialogVisible.value = false
      needJoinCompany.value = false
      return
    }

    const companies = me.accountCompanies || []

    if (!companies.length) {
      companyName.value = ''
      companyRole.value = ''
      needJoinCompany.value = true
      return
    }

    needJoinCompany.value = false

    const active = companies.find((c) => c.choiceFlag) || companies[0]
    companyName.value = active?.company?.name || ''
    companyRole.value = (active?.role as string) || ''

    const tenant = active?.company?.tenant
    if (tenant) {
      localStorage.setItem('auth_tenant', tenant)
    }
  } catch (e) {
    console.error('加载企业状态失败', e)
  }
}

const stats = ref([
  { label: '总笔记', value: '128', desc: '累计创建', icon: '📒' },
  { label: '本周新增', value: '23', desc: '近期产出', icon: '🆕' },
  { label: '收藏', value: '45', desc: '重点笔记', icon: '⭐' },
  { label: '共享', value: '12', desc: '团队协作', icon: '🤝' },
])

const quickActions = ref([
  { icon: '📝', title: '新建笔记', desc: '快速记录灵感', path: '/notes/create' },
  { icon: '🔍', title: '搜索', desc: '全文检索与过滤', path: '/search' },
  { icon: '📊', title: '分析', desc: '统计与趋势', path: '/analytics' },
  { icon: '⚙️', title: '设置', desc: '偏好与安全', path: '/settings' },
  { icon: '👥', title: '团队', desc: '共享与权限', path: '/team' },
  { icon: '🔖', title: '标签', desc: '管理分类标签', path: '/tags' },
  { icon: '🏢', title: '企业管理', desc: '租户与企业', path: '/admin/company', adminOnly: true },
  { icon: '🧑‍💼', title: '用户管理', desc: '成员与权限', path: '/admin/users', adminOnly: true },
  { icon: '📜', title: '日志管理', desc: '系统审计', path: '/admin/logs', adminOnly: true },
])

const shortcuts = ref([
  { title: '最近打开', items: ['项目规划', '会议记录', '学习清单'] },
  { title: '常用标签', items: ['#工作', '#灵感', '#技术'] },
])

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

onMounted(() => {
  loadCompanyState()
})
</script>

<template>
  <WebLayout>
    <div class="content">
      <Dialog
        v-model:visible="joinDialogVisible"
        header="加入企业"
        confirm-btn="加入"
        :close-btn="false"
        :cancel-btn="null"
        :close-on-esc-keydown="false"
        :close-on-overlay-click="false"
        :confirm-loading="joinLoading"
        @confirm="handleJoinCompany"
      >
        <Form colon :label-width="80">
          <FormItem label="选择企业">
            <Select v-model="joinSelectedCompanyId" filterable clearable placeholder="请选择企业">
              <Option v-for="c in filteredCompanyOptions" :key="c.id" :value="c.id" :label="c.name" />
            </Select>
          </FormItem>
        </Form>
      </Dialog>

      <Row :gutter="[16, 16]">
        <Col :span="9">
          <Card bordered hover-shadow>
            <div class="hero">
              <div>
                <div class="hero-title">欢迎来到 {{ appStore.title }}</div>
                <div class="hero-sub">智能笔记与多端体验，使用 TDesign 构建</div>
                <Space size="small" class="hero-actions">
                  <Button theme="primary" @click="navigateTo('/notes')">进入工作台</Button>
                  <Button variant="outline" @click="navigateTo('/auth')">
                    {{ isLoggedIn ? '切换账号' : '立即登录' }}
                  </Button>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
        <Col :span="3">
          <Card bordered hover-shadow title="状态">
            <div class="status-list">
              <div class="status-item">
                <span class="status-icon">🔐</span>
                <div>
                  <div class="status-label">认证</div>
                  <div class="status-value">{{ isLoggedIn ? '已登录' : '未登录' }}</div>
                </div>
              </div>
              <div class="status-item">
                <span class="status-icon">🏢</span>
                <div>
                  <div class="status-label">企业</div>
                  <div class="status-value">{{ companyName || (isLoggedIn ? '未加入' : '-') }}</div>
                </div>
              </div>
              <div v-if="needJoinCompany" class="status-item">
                <span class="status-icon">➕</span>
                <div style="width: 100%">
                  <div class="status-label">操作</div>
                  <Button theme="primary" size="small" :loading="joinLoading" @click="openJoinDialog">
                    加入企业
                  </Button>
                </div>
              </div>
              <div class="status-item">
                <span class="status-icon">🪪</span>
                <div>
                  <div class="status-label">企业角色</div>
                  <div class="status-value">{{ companyRole || (isLoggedIn ? '-' : '-') }}</div>
                </div>
              </div>
              <div class="status-item">
                <span class="status-icon">🏷️</span>
                <div>
                  <div class="status-label">角色</div>
                  <div class="status-value">{{ userRole }}</div>
                </div>
              </div>
              <div class="status-item">
                <span class="status-icon">🧭</span>
                <div>
                  <div class="status-label">租户</div>
                  <div class="status-value">{{ tenantId }}</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row :gutter="[16, 16]">
        <Col v-for="item in stats" :key="item.label" :span="3">
          <Card bordered hover-shadow>
            <div class="stat-card">
              <span class="stat-icon">{{ item.icon }}</span>
              <div class="stat-body">
                <div class="stat-value">{{ item.value }}</div>
                <div class="stat-label">{{ item.label }}</div>
                <div class="stat-desc">{{ item.desc }}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row :gutter="[16, 16]">
        <Col :span="9">
          <Card bordered hover-shadow title="快捷功能" subtitle="桌面端优先布局">
            <Row :gutter="[16, 16]">
              <Col v-for="action in quickActions" :key="action.title" :span="3">
                <div
                  v-if="!action.adminOnly || isAdmin"
                  class="action-card"
                  @click="navigateTo(action.path)"
                >
                  <div class="action-icon">{{ action.icon }}</div>
                  <div class="action-title">{{ action.title }}</div>
                  <div class="action-desc">{{ action.desc }}</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col :span="3">
          <Card bordered hover-shadow title="快捷入口">
            <div class="shortcut-section" v-for="group in shortcuts" :key="group.title">
              <div class="shortcut-title">{{ group.title }}</div>
              <Space direction="vertical" size="small">
                <Button
                  v-for="item in group.items"
                  :key="item"
                  variant="outline"
                  size="small"
                  block
                  @click="navigateTo('/notes')"
                >
                  {{ item }}
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </WebLayout>
</template>

<style scoped>
.content {
  padding: 24px 24px 48px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.hero-title {
  font-size: 22px;
  font-weight: 700;
  color: #2d2f33;
}

.hero-sub {
  margin-top: 4px;
  color: #666;
}

.hero-actions {
  margin-top: 12px;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
}

.status-icon {
  font-size: 18px;
}

.status-label {
  color: #606266;
}

.status-value {
  font-weight: 600;
  color: #18181b;
}

.stat-card {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-icon {
  font-size: 26px;
}

.stat-body {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
}

.stat-label {
  color: #555;
}

.stat-desc {
  color: #8c8c8c;
  font-size: 12px;
}

.action-card {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e6ebf5;
  background: #fdfefe;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 120px;
}

.action-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 22px;
}

.action-title {
  margin-top: 6px;
  font-weight: 600;
  color: #1f2937;
}

.action-desc {
  margin-top: 4px;
  color: #6b7280;
  font-size: 13px;
}

.shortcut-section + .shortcut-section {
  margin-top: 16px;
}

.shortcut-title {
  font-weight: 600;
  margin-bottom: 8px;
}
</style>
