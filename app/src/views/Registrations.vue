<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRegistrationsStore } from "../stores/registrations.store";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useRegistrationsStore();
const regs = computed(() => store.items);

onMounted(() => { store.fetchAll() });

const query = ref("");
const filtered = computed(() => {
  let r = regs.value;
  if (query.value.trim()) {
    const q = query.value.toLowerCase();
    r = r.filter(x => JSON.stringify(x).toLowerCase().includes(q));
  }
  return r;
});

function openDetail(id: string) {
  router.push({ name: 'RegistrationDetail', params: { id } });
}
</script>

<template>
  <div class="space-y-4">
    <UiToolbar title="Registrations">
      <UiInput v-model="query" type="search" placeholder="Search" class="w-full sm:w-56" />
    </UiToolbar>

    <div class="bg-white rounded shadow overflow-hidden">
      <UiDataTable :columns="[
        { key: 'id', label: 'ID' },
        { key: 'status', label: 'Status' },
        { key: 'steps', label: 'Steps' },
      ]" :rows="filtered.map(r => ({ id: r.id, status: r.status, steps: r.timeline.map(t=>t.state).join(', ') }))" row-clickable @row-click="(row:any)=>openDetail(row.id)">
        <template #cell:status="{ row }">
          <UiBadge :tone="row.status==='Complete' ? 'success' : row.status==='Abandoned' ? 'danger' : 'warning'">{{ row.status }}</UiBadge>
        </template>
        <template #empty>
          <UiEmptyState title="No registrations" description="Create or seed registrations to see them here." />
        </template>
      </UiDataTable>
    </div>
  </div>
</template>

<style scoped>
</style>


