<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  MessagePlugin,
  Select,
  Option,
  Space,
} from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'
import { api } from '@/utils/api'
import { showError } from '@/utils/message'
import type { CompanyDto } from '@/api/model/dto/CompanyDto'

type CompanyRow = CompanyDto['CompanyService/COMPANY_NAME']

const router = useRouter()

const loading = ref(false)
const rows = ref<CompanyRow[]>([])

const keywords = ref('')

const selectedCompanyId = ref<string>('')

const filteredRows = computed(() => {
  const kw = (keywords.value || '').trim().toLowerCase()
  if (!kw) return rows.value
  return rows.value.filter((r) => (r.name || '').toLowerCase().includes(kw))
})

const fetchCompanies = async () => {
  loading.value = true
  try {
    rows.value = (await api.companyService.allCompanyNames()) as CompanyRow[]
  } catch (e) {
    console.error('获取企业列表失败', e)
    showError('获取企业列表失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // names 接口不分页，搜索走前端过滤
}

const handleJoin = async () => {
  if (!selectedCompanyId.value) {
    showError('请选择企业')
    return
  }

  loading.value = true
  try {
    await api.accountService.joinCompany({
      body: {
        accountCompanies: [
          {
            companyId: selectedCompanyId.value,
            role: 'USER',
          },
        ],
      },
    })

    MessagePlugin.success('加入成功')
    await router.replace('/')
  } catch (e) {
    console.error('加入企业失败', e)
    const msg = e instanceof Error ? e.message : '加入企业失败'
    showError(msg)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const token = localStorage.getItem('auth_token')
  if (!token) {
    router.replace('/auth')
    return
  }
  fetchCompanies()
})
</script>

<template>
  <WebLayout>
    <div class="content">
      <Card bordered hover-shadow>
        <div class="header">
          <div class="title">加入企业</div>
          <div class="sub">请选择一个企业加入，并设置你在企业内的角色</div>
        </div>

        <Form colon :label-width="80" class="form">
          <div class="toolbar">
            <FormItem label="企业搜索">
              <Input v-model="keywords" placeholder="输入企业名称/编码" clearable @enter="handleSearch" />
            </FormItem>
            <FormItem label="选择企业">
              <Select v-model="selectedCompanyId" filterable clearable placeholder="请选择企业">
                <Option v-for="c in filteredRows" :key="c.id" :value="c.id" :label="c.name" />
              </Select>
            </FormItem>
            <Space size="small" class="toolbar-actions">
              <Button theme="success" :loading="loading" @click="handleJoin">加入</Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  </WebLayout>
</template>

<style scoped>
.content {
  padding: 24px;
  background: #f5f6f7;
  min-height: calc(100vh - 64px);
}

.header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #18181b;
}

.sub {
  color: #606266;
}

.toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: end;
  margin-bottom: 12px;
}

.toolbar-actions {
  justify-content: flex-end;
}

</style>
