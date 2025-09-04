<script setup lang="ts">
defineProps<{ tone?: "neutral" | "success" | "danger" | "warning" }>();
</script>

<template>
  <span :class="[
    'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
    tone === 'success' ? 'bg-green-100 text-green-700' : tone === 'danger' ? 'bg-red-100 text-red-700' : tone === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
  ]">
    <slot />
  </span>
</template>

<style scoped>
</style>


