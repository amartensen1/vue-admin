<script setup lang="ts">
import { reactive } from 'vue'
import { usePartnersStore } from '../stores/partners'
import { useProgramsStore } from '../stores/programs'

const partnersStore = usePartnersStore()
const programsStore = useProgramsStore()

const form = reactive({ id: '', name: '', address: '', contact: '', programIds: [] as string[] })

function edit(id: string) {
  const p = partnersStore.partners.find(p => p.id === id)
  if (!p) return
  Object.assign(form, { ...p, programIds: [...p.programIds] })
}
function reset() {
  Object.assign(form, { id: '', name: '', address: '', contact: '', programIds: [] })
}
function toggleProgram(pid: string) {
  const i = form.programIds.indexOf(pid)
  if (i >= 0) form.programIds.splice(i, 1)
  else form.programIds.push(pid)
}
function save() {
  if (!form.name) return
  if (form.id) partnersStore.updatePartner({ ...form })
  else partnersStore.addPartner({ ...form, id: crypto.randomUUID() })
  reset()
}
</script>

<template>
  <section>
    <h1 class="text-xl font-semibold mb-4">High School Partners</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 class="font-medium mb-2">Existing Partners</h2>
        <div class="border rounded-md divide-y bg-white">
          <div v-for="hs in partnersStore.partners" :key="hs.id" class="p-3">
            <div class="flex items-start justify-between">
              <div>
                <div class="font-medium">{{ hs.name }}</div>
                <div class="text-sm text-gray-600">{{ hs.address }} · {{ hs.contact }}</div>
                <div class="text-xs text-gray-500 mt-1">Programs: {{ hs.programIds.map(id => programsStore.programs.find(p => p.id === id)?.title).filter(Boolean).join(', ') || '—' }}</div>
              </div>
              <button class="px-3 py-1 border rounded" @click="edit(hs.id)">Edit</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 class="font-medium mb-2">Create / Edit</h2>
        <div class="grid gap-3">
          <input v-model="form.name" placeholder="School name" class="border rounded px-3 py-2" />
          <input v-model="form.address" placeholder="Address" class="border rounded px-3 py-2" />
          <input v-model="form.contact" placeholder="Contact person or email" class="border rounded px-3 py-2" />
          <div>
            <div class="text-sm text-gray-700 mb-1">Associate Programs</div>
            <div class="flex flex-wrap gap-2">
              <label v-for="p in programsStore.programs" :key="p.id" class="inline-flex items-center gap-2 border rounded px-2 py-1">
                <input type="checkbox" :checked="form.programIds.includes(p.id)" @change="toggleProgram(p.id)" /> {{ p.title }}
              </label>
            </div>
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



