<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { RegistrationsRepo, IdUtil, ConsentTokensRepo } from "../repo/storage";
import type { RegistrationRecord, RegistrationTimelineItem } from "../types";

const route = useRoute();
const router = useRouter();
const regId = route.params.id as string;
const reg = ref<RegistrationRecord | null>(RegistrationsRepo.list().find(r => r.id === regId) || null);
const tab = ref("timeline");

const canAbandon = computed(() => reg.value && reg.value.status !== 'Complete' && reg.value.status !== 'Abandoned');
const consentLink = computed(() => {
  if (!reg.value) return ''
  const existing = ConsentTokensRepo.list().find(t => t.registrationId === reg.value!.id && !t.usedAt)
  const token = existing?.token
  return token ? `${location.origin}/consent/${token}` : ''
})

function abandon() {
  if (!reg.value) return;
  if (!confirm('Abandon this registration?')) return;
  const now = new Date().toISOString();
  const next: RegistrationRecord = {
    ...reg.value,
    status: 'Abandoned',
    timeline: reg.value.timeline.map(t => t.state === 'Complete' ? t : { ...t, state: 'Abandoned', updatedAt: now }),
    history: [...reg.value.history, { id: IdUtil.uid('h'), ts: now, actorRole: 'Student', action: 'ABANDON', meta: {} }],
  };
  RegistrationsRepo.upsert(next);
  reg.value = next;
}

function generateConsentLink() {
  if (!reg.value) return
  const now = new Date()
  const expires = new Date(now)
  expires.setDate(now.getDate() + 7)
  const token = IdUtil.uid('consent')
  ConsentTokensRepo.upsert({ token, registrationId: reg.value.id, createdAt: now.toISOString(), expiresAt: expires.toISOString() })
  alert(`Consent link generated:\n${location.origin}/consent/${token}`)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold">Registration {{ reg?.id }}</h1>
      <div class="flex items-center gap-2">
        <UiBadge :tone="reg?.status==='Complete' ? 'success' : reg?.status==='Abandoned' ? 'danger' : 'warning'">{{ reg?.status }}</UiBadge>
        <UiButton variant="secondary" @click="router.push({ name: 'Registrations' })">Back</UiButton>
        <UiButton v-if="!consentLink && reg?.status==='WaitingParent'" variant="secondary" @click="generateConsentLink">Generate consent link</UiButton>
        <UiButton v-else-if="consentLink" variant="secondary" @click="() => { navigator.clipboard.writeText(consentLink as string); alert('Link copied to clipboard') }">Copy link</UiButton>
        <UiButton v-if="canAbandon" variant="ghost" @click="abandon">Abandon</UiButton>
      </div>
    </div>

    <UiTabs v-model="tab" :tabs="[
      { key: 'overview', label: 'Overview' },
      { key: 'timeline', label: 'Timeline' },
      { key: 'history', label: 'History' },
      { key: 'notifications', label: 'Notifications' },
    ]" />

    <div v-if="tab==='overview'" class="bg-white rounded border p-3">
      <div class="text-sm text-gray-600">Section and student details TBD for Phase 2 data model.</div>
    </div>

    <div v-if="tab==='timeline'">
      <RegistrationTimeline :items="reg?.timeline || []" />
    </div>

    <div v-if="tab==='history'" class="bg-white rounded border">
      <div v-for="h in reg?.history || []" :key="h.id" class="p-2 border-b">
        <div class="text-sm">{{ h.action }}</div>
        <div class="text-xs text-gray-500">{{ new Date(h.ts).toLocaleString() }} • Actor: {{ h.actorRole }}</div>
      </div>
      <div v-if="!reg || reg.history.length===0" class="p-3 text-sm text-gray-500">No history yet</div>
    </div>

    <div v-if="tab==='notifications'" class="bg-white rounded border">
      <div v-for="n in reg?.notifications || []" :key="n.id" class="p-2 border-b">
        <div class="text-sm">{{ n.channel.toUpperCase() }} to {{ n.to }}</div>
        <div class="text-xs text-gray-500">{{ new Date(n.ts).toLocaleString() }}</div>
        <div v-if="n.bodyPreview" class="text-xs text-gray-600 mt-1">{{ n.bodyPreview }}</div>
      </div>
      <div v-if="!reg || reg.notifications.length===0" class="p-3 text-sm text-gray-500">No notifications yet</div>
    </div>
  </div>
</template>

<style scoped>
</style>


