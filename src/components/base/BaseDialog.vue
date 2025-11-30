<script setup lang="ts">
import { useDevice } from '@/utils/device'
import { Dialog as TDialog, DialogPlugin } from 'tdesign-vue-next'
import { Dialog as TMDialog } from 'tdesign-mobile-vue'

interface Props {
  visible: boolean
  title?: string
  content?: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: '确定',
  cancelText: '取消',
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()

const { isMobile } = useDevice()

const handleConfirm = () => {
  emit('confirm')
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

const handleClose = () => {
  emit('update:visible', false)
}
</script>

<template>
  <!-- 移动端使用 TDesign Mobile -->
  <TMDialog
    v-if="isMobile"
    :visible="visible"
    :title="title"
    :content="content"
    :confirm-btn="confirmText"
    :cancel-btn="cancelText"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @update:visible="(val: boolean) => emit('update:visible', val)"
  >
    <slot />
  </TMDialog>

  <!-- 桌面端使用 TDesign Vue Next -->
  <TDialog
    v-else
    :visible="visible"
    :header="title"
    :confirm-btn="confirmText"
    :cancel-btn="cancelText"
    @confirm="handleConfirm"
    @cancel="handleCancel"
    @close="handleClose"
    @update:visible="(val: boolean) => emit('update:visible', val)"
  >
    <div v-if="content">{{ content }}</div>
    <slot v-else />
  </TDialog>
</template>
