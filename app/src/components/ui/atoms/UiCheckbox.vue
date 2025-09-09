<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ modelValue?: boolean; disabled?: boolean }>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get: () => !!props.modelValue,
  set: (v) => emit("update:modelValue", !!v)
})
</script>

<template>
  <input type="checkbox" v-model="value" :disabled="props.disabled" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" v-bind="$attrs" />
</template>

<style scoped>
</style>


