<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { idFactory } from '../helpers/idFactory'
import { useConsentTokensStore } from '../stores/consent-tokens.store'
import { useConsentsStore } from '../stores/consents.store'
import { useRegistrationsStore } from '../stores/registrations.store'

const route = useRoute()
const token = String(route.params.token || '')
const tokensStore = useConsentTokensStore()
const consentsStore = useConsentsStore()
const regsStore = useRegistrationsStore()
await tokensStore.fetchAll()
await regsStore.fetchAll()
const tokenRec = ref(tokensStore.byToken(token))
const isExpired = ref(tokenRec.value ? new Date(tokenRec.value.expiresAt).getTime() < Date.now() : true)
const registration = ref(tokenRec.value ? regsStore.byId(tokenRec.value.registrationId) : null)

const signerName = ref('')
const relationship = ref('Parent')
const acknowledged = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const ts = ref('')

async function submit() {
  error.value = null
  if (!registration.value || !tokenRec.value) { error.value = 'Invalid or expired link.'; return }
  if (isExpired.value) { error.value = 'This link has expired.'; return }
  if (!signerName.value.trim() || !relationship.value.trim() || !acknowledged.value) {
    error.value = 'Please provide name, relationship, and acknowledge.'
    return
  }
  const now = new Date().toISOString()
  const signatureHash = btoa(`${signerName.value}|${relationship.value}|${now}`)
  await consentsStore.add({ id: idFactory('consent'), registrationId: registration.value.id, signerName: signerName.value.trim(), relationship: relationship.value.trim(), signatureHash, ts: now, userAgent: navigator.userAgent })
  // Update registration: mark Parent step complete, status to WaitingCounselor
  const next = { ...registration.value }
  next.status = 'WaitingCounselor'
  next.timeline = next.timeline.map(t => t.step === 'Parent' ? { ...t, state: 'Complete', updatedAt: now } : t)
  next.history = [...next.history, { id: idFactory('h'), ts: now, actorRole: 'Parent', action: 'PARENT_CONSENTED', meta: { signerName: signerName.value } }]
  await regsStore.upsertOne(next)
  // invalidate token
  await tokensStore.upsert({ ...(tokenRec.value!), usedAt: now } as any)
  success.value = true
  ts.value = now
}
</script>

<template>
  <div class="max-w-xl mx-auto p-4 space-y-4">
    <div class="text-center">
      <h1 class="text-xl font-semibold">Parent/Guardian Consent</h1>
    </div>

    <div v-if="!tokenRec || isExpired" class="bg-white rounded border p-4">
      <p class="text-sm text-red-700">This consent link is invalid or has expired.</p>
    </div>

    <div v-else-if="success" class="bg-white rounded border p-4 text-center space-y-2">
      <div class="text-3xl">✅</div>
      <div class="text-sm">Thank you. Consent recorded at {{ new Date(ts).toLocaleString() }}.</div>
    </div>

    <div v-else class="space-y-4">
      <div class="bg-white rounded border p-4">
        <h2 class="text-sm font-medium mb-2">Registration Summary</h2>
        <p class="text-sm text-gray-600">Registration ID: {{ registration?.id }}</p>
        <p class="text-sm text-gray-600">Step: Parent Consent</p>
      </div>

      <form class="bg-white rounded border p-4 space-y-3" @submit.prevent="submit">
        <UiFormField label="Your full name">
          <UiInput v-model="signerName" />
        </UiFormField>
        <UiFormField label="Relationship">
          <UiSelect v-model="relationship">
            <option>Parent</option>
            <option>Guardian</option>
            <option>Other</option>
          </UiSelect>
        </UiFormField>
        <label class="flex items-center gap-2 text-sm">
          <UiCheckbox v-model="acknowledged" />
          <span>I agree to the policies and certify I am authorized to consent.</span>
        </label>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <UiButton type="submit">Provide consent</UiButton>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>


