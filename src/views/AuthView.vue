<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { api } from '@/utils/api'
import type { LoginInput, RegisterInput } from '@/api/model/static'

const router = useRouter()

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
    showToast('请填写完整的登录信息')
    return
  }

  showLoadingToast({
    message: '登录中...',
    forbidClick: true,
    duration: 0,
  })

  try {
    const response = await api.authService.login({
      input: loginForm.value,
    })

    closeToast()

    // 保存 token
    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('user_id', response.id)
    localStorage.setItem('user_role', response.role)

    showToast({
      message: '登录成功',
      type: 'success',
    })

    // 跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    closeToast()
    showToast({
      message: error instanceof Error ? error.message : '登录失败',
      type: 'fail',
    })
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.password) {
    showToast('请填写完整的注册信息')
    return
  }

  if (registerForm.value.password !== confirmPassword.value) {
    showToast('两次输入的密码不一致')
    return
  }

  if (registerForm.value.password.length < 6) {
    showToast('密码长度至少为6位')
    return
  }

  showLoadingToast({
    message: '注册中...',
    forbidClick: true,
    duration: 0,
  })

  try {
    const response = await api.authService.register({
      input: registerForm.value,
    })

    closeToast()

    // 保存 token
    localStorage.setItem('auth_token', response.token)
    localStorage.setItem('user_id', response.id)
    localStorage.setItem('user_role', response.role)

    showToast({
      message: '注册成功',
      type: 'success',
    })

    // 跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    closeToast()
    showToast({
      message: error instanceof Error ? error.message : '注册失败',
      type: 'fail',
    })
  }
}
</script>

<template>
  <div class="auth-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
    <div class="w-full max-w-md mx-auto">
      <!-- 卡片容器 -->
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
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
        <div v-if="mode === 'login'" class="space-y-4">
          <van-cell-group inset class="form-group">
            <van-field
              v-model="loginForm.username"
              label="用户名"
              placeholder="请输入用户名"
              clearable
              size="large"
            />
            <van-field
              v-model="loginForm.password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              clearable
              size="large"
            />
          </van-cell-group>

          <van-button
            type="primary"
            block
            round
            class="mt-6 submit-btn"
            @click="handleLogin"
          >
            登录
          </van-button>
        </div>

        <!-- 注册表单 -->
        <div v-else class="space-y-4">
          <van-cell-group inset class="form-group">
            <van-field
              v-model="registerForm.username"
              label="用户名"
              placeholder="请输入用户名"
              clearable
              size="large"
            />
            <van-field
              v-model="registerForm.phone"
              label="手机号"
              placeholder="请输入手机号（可选）"
              clearable
              size="large"
            />
            <van-field
              v-model="registerForm.password"
              type="password"
              label="密码"
              placeholder="请输入密码（至少6位）"
              clearable
              size="large"
            />
            <van-field
              v-model="confirmPassword"
              type="password"
              label="确认密码"
              placeholder="请再次输入密码"
              clearable
              size="large"
            />
          </van-cell-group>

          <van-button
            type="primary"
            block
            round
            class="mt-6 submit-btn"
            @click="handleRegister"
          >
            注册
          </van-button>
        </div>

        <!-- 切换模式 -->
        <div class="mt-6 sm:mt-8 text-center">
          <span class="text-sm sm:text-base text-gray-600">
            {{ mode === 'login' ? '还没有账户？' : '已有账户？' }}
          </span>
          <button
            class="text-sm sm:text-base text-blue-600 hover:text-blue-700 active:text-blue-800 font-medium ml-2 transition-colors"
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

/* Vant 组件样式覆盖 */
:deep(.van-cell-group) {
  margin: 0;
  overflow: hidden;
}

:deep(.form-group) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.van-field) {
  padding: 14px 16px;
  font-size: 15px;
}

/* 移动端字段样式 */
@media (max-width: 640px) {
  :deep(.van-field) {
    padding: 12px 14px;
    font-size: 14px;
  }
  
  :deep(.van-field__label) {
    font-size: 14px;
    width: 70px;
  }
}

/* 电脑端字段样式 */
@media (min-width: 768px) {
  :deep(.van-field) {
    padding: 16px 20px;
    font-size: 16px;
  }
  
  :deep(.van-field__label) {
    font-size: 15px;
    width: 90px;
  }
}

/* 按钮样式 */
:deep(.van-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.van-button--primary:active) {
  background: linear-gradient(135deg, #5a67d8 0%, #6b3f95 100%);
  transform: scale(0.98);
}

/* 移动端按钮 */
@media (max-width: 640px) {
  :deep(.van-button--primary) {
    height: 44px;
    font-size: 15px;
  }
}

/* 电脑端按钮 */
@media (min-width: 768px) {
  :deep(.van-button--primary) {
    height: 52px;
    font-size: 17px;
  }
  
  :deep(.van-button--primary:hover) {
    background: linear-gradient(135deg, #5a67d8 0%, #6b3f95 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transform: translateY(-1px);
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

/* 输入框焦点效果 */
:deep(.van-field__control:focus) {
  outline: none;
}

:deep(.van-cell--clickable:active) {
  background-color: #f7f8fa;
}

/* 清除按钮样式优化 */
:deep(.van-field__clear) {
  padding: 0 8px;
}

/* 响应式卡片阴影 */
@media (min-width: 768px) {
  .bg-white.rounded-2xl {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  :deep(.van-button) {
    -webkit-tap-highlight-color: transparent;
  }
  
  button {
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
