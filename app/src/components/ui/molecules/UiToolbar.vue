<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <h1 v-if="title" class="text-xl font-semibold">{{ title }}</h1>
    <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
      <slot />
    </div>
  </div>
</template>

<style scoped>
</style>


