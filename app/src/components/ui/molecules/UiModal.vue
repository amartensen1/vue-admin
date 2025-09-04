<script setup lang="ts">
defineProps<{ open: boolean; title?: string }>()
defineEmits(["close"])
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/30" @click="$emit('close')"></div>
      <div class="relative bg-white rounded shadow-lg w-full max-w-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-base font-semibold">{{ title }}</h3>
          <button class="text-gray-500 hover:text-gray-700" @click="$emit('close')">✕</button>
        </div>
        <div>
          <slot />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <slot name="footer">
            <UiButton variant="ghost" @click="$emit('close')">Close</UiButton>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
  
</template>

<style scoped>
</style>


