import type { Executor } from '@/api'
import { clearAuthInfo } from './tenant'

/**
 * HTTP 请求配置
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

/**
 * HTTP Executor 实现
 * 用于执行实际的 HTTP 请求
 */
export const httpExecutor: Executor = async ({ uri, method, headers, body }) => {
  const url = `${API_BASE_URL}${uri}`
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // 从 localStorage 获取 token
  const token = localStorage.getItem('auth_token')
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  // 从 localStorage 获取 tenant
  const tenant = localStorage.getItem('auth_tenant')
  if (tenant) {
    requestHeaders['X-Tenant-ID'] = tenant
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, config)
    
    // 处理 401 未授权错误
    if (response.status === 401) {
      // 清除认证信息
      clearAuthInfo()
      // 跳转到登录页
      const currentPath = window.location.pathname
      if (currentPath !== '/auth' && currentPath !== '/mobile/auth') {
        window.location.href = '/auth'
      }
      throw new Error('未授权访问，请重新登录')
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      // 处理结构化错误响应
      if (errorData.family && errorData.code) {
        // 根据错误类型返回用户友好的消息
        let message = '操作失败'
        switch (errorData.code) {
          case 'USERNAME_DOES_NOT_EXIST':
            message = '用户名不存在'
            break
          case 'PASSWORD_IS_ERROR':
            message = '密码错误'
            break
          case 'USERNAME_ALREADY_EXISTS':
            message = '用户名已存在'
            break
          case 'UNAUTHORIZED':
            message = '未授权访问'
            // 如果是 UNAUTHORIZED 错误码，也清除认证信息并跳转
            clearAuthInfo()
            const currentPath = window.location.pathname
            if (currentPath !== '/auth' && currentPath !== '/mobile/auth') {
              window.location.href = '/auth'
            }
            break
          default:
            message = errorData.message || `操作失败 (${errorData.code})`
        }
        throw new Error(message)
      }

      // 处理普通错误响应
      throw new Error(errorData.message || `HTTP Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('HTTP Request Error:', error)
    throw error
  }
}
