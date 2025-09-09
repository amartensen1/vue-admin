<script setup lang="ts">
defineProps<{ src?: string; alt?: string; size?: number }>()
</script>

<template>
  <div class="inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden" :style="{ width: (size||40)+'px', height: (size||40)+'px' }">
    <img v-if="src" :src="src" :alt="alt||'avatar'" class="w-full h-full object-cover" />
    <span v-else class="text-gray-500 text-xs">👤</span>
  </div>
</template>

<style scoped>
</style>


