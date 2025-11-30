<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@/utils/api'
import { showSuccess, showError, showLoading, hideLoading } from '@/utils/message'
import { BaseButton, BaseInput } from '@/components/base'
import type { LoginInput, RegisterInput } from '@/api/model/static'

const router = useRouter()
const route = useRoute()

// 判断当前是否为移动端路由
const isMobilePath = route.path.startsWith('/mobile')

// 表单模式：login 或 register
const mode = ref<'login' | 'register'>('login')

// 登录表单数据
const loginForm = ref<LoginInput>({
  username: '',
  password: '',
})

// 注册表单数据
const registerForm = ref<RegisterInput>({
  username: '',
  phone: '',
  password: '',
})

// 确认密码
const confirmPassword = ref('')

// 切换模式
const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  // 清空表单
  loginForm.value = { username: '', password: '' }
  registerForm.value = { username: '', phone: '', password: '' }
  confirmPassword.value = ''
}

// 处理登录
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    showError('请填写完整的登录信息')
    return
  }

  showLoading('登录中...')

  try {
    const response = await api.authService.login({
      input: loginForm.value,
    })

    hideLoading()

    // 保存 token
    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('user_id', response.id)
    localStorage.setItem('user_role', response.role)

    showSuccess('登录成功')

    // 跳转到首页（保持移动端/PC端路由）
    setTimeout(() => {
      router.push(isMobilePath ? '/mobile' : '/')
    }, 1000)
  } catch (error) {
    hideLoading()
    showError(error instanceof Error ? error.message : '登录失败')
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.password) {
    showError('请填写完整的注册信息')
    return
  }

  if (registerForm.value.password !== confirmPassword.value) {
    showError('两次输入的密码不一致')
    return
  }

  if (registerForm.value.password.length < 6) {
    showError('密码长度至少为6位')
    return
  }

  showLoading('注册中...')

  try {
    const response = await api.authService.register({
      input: registerForm.value,
    })

    hideLoading()

    // 保存 token
    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('user_id', response.id)
    localStorage.setItem('user_role', response.role)

    showSuccess('注册成功')

    // 跳转到首页（保持移动端/PC端路由）
    setTimeout(() => {
      router.push(isMobilePath ? '/mobile' : '/')
    }, 1000)
  } catch (error) {
    hideLoading()
    showError(error instanceof Error ? error.message : '注册失败')
  }
}
</script>

<template>
  <div class="auth-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
    <!-- PC端容器：限制为屏幕三分之一宽度 -->
    <div class="w-full" style="max-width: min(90vw, 480px);">
      <!-- 卡片容器 -->
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12">
        <!-- 标题 -->
        <div class="text-center mb-6 sm:mb-8">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {{ mode === 'login' ? '欢迎回来' : '创建账户' }}
          </h1>
          <p class="text-sm sm:text-base text-gray-500">
            {{ mode === 'login' ? '登录您的账户' : '注册新账户' }}
          </p>
        </div>

        <!-- 登录表单 -->
        <div v-if="mode === 'login'" class="space-y-6" style="padding: 0 20px;">
          <BaseInput
            v-model="loginForm.username"
            label="用户名"
            placeholder="请输入用户名"
          />
          <BaseInput
            v-model="loginForm.password"
            type="password"
            label="密码"
            placeholder="请输入密码"
          />

          <BaseButton
            type="primary"
            block
            class="mt-8 submit-btn"
            style="margin-bottom: 32px;"
            @click="handleLogin"
          >
            登录
          </BaseButton>
        </div>

        <!-- 注册表单 -->
        <div v-else class="space-y-6" style="padding: 0 20px;">
          <BaseInput
            v-model="registerForm.username"
            label="用户名"
            placeholder="请输入用户名"
          />
          <BaseInput
            v-model="registerForm.phone"
            type="tel"
            label="手机号"
            placeholder="请输入手机号（可选）"
          />
          <BaseInput
            v-model="registerForm.password"
            type="password"
            label="密码"
            placeholder="请输入密码（至少6位）"
          />
          <BaseInput
            v-model="confirmPassword"
            type="password"
            label="确认密码"
            placeholder="请再次输入密码"
          />

          <BaseButton
            type="primary"
            block
            class="mt-8 submit-btn"
            style="margin-bottom: 32px;"
            @click="handleRegister"
          >
            注册
          </BaseButton>
        </div>

        <!-- 切换模式 -->
        <div class="text-center" style="padding: 0 20px;">
          <span class="text-sm sm:text-base text-gray-600">
            {{ mode === 'login' ? '还没有账户？' : '已有账户？' }}
          </span>
          <button
            class="text-sm sm:text-base text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium ml-3 transition-colors underline underline-offset-4"
            @click="toggleMode"
          >
            {{ mode === 'login' ? '立即注册' : '立即登录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器样式 */
.auth-container {
  position: relative;
  overflow-x: hidden;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .auth-container {
    padding: 1rem;
  }
}

/* PC端优化 - 增强卡片样式 */
@media (min-width: 768px) {
  .bg-white.rounded-2xl {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
    /* 确保卡片不会超过480px */
    max-width: 480px;
    margin: 0 auto;
  }
}

/* 提交按钮额外样式 */
.submit-btn {
  margin-top: 1.5rem;
}

@media (min-width: 640px) {
  .submit-btn {
    margin-top: 2rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  button {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
