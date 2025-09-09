<script setup lang="ts">
import type { RegistrationTimelineItem } from "../../../types";
defineProps<{ items: RegistrationTimelineItem[] }>()
</script>

<template>
  <ol class="space-y-3">
    <li v-for="it in items" :key="it.id" class="p-3 rounded border bg-white flex items-center justify-between">
      <div>
        <div class="text-sm font-medium">{{ it.step }} <span class="text-xs text-gray-500">(Owner: {{ it.ownerRole }})</span></div>
        <div class="text-xs text-gray-500">Updated {{ new Date(it.updatedAt).toLocaleString() }}</div>
        <div v-if="it.note" class="text-xs text-gray-600 mt-1">{{ it.note }}</div>
      </div>
      <UiBadge :tone="it.state==='Complete' ? 'success' : it.state==='Waiting' ? 'warning' : it.state==='Abandoned' ? 'danger' : 'neutral'">{{ it.state }}</UiBadge>
    </li>
  </ol>
</template>

<style scoped>
</style>


