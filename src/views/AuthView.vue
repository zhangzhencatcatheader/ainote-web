<script setup lang="ts">
import { reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form as TForm, FormItem as TFormItem, Input as TInput, Button as TButton } from 'tdesign-vue-next'
import { UserIcon, LockOnIcon, CallIcon } from 'tdesign-icons-vue-next'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'
import { api } from '@/utils/api'
import { showSuccess, showError, showLoading, hideLoading } from '@/utils/message'
import type { LoginInput, RegisterInput, SmsLoginInput } from '@/api/model/static'
import { setAuthInfo } from '@/utils/tenant'
import CaptchaVerify from '@/components/CaptchaVerify.vue'

type LoginFormModel = {
  username: LoginInput['username']
  password: LoginInput['password']
  verCode: LoginInput['verCode']
  verKey: LoginInput['verKey']
}

const handleSmsLogin = async () => {
  showLoading('登录中...')

  try {
    const response = await api.authService.smsLogin({
      body: {
        phone: smsLoginForm.phone,
        code: smsLoginForm.code,
        scene: SMS_LOGIN_SCENE,
      },
    })

    if (!response || !response.token) {
      throw new Error('登录响应格式错误')
    }

    setAuthInfo(response)

    showSuccess('登录成功')
    await router.push('/')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '登录失败'
    showError(errorMessage)
  } finally {
    hideLoading()
  }
}

type RegisterFormModel = {
  username: RegisterInput['username']
  phone: RegisterInput['phone']
  code: RegisterInput['code']
  password: RegisterInput['password']
  confirmPassword: string
}

const router = useRouter()
const mode = ref<'login' | 'register'>('login')
const loginType = ref<'password' | 'sms'>('password')
const loginFormRef = ref<FormInstanceFunctions>()
const registerFormRef = ref<FormInstanceFunctions>()
const smsLoginFormRef = ref<FormInstanceFunctions>()

const showCaptchaDialog = ref(false)
const captchaPhone = ref('')
const captchaScene = ref<'LOGIN' | 'REGISTER'>('LOGIN')

const loginForm = reactive<LoginFormModel>({
  username: '',
  password: '',
  verCode: '',
  verKey: '',
})

const registerForm = reactive<RegisterFormModel>({
  username: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
})

type SmsLoginFormModel = {
  phone: SmsLoginInput['phone']
  code: SmsLoginInput['code']
}

const SMS_LOGIN_SCENE: SmsLoginInput['scene'] = 'LOGIN'
const SMS_REGISTER_SCENE: RegisterInput['scene'] = 'REGISTER'

const smsLoginForm = reactive<SmsLoginFormModel>({
  phone: '',
  code: '',
})

const smsCountdown = ref(0)
const registerSmsCountdown = ref(0)
let smsTimer: number | undefined
let registerSmsTimer: number | undefined

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
    loginForm.verKey = resp.key || ''
    captchaImageRaw.value = resp.image || ''
    loginForm.verCode = ''
  } catch (e) {
    console.error('获取验证码失败', e)
    showError('获取验证码失败，请稍后重试')
  }
}

const loginRules: FormProps['rules'] = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
  verCode: [{ required: true, message: '请输入验证码' }],
}

const smsLoginRules: FormProps['rules'] = {
  phone: [
    { required: true, message: '请输入手机号' },
    {
      validator: (val: string) => /^1\d{10}$/.test(val),
      message: '请输入有效手机号',
      trigger: 'blur',
    },
  ],
  code: [{ required: true, message: '请输入短信验证码' }],
}

const registerRules: FormProps['rules'] = {
  username: [{ required: true, message: '请输入用户名' }],
  phone: [
    { required: true, message: '请输入手机号' },
    {
      validator: (val: string) => /^1\d{10}$/.test(val),
      message: '请输入有效手机号',
      trigger: 'blur',
    },
  ],
  code: [{ required: true, message: '请输入短信验证码' }],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6位' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码' },
    {
      validator: (val: string) => val === registerForm.password,
      message: '两次输入的密码不一致',
      trigger: 'blur',
    },
  ],
}

const resetForms = () => {
  loginForm.username = ''
  loginForm.password = ''
  loginForm.verCode = ''
  loginForm.verKey = ''
  smsLoginForm.phone = ''
  smsLoginForm.code = ''
  registerForm.username = ''
  registerForm.phone = ''
  registerForm.code = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  loginFormRef.value?.reset()
  smsLoginFormRef.value?.reset()
  registerFormRef.value?.reset()
}

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  resetForms()
}

const setCountdown = (seconds: number) => {
  smsCountdown.value = seconds
  if (smsTimer) {
    window.clearInterval(smsTimer)
    smsTimer = undefined
  }
  if (seconds <= 0) return
  smsTimer = window.setInterval(() => {
    smsCountdown.value -= 1
    if (smsCountdown.value <= 0 && smsTimer) {
      window.clearInterval(smsTimer)
      smsTimer = undefined
    }
  }, 1000)
}

const setRegisterCountdown = (seconds: number) => {
  registerSmsCountdown.value = seconds
  if (registerSmsTimer) {
    window.clearInterval(registerSmsTimer)
    registerSmsTimer = undefined
  }
  if (seconds <= 0) return
  registerSmsTimer = window.setInterval(() => {
    registerSmsCountdown.value -= 1
    if (registerSmsCountdown.value <= 0 && registerSmsTimer) {
      window.clearInterval(registerSmsTimer)
      registerSmsTimer = undefined
    }
  }, 1000)
}

const handleSendSms = () => {
  const phone = (smsLoginForm.phone || '').trim()
  if (!/^1\d{10}$/.test(phone)) {
    showError('请先输入正确的手机号')
    return
  }

  if (smsCountdown.value > 0) {
    return
  }

  captchaPhone.value = phone
  captchaScene.value = 'LOGIN'
  showCaptchaDialog.value = true
}

const handleSendRegisterSms = () => {
  const phone = (registerForm.phone || '').trim()
  if (!/^1\d{10}$/.test(phone)) {
    showError('请先输入正确的手机号')
    return
  }

  if (registerSmsCountdown.value > 0) {
    return
  }

  captchaPhone.value = phone
  captchaScene.value = 'REGISTER'
  showCaptchaDialog.value = true
}

const handleLogin = async () => {
  showLoading('登录中...')

  try {
    const response = await api.authService.login({
      body: loginForm,
    })

    if (!response || !response.token) {
      throw new Error('登录响应格式错误')
    }

    setAuthInfo(response)

    showSuccess('登录成功')
    await router.push('/')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '登录失败'
    showError(errorMessage)
  } finally {
    hideLoading()
  }
}

const handleRegister = async () => {
  showLoading('注册中...')

  try {
    const { username, phone, code, password } = registerForm
    const response = await api.authService.register({
      body: { username, phone, code, password, scene: SMS_REGISTER_SCENE },
    })

    if (!response || !response.token) {
      throw new Error('注册响应格式错误')
    }

    setAuthInfo(response)

    showSuccess('注册成功')
    await router.push('/')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '注册失败'
    showError(errorMessage)
  } finally {
    hideLoading()
  }
}

const onLoginSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    await handleLogin()
  } else {
    showError(firstError || '请完善登录信息')
  }
}

const onSmsLoginSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    await handleSmsLogin()
  } else {
    showError(firstError || '请完善登录信息')
  }
}

const onRegisterSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    await handleRegister()
  } else {
    showError(firstError || '请完善注册信息')
  }
}

const handleCaptchaSuccess = async () => {
  showLoading('发送中...')
  try {
    await api.authService.sendSms({
      body: {
        phone: captchaPhone.value,
        scene: captchaScene.value,
      },
    })
    showSuccess('验证码已发送')
    if (captchaScene.value === 'LOGIN') {
      setCountdown(60)
    } else {
      setRegisterCountdown(60)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '发送失败'
    showError(errorMessage)
  } finally {
    hideLoading()
  }
}

onMounted(() => {
  refreshCaptcha()
})

onUnmounted(() => {
  if (smsTimer) {
    window.clearInterval(smsTimer)
    smsTimer = undefined
  }
  if (registerSmsTimer) {
    window.clearInterval(registerSmsTimer)
    registerSmsTimer = undefined
  }
})
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>{{ mode === 'login' ? '欢迎回来' : '创建账户' }}</h1>
        <p>{{ mode === 'login' ? '登录您的账户' : '注册新账户' }}</p>
      </div>

      <div class="form-wrapper">
        <div v-if="mode === 'login'" class="login-type-switch">
          <TButton variant="text" :theme="loginType === 'password' ? 'primary' : 'default'" @click="loginType = 'password'">密码登录</TButton>
          <TButton variant="text" :theme="loginType === 'sms' ? 'primary' : 'default'" @click="loginType = 'sms'">短信登录</TButton>
        </div>

        <TForm
          v-if="mode === 'login' && loginType === 'password'"
          ref="loginFormRef"
          :data="loginForm"
          :rules="loginRules"
          colon
          :label-width="0"
          :show-error-message="true"
          @submit="onLoginSubmit"
        >
          <TFormItem name="username">
            <TInput v-model="loginForm.username" size="large" clearable placeholder="请输入用户名">
              <template #prefix-icon>
                <UserIcon />
              </template>
            </TInput>
          </TFormItem>

          <TFormItem name="password">
            <TInput v-model="loginForm.password" size="large" type="password" clearable placeholder="请输入密码">
              <template #prefix-icon>
                <LockOnIcon />
              </template>
            </TInput>
          </TFormItem>

          <TFormItem name="verCode">
            <div class="captcha-row">
              <TInput v-model="loginForm.verCode" size="large" clearable placeholder="请输入验证码">
                <template #prefix-icon>
                  <CallIcon />
                </template>
              </TInput>
              <img v-if="captchaImageSrc" class="captcha-image" :src="captchaImageSrc" alt="captcha" @click="refreshCaptcha" />
            </div>
          </TFormItem>

          <TFormItem>
            <TButton class="submit-button" theme="primary" type="submit" size="large" block>登录</TButton>
          </TFormItem>
        </TForm>

        <TForm
          v-else-if="mode === 'login' && loginType === 'sms'"
          ref="smsLoginFormRef"
          :data="smsLoginForm"
          :rules="smsLoginRules"
          colon
          :label-width="0"
          :show-error-message="true"
          @submit="onSmsLoginSubmit"
        >
          <TFormItem name="phone">
            <TInput v-model="smsLoginForm.phone" size="large" type="tel" clearable placeholder="请输入手机号">
              <template #prefix-icon>
                <CallIcon />
              </template>
            </TInput>
          </TFormItem>

          <TFormItem name="code">
            <div class="sms-row">
              <TInput v-model="smsLoginForm.code" size="large" clearable placeholder="请输入短信验证码" />
              <TButton class="sms-button" variant="outline" :disabled="smsCountdown > 0" @click="handleSendSms">
                {{ smsCountdown > 0 ? `${smsCountdown}s` : '发送验证码' }}
              </TButton>
            </div>
          </TFormItem>

          <TFormItem>
            <TButton class="submit-button" theme="primary" type="submit" size="large" block>登录</TButton>
          </TFormItem>
        </TForm>

        <TForm
          v-else
          ref="registerFormRef"
          :data="registerForm"
          :rules="registerRules"
          colon
          :label-width="0"
          :show-error-message="true"
          @submit="onRegisterSubmit"
        >
          <TFormItem name="username">
            <TInput v-model="registerForm.username" size="large" clearable placeholder="请输入用户名">
              <template #prefix-icon>
                <UserIcon />
              </template>
            </TInput>
          </TFormItem>

          <TFormItem name="phone">
            <TInput v-model="registerForm.phone" size="large" type="tel" clearable placeholder="请输入手机号">
              <template #prefix-icon>
                <CallIcon />
              </template>
            </TInput>
          </TFormItem>

          <TFormItem name="code">
            <div class="sms-row">
              <TInput v-model="registerForm.code" size="large" clearable placeholder="请输入短信验证码" />
              <TButton class="sms-button" variant="outline" :disabled="registerSmsCountdown > 0" @click="handleSendRegisterSms">
                {{ registerSmsCountdown > 0 ? `${registerSmsCountdown}s` : '发送验证码' }}
              </TButton>
            </div>
          </TFormItem>

          <TFormItem name="password">
            <TInput
              v-model="registerForm.password"
              size="large"
              type="password"
              clearable
              placeholder="请输入密码（至少6位）"
            >
              <template #prefix-icon>
                <LockOnIcon />
              </template>
            </TInput>
          </TFormItem>

          <TFormItem name="confirmPassword">
            <TInput
              v-model="registerForm.confirmPassword"
              size="large"
              type="password"
              clearable
              placeholder="请再次输入密码"
            >
              <template #prefix-icon>
                <LockOnIcon />
              </template>
            </TInput>
          </TFormItem>

          <TFormItem>
            <TButton class="submit-button" theme="primary" type="submit" size="large" block>注册</TButton>
          </TFormItem>
        </TForm>
      </div>

      <div class="switcher">
        <span>{{ mode === 'login' ? '还没有账户？' : '已有账户？' }}</span>
        <a class="switcher-link" href="#" @click.prevent="toggleMode">
          {{ mode === 'login' ? '立即注册' : '立即登录' }}
        </a>
      </div>
    </div>

    <CaptchaVerify
      v-model:visible="showCaptchaDialog"
      :phone="captchaPhone"
      :scene="captchaScene"
      @success="handleCaptchaSuccess"
    />
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: linear-gradient(135deg, #e8f0ff 0%, #eef2ff 50%, #f7f9ff 100%);
}

.auth-card {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(24, 41, 82, 0.14);
  padding: 32px 28px 24px;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: #1d1f23;
  margin-bottom: 8px;
}

.auth-header p {
  color: #5f6672;
  font-size: 14px;
}

.switcher {
  margin-top: 12px;
  text-align: center;
  color: #5f6672;
  font-size: 14px;
}

.switcher-link {
  margin-left: 8px;
  color: #0052d9;
  font-weight: 600;
  text-decoration: none;
}

.captcha-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.sms-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.sms-button {
  width: 110px;
  height: 40px;
}

.captcha-image {
  width: 110px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e6e8ee;
  cursor: pointer;
  object-fit: contain;
  background: #fff;
}

.switcher-link:hover {
  color: #0631ad;
}

.form-wrapper {
  width: 360px;
  max-width: 100%;
  margin: 0 auto;
}

.login-type-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  gap: 8px;
}

.submit-button {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}
</style>
