<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { ProgramRecord, TermRecord, CourseRecord, SectionRecord, HighSchoolRecord, SettingsRecord } from '../types'
import { useRoute, useRouter } from 'vue-router'
import { useProgramsStore } from '../stores/programs.store'
import { useTermsStore } from '../stores/terms.store'
import { useCoursesStore } from '../stores/courses.store'
import { useSectionsStore } from '../stores/sections.store'
import { useHighSchoolsStore } from '../stores/high-schools.store'
import { useSettingsStore } from '../stores/settings.store'

const route = useRoute()
const router = useRouter()
const initialTab = typeof route.params.tab === 'string' ? route.params.tab : 'Programs'
const tab = ref(initialTab)

const programsStore = useProgramsStore()
const termsStore = useTermsStore()
const coursesStore = useCoursesStore()
const sectionsStore = useSectionsStore()
const highSchoolsStore = useHighSchoolsStore()
const settingsStore = useSettingsStore()

onMounted(async () => {
  await Promise.all([
    programsStore.fetchAll(),
    termsStore.fetchAll(),
    coursesStore.fetchAll(),
    sectionsStore.fetchAll(),
    highSchoolsStore.fetchAll(),
    settingsStore.fetch(),
  ])
})

const programs = ref<ProgramRecord[]>([])
const terms = ref<TermRecord[]>([])
const courses = ref<CourseRecord[]>([])
const sections = ref<SectionRecord[]>([])
const highSchools = ref<HighSchoolRecord[]>([])
const settings = ref<SettingsRecord>({ registrationOpen: true })

watch(() => programsStore.items, (val) => { programs.value = val }, { immediate: true })
watch(() => termsStore.items, (val) => { terms.value = val }, { immediate: true })
watch(() => coursesStore.items, (val) => { courses.value = val }, { immediate: true })
watch(() => sectionsStore.items, (val) => { sections.value = val }, { immediate: true })
watch(() => highSchoolsStore.items, (val) => { highSchools.value = val }, { immediate: true })
watch(() => settingsStore.item, (val) => { if (val) settings.value = val }, { immediate: true })

function addProgram() { programsStore.createOne({ name: 'New Program' } as ProgramRecord) }
function removeProgram(id:string){ programsStore.removeOne(id) }

function addTerm(){ termsStore.createOne({ name: 'New Term', isActive: true, customDates: {} } as TermRecord) }
function removeTerm(id:string){ termsStore.removeOne(id) }

function addCourse(){ coursesStore.createOne({ title: 'New Course' } as CourseRecord) }
function removeCourse(id:string){ coursesStore.removeOne(id) }

function addSection(){
  const firstCourse = courses.value[0]?.id || ''
  const firstTerm = terms.value[0]?.id || ''
  sectionsStore.createOne({ courseId: firstCourse, termId: firstTerm, allowRegistration: true } as SectionRecord)
}
function removeSection(id:string){ sectionsStore.removeOne(id) }

function addHS(){ highSchoolsStore.createOne({ name: 'New High School' } as HighSchoolRecord) }
function removeHS(id:string){ highSchoolsStore.removeOne(id) }

async function saveSettings(){ await settingsStore.save(settings.value) }

function exportAll(){
  const data = {
    programs: programs.value,
    terms: terms.value,
    courses: courses.value,
    sections: sections.value,
    highSchools: highSchools.value,
    settings: settings.value,
  };
  const blob = new Blob([JSON.stringify(data,null,2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'admin-seed.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

function importAll(e: Event){
  const input = e.target as HTMLInputElement; const file = input.files && input.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try{
      const obj = JSON.parse(String(reader.result));
      if (obj.programs) { programs.value = obj.programs; await Promise.all(obj.programs.map((p:ProgramRecord)=>programsStore.updateOne(p.id,p))) }
      if (obj.terms) { terms.value = obj.terms; await Promise.all(obj.terms.map((t:TermRecord)=>termsStore.updateOne(t.id,t))) }
      if (obj.courses) { courses.value = obj.courses; await Promise.all(obj.courses.map((c:CourseRecord)=>coursesStore.updateOne(c.id,c))) }
      if (obj.sections) { sections.value = obj.sections; await Promise.all(obj.sections.map((s:SectionRecord)=>sectionsStore.updateOne(s.id,s))) }
      if (obj.highSchools) { highSchools.value = obj.highSchools; await Promise.all(obj.highSchools.map((h:HighSchoolRecord)=>highSchoolsStore.updateOne(h.id,h))) }
      if (obj.settings) { settings.value = obj.settings; await settingsStore.save(obj.settings) }
      alert('Imported successfully')
    }catch(err){ alert('Invalid JSON') }
  }
  reader.readAsText(file)
}

// Keep route in sync with selected tab via path param
watch(tab, (val) => {
  router.replace({ name: 'AdminLite', params: { tab: val } })
})
watch(() => route.params.tab, (val) => {
  if (typeof val === 'string' && val !== tab.value) tab.value = val
})
</script>

<template>
  <div class="space-y-4">
    <UiToolbar title="Admin-Lite">
      <UiTabs v-model="tab" :tabs="[
        { key: 'Programs', label: 'Programs' },
        { key: 'Terms', label: 'Terms' },
        { key: 'Courses', label: 'Courses' },
        { key: 'Sections', label: 'Sections' },
        { key: 'HighSchools', label: 'High Schools' },
        { key: 'Settings', label: 'Settings' },
      ]" />
    </UiToolbar>

    <div v-if="tab==='Programs'" class="bg-white rounded border p-3 space-y-2">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-semibold">Programs</h2>
        <UiButton @click="addProgram">Add Program</UiButton>
      </div>
      <div class="divide-y">
        <div v-for="p in programs" :key="p.id" class="flex items-center gap-2 p-2">
          <router-link class="text-blue-600 hover:underline" :to="{ name: 'ProgramDetail', params: { id: p.id } }">{{ p.name }}</router-link>
          <UiButton variant="secondary" @click="removeProgram(p.id)">Remove</UiButton>
        </div>
      </div>
    </div>

    <div v-if="tab==='Terms'" class="bg-white rounded border p-3 space-y-2">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-semibold">Terms</h2>
        <UiButton @click="addTerm">Add Term</UiButton>
      </div>
      <div class="divide-y">
        <div v-for="t in terms" :key="t.id" class="grid grid-cols-1 sm:grid-cols-5 gap-2 p-2 items-center">
          <router-link class="text-blue-600 hover:underline sm:col-span-2" :to="{ name: 'TermDetail', params: { id: t.id } }">{{ t.name }}</router-link>
          <label class="flex items-center gap-2 text-sm"><UiCheckbox v-model="t.isActive" @update:modelValue="(v:boolean)=>termsStore.updateOne(t.id,{ isActive: v })" /> Active</label>
          <UiInput :model-value="t.customDates?.registrationStart || ''" placeholder="Reg Start (YYYY-MM-DD)"
            @update:modelValue="(v:string)=>{ t.customDates = { ...(t.customDates||{}), registrationStart: v }; termsStore.updateOne(t.id,{ customDates: t.customDates }) }" />
          <UiInput :model-value="t.customDates?.registrationEnd || ''" placeholder="Reg End (YYYY-MM-DD)"
            @update:modelValue="(v:string)=>{ t.customDates = { ...(t.customDates||{}), registrationEnd: v }; termsStore.updateOne(t.id,{ customDates: t.customDates }) }" />
          <UiButton variant="secondary" @click="removeTerm(t.id)">Remove</UiButton>
        </div>
      </div>
    </div>

    <div v-if="tab==='Courses'" class="bg-white rounded border p-3 space-y-2">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-semibold">Courses</h2>
        <UiButton @click="addCourse">Add Course</UiButton>
      </div>
      <div class="divide-y">
        <div v-for="c in courses" :key="c.id" class="grid grid-cols-1 sm:grid-cols-4 gap-2 p-2 items-center">
          <router-link class="text-blue-600 hover:underline" :to="{ name: 'CourseDetail', params: { id: c.id } }">{{ c.title }}</router-link>
          <UiInput v-model="c.code" placeholder="Code" @update:modelValue="(v:string)=>coursesStore.updateOne(c.id,{ code: v })" />
          <UiSelect v-model="c.programId" @update:modelValue="(v:string|undefined)=>coursesStore.updateOne(c.id,{ programId: v as any })">
            <option :value="undefined">No Program</option>
            <option v-for="p in programs" :value="p.id">{{ p.name }}</option>
          </UiSelect>
          <UiButton variant="secondary" @click="removeCourse(c.id)">Remove</UiButton>
        </div>
      </div>
    </div>

    <div v-if="tab==='Sections'" class="bg-white rounded border p-3 space-y-2">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-semibold">Sections</h2>
        <UiButton @click="addSection">Add Section</UiButton>
      </div>
      <div class="divide-y">
        <div v-for="s in sections" :key="s.id" class="grid grid-cols-1 sm:grid-cols-6 gap-2 p-2 items-center">
          <router-link class="text-blue-600 hover:underline" :to="{ name: 'SectionDetail', params: { id: s.id } }">{{ s.title || 'Section' }}</router-link>
          <UiSelect v-model="s.courseId" @update:modelValue="(v:string)=>sectionsStore.updateOne(s.id,{ courseId: v })">
            <option v-for="c in courses" :value="c.id">{{ c.title }}</option>
          </UiSelect>
          <UiSelect v-model="s.termId" @update:modelValue="(v:string)=>sectionsStore.updateOne(s.id,{ termId: v })">
            <option v-for="t in terms" :value="t.id">{{ t.name }}</option>
          </UiSelect>
          <UiInput v-model="s.capacity" type="number" placeholder="Capacity" @update:modelValue="(v:any)=>sectionsStore.updateOne(s.id,{ capacity: Number(v) })" />
          <label class="flex items-center gap-2 text-sm"><UiCheckbox v-model="s.allowRegistration" @update:modelValue="(v:boolean)=>sectionsStore.updateOne(s.id,{ allowRegistration: v })" /> Allow Registration</label>
          <UiInput v-model="s.meetingInfo" placeholder="Meeting info" @update:modelValue="(v:string)=>sectionsStore.updateOne(s.id,{ meetingInfo: v })" />
          <UiButton variant="secondary" @click="removeSection(s.id)">Remove</UiButton>
        </div>
      </div>
    </div>

    <div v-if="tab==='HighSchools'" class="bg-white rounded border p-3 space-y-2">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-semibold">High Schools</h2>
        <UiButton @click="addHS">Add High School</UiButton>
      </div>
      <div class="divide-y">
        <div v-for="h in highSchools" :key="h.id" class="flex items-center gap-2 p-2">
          <router-link class="text-blue-600 hover:underline" :to="{ name: 'HighSchoolDetail', params: { id: h.id } }">{{ h.name }}</router-link>
          <UiButton variant="secondary" @click="removeHS(h.id)">Remove</UiButton>
        </div>
      </div>
    </div>

    <div v-if="tab==='Settings'" class="bg-white rounded border p-3 space-y-3">
      <h2 class="text-sm font-semibold">Settings</h2>
      <label class="flex items-center gap-2 text-sm">
        <UiCheckbox v-model="settings.registrationOpen" /> Registration Open
      </label>
      <UiFormField label="No Registration message">
        <UiInput v-model="settings.noRegistrationMessage" placeholder="Registration is currently closed." />
      </UiFormField>
      <div class="flex items-center gap-2">
        <UiButton @click="saveSettings">Save Settings</UiButton>
        <UiButton variant="secondary" @click="exportAll">Export JSON</UiButton>
        <label class="text-sm inline-flex items-center gap-2">
          <span class="px-3 py-2 border rounded bg-white cursor-pointer">Import JSON</span>
          <input type="file" accept="application/json" class="hidden" @change="importAll" />
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


