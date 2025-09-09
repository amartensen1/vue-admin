<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useSectionsStore } from '../stores/sections.store'
import { useCoursesStore } from '../stores/courses.store'
import { useTermsStore } from '../stores/terms.store'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const sectionsStore = useSectionsStore()
const coursesStore = useCoursesStore()
const termsStore = useTermsStore()
onMounted(() => { sectionsStore.fetchAll(); coursesStore.fetchAll(); termsStore.fetchAll() })
const sect = computed(() => sectionsStore.byId(id))
const course = computed(() => sect.value ? coursesStore.byId(sect.value.courseId) : null)
const term = computed(() => sect.value ? termsStore.byId(sect.value.termId) : null)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Section Details</h1>
      <UiButton variant="secondary" @click="router.push({ name: 'AdminLite', params: { tab: 'Sections' } })">Back</UiButton>
    </div>

    <div v-if="!sect" class="bg-white rounded border p-4">
      <p class="text-sm text-red-700">Section not found.</p>
    </div>

    <div v-else class="bg-white rounded border p-4 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div class="text-xs text-gray-500">Course</div>
          <div class="text-sm">{{ course?.title || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Term</div>
          <div class="text-sm">{{ term?.name || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Number</div>
          <div class="text-sm">{{ sect.number || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Capacity</div>
          <div class="text-sm">{{ sect.capacity ?? '—' }}</div>
        </div>
        <div class="sm:col-span-2">
          <div class="text-xs text-gray-500">Meeting</div>
          <div class="text-sm">{{ sect.meetingInfo || '—' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


