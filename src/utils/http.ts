import type { Executor } from '@/api'

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

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('HTTP Request Error:', error)
    throw error
  }
}
