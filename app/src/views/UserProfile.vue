<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccountStore } from '../stores/account.store'
const account = useAccountStore()
onMounted(async ()=>{ await account.fetch(); await account.fetchMemberships() })
</script>

<template>
  <div class="space-y-4">
    <UiToolbar title="User Profile" />
    <div class="bg-white rounded border p-4 flex items-center gap-3">
      <UiAvatar :src="account.item?.avatarDataUrl" :size="64" />
      <div class="min-w-0">
        <div class="font-medium truncate">{{ account.item?.firstName }} {{ account.item?.lastName }}</div>
        <div class="text-sm text-muted truncate">{{ account.item?.email }}</div>
      </div>
      <router-link to="/account" class="ml-auto px-3 py-2 rounded border text-sm">Edit Account</router-link>
    </div>

    <div class="space-y-2">
      <h3 class="text-sm font-semibold">Institution Memberships</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="m in account.memberships" :key="m.id" class="bg-white rounded border p-3">
          <div class="text-sm font-medium truncate">{{ m.institutionName }}</div>
          <div class="text-xs text-muted">{{ m.institutionType }}</div>
          <div class="mt-1 flex flex-wrap gap-1">
            <UiBadge v-for="r in m.roles" :key="r" tone="neutral">{{ r }}</UiBadge>
          </div>
          <router-link :to="m.portalPath" class="mt-3 inline-block px-3 py-1.5 rounded border text-sm">Open portal</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


