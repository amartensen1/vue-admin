<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

type Role = 'Admin' | 'Instructor' | 'High School Staff'
const roles: Role[] = ['Admin', 'Instructor', 'High School Staff']
const selectedRole = ref<Role>('Admin')

const router = useRouter()
const route = useRoute()

watch(selectedRole, () => {
  // Placeholder: could alter visible nav in future
})

const nav = [
  { name: 'Institution', to: '/institution' },
  { name: 'Terms', to: '/terms' },
  { name: 'Programs', to: '/programs' },
  { name: 'Partners', to: '/partners' },
  { name: 'Users', to: '/users' },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="border-b bg-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="font-semibold">Dual Credit Admin</span>
          <nav class="hidden md:flex items-center gap-2">
            <router-link v-for="item in nav" :key="item.to" :to="item.to" 
              class="px-3 py-2 rounded-md text-sm"
              :class="isActive(item.to) ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'">
              {{ item.name }}
            </router-link>
          </nav>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-600">Role</label>
          <select v-model="selectedRole" class="border rounded-md px-2 py-1 text-sm">
            <option v-for="r in roles" :key="r">{{ r }}</option>
          </select>
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>
  </div>
  
</template>



