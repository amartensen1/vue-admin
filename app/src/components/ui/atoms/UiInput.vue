<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue?: string | number; type?: string; placeholder?: string; disabled?: boolean }>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get: () => props.modelValue as any,
  set: (v) => emit("update:modelValue", v)
})
</script>

<template>
  <input
    v-model="value"
    :type="props.type || 'text'"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    v-bind="$attrs"
  />
</template>

<style scoped>
</style>


