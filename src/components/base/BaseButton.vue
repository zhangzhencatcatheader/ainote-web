<script setup lang="ts">
import { computed } from 'vue'
import { useDevice } from '@/utils/device'
import { Button as TButton } from 'tdesign-vue-next'
import { Button as TMButton } from 'tdesign-mobile-vue'

interface Props {
  type?: 'primary' | 'default' | 'danger' | 'warning' | 'success'
  size?: 'small' | 'medium' | 'large'
  block?: boolean
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'medium',
  block: false,
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { isMobile } = useDevice()

// 映射桌面端类型到移动端
const mobileTheme = computed<'primary' | 'default' | 'danger'>(() => {
  const themeMap: Record<string, 'primary' | 'default' | 'danger'> = {
    primary: 'primary',
    default: 'default',
    danger: 'danger',
    warning: 'primary',
    success: 'primary',
  }
  return themeMap[props.type] || 'primary'
})

// 映射桌面端尺寸到移动端
const mobileSize = computed<'small' | 'medium' | 'large'>(() => {
  const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
    small: 'small',
    medium: 'medium',
    large: 'large',
  }
  return sizeMap[props.size] || 'medium'
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <!-- 移动端使用 TDesign Mobile -->
  <TMButton
    v-if="isMobile"
    :theme="mobileTheme"
    :size="mobileSize"
    :block="block"
    :disabled="disabled"
    :loading="loading"
    @click="handleClick"
  >
    <slot />
  </TMButton>

  <!-- 桌面端使用 TDesign Vue Next -->
  <TButton
    v-else
    :variant="type === 'default' ? 'outline' : 'base'"
    :theme="type"
    :size="size"
    :block="block"
    :disabled="disabled"
    :loading="loading"
    class="base-button"
    @click="handleClick"
  >
    <slot />
  </TButton>
</template>

<style scoped>
.base-button {
  width: 100%;
}

.base-button :deep(.t-button) {
  width: 100% !important;
}
</style>
