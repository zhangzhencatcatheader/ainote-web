<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, h } from 'vue'
import { Button, Card, Descriptions, DescriptionsItem, Dialog, DialogPlugin, Form, FormItem, Image, Input, Pagination, Select, Option, Space, Switch, Table, Tabs, TabPanel } from 'tdesign-vue-next'
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'
import { api } from '@/utils/api'
import { showConfirm, showError, showSuccess } from '@/utils/message'

type TemplateRow = {
  id: string
  name: string
  category?: string
  description?: string
  enabled: boolean
  icon?: {
    id: string
    filePath: string
    originalName: string
  }
  __empty?: boolean
}

const buildFileUrl = (fileId?: string, filePath?: string) => {
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
const data = ref<TemplateRow[]>([])
const total = ref(0)

const tab = ref<'my' | 'tenant'>('my')

const myQuery = ref({
  keyword: '',
  category: '',
  enabled: undefined as boolean | undefined,
  pageIndex: 1,
  pageSize: 10,
})

const tenantQuery = ref({
  keyword: '',
  category: '',
  enabled: undefined as boolean | undefined,
  pageIndex: 1,
  pageSize: 10,
})

const activeQuery = computed(() => (tab.value === 'tenant' ? tenantQuery.value : myQuery.value))

const keyword = computed({
  get: () => activeQuery.value.keyword,
  set: (v: string) => {
    activeQuery.value.keyword = v
  },
})

const category = computed({
  get: () => activeQuery.value.category,
  set: (v: string) => {
    activeQuery.value.category = v
  },
})

const enabled = computed({
  get: () => activeQuery.value.enabled,
  set: (v: boolean | undefined) => {
    activeQuery.value.enabled = v
  },
})

const pageIndex = computed({
  get: () => activeQuery.value.pageIndex,
  set: (v: number) => {
    activeQuery.value.pageIndex = v
  },
})

const pageSize = computed({
  get: () => activeQuery.value.pageSize,
  set: (v: number) => {
    activeQuery.value.pageSize = v
  },
})

const addDialogVisible = ref(false)
const addLoading = ref(false)

const categoryPreset = ref<string | undefined>(undefined)

const statusChangingIds = ref<Set<string>>(new Set())

const iconFile = ref<File | null>(null)
const iconFileName = computed(() => iconFile.value?.name || '')
const iconFileInputRef = ref<HTMLInputElement | null>(null)
const iconPreviewUrl = ref('')

const templateFile = ref<File | null>(null)
const templateFileName = computed(() => templateFile.value?.name || '')
const templateFileInputRef = ref<HTMLInputElement | null>(null)

const addForm = ref({
  name: '',
  description: '',
  category: '',
  sortOrder: 0,
  color: '',
})

const colorPreset = ref<string | undefined>(undefined)

watch(iconFile, (file) => {
  if (iconPreviewUrl.value) {
    URL.revokeObjectURL(iconPreviewUrl.value)
    iconPreviewUrl.value = ''
  }

  if (file) {
    iconPreviewUrl.value = URL.createObjectURL(file)
  }
})

onBeforeUnmount(() => {
  if (iconPreviewUrl.value) {
    URL.revokeObjectURL(iconPreviewUrl.value)
    iconPreviewUrl.value = ''
  }
})

const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'name', title: '名称' },
  { colKey: 'category', title: '分类', width: 140 },
  { colKey: 'enabled', title: '启用', width: 90 },
  { colKey: 'description', title: '描述' },
  { colKey: 'actions', title: '操作', width: 200, fixed: 'right' },
]

const tableData = computed(() => {
  const rows = [...data.value]
  const missing = Math.max(0, pageSize.value - rows.length)
  for (let i = 0; i < missing; i++) {
    rows.push({
      id: `empty-${i}`,
      name: '',
      category: '',
      description: '',
      enabled: false,
      __empty: true,
    })
  }
  return rows
})

const fetchList = async () => {
  loading.value = true
  try {
    const search = {
      keyword: keyword.value || undefined,
      category: category.value || undefined,
      enabled: enabled.value,
    }

    const options = {
      pageIndex: Math.max(0, activeQuery.value.pageIndex - 1),
      pageSize: activeQuery.value.pageSize,
      search,
    }

    const res = tab.value === 'tenant'
      ? await api.templateService.tenantTemplatePage(options)
      : await api.templateService.myTemplatePage(options)

    data.value = (res.rows || []) as TemplateRow[]
    total.value = res.totalRowCount || 0
  } catch (e) {
    console.error('获取模板列表失败', e)
    showError('获取模板列表失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

const handleChangeStatus = async (row: TemplateRow, nextEnabled: boolean) => {
  if (tab.value !== 'my') {
    showError('同商户模板不支持修改状态')
    return
  }
  if (statusChangingIds.value.has(row.id)) return

  const prev = row.enabled
  row.enabled = nextEnabled
  statusChangingIds.value.add(row.id)
  try {
    await api.templateService.changeStatus({
      body: {
        id: row.id,
        enabled: nextEnabled,
      },
    })
    showSuccess('状态已更新')
    await fetchList()
  } catch (e) {
    row.enabled = prev
    console.error('更新模板状态失败', e)
    showError('更新模板状态失败，请稍后再试')
  } finally {
    statusChangingIds.value.delete(row.id)
  }
}

const handleTabChange = (value: string | number) => {
  tab.value = value === 'tenant' ? 'tenant' : 'my'
  fetchList()
}

const handlePageChange = (pageInfo: { current: number; pageSize: number }) => {
  activeQuery.value.pageIndex = pageInfo.current
  activeQuery.value.pageSize = pageInfo.pageSize
  fetchList()
}

const resetFilters = () => {
  activeQuery.value.keyword = ''
  activeQuery.value.category = ''
  activeQuery.value.enabled = undefined
  activeQuery.value.pageIndex = 1
  fetchList()
}

const openAddDialog = () => {
  addForm.value = {
    name: '',
    description: '',
    category: '',
    sortOrder: 0,
    color: '',
  }
  categoryPreset.value = undefined
  colorPreset.value = undefined
  iconFile.value = null
  templateFile.value = null
  addDialogVisible.value = true
}

const handleCategoryPresetChange = (value: string | number) => {
  const preset = typeof value === 'string' ? value : String(value)
  categoryPreset.value = preset
  addForm.value.category = preset
}

const handleColorPresetChange = (value: string | number) => {
  const preset = typeof value === 'string' ? value : String(value)
  colorPreset.value = preset
  addForm.value.color = preset
}

const openIconFilePicker = () => {
  if (iconFileInputRef.value) {
    iconFileInputRef.value.value = ''
  }
  iconFileInputRef.value?.click()
}

const handleSelectIconFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  iconFile.value = files[0] || null
}

const openTemplateFilePicker = () => {
  if (templateFileInputRef.value) {
    templateFileInputRef.value.value = ''
  }
  templateFileInputRef.value?.click()
}

const handleSelectTemplateFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  templateFile.value = files[0] || null
}

const handleAdd = async () => {
  if (!addForm.value.name.trim()) {
    showError('请填写模板名称')
    return
  }

  addLoading.value = true
  try {
    let iconFileId: string | undefined
    let fileId: string | undefined

    if (iconFile.value) {
      const uploadedIcon = await api.ossService.uploadFile({
        folder: 'template/icon',
        body: { file: iconFile.value },
      })
      iconFileId = uploadedIcon?.id
    }

    if (templateFile.value) {
      const uploaded = await api.ossService.uploadFile({
        folder: 'template',
        body: { file: templateFile.value },
      })
      fileId = uploaded?.id
    }

    const id = await api.templateService.add({
      body: {
        name: addForm.value.name.trim(),
        description: addForm.value.description || undefined,
        category: addForm.value.category || undefined,
        iconFileId,
        fileId,
        sortOrder: addForm.value.sortOrder,
        color: addForm.value.color || undefined,
      },
    })

    showSuccess('创建成功')
    addDialogVisible.value = false
    tab.value = 'my'
    myQuery.value.pageIndex = 1
    await fetchList()

    if (id) {
      // no-op: keep on list
    }
  } catch (e) {
    console.error('创建模板失败', e)
    showError('创建模板失败，请检查输入或稍后再试')
  } finally {
    addLoading.value = false
  }
}

const handleDelete = async (row: TemplateRow) => {
  const ok = await showConfirm({
    title: '确认删除',
    content: `确定删除模板「${row.name}」吗？此操作不可恢复。`,
    confirmText: '删除',
    cancelText: '取消',
  })
  if (!ok) return

  loading.value = true
  try {
    await api.templateService.delete({ id: row.id })
    showSuccess('删除成功')
    if (data.value.length === 1 && pageIndex.value > 1) {
      pageIndex.value -= 1
    }
    await fetchList()
  } catch (e) {
    console.error('删除模板失败', e)
    showError('删除模板失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

const handleView = async (row: TemplateRow) => {
  loading.value = true
  try {
    const detail = await api.templateService.detail({ id: row.id })

    const iconUrl = buildFileUrl(detail?.icon?.id, detail?.icon?.filePath)
    const fileUrl = buildFileUrl(detail?.file?.id, detail?.file?.filePath)

    DialogPlugin.alert({
      header: detail?.name || '模板详情',
      body: () =>
        h('div', { style: 'display:flex;flex-direction:column;gap:12px;' }, [
          h(
            Descriptions,
            { bordered: true, size: 'medium', column: 2 },
            {
              default: () => [
                h(DescriptionsItem, { label: 'ID' }, () => detail?.id || '-'),
                h(DescriptionsItem, { label: '名称' }, () => detail?.name || '-'),
                h(DescriptionsItem, { label: '分类' }, () => detail?.category || '-'),
                h(DescriptionsItem, { label: '启用' }, () => (detail?.enabled ? '是' : '否')),
                h(DescriptionsItem, { label: '主题颜色' }, () => detail?.color || '-'),
                h(
                  DescriptionsItem,
                  { label: '图标' },
                  () =>
                    iconUrl
                      ? h('a', { href: iconUrl, target: '_blank', rel: 'noreferrer' }, detail?.icon?.originalName || '查看')
                      : '-',
                ),
                h(
                  DescriptionsItem,
                  { label: '模板文件' },
                  () =>
                    fileUrl
                      ? h('a', { href: fileUrl, target: '_blank', rel: 'noreferrer' }, detail?.file?.originalName || '查看')
                      : '-',
                ),
              ],
            },
          ),
          h(
            'div',
            { style: 'font-weight:600;' },
            '描述',
          ),
          h(
            'pre',
            {
              style:
                'white-space:pre-wrap;word-break:break-word;padding:12px;background:#f8fafc;border:1px solid #eef2f7;border-radius:8px;margin:0;',
            },
            detail?.description || '-',
          ),
          h(
            'div',
            { style: 'font-weight:600;' },
            '字段',
          ),
          h(
            'div',
            { style: 'color:#666;font-size:12px;' },
            (detail?.fields?.length || 0) > 0
              ? detail?.fields
                  .map((f) => `${f.fieldLabel}（${f.fieldName}）- ${String(f.fieldType)}${f.required ? ' - 必填' : ''}`)
                  .join('\n')
              : '-',
          ),
        ]),
      confirmBtn: '关闭',
      width: 820,
    })
  } catch (e) {
    console.error('获取模板详情失败', e)
    showError('获取模板详情失败，请稍后再试')
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
    <div class="template-page">
      <Card title="模板管理" bordered hover-shadow>
        <template #actions>
          <Space size="small" align="center">
            <Button theme="default" variant="outline" @click="fetchList" :loading="loading">刷新</Button>
            <Button theme="primary" @click="openAddDialog">新建模板</Button>
          </Space>
        </template>

        <div class="tabs-wrap">
          <Tabs :value="tab" @change="handleTabChange">
            <TabPanel value="my" label="我的模板" />
            <TabPanel value="tenant" label="同商户模板" />
          </Tabs>
        </div>

        <div class="filters">
          <Space size="small" align="center" class="filters-inline">
            <Input v-model="keyword" size="medium" clearable placeholder="关键词" @enter="fetchList" />
            <Input v-model="category" size="medium" clearable placeholder="分类" @enter="fetchList" />
            <Select v-model="enabled" clearable placeholder="是否启用" style="width: 120px">
              <Option :value="true" label="启用" />
              <Option :value="false" label="停用" />
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
          <template #category="{ row }">
            <span v-if="!row.__empty">{{ row.category || '-' }}</span>
          </template>
          <template #enabled="{ row }">
            <span v-if="!row.__empty">
              <Switch
                :value="row.enabled"
                :disabled="statusChangingIds.has(row.id)"
                @change="(val) => handleChangeStatus(row, Boolean(val))"
              />
            </span>
          </template>
          <template #description="{ row }">
            <span v-if="!row.__empty">{{ row.description || '-' }}</span>
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

      <Dialog v-model:visible="addDialogVisible" header="新建模板" width="720">
        <Form label-width="100px">
          <FormItem label="模板名称" required>
            <Input v-model="addForm.name" placeholder="请输入模板名称" />
          </FormItem>
          <FormItem label="分类">
            <div style="width: 100%">
              <Select
                v-model="categoryPreset"
                clearable
                filterable
                placeholder="选择预设分类（环境/健康/安全），也可不选"
                @change="handleCategoryPresetChange"
              >
                <Option value="环境" label="环境" />
                <Option value="健康" label="健康" />
                <Option value="安全" label="安全" />
              </Select>
              <div style="height: 8px" />
              <Input v-model="addForm.category" clearable placeholder="不选择也可以：请填写分类（可不填）" />
            </div>
          </FormItem>
          <FormItem label="描述">
            <Input v-model="addForm.description" placeholder="模板说明" />
          </FormItem>
          <FormItem label="主题颜色">
            <div style="width: 100%">
              <Select
                v-model="colorPreset"
                clearable
                filterable
                placeholder="选择预设颜色，也可不选"
                @change="handleColorPresetChange"
              >
                <Option value="#1677ff" label="蓝色" />
                <Option value="#52c41a" label="绿色" />
                <Option value="#faad14" label="橙色" />
                <Option value="#f5222d" label="红色" />
                <Option value="#722ed1" label="紫色" />
                <Option value="#13c2c2" label="青色" />
                <Option value="#2f54eb" label="深蓝" />
                <Option value="#595959" label="灰色" />
              </Select>
              <div style="height: 8px" />
              <div style="display: flex; align-items: center; gap: 12px; width: 100%">
                <Input v-model="addForm.color" clearable placeholder="例如：#1677ff（可不填，可自定义）" />
                <Input v-model="addForm.color" type="color" style="width: 56px; padding: 0" />
              </div>
            </div>
          </FormItem>
          <FormItem label="排序" required>
            <Input v-model="addForm.sortOrder" type="number" placeholder="0" />
          </FormItem>
          <FormItem label="模板图标">
            <div class="upload-wrap">
              <input
                ref="iconFileInputRef"
                class="file-input"
                type="file"
                accept="image/*"
                @change="handleSelectIconFile"
              />
              <Space size="small">
                <Button theme="default" variant="outline" @click="openIconFilePicker">选择图标</Button>
                <span class="upload-tip">{{ iconFileName || '未选择' }}</span>
              </Space>
              <Image
                v-if="iconPreviewUrl"
                :src="iconPreviewUrl"
                :style="{ width: '56px', height: '56px', borderRadius: '8px' }"
                fit="cover"
              />
            </div>
          </FormItem>
          <FormItem label="模板文件">
            <div class="upload-wrap">
              <input
                ref="templateFileInputRef"
                class="file-input"
                type="file"
                @change="handleSelectTemplateFile"
              />
              <Space size="small">
                <Button theme="default" variant="outline" @click="openTemplateFilePicker">选择文件</Button>
                <span class="upload-tip">{{ templateFileName || '未选择' }}</span>
              </Space>
            </div>
          </FormItem>
        </Form>
        <template #footer>
          <Space>
            <Button theme="default" @click="addDialogVisible = false">取消</Button>
            <Button theme="primary" :loading="addLoading" @click="handleAdd">保存</Button>
          </Space>
        </template>
      </Dialog>
    </div>
  </WebLayout>
</template>

<style scoped>
.template-page {
  padding: 24px;
  background: #f6f8fb;
  min-height: 100vh;
}

.tabs-wrap {
  margin-top: 8px;
}

.filters {
  margin: 12px 0;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}

.upload-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-input {
  display: none;
}

.upload-tip {
  color: #666;
  font-size: 12px;
}
</style>
