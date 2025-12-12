import { computed } from 'vue'

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
 */
export function isMobileDevice(): boolean {
  return false
}

/**
 * 获取当前设备类型
 */
export function getDeviceType(): DeviceType {
  return DeviceType.DESKTOP
}

/**
 * 响应式设备类型 Hook
 */
export function useDevice() {
  const isMobile = computed(() => false)
  const deviceType = computed(() => DeviceType.DESKTOP)
  const isDesktop = computed(() => true)

  return {
    deviceType,
    isMobile,
    isDesktop,
  }
}
