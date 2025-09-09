<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useProgramsStore } from '../stores/programs.store'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const store = useProgramsStore()
onMounted(() => { store.fetchAll() })
const prog = computed(() => store.byId(id))
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Program Details</h1>
      <UiButton variant="secondary" @click="router.push({ name: 'AdminLite', params: { tab: 'Programs' } })">Back</UiButton>
    </div>

    <div v-if="!prog" class="bg-white rounded border p-4">
      <p class="text-sm text-red-700">Program not found.</p>
    </div>

    <div v-else class="bg-white rounded border p-4 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div class="text-xs text-gray-500">Name</div>
          <div class="text-sm">{{ prog.name }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Internal Name</div>
          <div class="text-sm">{{ prog.internal_name || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Owner</div>
          <div class="text-sm">{{ prog.owner_type || '—' }} #{{ prog.owner_id ?? '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">DB Id</div>
          <div class="text-sm">{{ prog.dbId ?? '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Created</div>
          <div class="text-sm">{{ prog.created_at ? new Date(prog.created_at).toLocaleString() : '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Updated</div>
          <div class="text-sm">{{ prog.updated_at ? new Date(prog.updated_at).toLocaleString() : '—' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


