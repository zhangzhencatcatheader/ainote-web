<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Button,
  Card,
  Input,
  LoadingPlugin,
  Option,
  Select,
  Space,
  Switch,
  Table,
} from 'tdesign-vue-next'
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'
import { api } from '@/utils/api'
import { showError, showSuccess } from '@/utils/message'
import { FieldType_CONSTANTS } from '@/api/model/enums/FieldType'
import type { FieldType } from '@/api/model/enums/FieldType'
import type { UpdateTemplate_TargetOf_fields } from '@/api/model/static/UpdateTemplate_TargetOf_fields'

type EditableField = UpdateTemplate_TargetOf_fields & { __localId: string }

type TemplateDetail = {
  id: string
  name: string
  category?: string
  description?: string
  fields: Array<UpdateTemplate_TargetOf_fields>
  file?: { id: string } | null
}

const route = useRoute()
const router = useRouter()

const templateId = computed(() => route.params.id as string)

const loading = ref(false)
const generating = ref(false)
const saving = ref(false)

const detail = ref<TemplateDetail | null>(null)
const fields = ref<EditableField[]>([])

const columns: PrimaryTableCol<TableRowData>[] = [
  { colKey: 'fieldLabel', title: '字段名称', minWidth: 160 },
  { colKey: 'fieldName', title: '字段标识', minWidth: 160 },
  { colKey: 'fieldType', title: '类型', width: 140 },
  { colKey: 'required', title: '必填', width: 80 },
  { colKey: 'visible', title: '可见', width: 80 },
  { colKey: 'editable', title: '可编辑', width: 90 },
  { colKey: 'searchable', title: '可搜索', width: 90 },
  { colKey: 'sortOrder', title: '排序', width: 90 },
  { colKey: 'actions', title: '操作', width: 100, fixed: 'right' },
]

const normalizeFields = (arr: ReadonlyArray<UpdateTemplate_TargetOf_fields>) => {
  fields.value = (arr || []).map((f, idx) => ({
    ...f,
    __localId: `${f.id || f.fieldName || 'field'}-${idx}`,
  }))
}

const fetchDetail = async () => {
  if (!templateId.value) return
  loading.value = true
  try {
    const res = await api.templateService.detail({ id: templateId.value })
    if (!res) {
      detail.value = null
      fields.value = []
      return
    }

    detail.value = {
      id: res.id,
      name: res.name,
      category: res.category || undefined,
      description: res.description || undefined,
      fields: (res.fields || []) as unknown as Array<UpdateTemplate_TargetOf_fields>,
      file: (res.file || null) as any,
    }

    normalizeFields(detail.value.fields)
  } catch (e) {
    console.error('获取模板详情失败', e)
    showError('获取模板详情失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

const addEmptyField = () => {
  fields.value.push({
    __localId: `new-${Date.now()}-${Math.random()}`,
    id: undefined,
    fieldLabel: '',
    fieldName: '',
    fieldType: 'TEXT',
    fieldOptions: undefined,
    defaultValue: undefined,
    placeholder: undefined,
    helpText: undefined,
    required: false,
    minLength: undefined,
    maxLength: undefined,
    minValue: undefined,
    maxValue: undefined,
    pattern: undefined,
    sortOrder: fields.value.length,
    width: undefined,
    visible: true,
    editable: true,
    searchable: false,
  })
}

const removeField = (row: EditableField) => {
  fields.value = fields.value.filter((f) => f.__localId !== row.__localId)
}

const createLoading = (text: string) => {
  return LoadingPlugin({
    text,
    fullscreen: true,
    preventScrollThrough: true,
  })
}

const handleGenerateFields = async () => {
  if (!detail.value) return
  if (generating.value) return

  generating.value = true
  const loadingInstance = createLoading('AI 识别文档生成字段中，可能需要 10-30 秒，请耐心等待...')
  try {
    const generated = await api.templateService.generateFields({
      body: {
        name: detail.value.name,
        description: detail.value.description || undefined,
        category: detail.value.category || undefined,
        iconFileId: undefined,
        fileId: detail.value.file?.id || undefined,
        sortOrder: 0,
        color: undefined,
      },
    })

    const mapped: UpdateTemplate_TargetOf_fields[] = (generated || []).map((f, idx) => ({
      id: undefined,
      fieldName: f.fieldName,
      fieldLabel: f.fieldLabel,
      fieldType: f.fieldType as FieldType,
      fieldOptions: f.fieldOptions,
      defaultValue: f.defaultValue,
      placeholder: f.placeholder,
      helpText: f.helpText,
      required: f.required,
      minLength: f.minLength,
      maxLength: f.maxLength,
      minValue: f.minValue,
      maxValue: f.maxValue,
      pattern: f.pattern,
      sortOrder: f.sortOrder ?? idx,
      width: f.width,
      visible: f.visible,
      editable: f.editable,
      searchable: f.searchable,
    }))

    await api.templateService.createFields({
      body: {
        id: detail.value.id,
        fields: mapped,
      },
    })

    normalizeFields(mapped)
    showSuccess('字段已生成并写入模板')
  } catch (e) {
    console.error('生成字段失败', e)
    showError('生成字段失败，请稍后再试')
  } finally {
    generating.value = false
    loadingInstance.hide()
  }
}

const handleSave = async () => {
  if (!detail.value) return
  if (saving.value) return

  const trimmed = fields.value.map((f) => ({
    ...f,
    fieldLabel: (f.fieldLabel || '').trim(),
    fieldName: (f.fieldName || '').trim(),
  }))

  const invalid = trimmed.find((f) => !f.fieldLabel || !f.fieldName)
  if (invalid) {
    showError('请完善字段名称/字段标识后再保存')
    return
  }

  saving.value = true
  const loadingInstance = createLoading('保存字段中...')
  try {
    await api.templateService.createFields({
      body: {
        id: detail.value.id,
        fields: trimmed.map((f, idx) => ({
          id: f.id,
          fieldName: f.fieldName,
          fieldLabel: f.fieldLabel,
          fieldType: f.fieldType,
          fieldOptions: f.fieldOptions,
          defaultValue: f.defaultValue,
          placeholder: f.placeholder,
          helpText: f.helpText,
          required: Boolean(f.required),
          minLength: f.minLength,
          maxLength: f.maxLength,
          minValue: f.minValue,
          maxValue: f.maxValue,
          pattern: f.pattern,
          sortOrder: Number.isFinite(Number(f.sortOrder)) ? Number(f.sortOrder) : idx,
          width: f.width,
          visible: Boolean(f.visible),
          editable: Boolean(f.editable),
          searchable: Boolean(f.searchable),
        })),
      },
    })

    showSuccess('保存成功')
    await fetchDetail()
  } catch (e) {
    console.error('保存字段失败', e)
    showError('保存失败，请稍后再试')
  } finally {
    saving.value = false
    loadingInstance.hide()
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<template>
  <WebLayout>
    <div class="template-edit-page">
      <Card :title="detail?.name ? `编辑模板：${detail.name}` : '编辑模板'" bordered hover-shadow :loading="loading">
        <template #actions>
          <Space size="small">
            <Button theme="default" variant="outline" @click="router.push('/templates')">返回列表</Button>
            <Button theme="primary" variant="outline" :loading="generating" @click="handleGenerateFields">生成字段</Button>
            <Button theme="primary" :loading="saving" @click="handleSave">保存</Button>
          </Space>
        </template>

        <div class="meta">
          <div class="meta-row">
            <span class="meta-label">分类：</span>
            <span class="meta-value">{{ detail?.category || '-' }}</span>
          </div>
          <div class="meta-row">
            <span class="meta-label">描述：</span>
            <span class="meta-value">{{ detail?.description || '-' }}</span>
          </div>
        </div>

        <div class="toolbar">
          <Space size="small">
            <Button theme="default" variant="outline" @click="addEmptyField">新增字段</Button>
          </Space>
        </div>

        <Table
          row-key="__localId"
          :data="fields"
          :columns="columns"
          bordered
          stripe
          size="medium"
        >
          <template #fieldLabel="{ row }">
            <Input v-model="row.fieldLabel" placeholder="显示名称" />
          </template>
          <template #fieldName="{ row }">
            <Input v-model="row.fieldName" placeholder="英文标识" />
          </template>
          <template #fieldType="{ row }">
            <Select v-model="row.fieldType" style="width: 120px">
              <Option v-for="t in FieldType_CONSTANTS" :key="t" :value="t" :label="t" />
            </Select>
          </template>
          <template #required="{ row }">
            <Switch v-model="row.required" />
          </template>
          <template #visible="{ row }">
            <Switch v-model="row.visible" />
          </template>
          <template #editable="{ row }">
            <Switch v-model="row.editable" />
          </template>
          <template #searchable="{ row }">
            <Switch v-model="row.searchable" />
          </template>
          <template #sortOrder="{ row }">
            <Input v-model="row.sortOrder" type="number" placeholder="0" />
          </template>
          <template #actions="{ row }">
            <Button theme="danger" variant="outline" size="small" @click="removeField(row)">删除</Button>
          </template>
        </Table>
      </Card>
    </div>
  </WebLayout>
</template>

<style scoped>
.template-edit-page {
  padding: 24px;
  background: #f6f8fb;
  min-height: 100vh;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  color: #333;
}

.meta-row {
  display: flex;
  gap: 8px;
}

.meta-label {
  color: #666;
}

.toolbar {
  margin: 12px 0;
}
</style>
