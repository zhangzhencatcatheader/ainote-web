<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button, Card, Image, Input, Option, Pagination, Select, Space, Table } from 'tdesign-vue-next'
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'
import { api } from '@/utils/api'
import { showError, showSuccess } from '@/utils/message'
import { RoleEnum_CONSTANTS } from '@/api/model/enums/RoleEnum'
import type { RoleEnum } from '@/api/model/enums/RoleEnum'
import { UserStatus_CONSTANTS } from '@/api/model/enums/UserStatus'
import type { UserStatus } from '@/api/model/enums/UserStatus'

type UserRow = {
  id: string
  username: string
  phone?: string
  role: RoleEnum
  status: UserStatus
  avatar?: {
    id: string
    filePath: string
    fileName: string
  }
  accountCompanies?: Array<{
    id: string
    choiceFlag: boolean
    role: RoleEnum
    company: {
      id: string
      tenant: string
      name: string
    }
  }>
  __empty?: boolean
}

const buildFileUrl = (fileId?: string, filePath?: string) => {
  if (filePath && (filePath.startsWith('http://') || filePath.startsWith('https://'))) {
    return filePath
  }
  if (fileId) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    return `${API_BASE_URL}/file/${fileId}`
  }
  if (filePath) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
    const safe = filePath.startsWith('/') ? filePath.substring(1) : filePath
    return `${API_BASE_URL}/${safe}`
  }
  return ''
}

const loading = ref(false)
const data = ref<UserRow[]>([])
const total = ref(0)
const pageIndex = ref(1)
const pageSize = ref(10)

const statusChangingIds = ref<Set<string>>(new Set())

const keyword = ref('')
const role = ref<RoleEnum | undefined>(undefined)
const status = ref<UserStatus | undefined>(undefined)

const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'avatar', title: '头像', width: 72 },
  { colKey: 'username', title: '用户名', minWidth: 140 },
  { colKey: 'phone', title: '手机号', width: 140 },
  { colKey: 'role', title: '角色', width: 110 },
  { colKey: 'status', title: '状态', width: 160 },
  { colKey: 'companies', title: '企业/租户' },
]

const tableData = computed(() => {
  const rows = [...data.value]
  const missing = Math.max(0, pageSize.value - rows.length)
  for (let i = 0; i < missing; i++) {
    rows.push({
      id: `empty-${i}`,
      username: '',
      phone: '',
      role: 'USER',
      status: undefined,
      __empty: true,
    })
  }
  return rows
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await api.accountService.page({
      pageIndex: Math.max(0, pageIndex.value - 1),
      pageSize: pageSize.value,
      search: {
        keyword: keyword.value || undefined,
        status: status.value,
        role: role.value,
      },
    })

    data.value = (res.rows || []) as unknown as UserRow[]
    total.value = res.totalRowCount || 0
  } catch (e) {
    console.error('获取用户列表失败', e)
    showError('获取用户列表失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

const handleChangeUserStatus = async (row: UserRow, next: UserStatus) => {
  if (statusChangingIds.value.has(row.id)) return

  const prev = row.status
  row.status = next
  statusChangingIds.value.add(row.id)
  try {
    await api.accountService.changeStatus({
      body: {
        id: row.id,
        status: next,
      },
    })
    showSuccess('状态已更新')
    await fetchList()
  } catch (e) {
    row.status = prev
    console.error('更新用户状态失败', e)
    showError('更新用户状态失败，请稍后再试')
  } finally {
    statusChangingIds.value.delete(row.id)
  }
}

const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
  pageIndex.value = pageInfo.current
  pageSize.value = pageInfo.pageSize
  fetchList()
}

const resetFilters = () => {
  keyword.value = ''
  role.value = undefined
  status.value = undefined
  pageIndex.value = 1
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <WebLayout>
    <div class="admin-users-page">
      <Card title="用户管理" bordered hover-shadow>
        <template #actions>
          <Space size="small" align="center">
            <Button theme="default" variant="outline" @click="fetchList" :loading="loading">刷新</Button>
          </Space>
        </template>

        <div class="filters">
          <Space size="small" align="center" class="filters-inline">
            <Input v-model="keyword" size="medium" clearable placeholder="关键词（用户名/手机号）" @enter="fetchList" />
            <Select v-model="role" clearable placeholder="角色" style="width: 140px">
              <Option v-for="r in RoleEnum_CONSTANTS" :key="r" :value="r" :label="r === 'ADMIN' ? '管理员' : '普通用户'" />
            </Select>
            <Select v-model="status" clearable placeholder="状态" style="width: 140px">
              <Option v-for="s in UserStatus_CONSTANTS" :key="s" :value="s" :label="s" />
            </Select>
            <Button theme="primary" @click="fetchList">查询</Button>
            <Button theme="default" variant="outline" @click="resetFilters">清空</Button>
          </Space>
        </div>

        <Table
          row-key="id"
          :data="tableData"
          :columns="columns"
          :loading="loading"
          bordered
          stripe
          size="medium"
        >
          <template #avatar="{ row }">
            <span v-if="!row.__empty">
              <Image
                v-if="row.avatar"
                :src="buildFileUrl(row.avatar?.id, row.avatar?.filePath)"
                :style="{ width: '40px', height: '40px', borderRadius: '50%' }"
                fit="cover"
              />
              <span v-else>-</span>
            </span>
          </template>
          <template #phone="{ row }">
            <span v-if="!row.__empty">{{ row.phone || '-' }}</span>
          </template>
          <template #role="{ row }">
            <span v-if="!row.__empty">{{ row.role === 'ADMIN' ? '管理员' : '普通用户' }}</span>
          </template>
          <template #status="{ row }">
            <span v-if="!row.__empty">
              <Select
                :value="row.status"
                :disabled="statusChangingIds.has(row.id)"
                size="small"
                style="width: 140px"
                @change="(val) => handleChangeUserStatus(row, val as UserStatus)"
              >
                <Option
                  v-for="s in UserStatus_CONSTANTS"
                  :key="s"
                  :value="s"
                  :label="s"
                />
              </Select>
            </span>
          </template>
          <template #companies="{ row }">
            <span v-if="!row.__empty">
              {{
                (row.accountCompanies || [])
                  .map((it) =>
                    `${it.company.name}（${it.company.tenant}）- ${it.role === 'ADMIN' ? '管理员' : '普通用户'}${it.choiceFlag ? '（当前）' : ''}`,
                  )
                  .join('，') || '-'
              }}
            </span>
          </template>
        </Table>

        <div class="pagination-wrap">
          <Pagination
            v-model:current="pageIndex"
            v-model:page-size="pageSize"
            size="medium"
            :total="total"
            :page-size-options="[10, 20, 50]"
            @change="handlePageChange"
          />
        </div>
      </Card>
    </div>
  </WebLayout>
</template>

<style scoped>
.admin-users-page {
  padding: 24px;
  background: #f6f8fb;
  min-height: 100vh;
}

.filters {
  margin: 12px 0;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}
</style>
