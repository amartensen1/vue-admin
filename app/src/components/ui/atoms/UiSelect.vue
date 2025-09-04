<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue?: string | number; disabled?: boolean }>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get: () => props.modelValue as any,
  set: (v) => emit("update:modelValue", v)
})
</script>

<template>
  <select v-model="value" :disabled="props.disabled" class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
    <slot />
  </select>
</template>

<style scoped>
</style>


