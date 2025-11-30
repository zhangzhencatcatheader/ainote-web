<script setup lang="ts">
import { computed } from 'vue'
import { useDevice } from '@/utils/device'
import { Input as TInput } from 'tdesign-vue-next'
import { Input as TMInput } from 'tdesign-mobile-vue'

interface Props {
  modelValue: string | undefined
  type?: 'text' | 'password' | 'number' | 'tel'
  label?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  clearable: true,
  size: 'medium',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
  blur: []
  focus: []
}>()

const { isMobile } = useDevice()

const handleInput = (value: string | undefined) => {
  emit('update:modelValue', value)
}

const handleBlur = () => {
  emit('blur')
}

const handleFocus = () => {
  emit('focus')
}
</script>

<template>
  <!-- 移动端使用 TDesign Mobile -->
  <TMInput
    v-if="isMobile"
    :model-value="modelValue"
    :type="type"
    :label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    @update:model-value="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
  />

  <!-- 桌面端使用 TDesign Vue Next -->
  <div v-else class="base-input-wrapper">
    <label v-if="label" class="base-input-label">{{ label }}</label>
    <div class="input-field-wrapper">
      <TInput
        :model-value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :clearable="clearable"
        :size="size"
        @update:model-value="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>
  </div>
</template>

<style scoped>
.base-input-wrapper {
  width: 100%;
  padding: 4px 0;
}

.input-field-wrapper {
  width: 100%;
}

.input-field-wrapper :deep(.t-input) {
  width: 100% !important;
}

.base-input-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 500;
}
</style>
