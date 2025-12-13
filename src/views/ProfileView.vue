<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  Form,
  FormItem,
  Input,
  Button,
  Space,
  Avatar,
  Upload,
} from 'tdesign-vue-next'
import type { UploadFile, RequestMethodResponse, SuccessContext } from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'
import { api } from '@/utils/api'
import { showError, showSuccess } from '@/utils/message'
import type { UpdateInput } from '@/api/model/static/UpdateInput'
import type { Dynamic_StaticFile } from '@/api/model/dynamic/Dynamic_StaticFile'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const uploadLoading = ref(false)

const formData = ref<UpdateInput>({
  username: '',
  phone: '',
  accountCompanies: [],
})

const avatarUrl = ref<string>('')
const avatarFileId = ref<string>('')

// 构建文件访问URL，优先使用后端返回的完整路径
const buildFileUrl = (fileId?: string, filePath?: string): string => {
  if (filePath) return filePath
  if (!fileId) return ''
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  return `${API_BASE_URL}/file/${fileId}`
}

// 获取用户信息
const fetchUserInfo = async (force = false) => {
  loading.value = true
  try {
    const data = await userStore.fetchProfile(force)
    if (!data) return

    formData.value = {
      id: data.id,
      username: data.username,
      phone: data.phone || '',
      accountCompanies: data.accountCompanies.map((ac) => ({
        companyId: ac.company.id,
        role: ac.role,
      })),
    }

    avatarFileId.value = data.avatar?.id || ''
    avatarUrl.value = buildFileUrl(data.avatar?.id, data.avatar?.filePath)
    userStore.setProfile(data)
  } catch (error) {
    console.error('获取用户信息失败', error)
    showError('获取用户信息失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 头像上传请求
const handleAvatarUpload = async (files: UploadFile | UploadFile[]): Promise<RequestMethodResponse> => {
  uploadLoading.value = true
  try {
    const file = Array.isArray(files) ? files[0] : files
    if (!file || !file.raw) {
      throw new Error('文件不存在')
    }
    
    const result = await api.ossService.uploadFile({
      folder: 'avatars',
      body: { file: file.raw },
    })
    
    if (result.id) {
      avatarFileId.value = result.id
      avatarUrl.value = buildFileUrl(result.id, result.filePath)
    }
    
    uploadLoading.value = false
    return {
      status: 'success',
      response: result,
    }
  } catch (error) {
    uploadLoading.value = false
    console.error('头像上传失败', error)
    showError('头像上传失败，请稍后重试')
    return {
      status: 'fail',
      response: {},
      error: error instanceof Error ? error.message : '上传失败',
    }
  }
}

// 头像上传成功回调
const handleAvatarSuccess = (context: SuccessContext) => {
  const response = context.response as Dynamic_StaticFile | undefined
  if (response?.id) {
    avatarFileId.value = response.id
    avatarUrl.value = buildFileUrl(response.id, response.filePath)
    showSuccess('头像上传成功')
  }
}

// 保存个人信息
const handleSave = async () => {
  if (!formData.value.username.trim()) {
    showError('请输入用户名')
    return
  }

  loading.value = true
  try {
    await api.accountService.update({
      body: {
        id: formData.value.id,
        username: formData.value.username,
        phone: formData.value.phone || undefined,
        avatarId: avatarFileId.value || undefined,
        accountCompanies: formData.value.accountCompanies,
      },
    })
    showSuccess('保存成功')
    // 更新本地存储的用户名
    localStorage.setItem('user_name', formData.value.username)
    // 刷新用户信息
    await fetchUserInfo(true)
  } catch (error) {
    console.error('保存失败', error)
    showError(error instanceof Error ? error.message : '保存失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 取消
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<template>
  <WebLayout>
    <div class="profile-page">
      <Card title="个人信息" bordered hover-shadow>
        <Form :data="formData" label-width="100px">
          <FormItem label="头像">
            <Space size="medium" align="center">
              <Avatar :size="'80px'" :image="avatarUrl" v-if="avatarUrl">
                {{ formData.username?.substring(0, 1).toUpperCase() }}
              </Avatar>
              <Avatar :size="'80px'" v-else>
                {{ formData.username?.substring(0, 1).toUpperCase() }}
              </Avatar>
              <Upload
                :request-method="handleAvatarUpload"
                :loading="uploadLoading"
                accept="image/*"
                :max="1"
                :auto-upload="true"
                @success="handleAvatarSuccess"
              >
                <Button theme="primary" variant="outline" :loading="uploadLoading">
                  上传头像
                </Button>
              </Upload>
            </Space>
          </FormItem>

          <FormItem label="用户名" required>
            <Input v-model="formData.username" placeholder="请输入用户名" clearable />
          </FormItem>

          <FormItem label="手机号">
            <Input v-model="formData.phone" placeholder="请输入手机号" clearable />
          </FormItem>

          <FormItem>
            <Space>
              <Button theme="primary" :loading="loading" @click="handleSave">保存</Button>
              <Button theme="default" @click="handleCancel">取消</Button>
            </Space>
          </FormItem>
        </Form>
      </Card>
    </div>
  </WebLayout>
</template>

<style scoped>
.profile-page {
  padding: 24px;
  background: #f6f8fb;
  min-height: 100vh;
}
</style>
