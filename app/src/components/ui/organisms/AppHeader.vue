<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSessionStore } from "../../../stores/session";
const session = useSessionStore();
const { currentUser } = storeToRefs(session);
</script>

<template>
  <header class="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
    <div class="mx-auto max-w-6xl px-2 sm:px-4 py-3 flex flex-wrap items-center gap-2 justify-between">
      <div class="flex items-center gap-2 sm:gap-3">
        <span class="font-semibold">DualEnroll</span>
        <UiBadge tone="warning">Prototype</UiBadge>
        <nav class="ml-2 flex items-center gap-1">
          <router-link
            to="/apps"
            class="px-2 py-1 rounded text-sm"
            :class="$route.path.startsWith('/apps') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'"
          >Applications</router-link>
          <router-link
            to="/registrations"
            class="px-2 py-1 rounded text-sm"
            :class="$route.path.startsWith('/registrations') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'"
          >Registrations</router-link>
          <router-link
            to="/admin"
            class="px-2 py-1 rounded text-sm"
            :class="$route.path.startsWith('/admin') ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'"
          >Admin</router-link>
        </nav>
      </div>
      <div class="flex items-center gap-2 sm:gap-3">
        <span v-if="currentUser" class="text-sm text-gray-700 max-w-[40vw] sm:max-w-none truncate">{{ currentUser.email }}</span>
        <UiBadge v-if="currentUser" tone="neutral">{{ currentUser.role }}</UiBadge>
        <UiButton v-if="currentUser" variant="ghost" @click="session.signOut(); $router.replace('/signin')">Sign out</UiButton>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>


