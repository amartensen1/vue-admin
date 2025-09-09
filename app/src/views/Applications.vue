<script setup lang="ts">
import { computed, ref } from "vue";
import { Repository } from "../repo/storage";
import { IdUtil } from "../repo/storage";
import type { StudentApplicationRecord, DocumentMetadata } from "../types";
import { useSessionStore } from "../stores/session";

const view = ref<"list" | "kanban">("list");
const query = ref("");
const statusFilter = ref<"All" | "Draft" | "Submitted">("All");
const schoolFilter = ref<string>("All");
const dateFrom = ref<string>("");
const dateTo = ref<string>("");
const sortKey = ref<"updatedAt" | "name">("updatedAt");
const sortDir = ref<"asc" | "desc">("desc");

const records = ref<StudentApplicationRecord[]>(Repository.listApplications());
const schoolOptions = computed(() => {
  const names = Array.from(new Set(records.value.map(r => r.school.name || ""))).filter(Boolean).sort();
  return ["All", ...names];
});
// Drawer state
const drawerOpen = ref(false);
const editingId = ref<string | null>(null);
const form = ref({
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  phone: "",
  schoolName: "",
  guardianName: "",
  guardianEmail: "",
  guardianPhone: "",
  notes: "",
  hs_current_grade: "",
  hs_stud_id: "",
  hs_start_date: "",
  hs_grad_date: "",
  hs_gpa: "",
  class_rank: "",
});
const errors = ref<Record<string, string>>({});
const docs = ref<DocumentMetadata[]>(Repository.listDocuments());
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const session = useSessionStore();

const filtersOpen = ref(false);

function clearAllFilters() {
  statusFilter.value = "All";
  schoolFilter.value = "All";
  dateFrom.value = "";
  dateTo.value = "";
  sortKey.value = "updatedAt";
  sortDir.value = "desc";
}

function openCreate() {
  editingId.value = null;
  Object.assign(form.value, { firstName: "", lastName: "", dob: "", email: "", phone: "", schoolName: "", guardianName: "", guardianEmail: "", guardianPhone: "", notes: "" });
  errors.value = {};
  drawerOpen.value = true;
}

function openEdit(id: string) {
  const r = records.value.find(x => x.id === id);
  if (!r) return;
  editingId.value = id;
  Object.assign(form.value, {
    firstName: r.profile.firstName,
    lastName: r.profile.lastName,
    dob: r.profile.dob ?? "",
    email: r.profile.email ?? "",
    phone: r.profile.phone ?? "",
    schoolName: r.school.name ?? "",
    guardianName: r.guardians?.[0]?.name ?? "",
    guardianEmail: r.guardians?.[0]?.email ?? "",
    guardianPhone: r.guardians?.[0]?.phone ?? "",
    notes: r.notes ?? "",
    hs_current_grade: r.hs_current_grade ?? "",
    hs_stud_id: r.hs_stud_id ?? "",
    hs_start_date: r.hs_start_date ?? "",
    hs_grad_date: r.hs_grad_date ?? "",
    hs_gpa: r.hs_gpa?.toString?.() ?? "",
    class_rank: r.class_rank ?? "",
  });
  errors.value = {};
  drawerOpen.value = true;
}

function validate(): boolean {
  const e: Record<string, string> = {};
  if (!form.value.firstName.trim()) e.firstName = "First name is required";
  if (!form.value.lastName.trim()) e.lastName = "Last name is required";
  if (form.value.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email)) e.email = "Enter a valid email";
  if (form.value.dob && !/^\d{4}-\d{2}-\d{2}$/.test(form.value.dob)) e.dob = "Use YYYY-MM-DD";
  errors.value = e;
  return Object.keys(e).length === 0;
}

function softDuplicateWarning(): string | null {
  const nameDob = `${form.value.firstName.trim().toLowerCase()}|${form.value.lastName.trim().toLowerCase()}|${form.value.dob}`;
  const exists = records.value.some(r => `${r.profile.firstName.toLowerCase()}|${r.profile.lastName.toLowerCase()}|${r.profile.dob ?? ''}` === nameDob && r.id !== editingId.value);
  return exists ? "A student with the same name and DOB exists." : null;
}

function saveDraft() {
  if (!validate()) return;
  const duplicate = softDuplicateWarning();
  if (duplicate && !confirm(`${duplicate}\nContinue?`)) return;
  const now = new Date().toISOString();
  if (!editingId.value) {
    const created: StudentApplicationRecord = {
      id: IdUtil.uid("app"),
      createdAt: now,
      updatedAt: now,
      createdBy: session.currentUser!.id,
      status: "Draft",
      profile: { firstName: form.value.firstName.trim(), lastName: form.value.lastName.trim(), dob: form.value.dob || undefined, email: form.value.email || undefined, phone: form.value.phone || undefined },
      school: { name: form.value.schoolName || undefined },
      guardians: form.value.guardianName || form.value.guardianEmail || form.value.guardianPhone ? [{ name: form.value.guardianName || undefined, email: form.value.guardianEmail || undefined, phone: form.value.guardianPhone || undefined }] : [],
      notes: form.value.notes || undefined,
      hs_current_grade: form.value.hs_current_grade || undefined,
      hs_stud_id: form.value.hs_stud_id || undefined,
      hs_start_date: form.value.hs_start_date || undefined,
      hs_grad_date: form.value.hs_grad_date || undefined,
      hs_gpa: form.value.hs_gpa ? Number(form.value.hs_gpa) : undefined,
      class_rank: form.value.class_rank || undefined,
    };
    records.value = [...records.value, created];
    Repository.saveApplications(records.value);
    Repository.appendAudit({ id: IdUtil.uid("audit"), ts: now, actorId: session.currentUser!.id, actorRole: session.currentUser!.role, action: "APP_CREATE", meta: { id: created.id } });
    editingId.value = created.id;
  } else {
    const updated = Repository.updateApplication(editingId.value, {
      profile: { firstName: form.value.firstName.trim(), lastName: form.value.lastName.trim(), dob: form.value.dob || undefined, email: form.value.email || undefined, phone: form.value.phone || undefined },
      school: { name: form.value.schoolName || undefined },
      guardians: form.value.guardianName || form.value.guardianEmail || form.value.guardianPhone ? [{ name: form.value.guardianName || undefined, email: form.value.guardianEmail || undefined, phone: form.value.guardianPhone || undefined }] : [],
      notes: form.value.notes || undefined,
      hs_current_grade: form.value.hs_current_grade || undefined,
      hs_stud_id: form.value.hs_stud_id || undefined,
      hs_start_date: form.value.hs_start_date || undefined,
      hs_grad_date: form.value.hs_grad_date || undefined,
      hs_gpa: form.value.hs_gpa ? Number(form.value.hs_gpa) : undefined,
      class_rank: form.value.class_rank || undefined,
    });
    if (updated) {
      records.value = records.value.map(r => r.id === updated.id ? updated : r);
      Repository.appendAudit({ id: IdUtil.uid("audit"), ts: now, actorId: session.currentUser!.id, actorRole: session.currentUser!.role, action: "APP_EDIT", meta: { id: updated.id } });
    }
  }
  drawerOpen.value = false;
}

function submitApp() {
  if (!validate()) return;
  // require core fields for submit
  if (!form.value.dob || !form.value.email) {
    errors.value = { ...errors.value, dob: errors.value.dob || (!form.value.dob ? 'DOB is required' : ''), email: errors.value.email || (!form.value.email ? 'Email is required' : '') };
    return;
  }
  const now = new Date().toISOString();
  if (!editingId.value) return;
  const updated = Repository.updateApplication(editingId.value, { status: "Submitted" });
  if (updated) {
    records.value = records.value.map(r => r.id === updated.id ? updated : r);
    Repository.appendAudit({ id: IdUtil.uid("audit"), ts: now, actorId: session.currentUser!.id, actorRole: session.currentUser!.role, action: "APP_SUBMIT", meta: { id: updated.id } });
  }
  drawerOpen.value = false;
}

async function onFileChange(file: File) {
  if (!editingId.value || !session.currentUser) return;
  if (file.size > MAX_SIZE) { alert("File exceeds 10 MB limit"); return; }
  const reader = new FileReader();
  const base64: string = await new Promise((resolve, reject) => {
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
  const add = Repository.addDocument({
    applicationId: editingId.value,
    kind: "Other",
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    storedRef: base64,
    uploadedBy: session.currentUser.id,
  });
  if (add.ok) {
    docs.value = Repository.listDocuments();
    Repository.appendAudit({ id: IdUtil.uid("audit"), ts: new Date().toISOString(), actorId: session.currentUser.id, actorRole: session.currentUser.role, action: "DOC_ADD", meta: { applicationId: editingId.value, docId: add.value.id } });
  } else {
    alert(add.error);
  }
}

function removeDoc(id: string) {
  if (!session.currentUser) return;
  Repository.removeDocument(id);
  docs.value = Repository.listDocuments();
  Repository.appendAudit({ id: IdUtil.uid("audit"), ts: new Date().toISOString(), actorId: session.currentUser.id, actorRole: session.currentUser.role, action: "DOC_REMOVE", meta: { docId: id } });
}

const filtered = computed(() => {
  let r = records.value;
  if (statusFilter.value !== "All") {
    r = r.filter(x => x.status === statusFilter.value);
  }
  if (schoolFilter.value !== "All") {
    r = r.filter(x => (x.school.name || "") === schoolFilter.value);
  }
  if (query.value.trim()) {
    const q = query.value.toLowerCase();
    r = r.filter(x =>
      `${x.profile.firstName} ${x.profile.lastName}`.toLowerCase().includes(q) ||
      (x.school.name ?? "").toLowerCase().includes(q)
    );
  }
  // Date range by updatedAt
  if (dateFrom.value) {
    const from = new Date(`${dateFrom.value}T00:00:00`).toISOString();
    r = r.filter(x => x.updatedAt >= from);
  }
  if (dateTo.value) {
    const to = new Date(`${dateTo.value}T23:59:59`).toISOString();
    r = r.filter(x => x.updatedAt <= to);
  }
  // Sort
  r = [...r].sort((a, b) => {
    if (sortKey.value === "name") {
      const an = `${a.profile.lastName} ${a.profile.firstName}`.toLowerCase();
      const bn = `${b.profile.lastName} ${b.profile.firstName}`.toLowerCase();
      return sortDir.value === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
    }
    // updatedAt
    return sortDir.value === "asc" ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt);
  });
  return r;
});

const editingRecord = computed(() => records.value.find(r => r.id === editingId.value) || null);
const isReadOnly = computed(() => editingRecord.value?.status === "Submitted");

function isSubmitReady(): boolean {
  const emailOk = !!form.value.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email);
  const dobOk = !!form.value.dob && /^\d{4}-\d{2}-\d{2}$/.test(form.value.dob);
  return !!form.value.firstName && !!form.value.lastName && emailOk && dobOk;
}

function onSortChange(payload: { key: string; dir: 'asc' | 'desc' }) {
  sortDir.value = payload.dir;
  sortKey.value = payload.key === 'student' ? 'name' : 'updatedAt';
}
</script>

<template>
  <div class="space-y-4">
    <UiToolbar title="Applications">
      <UiInput v-model="query" type="search" placeholder="Search" class="w-full sm:w-56" />
      <div class="flex items-center gap-2">
        <UiButton variant="secondary" @click="filtersOpen = !filtersOpen">Filters</UiButton>
        <div class="flex flex-wrap items-center gap-1">
          <UiBadge v-if="statusFilter !== 'All'">Status: {{ statusFilter }} <button class="ml-1" @click.stop="statusFilter='All'">✕</button></UiBadge>
          <UiBadge v-if="schoolFilter !== 'All'">School: {{ schoolFilter }} <button class="ml-1" @click.stop="schoolFilter='All'">✕</button></UiBadge>
          <UiBadge v-if="dateFrom || dateTo">Date: {{ dateFrom || '…' }} → {{ dateTo || '…' }} <button class="ml-1" @click.stop="dateFrom=''; dateTo=''">✕</button></UiBadge>
        </div>
      </div>
      <div class="flex items-center gap-2 ml-auto">
        <UiButton variant="secondary" :class="view==='list' ? 'bg-gray-100' : ''" @click="view = 'list'">List</UiButton>
        <UiButton variant="secondary" :class="view==='kanban' ? 'bg-gray-100' : ''" @click="view = 'kanban'">Kanban</UiButton>
        <UiButton @click="openCreate()">New</UiButton>
      </div>
    </UiToolbar>

    <div v-if="filtersOpen" class="bg-white rounded border p-3 sm:p-4 shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <UiFormField label="Status">
          <UiSelect v-model="statusFilter">
            <option>All</option>
            <option>Draft</option>
            <option>Submitted</option>
          </UiSelect>
        </UiFormField>
        <UiFormField label="High School">
          <UiSelect v-model="schoolFilter">
            <option v-for="name in schoolOptions" :key="name">{{ name }}</option>
          </UiSelect>
        </UiFormField>
        <UiFormField label="From date">
          <UiInput v-model="dateFrom" type="date" />
        </UiFormField>
        <UiFormField label="To date">
          <UiInput v-model="dateTo" type="date" />
        </UiFormField>
        <UiFormField label="Sort by">
          <UiSelect v-model="sortKey">
            <option value="updatedAt">Last updated</option>
            <option value="name">Student name</option>
          </UiSelect>
        </UiFormField>
        <UiFormField label="Sort direction">
          <UiSelect v-model="sortDir">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </UiSelect>
        </UiFormField>
      </div>
      <div class="mt-3 flex justify-end gap-2">
        <UiButton variant="ghost" @click="clearAllFilters()">Clear all</UiButton>
        <UiButton @click="filtersOpen=false">Apply</UiButton>
      </div>
    </div>

    <div v-if="view === 'list'" class="bg-white rounded shadow overflow-hidden">
      <UiDataTable :columns="[
        { key: 'student', label: 'Student', sortable: true },
        { key: 'school', label: 'High School' },
        { key: 'created', label: 'Created' },
        { key: 'status', label: 'Status' },
        { key: 'docs', label: 'Docs' },
        { key: 'updated', label: 'Updated', sortable: true },
        { key: 'actions', label: 'Actions' },
      ]" :rows="filtered.map(r => ({
        id: r.id,
        student: `${r.profile.firstName} ${r.profile.lastName}`,
        school: r.school.name ?? '',
        created: new Date(r.createdAt).toLocaleString(),
        status: r.status,
        docs: docs.filter(d => d.applicationId === r.id).length,
        updated: new Date(r.updatedAt).toLocaleString(),
      }))" row-clickable @row-click="(row:any)=>openEdit(row.id)" :sort-key="sortKey === 'name' ? 'student' : 'updated'" :sort-dir="sortDir" @sort-change="onSortChange">
        <template #cell:student="{ row }">
          <span class="truncate" :title="row.student">{{ row.student }}</span>
        </template>
        <template #cell:status="{ row }">
          <UiBadge :tone="row.status==='Submitted' ? 'success' : 'neutral'">{{ row.status }}</UiBadge>
        </template>
        <template #cell:docs="{ row }">
          <UiBadge tone="neutral">{{ row.docs }}</UiBadge>
        </template>
        <template #cell:actions="{ row }">
          <UiButton size="sm" variant="secondary" @click.stop="openEdit(row.id)">View</UiButton>
        </template>
        <template #empty>
          <UiEmptyState title="No applications found" description="Try adjusting filters or create your first application.">
            <UiButton @click="openCreate()">Create application</UiButton>
          </UiEmptyState>
        </template>
      </UiDataTable>
    </div>

    <UiDrawer :open="drawerOpen" title="Application" @close="drawerOpen=false">
      <div class="space-y-4">
        <section class="space-y-2">
          <h3 class="text-sm font-semibold">Student</h3>
          <UiFormField label="First name" :error="errors.firstName">
            <UiInput v-model="form.firstName" :disabled="isReadOnly" />
          </UiFormField>
          <UiFormField label="Last name" :error="errors.lastName">
            <UiInput v-model="form.lastName" :disabled="isReadOnly" />
          </UiFormField>
          <UiFormField label="DOB" hint="YYYY-MM-DD" :error="errors.dob">
            <UiInput v-model="form.dob" placeholder="2006-09-14" :disabled="isReadOnly" />
          </UiFormField>
          <UiFormField label="Email" :error="errors.email">
            <UiInput v-model="form.email" type="email" :disabled="isReadOnly" />
          </UiFormField>
          <UiFormField label="Phone">
            <UiInput v-model="form.phone" :disabled="isReadOnly" />
          </UiFormField>
        </section>

        <section class="space-y-2">
          <h3 class="text-sm font-semibold">School</h3>
          <UiFormField label="High School name">
            <UiInput v-model="form.schoolName" :disabled="isReadOnly" />
          </UiFormField>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <UiFormField label="HS current grade">
              <UiInput v-model="form.hs_current_grade" :disabled="isReadOnly" />
            </UiFormField>
            <UiFormField label="HS student ID">
              <UiInput v-model="form.hs_stud_id" :disabled="isReadOnly" />
            </UiFormField>
            <UiFormField label="HS start date">
              <UiInput v-model="form.hs_start_date" type="date" :disabled="isReadOnly" />
            </UiFormField>
            <UiFormField label="HS grad date">
              <UiInput v-model="form.hs_grad_date" type="date" :disabled="isReadOnly" />
            </UiFormField>
            <UiFormField label="HS GPA">
              <UiInput v-model="form.hs_gpa" type="number" step="0.01" :disabled="isReadOnly" />
            </UiFormField>
            <UiFormField label="Class rank">
              <UiInput v-model="form.class_rank" :disabled="isReadOnly" />
            </UiFormField>
          </div>
        </section>

        <section class="space-y-2">
          <h3 class="text-sm font-semibold">Guardian (optional)</h3>
          <UiFormField label="Name">
            <UiInput v-model="form.guardianName" :disabled="isReadOnly" />
          </UiFormField>
          <UiFormField label="Email">
            <UiInput v-model="form.guardianEmail" :disabled="isReadOnly" />
          </UiFormField>
          <UiFormField label="Phone">
            <UiInput v-model="form.guardianPhone" :disabled="isReadOnly" />
          </UiFormField>
        </section>

        <section class="space-y-2">
          <h3 class="text-sm font-semibold">Notes</h3>
          <UiTextarea v-model="form.notes" :disabled="false" />
        </section>

        <section class="space-y-2">
          <h3 class="text-sm font-semibold">Documents</h3>
          <div class="flex items-center gap-2">
            <UiFileButton accept=".pdf,.png,.jpg,.jpeg" :disabled="!editingId" @change="onFileChange">Upload file</UiFileButton>
            <span class="text-xs text-gray-500">Max 10 MB</span>
          </div>
          <div class="divide-y rounded border bg-white">
            <div v-for="d in docs.filter(x => x.applicationId === editingId)" :key="d.id" class="flex items-center justify-between p-2">
              <div class="min-w-0 mr-2">
                <div class="text-sm truncate" :title="d.name">{{ d.name }}</div>
                <div class="text-xs text-gray-500 truncate">{{ (d.size/1024).toFixed(1) }} KB • {{ d.mimeType }} • {{ new Date(d.uploadedAt).toLocaleString() }}</div>
              </div>
              <UiButton size="sm" variant="secondary" @click="removeDoc(d.id)">Remove</UiButton>
            </div>
            <div v-if="docs.filter(x => x.applicationId === editingId).length===0" class="p-3 text-sm text-gray-500">No documents</div>
          </div>
        </section>
      </div>

      <template #footer>
        <UiButton variant="ghost" @click="drawerOpen=false">Close</UiButton>
        <UiButton v-if="!isReadOnly" variant="secondary" @click="saveDraft()">Save Draft</UiButton>
        <UiButton v-if="!isReadOnly" :disabled="!isSubmitReady()" @click="submitApp()">Submit</UiButton>
      </template>
    </UiDrawer>

    <div v-if="view === 'kanban'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-sm font-medium">Draft</h2>
          <UiBadge tone="neutral">{{ filtered.filter(x => x.status==='Draft').length }}</UiBadge>
        </div>
        <div class="space-y-2">
          <div v-for="r in filtered.filter(x => x.status==='Draft')" :key="r.id" class="bg-white rounded shadow p-3 cursor-pointer hover:bg-gray-50" @click="openEdit(r.id)">
            <div class="font-medium truncate" :title="`${r.profile.firstName} ${r.profile.lastName}`">{{ r.profile.firstName }} {{ r.profile.lastName }}</div>
            <div class="text-xs text-gray-500">Updated {{ new Date(r.updatedAt).toLocaleString() }}</div>
          </div>
          <div v-if="filtered.filter(x => x.status==='Draft').length===0" class="text-sm text-gray-500">No drafts</div>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-sm font-medium">Submitted</h2>
          <UiBadge tone="success">{{ filtered.filter(x => x.status==='Submitted').length }}</UiBadge>
        </div>
        <div class="space-y-2">
          <div v-for="r in filtered.filter(x => x.status==='Submitted')" :key="r.id" class="bg-white rounded shadow p-3 cursor-pointer hover:bg-gray-50" @click="openEdit(r.id)">
            <div class="font-medium truncate" :title="`${r.profile.firstName} ${r.profile.lastName}`">{{ r.profile.firstName }} {{ r.profile.lastName }}</div>
            <div class="text-xs text-gray-500">Updated {{ new Date(r.updatedAt).toLocaleString() }}</div>
          </div>
          <div v-if="filtered.filter(x => x.status==='Submitted').length===0" class="text-sm text-gray-500">No submitted</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


