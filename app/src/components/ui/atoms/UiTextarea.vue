<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue?: string; placeholder?: string; disabled?: boolean; rows?: number }>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v as string)
})
</script>

<template>
  <textarea
    v-model="value"
    :rows="rows ?? 3"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</template>

<style scoped>
</style>


