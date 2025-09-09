<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { TermsRepo } from '../repo/storage'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const term = TermsRepo.list().find(t => t.id === id) || null
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Term Details</h1>
      <UiButton variant="secondary" @click="router.push({ name: 'AdminLite', params: { tab: 'Terms' } })">Back</UiButton>
    </div>

    <div v-if="!term" class="bg-white rounded border p-4">
      <p class="text-sm text-red-700">Term not found.</p>
    </div>

    <div v-else class="bg-white rounded border p-4 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div class="text-xs text-gray-500">Name</div>
          <div class="text-sm">{{ term.name }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Session Code</div>
          <div class="text-sm">{{ term.session_code || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Dates</div>
          <div class="text-sm">{{ term.start_date }} → {{ term.end_date }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Active</div>
          <div class="text-sm">{{ term.isActive ? 'Yes' : 'No' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


