<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Form as TForm, FormItem as TFormItem, Input as TInput, Button as TButton } from 'tdesign-vue-next'
import { UserIcon, LockOnIcon, CallIcon } from 'tdesign-icons-vue-next'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'
import { api } from '@/utils/api'
import { showSuccess, showError, showLoading, hideLoading } from '@/utils/message'
import type { LoginInput, RegisterInput } from '@/api/model/static'

type LoginFormModel = {
  username: LoginInput['username']
  password: LoginInput['password']
}

type RegisterFormModel = {
  username: RegisterInput['username']
  phone?: RegisterInput['phone']
  password: RegisterInput['password']
  confirmPassword: string
}

const router = useRouter()
const mode = ref<'login' | 'register'>('login')
const loginFormRef = ref<FormInstanceFunctions>()
const registerFormRef = ref<FormInstanceFunctions>()

const loginForm = reactive<LoginFormModel>({
  username: '',
  password: '',
})

const registerForm = reactive<RegisterFormModel>({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const loginRules: FormProps['rules'] = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
}

const registerRules: FormProps['rules'] = {
  username: [{ required: true, message: '请输入用户名' }],
  phone: [
    {
      validator: (val: string) => !val || /^1\d{10}$/.test(val),
      message: '请输入有效手机号',
      trigger: 'blur',
    },
  ],
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
  registerForm.username = ''
  registerForm.phone = ''
  registerForm.password = ''
  registerForm.confirmPassword = ''
  loginFormRef.value?.reset()
  registerFormRef.value?.reset()
}

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  resetForms()
}

const handleLogin = async () => {
  showLoading('登录中...')

  try {
    const response = await api.authService.login({
      input: loginForm,
    })

    if (!response || !response.token) {
      throw new Error('登录响应格式错误')
    }

    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('user_id', response.id || '')
    localStorage.setItem('user_role', response.role || 'user')
    if (response.tenant) {
      localStorage.setItem('auth_tenant', response.tenant)
    }

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
    const { username, phone, password } = registerForm
    const response = await api.authService.register({
      input: { username, phone, password },
    })

    if (!response || !response.token) {
      throw new Error('注册响应格式错误')
    }

    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('user_id', response.id || '')
    localStorage.setItem('user_role', response.role || 'user')
    if (response.tenant) {
      localStorage.setItem('auth_tenant', response.tenant)
    }

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

const onRegisterSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
  if (validateResult === true) {
    await handleRegister()
  } else {
    showError(firstError || '请完善注册信息')
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>{{ mode === 'login' ? '欢迎回来' : '创建账户' }}</h1>
        <p>{{ mode === 'login' ? '登录您的账户' : '注册新账户' }}</p>
      </div>

      <div class="form-wrapper">
        <TForm
          v-if="mode === 'login'"
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
            <TInput v-model="registerForm.phone" size="large" type="tel" clearable placeholder="请输入手机号（可选）">
              <template #prefix-icon>
                <CallIcon />
              </template>
            </TInput>
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
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
  transition: color 0.2s ease;
}

.switcher-link:hover {
  color: #0631ad;
}

.form-wrapper {
  width: 360px;
  max-width: 100%;
  margin: 0 auto;
}

.submit-button {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}
</style>
