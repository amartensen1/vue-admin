<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from "pinia";
import { useSessionStore } from "../../../stores/session";
const session = useSessionStore();
const { currentUser } = storeToRefs(session);
const emit = defineEmits(["toggle-nav"]) 
const showUserMenu = ref(false)
const router = useRouter()

function openUserMenu(){ showUserMenu.value = true }
function closeUserMenu(){ showUserMenu.value = false }
async function goSettings(){
  closeUserMenu()
  router.push({ name: 'AdminLite', params: { tab: 'Settings' } })
}
async function signOut(){
  closeUserMenu()
  session.signOut();
  router.replace('/signin')
}
</script>

<template>
  <header class="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
    <div class="mx-auto max-w-6xl px-2 sm:px-4 py-3 flex flex-wrap items-center gap-2 justify-between">
      <div class="flex items-center gap-2 sm:gap-3">
        <button class="px-2 py-1 rounded text-sm border sm:hidden" @click="emit('toggle-nav')">Menu</button>
        <span class="font-semibold">DualEnroll</span>
        <UiBadge tone="warning">Prototype</UiBadge>
      </div>
      <div class="relative flex items-center gap-2 sm:gap-3">
        <button
          v-if="currentUser"
          class="text-sm text-gray-700 max-w-[40vw] sm:max-w-none truncate hover:underline"
          @click="openUserMenu"
          aria-haspopup="dialog"
          :aria-expanded="showUserMenu ? 'true' : 'false'"
        >
          {{ currentUser.email }}
        </button>

        <!-- User menu dialog -->
        <div v-if="showUserMenu" class="fixed inset-0 z-40" @click="closeUserMenu"></div>
        <div v-if="showUserMenu" class="absolute right-0 top-full mt-2 z-50 w-48 rounded border bg-white shadow-lg">
          <div class="py-1">
            <button class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50" @click="goSettings">Settings</button>
            <button class="w-full text-left px-3 py-2 text-sm text-danger hover:bg-red-50" @click="signOut">Sign out</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
</style>


