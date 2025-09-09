<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue: string; tabs: Array<{ key: string; label: string }> }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
function select(k: string) { emit('update:modelValue', k) }
const active = computed(() => props.modelValue)
</script>

<template>
  <div class="border-b flex items-center gap-2">
    <button v-for="t in props.tabs" :key="t.key" class="px-3 py-2 text-sm -mb-px border-b-2 focus:outline-none focus:ring-2 focus:ring-primary"
      :class="active===t.key ? 'border-primary text-primary font-medium' : 'border-transparent text-muted hover:text-gray-800'"
      @click="select(t.key)">{{ t.label }}</button>
  </div>
  <div class="pt-3">
    <slot />
  </div>
  
</template>

<style scoped>
</style>


