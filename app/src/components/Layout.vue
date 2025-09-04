<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 bg-gray-50">
      <div class="mx-auto max-w-6xl p-3 sm:p-4">
        <slot />
      </div>
    </main>
  </div>
  
</template>

<style scoped>
</style>


