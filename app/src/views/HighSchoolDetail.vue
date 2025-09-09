<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { HighSchoolsRepo } from '../repo/storage'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const hs = HighSchoolsRepo.list().find(h => h.id === id) || null
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">High School Details</h1>
      <UiButton variant="secondary" @click="router.push({ name: 'AdminLite' })">Back</UiButton>
    </div>

    <div v-if="!hs" class="bg-white rounded border p-4">
      <p class="text-sm text-red-700">High school not found.</p>
    </div>

    <div v-else class="bg-white rounded border p-4 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div class="text-xs text-gray-500">Name</div>
          <div class="text-sm">{{ hs.schl_name || hs.name }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">NCES</div>
          <div class="text-sm">{{ hs.nces_schl_id || hs.nces_id }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Address</div>
          <div class="text-sm">{{ hs.street1 }} {{ hs.street2 }}</div>
          <div class="text-sm">{{ hs.city }}, {{ hs.state }} {{ hs.zip }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Phone</div>
          <div class="text-sm">{{ hs.phone }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Type</div>
          <div class="text-sm">{{ hs.school_type }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Offers</div>
          <div class="text-sm">DE: {{ hs.offers_de ? 'Yes' : 'No' }}, AP: {{ hs.offers_ap ? 'Yes' : 'No' }}, IB: {{ hs.offers_ib ? 'Yes' : 'No' }}</div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <div class="text-xs text-gray-500">Enrollment</div>
          <div class="text-sm">{{ hs.enrollment ?? '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Pct College</div>
          <div class="text-sm">{{ hs.pct_college ?? '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Principal</div>
          <div class="text-sm">{{ hs.principal ?? '—' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


