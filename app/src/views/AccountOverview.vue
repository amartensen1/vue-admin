<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccountStore } from '../stores/account.store'
const account = useAccountStore()
onMounted(()=> account.fetch())
</script>

<template>
  <div class="space-y-4">
    <UiToolbar title="Account Settings" />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded border p-4 flex items-center gap-3">
        <UiAvatar :src="account.item?.avatarDataUrl" :size="56" />
        <div class="min-w-0">
          <div class="font-medium truncate">{{ account.item?.firstName }} {{ account.item?.lastName }}</div>
          <div class="text-sm text-muted truncate">{{ account.item?.pronouns }}</div>
          <div class="text-sm text-muted truncate">@{{ account.item?.username }}</div>
        </div>
      </div>

      <div class="bg-white rounded border p-4">
        <div class="text-sm font-medium">Contact</div>
        <div class="text-sm text-muted">{{ account.item?.email }}</div>
      </div>

      <div class="bg-white rounded border p-4">
        <div class="text-sm font-medium">Security</div>
        <div class="text-sm">2FA: <UiBadge :tone="account.item?.twoFactorEnabled ? 'success' : 'neutral'">{{ account.item?.twoFactorEnabled ? 'Enabled' : 'Disabled' }}</UiBadge></div>
        <div class="text-sm text-muted">Password updated: {{ account.item?.passwordLastUpdatedAt ? new Date(account.item.passwordLastUpdatedAt).toLocaleString() : '—' }}</div>
      </div>

      <div class="bg-white rounded border p-4 space-y-2">
        <div class="text-sm font-medium">Quick links</div>
        <div class="flex gap-2 flex-wrap">
          <router-link to="/account/settings" class="px-3 py-2 rounded border text-sm">User Settings</router-link>
          <router-link to="/account/settings#security" class="px-3 py-2 rounded border text-sm">Security & Authentication</router-link>
          <router-link to="/account/settings#avatar" class="px-3 py-2 rounded border text-sm">Profile Photo</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


