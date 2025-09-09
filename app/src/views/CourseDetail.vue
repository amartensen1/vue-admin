<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { CoursesRepo } from '../repo/storage'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const course = CoursesRepo.list().find(c => c.id === id) || null
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Course Details</h1>
      <UiButton variant="secondary" @click="router.push({ name: 'AdminLite', params: { tab: 'Courses' } })">Back</UiButton>
    </div>

    <div v-if="!course" class="bg-white rounded border p-4">
      <p class="text-sm text-red-700">Course not found.</p>
    </div>

    <div v-else class="bg-white rounded border p-4 space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div class="text-xs text-gray-500">Title</div>
          <div class="text-sm">{{ course.title }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Code</div>
          <div class="text-sm">{{ course.code || (course.subject && course.number ? course.subject + '-' + course.number : '—') }}</div>
        </div>
        <div class="sm:col-span-2">
          <div class="text-xs text-gray-500">Description</div>
          <div class="text-sm">{{ course.description || '—' }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-500">Credits</div>
          <div class="text-sm">{{ course.credits ?? '—' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


