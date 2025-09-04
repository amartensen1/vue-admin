<script setup lang="ts">
const props = defineProps<{ accept?: string; disabled?: boolean }>()
const emit = defineEmits<{ (e: 'change', file: File): void }>()
let inputRef: HTMLInputElement | null = null
function onPick() { if (!props.disabled) inputRef?.click() }
function onChange(e: Event) {
  const t = e.target as HTMLInputElement
  const file = t.files && t.files[0]
  if (file) emit('change', file)
  if (t) t.value = ''
}
</script>

<template>
  <div>
    <input ref="inputRef" type="file" class="hidden" :accept="props.accept" @change="onChange" />
    <UiButton :disabled="props.disabled" @click="onPick"><slot>Upload file</slot></UiButton>
  </div>
</template>

<style scoped>
</style>


