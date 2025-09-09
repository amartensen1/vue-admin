<script setup lang="ts">
import { ref } from 'vue'
const navOpen = ref(false)
function toggleNav(){ navOpen.value = !navOpen.value }
const isCollapsed = ref(false)
function toggleCollapse(){ isCollapsed.value = !isCollapsed.value }
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader @toggle-nav="toggleNav" />
    <div class="flex-1 flex">
      <!-- Desktop sidebar under header -->
      <aside class="hidden sm:flex flex-col border-r bg-white transition-[width] duration-200" :class="isCollapsed ? 'w-14' : 'w-56'">
        <div class="p-2 border-b flex items-center justify-between">
          <span class="text-sm font-semibold" :class="isCollapsed ? 'sr-only' : ''">Navigation</span>
          <button class="px-2 py-1 rounded text-xs border" :title="isCollapsed ? 'Expand' : 'Collapse'" @click="toggleCollapse">{{ isCollapsed ? '›' : '‹' }}</button>
        </div>
        <nav class="p-2 space-y-1">
          <router-link to="/apps" class="flex items-center gap-2 px-2 py-1 rounded text-sm" :class="$route.path.startsWith('/apps') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs">A</span>
            <span :class="isCollapsed ? 'hidden' : ''">Applications</span>
          </router-link>
          <router-link to="/registrations" class="flex items-center gap-2 px-2 py-1 rounded text-sm" :class="$route.path.startsWith('/registrations') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs">R</span>
            <span :class="isCollapsed ? 'hidden' : ''">Registrations</span>
          </router-link>
          <router-link to="/admin" class="flex items-center gap-2 px-2 py-1 rounded text-sm" :class="$route.path.startsWith('/admin') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs">Ad</span>
            <span :class="isCollapsed ? 'hidden' : ''">Admin</span>
          </router-link>
        </nav>
      </aside>

      <!-- Mobile drawer (overlays under header) -->
      <UiDrawer class="sm:hidden" :open="navOpen" side="left" title="Navigation" @close="navOpen=false">
        <nav class="space-y-1">
          <router-link to="/apps" class="block px-2 py-1 rounded text-sm" :class="$route.path.startsWith('/apps') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'" @click="navOpen=false">Applications</router-link>
          <router-link to="/registrations" class="block px-2 py-1 rounded text-sm" :class="$route.path.startsWith('/registrations') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'" @click="navOpen=false">Registrations</router-link>
          <router-link to="/admin" class="block px-2 py-1 rounded text-sm" :class="$route.path.startsWith('/admin') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'" @click="navOpen=false">Admin</router-link>
        </nav>
      </UiDrawer>

      <main class="flex-1 bg-gray-50">
        <div class="mx-auto max-w-6xl p-3 sm:p-4">
          <slot />
        </div>
      </main>
    </div>
  </div>
  
</template>

<style scoped>
</style>


