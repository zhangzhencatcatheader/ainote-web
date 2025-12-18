/**
 * Tenant 管理工具
 * 用于处理多租户相关的操作
 */

import type { AuthResponse } from '@/api/model/static'

/**
 * 获取当前tenant ID
 */
export const getCurrentTenant = (): string | null => {
  return localStorage.getItem('auth_tenant')
}

/**
 * 设置当前tenant ID
 */
export const setCurrentTenant = (tenantId: string): void => {
  localStorage.setItem('auth_tenant', tenantId)
}

/**
 * 清除tenant信息
 */
export const clearTenant = (): void => {
  localStorage.removeItem('auth_tenant')
}

/**
 * 切换tenant
 * @param tenantId 新的tenant ID
 */
export const switchTenant = (tenantId: string): void => {
  setCurrentTenant(tenantId)
  // 可以在这里添加切换tenant后的其他处理，比如刷新页面数据
  window.location.reload()
}

/**
 * 检查是否有有效的tenant
 */
export const hasValidTenant = (): boolean => {
  const tenant = getCurrentTenant()
  return !!tenant
}

/**
 * 获取所有认证相关的信息
 */
export const getAuthInfo = () => {
  return {
    token: localStorage.getItem('auth_token'),
    userId: localStorage.getItem('user_id'),
    userRole: localStorage.getItem('user_role'),
    tenant: getCurrentTenant(),
  }
}

export const setAuthInfo = (auth: AuthResponse): void => {
  localStorage.setItem('auth_token', auth.token || '')
  localStorage.setItem('user_id', auth.id || '')
  localStorage.setItem('user_role', auth.role || 'user')
  if (auth.tenant) {
    setCurrentTenant(auth.tenant)
  } else {
    clearTenant()
  }
}

/**
 * 清除所有认证相关信息
 */
export const clearAuthInfo = (): void => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_id')
  localStorage.removeItem('user_role')
  clearTenant()
}