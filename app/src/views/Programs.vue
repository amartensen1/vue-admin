<script setup lang="ts">
import { reactive } from 'vue'
import { useProgramsStore } from '../stores/programs'
import { useTermsStore } from '../stores/terms'

const programsStore = useProgramsStore()
const termsStore = useTermsStore()
const form = reactive({ id: '', title: '', description: '', creditHours: 3, termId: '' })

function edit(id: string) {
  const p = programsStore.programs.find(p => p.id === id)
  if (!p) return
  Object.assign(form, p)
}
function reset() {
  Object.assign(form, { id: '', title: '', description: '', creditHours: 3, termId: '' })
}
function save() {
  if (!form.title || !form.termId) return
  if (form.id) {
    programsStore.updateProgram({ ...form })
  } else {
    programsStore.addProgram({ ...form, id: crypto.randomUUID() })
  }
  reset()
}
</script>

<template>
  <section>
    <h1 class="text-xl font-semibold mb-4">Programs</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 class="font-medium mb-2">Existing Programs</h2>
        <div class="border rounded-md divide-y bg-white">
          <div v-for="p in programsStore.programs" :key="p.id" class="p-3">
            <div class="flex items-start justify-between">
              <div>
                <div class="font-medium">{{ p.title }} <span class="text-xs text-gray-500">({{ p.creditHours }} cr)</span></div>
                <div class="text-sm text-gray-600">{{ p.description }}</div>
                <div class="text-xs text-gray-500 mt-1">Term: {{ termsStore.terms.find(t => t.id === p.termId)?.name || '—' }}</div>
              </div>
              <button class="px-3 py-1 border rounded" @click="edit(p.id)">Edit</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 class="font-medium mb-2">Create / Edit</h2>
        <div class="grid gap-3">
          <input v-model="form.title" placeholder="Program title" class="border rounded px-3 py-2" />
          <textarea v-model="form.description" placeholder="Description" class="border rounded px-3 py-2"></textarea>
          <div class="grid grid-cols-2 gap-3">
            <input v-model.number="form.creditHours" type="number" min="0" class="border rounded px-3 py-2" />
            <select v-model="form.termId" class="border rounded px-3 py-2">
              <option value="">Select term</option>
              <option v-for="t in termsStore.terms" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button class="bg-gray-900 text-white px-4 py-2 rounded" @click="save">Save</button>
            <button class="border px-4 py-2 rounded" @click="reset">Reset</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  
</template>




