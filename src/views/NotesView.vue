<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Input, Pagination, Space, Table, Tabs, TabPanel } from 'tdesign-vue-next'
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'
import { api } from '@/utils/api'
import { showError, showSuccess, showConfirm } from '@/utils/message'

type NoteRow = {
  id: string
  title: string
  createdTime: string
  modifiedTime: string
  __empty?: boolean
}

const router = useRouter()

const loading = ref(false)
const data = ref<NoteRow[]>([])
const total = ref(0)
const pageIndex = ref(1)
const pageSize = ref(10)
const keyword = ref('')
const tab = ref<'my' | 'tenant'>('my')

const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'title', title: '标题' },
  { colKey: 'createdTime', title: '创建时间', width: 180 },
  { colKey: 'modifiedTime', title: '更新时间', width: 180 },
  { colKey: 'actions', title: '操作', width: 180, fixed: 'right' },
]

const tableData = computed(() => {
  const rows = [...data.value]
  const missing = Math.max(0, pageSize.value - rows.length)
  for (let i = 0; i < missing; i++) {
    rows.push({
      id: `empty-${i}`,
      title: '',
      createdTime: '',
      modifiedTime: '',
      __empty: true,
    })
  }
  return rows
})

const fetchList = async () => {
  loading.value = true
  try {
    const options = {
      pageIndex: Math.max(0, pageIndex.value - 1),
      pageSize: pageSize.value,
      search: { keyword: keyword.value || undefined },
    }

    const res = tab.value === 'tenant'
      ? await api.noteService.tenantNotePage(options)
      : await api.noteService.myNotePage(options)

    data.value = (res.rows || []) as NoteRow[]
    total.value = res.totalRowCount || 0
  } catch (e) {
    console.error('获取笔记列表失败', e)
    showError('获取笔记列表失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
  pageIndex.value = pageInfo.current
  pageSize.value = pageInfo.pageSize
  fetchList()
}

const handleTabChange = (value: string | number) => {
  tab.value = value === 'tenant' ? 'tenant' : 'my'
  pageIndex.value = 1
  fetchList()
}

const handleView = (row: NoteRow) => {
  router.push(`/notes/${row.id}`)
}

const handleDelete = async (row: NoteRow) => {
  if (tab.value === 'tenant') {
    return
  }
  const ok = await showConfirm({
    title: '确认删除',
    content: `确定删除笔记「${row.title}」吗？此操作不可恢复。`,
    confirmText: '删除',
    cancelText: '取消',
  })
  if (!ok) return

  loading.value = true
  try {
    await api.noteService.delete({ id: row.id })
    showSuccess('删除成功')
    if (data.value.length === 1 && pageIndex.value > 1) {
      pageIndex.value -= 1
    }
    fetchList()
  } catch (e) {
    console.error('删除笔记失败', e)
    showError('删除笔记失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchList()
})
</script>

<template>
  <WebLayout>
    <div class="notes-page">
      <Card title="笔记" bordered hover-shadow>
        <template #actions>
          <Space size="small" align="center">
            <Button theme="default" variant="outline" @click="fetchList" :loading="loading">刷新</Button>
            <Button theme="primary" @click="router.push('/notes/create')">新建笔记</Button>
          </Space>
        </template>

        <Tabs :value="tab" @change="handleTabChange">
          <TabPanel value="my" label="我的笔记" />
          <TabPanel value="tenant" label="同商户笔记" />
        </Tabs>

        <div class="filters">
          <Space size="small" align="center" class="filters-inline">
            <Input v-model="keyword" size="medium" clearable placeholder="搜索标题/内容" @enter="fetchList" />
            <Button theme="primary" @click="fetchList">查询</Button>
            <Button theme="default" variant="outline" @click="keyword = ''; pageIndex = 1; fetchList()">清空</Button>
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
          <template #title="{ row }">
            <span v-if="!row.__empty">{{ row.title || '-' }}</span>
          </template>

          <template #createdTime="{ row }">
            <span v-if="!row.__empty">{{ row.createdTime || '-' }}</span>
          </template>

          <template #modifiedTime="{ row }">
            <span v-if="!row.__empty">{{ row.modifiedTime || '-' }}</span>
          </template>

          <template #actions="{ row }">
            <Space v-if="!row.__empty" size="small">
              <Button theme="default" variant="outline" size="small" @click="handleView(row)">查看</Button>
              <Button
                v-if="tab === 'my'"
                theme="danger"
                variant="outline"
                size="small"
                @click="handleDelete(row)"
              >
                删除
              </Button>
            </Space>
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
.notes-page {
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
