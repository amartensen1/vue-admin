<script setup lang="ts">
defineProps<{ label?: string; hint?: string; error?: string; forId?: string }>()
</script>

<template>
  <div class="space-y-1">
    <UiLabel v-if="label" :for-id="forId">{{ label }}</UiLabel>
    <div>
      <slot />
    </div>
    <p v-if="hint && !error" class="text-xs text-gray-500">{{ hint }}</p>
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<style scoped>
</style>


