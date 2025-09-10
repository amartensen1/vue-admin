<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-0">
    <aside class="md:w-56 shrink-0 md:border-r bg-white md:bg-transparent">
      <nav class="p-2 md:p-3 space-y-1">
        <router-link
          to="/account"
          class="block px-2 py-1 rounded text-sm"
          :class="$route.path === '/account' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'"
        >Overview</router-link>
        <router-link
          to="/account/settings"
          class="block px-2 py-1 rounded text-sm"
          :class="$route.path.startsWith('/account/settings') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'"
        >User Settings</router-link>
      </nav>
    </aside>
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<style scoped>
</style>


