<script setup lang="ts">
defineProps<{ open: boolean; title?: string; side?: 'right' | 'left' }>()
defineEmits(["close"])
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/30" @click="$emit('close')"></div>
      <div
        class="absolute top-0 h-full w-full sm:w-[480px] bg-white shadow-xl flex flex-col"
        :class="side === 'left' ? 'left-0' : 'right-0'"
      >
        <div class="p-3 sm:p-4 border-b flex items-center justify-between">
          <h3 class="text-base font-semibold">{{ title }}</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="$emit('close')">✕</button>
        </div>
        <div class="p-3 sm:p-4 overflow-y-auto flex-1">
          <slot />
        </div>
        <div class="p-3 sm:p-4 border-t bg-gray-50">
          <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
</style>


