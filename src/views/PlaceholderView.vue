<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Card, Empty } from 'tdesign-vue-next'
import WebLayout from '@/components/WebLayout.vue'

const route = useRoute()

const title = computed(() => (route.meta?.title as string) || '页面建设中')
const description = computed(() => (route.meta?.description as string) || '功能正在建设中，敬请期待。')
</script>

<template>
  <WebLayout>
    <div class="placeholder">
      <Card :title="title" bordered hover-shadow>
        <Empty :description="description" />
      </Card>
    </div>
  </WebLayout>
</template>

<style scoped>
.placeholder {
  min-height: calc(100vh - 56px);
  padding: 24px;
  background: #f7f9fb;
}
</style>
