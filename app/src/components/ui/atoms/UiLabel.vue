<script setup lang="ts">
defineProps<{ forId?: string }>()
</script>

<template>
  <label :for="forId" class="text-sm font-medium text-gray-800">
    <slot />
  </label>
</template>

<style scoped>
</style>


