<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ConsentTokensRepo, ConsentsRepo, RegistrationsRepo, IdUtil } from '../repo/storage'

const route = useRoute()
const token = String(route.params.token || '')
const tokenRec = ConsentTokensRepo.byToken(token)
const isExpired = tokenRec ? new Date(tokenRec.expiresAt).getTime() < Date.now() : true
const registration = tokenRec ? RegistrationsRepo.list().find(r => r.id === tokenRec.registrationId) : null

const signerName = ref('')
const relationship = ref('Parent')
const acknowledged = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const ts = ref('')

function submit() {
  error.value = null
  if (!registration || !tokenRec) { error.value = 'Invalid or expired link.'; return }
  if (isExpired) { error.value = 'This link has expired.'; return }
  if (!signerName.value.trim() || !relationship.value.trim() || !acknowledged.value) {
    error.value = 'Please provide name, relationship, and acknowledge.'
    return
  }
  const now = new Date().toISOString()
  const signatureHash = btoa(`${signerName.value}|${relationship.value}|${now}`)
  ConsentsRepo.add({ id: IdUtil.uid('consent'), registrationId: registration.id, signerName: signerName.value.trim(), relationship: relationship.value.trim(), signatureHash, ts: now, userAgent: navigator.userAgent })
  // Update registration: mark Parent step complete, status to WaitingCounselor
  const next = { ...registration }
  next.status = 'WaitingCounselor'
  next.timeline = next.timeline.map(t => t.step === 'Parent' ? { ...t, state: 'Complete', updatedAt: now } : t)
  next.history = [...next.history, { id: IdUtil.uid('h'), ts: now, actorRole: 'Parent', action: 'PARENT_CONSENTED', meta: { signerName: signerName.value } }]
  RegistrationsRepo.upsert(next)
  // invalidate token
  ConsentTokensRepo.upsert({ ...tokenRec, usedAt: now })
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


