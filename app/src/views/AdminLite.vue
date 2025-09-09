<script setup lang="ts">
import { ref, watch } from 'vue'
import { ProgramsRepo, TermsRepo, CoursesRepo, SectionsRepo, HighSchoolsRepo, SettingsRepo, IdUtil } from '../repo/storage'
import type { ProgramRecord, TermRecord, CourseRecord, SectionRecord, HighSchoolRecord, SettingsRecord } from '../types'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const initialTab = typeof route.params.tab === 'string' ? route.params.tab : 'Programs'
const tab = ref(initialTab)

// load
const programs = ref<ProgramRecord[]>(ProgramsRepo.list())
const terms = ref<TermRecord[]>(TermsRepo.list())
const courses = ref<CourseRecord[]>(CoursesRepo.list())
const sections = ref<SectionRecord[]>(SectionsRepo.list())
const highSchools = ref<HighSchoolRecord[]>(HighSchoolsRepo.list())
const settings = ref<SettingsRecord>(SettingsRepo.get())

function addProgram() { const p = { id: IdUtil.uid('prog'), name: 'New Program' }; programs.value=[...programs.value,p]; ProgramsRepo.saveAll(programs.value) }
function removeProgram(id:string){ programs.value = programs.value.filter(x=>x.id!==id); ProgramsRepo.saveAll(programs.value) }

function addTerm(){ const t: TermRecord = { id: IdUtil.uid('term'), name: 'New Term', isActive: true, customDates: {} }; terms.value=[...terms.value,t]; TermsRepo.saveAll(terms.value) }
function removeTerm(id:string){ terms.value = terms.value.filter(x=>x.id!==id); TermsRepo.saveAll(terms.value) }

function addCourse(){ const c: CourseRecord = { id: IdUtil.uid('course'), title: 'New Course' }; courses.value=[...courses.value,c]; CoursesRepo.saveAll(courses.value) }
function removeCourse(id:string){ courses.value = courses.value.filter(x=>x.id!==id); CoursesRepo.saveAll(courses.value) }

function addSection(){ const s: SectionRecord = { id: IdUtil.uid('sect'), courseId: courses.value[0]?.id || '', termId: terms.value[0]?.id || '', allowRegistration: true }; sections.value=[...sections.value,s]; SectionsRepo.saveAll(sections.value) }
function removeSection(id:string){ sections.value = sections.value.filter(x=>x.id!==id); SectionsRepo.saveAll(sections.value) }

function addHS(){ const h: HighSchoolRecord = { id: IdUtil.uid('hs'), name: 'New High School' }; highSchools.value=[...highSchools.value,h]; HighSchoolsRepo.saveAll(highSchools.value) }
function removeHS(id:string){ highSchools.value = highSchools.value.filter(x=>x.id!==id); HighSchoolsRepo.saveAll(highSchools.value) }

function saveSettings(){ SettingsRepo.set(settings.value) }

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
  reader.onload = () => {
    try{
      const obj = JSON.parse(String(reader.result));
      if (obj.programs) { programs.value = obj.programs; ProgramsRepo.saveAll(programs.value) }
      if (obj.terms) { terms.value = obj.terms; TermsRepo.saveAll(terms.value) }
      if (obj.courses) { courses.value = obj.courses; CoursesRepo.saveAll(courses.value) }
      if (obj.sections) { sections.value = obj.sections; SectionsRepo.saveAll(sections.value) }
      if (obj.highSchools) { highSchools.value = obj.highSchools; HighSchoolsRepo.saveAll(highSchools.value) }
      if (obj.settings) { settings.value = obj.settings; SettingsRepo.set(settings.value) }
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
          <label class="flex items-center gap-2 text-sm"><UiCheckbox v-model="t.isActive" @update:modelValue="TermsRepo.saveAll(terms)" /> Active</label>
          <UiInput :model-value="t.customDates?.registrationStart || ''" placeholder="Reg Start (YYYY-MM-DD)"
            @update:modelValue="(v:string)=>{ t.customDates = { ...(t.customDates||{}), registrationStart: v }; TermsRepo.saveAll(terms) }" />
          <UiInput :model-value="t.customDates?.registrationEnd || ''" placeholder="Reg End (YYYY-MM-DD)"
            @update:modelValue="(v:string)=>{ t.customDates = { ...(t.customDates||{}), registrationEnd: v }; TermsRepo.saveAll(terms) }" />
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
          <UiInput v-model="c.code" placeholder="Code" @update:modelValue="CoursesRepo.saveAll(courses)" />
          <UiSelect v-model="c.programId" @update:modelValue="CoursesRepo.saveAll(courses)">
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
          <UiSelect v-model="s.courseId" @update:modelValue="SectionsRepo.saveAll(sections)">
            <option v-for="c in courses" :value="c.id">{{ c.title }}</option>
          </UiSelect>
          <UiSelect v-model="s.termId" @update:modelValue="SectionsRepo.saveAll(sections)">
            <option v-for="t in terms" :value="t.id">{{ t.name }}</option>
          </UiSelect>
          <UiInput v-model="s.capacity" type="number" placeholder="Capacity" @update:modelValue="SectionsRepo.saveAll(sections)" />
          <label class="flex items-center gap-2 text-sm"><UiCheckbox v-model="s.allowRegistration" @update:modelValue="SectionsRepo.saveAll(sections)" /> Allow Registration</label>
          <UiInput v-model="s.meetingInfo" placeholder="Meeting info" @update:modelValue="SectionsRepo.saveAll(sections)" />
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


