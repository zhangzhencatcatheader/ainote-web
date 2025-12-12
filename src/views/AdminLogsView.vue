<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, Space, Input, Button, Table, Tag, Divider, MessagePlugin, Pagination } from 'tdesign-vue-next'
import type { Dynamic_Log } from '@/api/model/dynamic/Dynamic_Log'
import type { LogSpecification } from '@/api/model/static/LogSpecification'
import type { RequestMethod } from '@/api/model/enums/RequestMethod'
import { RequestMethod_CONSTANTS } from '@/api/model/enums/RequestMethod'
import { api } from '@/utils/api'
import { showError } from '@/utils/message'
import WebLayout from '@/components/WebLayout.vue'

const loading = ref(false)
const logs = ref<Dynamic_Log[]>([])
const total = ref(0)
const pageIndex = ref(1)
const pageSize = ref(20)
const keyword = ref('')
const methodFilter = ref<string>('全部')
const statusFilter = ref<string>('全部')

const columns = [
  { title: '时间', colKey: 'createdTime', width: 170 },
  { title: '操作', colKey: 'action', width: 120 },
  { title: '实体', colKey: 'targetEntity', width: 140 },
  { title: '实体ID', colKey: 'entityId', width: 140 },
  { title: '账户', colKey: 'accountId', width: 140 },
  { title: '方法', colKey: 'requestMethod', width: 90 },
  { title: '状态', colKey: 'responseStatus', width: 90 },
  { title: 'IP', colKey: 'ipAddress', width: 140 },
  { title: '请求路径', colKey: 'requestUrl', minWidth: 220 },
  { title: 'User Agent', colKey: 'userAgent', minWidth: 200 },
  { title: '错误信息', colKey: 'errorMessage', minWidth: 180 },
]

const requestMethods = computed(() => {
  return ['全部', ...RequestMethod_CONSTANTS]
})

const statusGroups = ['全部', '2xx', '3xx', '4xx', '5xx']

const formatTime = (value?: string) => {
  if (!value) return '-'
  try {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}

const statusTag = (status?: number) => {
  if (status === undefined || status === null) return { theme: 'default', text: '未知' }
  if (status >= 500) return { theme: 'danger', text: String(status) }
  if (status >= 400) return { theme: 'warning', text: String(status) }
  if (status >= 300) return { theme: 'primary', text: String(status) }
  return { theme: 'success', text: String(status) }
}

const buildSpecification = (): LogSpecification => {
  const spec: LogSpecification = {}
  
  // 关键词搜索：尝试匹配多个字段
  const kw = keyword.value.trim()
  if (kw) {
    // 如果关键词看起来像IP地址，设置ipAddress
    if (/^\d+\.\d+\.\d+\.\d+$/.test(kw)) {
      spec.ipAddress = kw
    } else if (kw.startsWith('http://') || kw.startsWith('https://') || kw.startsWith('/')) {
      // 如果看起来像URL，设置requestUrl
      spec.requestUrl = kw
    } else {
      // 否则尝试匹配 action、targetEntity、entityId 等
      // 注意：接口只支持单个字段查询，这里优先使用 action
      // 如果需要更灵活的搜索，可能需要后端支持多字段模糊查询
      spec.action = kw
    }
  }
  
  // 方法筛选
  if (methodFilter.value !== '全部') {
    spec.requestMethod = methodFilter.value as RequestMethod
  }
  
  // 注意：状态筛选（2xx/3xx/4xx/5xx）需要范围查询支持
  // 由于后端接口只支持精确状态码匹配，状态筛选在前端进行
  // 这会导致分页总数可能不准确，但可以保证筛选结果的正确性
  
  return spec
}

// 前端状态筛选：根据状态组过滤日志
const filterByStatus = (logs: Dynamic_Log[]): Dynamic_Log[] => {
  if (statusFilter.value === '全部') {
    return logs
  }
  
  const statusGroup = statusFilter.value
  return logs.filter((log) => {
    const status = log.responseStatus ?? 0
    if (statusGroup === '2xx') {
      return status >= 200 && status < 300
    } else if (statusGroup === '3xx') {
      return status >= 300 && status < 400
    } else if (statusGroup === '4xx') {
      return status >= 400 && status < 500
    } else if (statusGroup === '5xx') {
      return status >= 500
    }
    return true
  })
}

// 显示用的日志列表（应用前端状态筛选）
const displayedLogs = computed(() => {
  return filterByStatus(logs.value)
})

const fetchLogs = async () => {
  loading.value = true
  try {
    const specification = buildSpecification()
    const res = await api.logService.findAll({
      pageNum: Math.max(0, pageIndex.value - 1), // 后端从0开始，UI从1开始
      pageSize: pageSize.value,
      specification,
    })
    logs.value = (res.rows || []) as Dynamic_Log[]
    total.value = res.totalRowCount || 0
  } catch (error) {
    console.error('获取日志失败', error)
    showError('获取日志失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
  pageIndex.value = pageInfo.current
  pageSize.value = pageInfo.pageSize
  fetchLogs()
}

const clearFilters = () => {
  keyword.value = ''
  methodFilter.value = '全部'
  statusFilter.value = '全部'
  pageIndex.value = 1
  fetchLogs()
}

onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <WebLayout>
    <div class="logs-page">
      <Card title="日志管理" bordered hover-shadow>
        <template #actions>
          <Space size="small">
            <Button theme="default" variant="outline" size="small" @click="clearFilters">清空筛选</Button>
            <Button theme="primary" size="small" :loading="loading" @click="fetchLogs">刷新</Button>
          </Space>
        </template>

        <div class="filters">
          <Space size="small" align="center" break-line>
            <Input 
              v-model="keyword" 
              placeholder="搜索 操作/实体/ID/URL/IP" 
              clearable 
              @enter="fetchLogs"
            />
            <Space align="center" size="small">
              <span class="filter-label">方法</span>
              <Button
                v-for="method in requestMethods"
                :key="method"
                size="small"
                :theme="methodFilter === method ? 'primary' : 'default'"
                variant="outline"
                @click="() => { methodFilter = method; fetchLogs() }"
              >
                {{ method }}
              </Button>
            </Space>
            <Space align="center" size="small">
              <span class="filter-label">状态</span>
              <Button
                v-for="group in statusGroups"
                :key="group"
                size="small"
                :theme="statusFilter === group ? 'primary' : 'default'"
                variant="outline"
                @click="() => { statusFilter = group; fetchLogs() }"
              >
                {{ group }}
              </Button>
            </Space>
            <Button theme="primary" size="small" @click="fetchLogs">查询</Button>
          </Space>
        </div>

        <Divider />

        <Table
          row-key="id"
          :data="displayedLogs"
          :columns="columns"
          :loading="loading"
          size="medium"
          bordered
          stripe
        >
          <template #createdTime="{ row }">
            {{ formatTime(row.createdTime) }}
          </template>
          <template #requestMethod="{ row }">
            <Tag theme="primary" variant="light-outline">{{ row.requestMethod || '-' }}</Tag>
          </template>
          <template #responseStatus="{ row }">
            <Tag v-bind="statusTag(row.responseStatus)" variant="light-outline">
              {{ statusTag(row.responseStatus).text }}
            </Tag>
          </template>
          <template #action="{ row }">
            <Tag theme="default" variant="light-outline">{{ row.action || '-' }}</Tag>
          </template>
          <template #targetEntity="{ row }">
            <Tag theme="default" variant="light-outline">{{ row.targetEntity || '-' }}</Tag>
          </template>
          <template #requestUrl="{ row }">
            <span class="ellipsis">{{ row.requestUrl || '-' }}</span>
          </template>
          <template #userAgent="{ row }">
            <span class="ellipsis">{{ row.userAgent || '-' }}</span>
          </template>
          <template #errorMessage="{ row }">
            <span class="ellipsis error-text">{{ row.errorMessage || '-' }}</span>
          </template>
        </Table>

        <div class="pagination-wrap">
          <Pagination
            v-model:current="pageIndex"
            v-model:page-size="pageSize"
            size="medium"
            :total="total"
            :page-size-options="[10, 20, 50, 100]"
            @change="handlePageChange"
          />
        </div>
      </Card>
    </div>
  </WebLayout>
</template>

<style scoped>
.logs-page {
  padding: 24px;
  background: #f6f8fb;
  min-height: 100vh;
}

.filters {
  padding: 12px 0;
}

.filter-label {
  color: #666;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}

.ellipsis {
  display: inline-block;
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error-text {
  color: #d54941;
}
</style>
