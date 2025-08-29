<script setup lang="ts">
import { reactive } from 'vue'
import { useTermsStore } from '../stores/terms'

const termsStore = useTermsStore()
const form = reactive({ id: '', name: '', startDate: '', endDate: '', active: false })

function edit(termId: string) {
  const t = termsStore.terms.find(t => t.id === termId)
  if (!t) return
  Object.assign(form, t)
}

function reset() {
  Object.assign(form, { id: '', name: '', startDate: '', endDate: '', active: false })
}

function save() {
  if (!form.name || !form.startDate || !form.endDate) return
  if (form.id) {
    termsStore.updateTerm({ ...form })
  } else {
    termsStore.addTerm({ ...form, id: crypto.randomUUID() })
  }
  reset()
}
</script>

<template>
  <section>
    <h1 class="text-xl font-semibold mb-4">Terms</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 class="font-medium mb-2">Existing Terms</h2>
        <div class="border rounded-md divide-y bg-white">
          <div v-for="t in termsStore.terms" :key="t.id" class="p-3 flex items-center justify-between">
            <div>
              <div class="font-medium">{{ t.name }}</div>
              <div class="text-sm text-gray-600">{{ t.startDate }} → {{ t.endDate }}</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2 py-1 rounded-full" :class="t.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">{{ t.active ? 'Active' : 'Inactive' }}</span>
              <button class="px-3 py-1 border rounded" @click="edit(t.id)">Edit</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 class="font-medium mb-2">Create / Edit</h2>
        <div class="grid gap-3">
          <input v-model="form.name" placeholder="Term name" class="border rounded px-3 py-2" />
          <div class="grid grid-cols-2 gap-3">
            <input v-model="form.startDate" type="date" class="border rounded px-3 py-2" />
            <input v-model="form.endDate" type="date" class="border rounded px-3 py-2" />
          </div>
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="form.active" /> Active
          </label>
          <div class="flex gap-2">
            <button class="bg-gray-900 text-white px-4 py-2 rounded" @click="save">Save</button>
            <button class="border px-4 py-2 rounded" @click="reset">Reset</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  
</template>



