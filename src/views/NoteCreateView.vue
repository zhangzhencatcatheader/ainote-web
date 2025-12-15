<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Form, FormItem, Input, Space, Textarea, ImageViewer } from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'
import { api } from '@/utils/api'
import { showError, showSuccess } from '@/utils/message'
import { BrowseIcon } from 'tdesign-icons-vue-next'

const router = useRouter()

const loading = ref(false)

const imageFiles = ref<File[]>([])
const imageUrls = ref<string[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

const form = ref({
  title: '',
  content: '',
})

const handleSelectImages = (e: Event) => {
  const input = e.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []
  const existed = new Set(imageFiles.value.map((f) => `${f.name}__${f.size}__${f.lastModified}`))
  const appendedFiles: File[] = []
  const appendedUrls: string[] = []

  for (const f of files) {
    const key = `${f.name}__${f.size}__${f.lastModified}`
    if (existed.has(key)) continue
    existed.add(key)
    appendedFiles.push(f)
    appendedUrls.push(URL.createObjectURL(f))
  }

  imageFiles.value = [...imageFiles.value, ...appendedFiles]
  imageUrls.value = [...imageUrls.value, ...appendedUrls]
}

const openFilePicker = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  fileInputRef.value?.click()
}

const handleSubmit = async () => {
  if (!form.value.title.trim()) {
    showError('请填写标题')
    return
  }

  loading.value = true
  try {
    const filesIds: string[] = []
    for (const file of imageFiles.value) {
      const uploaded = await api.ossService.uploadFile({
        folder: 'note',
        body: { file },
      })
      if (uploaded?.id) {
        filesIds.push(uploaded.id)
      }
    }

    const id = await api.noteService.add({
      body: {
        title: form.value.title.trim(),
        content: form.value.content || undefined,
        filesIds,
        aboutAccountIds: [],
      },
    })

    showSuccess('创建成功')
    router.replace(`/notes/${id}`)
  } catch (e) {
    console.error('创建笔记失败', e)
    showError('创建笔记失败，请稍后再试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <WebLayout>
    <div class="note-create-page">
      <Card title="新建笔记" bordered hover-shadow>
        <Form label-width="80px">
          <FormItem label="标题" required>
            <Input v-model="form.title" placeholder="请输入标题" />
          </FormItem>
          <FormItem label="内容">
            <Textarea v-model="form.content" placeholder="请输入内容" :autosize="{ minRows: 6, maxRows: 18 }" />
          </FormItem>
          <FormItem label="图片">
            <div class="upload-wrap">
              <input
                ref="fileInputRef"
                class="file-input"
                type="file"
                accept="image/*"
                multiple
                @change="handleSelectImages"
              />
              <Space size="small">
                <Button theme="default" variant="outline" @click="openFilePicker">选择图片</Button>
                <span v-if="imageFiles.length" class="upload-tip">已选择 {{ imageFiles.length }} 张</span>
              </Space>

              <div v-if="imageUrls.length" class="image-wall">
                <ImageViewer
                  v-for="(img, index) in imageUrls"
                  :key="img"
                  :default-index="index"
                  :images="imageUrls"
                  :z-index="10000"
                >
                  <template #trigger="{ open }">
                    <div class="img-item">
                      <img alt="image" :src="img" class="img-item__img" />
                      <div class="img-item__hover" @click="open(index)">
                        <span class="img-item__hover-text"><BrowseIcon size="1.4em" /> 预览</span>
                      </div>
                    </div>
                  </template>
                </ImageViewer>
              </div>
            </div>
          </FormItem>
        </Form>

        <div class="footer">
          <Space>
            <Button theme="default" variant="outline" @click="router.back()">取消</Button>
            <Button theme="primary" :loading="loading" @click="handleSubmit">保存</Button>
          </Space>
        </div>
      </Card>
    </div>
  </WebLayout>
</template>

<style scoped>
.note-create-page {
  padding: 24px;
  background: #f6f8fb;
  min-height: 100vh;
}

.footer {
  padding-top: 12px;
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

.image-wall {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.img-item {
  width: 160px;
  height: 160px;
  display: inline-flex;
  position: relative;
  justify-content: center;
  align-items: center;
  border-radius: var(--td-radius-medium);
  overflow: hidden;
  border: 4px solid var(--td-bg-color-secondarycontainer);
}

.img-item__hover {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: var(--td-text-color-anti);
  line-height: 22px;
  transition: 0.2s;
}

.img-item:hover .img-item__hover {
  opacity: 1;
  cursor: pointer;
}

.img-item__img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
  position: absolute;
}

.img-item__hover-text {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}
</style>
