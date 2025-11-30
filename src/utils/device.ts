import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 设备类型
 */
export const DeviceType = {
  MOBILE: 'mobile',
  DESKTOP: 'desktop',
} as const

export type DeviceType = typeof DeviceType[keyof typeof DeviceType]

/**
 * 判断是否为移动设备
 * 基于路由路径判断：/mobile 开头的路由为移动端
 */
export function isMobileDevice(): boolean {
  // 在非 Vue 组件上下文中，通过 URL 判断
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    return path.startsWith('/mobile')
  }
  return false
}

/**
 * 获取当前设备类型
 */
export function getDeviceType(): DeviceType {
  return isMobileDevice() ? DeviceType.MOBILE : DeviceType.DESKTOP
}

/**
 * 响应式设备类型 Hook
 * 基于路由变化自动更新设备类型
 */
export function useDevice() {
  const route = useRoute()
  
  // 基于路由计算是否为移动端
  const isMobile = computed(() => route.path.startsWith('/mobile'))
  const deviceType = computed(() => isMobile.value ? DeviceType.MOBILE : DeviceType.DESKTOP)
  const isDesktop = computed(() => !isMobile.value)

  return {
    deviceType,
    isMobile,
    isDesktop,
  }
}
