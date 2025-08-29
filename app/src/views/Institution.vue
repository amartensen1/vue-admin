<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useInstitutionStore } from '../stores/institution'

const institutionStore = useInstitutionStore()
const form = reactive({
  name: institutionStore.institution.name,
  address: institutionStore.institution.address,
  contactEmail: institutionStore.institution.contactEmail,
})

const errors = reactive<{ name?: string; address?: string; contactEmail?: string }>({})

function validate() {
  errors.name = form.name ? '' : 'Name is required'
  errors.address = form.address ? '' : 'Address is required'
  errors.contactEmail = /.+@.+\..+/.test(form.contactEmail) ? '' : 'Valid email required'
  return !errors.name && !errors.address && !errors.contactEmail
}

function save() {
  if (!validate()) return
  institutionStore.updateInstitution({ ...form })
}

const isDirty = computed(() => {
  const i = institutionStore.institution
  return i.name !== form.name || i.address !== form.address || i.contactEmail !== form.contactEmail
})
</script>

<template>
  <section>
    <h1 class="text-xl font-semibold mb-4">Institution Profile</h1>
    <div class="grid gap-4 max-w-xl">
      <div>
        <label class="block text-sm text-gray-700">Institution Name</label>
        <input v-model="form.name" class="mt-1 w-full border rounded-md px-3 py-2" placeholder="College name" />
        <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <label class="block text-sm text-gray-700">Address</label>
        <input v-model="form.address" class="mt-1 w-full border rounded-md px-3 py-2" placeholder="Address" />
        <p v-if="errors.address" class="text-sm text-red-600 mt-1">{{ errors.address }}</p>
      </div>
      <div>
        <label class="block text-sm text-gray-700">Contact Email</label>
        <input v-model="form.contactEmail" class="mt-1 w-full border rounded-md px-3 py-2" placeholder="email@college.edu" />
        <p v-if="errors.contactEmail" class="text-sm text-red-600 mt-1">{{ errors.contactEmail }}</p>
      </div>
      <div class="flex gap-2">
        <button @click="save" class="bg-gray-900 text-white px-4 py-2 rounded-md disabled:opacity-50" :disabled="!isDirty">Save</button>
      </div>
    </div>
  </section>
  
</template>


