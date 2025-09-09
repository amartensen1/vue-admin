<script setup lang="ts">
defineProps<{ tone?: "neutral" | "success" | "danger" | "warning" }>();
</script>

<template>
  <span :class="[
    'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium',
    tone === 'success' ? 'bg-green-100 text-success' : tone === 'danger' ? 'bg-red-100 text-danger' : tone === 'warning' ? 'bg-amber-100 text-warning' : 'bg-gray-100 text-muted'
  ]" v-bind="$attrs">
    <slot />
  </span>
</template>

<style scoped>
</style>


