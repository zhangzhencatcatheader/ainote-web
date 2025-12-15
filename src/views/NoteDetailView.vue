<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button, Card, Descriptions, DescriptionsItem, Space } from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'
import { api } from '@/utils/api'
import { showError } from '@/utils/message'

type NoteDetail = {
  id: string
  title: string
  content?: string
  createdTime: string
  modifiedTime: string
}

const route = useRoute()
const router = useRouter()

const noteId = computed(() => route.params.id as string)

const loading = ref(false)
const note = ref<NoteDetail | null>(null)

const fetchDetail = async () => {
  if (!noteId.value) return

  loading.value = true
  try {
    const res = await api.noteService.get({ id: noteId.value })
    note.value = res as unknown as NoteDetail
  } catch (e) {
    console.error('获取笔记详情失败', e)
    showError('获取笔记详情失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

watch(noteId, () => {
  fetchDetail()
})

onMounted(() => {
  fetchDetail()
})
</script>

<template>
  <WebLayout>
    <div class="note-detail-page">
      <Card :title="note?.title || '笔记详情'" bordered hover-shadow :loading="loading">
        <template #actions>
          <Space size="small">
            <Button theme="default" variant="outline" @click="router.push('/notes')">返回列表</Button>
          </Space>
        </template>

        <Descriptions v-if="note" bordered size="medium" :column="2">
          <DescriptionsItem label="ID">{{ note.id }}</DescriptionsItem>
          <DescriptionsItem label="标题">{{ note.title }}</DescriptionsItem>
          <DescriptionsItem label="创建时间">{{ note.createdTime }}</DescriptionsItem>
          <DescriptionsItem label="更新时间">{{ note.modifiedTime }}</DescriptionsItem>
        </Descriptions>

        <div v-if="note" class="content">
          <div class="content-title">内容</div>
          <pre class="content-body">{{ note.content || '-' }}</pre>
        </div>
      </Card>
    </div>
  </WebLayout>
</template>

<style scoped>
.note-detail-page {
  padding: 24px;
  background: #f6f8fb;
  min-height: 100vh;
}

.content {
  margin-top: 16px;
}

.content-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.content-body {
  white-space: pre-wrap;
  word-break: break-word;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  margin: 0;
}
</style>
