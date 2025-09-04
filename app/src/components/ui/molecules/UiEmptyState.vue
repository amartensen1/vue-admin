<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="text-center py-8 border rounded bg-white">
    <h3 class="text-base font-semibold">{{ title }}</h3>
    <p v-if="description" class="text-sm text-gray-600 mt-1">{{ description }}</p>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
</style>


