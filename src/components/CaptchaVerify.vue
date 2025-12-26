<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { Input as TInput, Button as TButton, Dialog as TDialog } from 'tdesign-vue-next'
import { CallIcon } from 'tdesign-icons-vue-next'
import { api } from '@/utils/api'
import { showError, showLoading, hideLoading } from '@/utils/message'

interface CaptchaVerifyProps {
  visible: boolean
  phone: string
  scene: string
}

interface CaptchaVerifyEmits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<CaptchaVerifyProps>()
const emit = defineEmits<CaptchaVerifyEmits>()

const verCode = ref('')
const verKey = ref('')
const captchaImageRaw = ref('')

const captchaImageSrc = computed(() => {
  const raw = captchaImageRaw.value
  if (!raw) {
    return ''
  }
  if (raw.startsWith('data:image')) {
    return raw
  }
  return `data:image/png;base64,${raw}`
})

const refreshCaptcha = async () => {
  try {
    const resp = await api.authService.captcha()
    verKey.value = resp.key || ''
    captchaImageRaw.value = resp.image || ''
    verCode.value = ''
  } catch (e) {
    console.error('获取验证码失败', e)
    showError('获取验证码失败，请稍后重试')
  }
}

const handleClose = () => {
  emit('update:visible', false)
  verCode.value = ''
}

const handleVerify = async () => {
  if (!verCode.value.trim()) {
    showError('请输入图形验证码')
    return
  }

  showLoading('验证中...')
  try {
    const result = await api.authService.verifyCaptcha({
      body: {
        verCode: verCode.value,
        verKey: verKey.value,
      },
    })

    if (!result.ok) {
      showError('图形验证码错误')
      await refreshCaptcha()
      return
    }

    hideLoading()
    emit('success')
    emit('update:visible', false)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '验证失败'
    showError(errorMessage)
    await refreshCaptcha()
  } finally {
    hideLoading()
  }
}

const handleOpen = () => {
  refreshCaptcha()
}

onUnmounted(() => {
  verCode.value = ''
  verKey.value = ''
  captchaImageRaw.value = ''
})
</script>

<template>
  <TDialog
    :visible="visible"
    header="图形验证"
    width="400px"
    :confirm-btn="null"
    :cancel-btn="null"
    :close-on-overlay-click="false"
    @close="handleClose"
    @opened="handleOpen"
  >
    <div class="captcha-verify-content">
      <div class="phone-info">
        <span class="label">手机号：</span>
        <span class="value">{{ phone }}</span>
      </div>

      <div class="captcha-input-row">
        <TInput
          v-model="verCode"
          size="large"
          clearable
          placeholder="请输入图形验证码"
          @enter="handleVerify"
        >
          <template #prefix-icon>
            <CallIcon />
          </template>
        </TInput>
      </div>

      <div class="captcha-image-row">
        <img
          v-if="captchaImageSrc"
          class="captcha-image"
          :src="captchaImageSrc"
          alt="captcha"
          @click="refreshCaptcha"
        />
        <span class="refresh-hint">点击图片刷新</span>
      </div>

      <div class="button-row">
        <TButton theme="default" variant="outline" block @click="handleClose">取消</TButton>
        <TButton theme="primary" block @click="handleVerify">确认</TButton>
      </div>
    </div>
  </TDialog>
</template>

<style scoped>
.captcha-verify-content {
  padding: 8px 0;
}

.phone-info {
  margin-bottom: 16px;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 14px;
}

.phone-info .label {
  color: #5f6672;
  font-weight: 500;
}

.phone-info .value {
  color: #1d1f23;
  font-weight: 600;
}

.captcha-input-row {
  margin-bottom: 16px;
}

.captcha-image-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.captcha-image {
  width: 160px;
  height: 60px;
  border-radius: 8px;
  border: 1px solid #e6e8ee;
  cursor: pointer;
  object-fit: contain;
  background: #fff;
  transition: all 0.2s;
}

.captcha-image:hover {
  border-color: #0052d9;
  box-shadow: 0 2px 8px rgba(0, 82, 217, 0.15);
}

.refresh-hint {
  margin-top: 8px;
  font-size: 12px;
  color: #8a8e99;
}

.button-row {
  display: flex;
  gap: 12px;
}
</style>
