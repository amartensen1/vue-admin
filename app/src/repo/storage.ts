import { LOCAL_KEYS, type AuditRecord, type ConsentRecord, type ConsentTokenRecord, type CurrentUser, type DocumentMetadata, type RegistrationRecord, type ReminderRecord, type Result, type StudentApplicationRecord, type ProgramRecord, type TermRecord, type CourseRecord, type SectionRecord, type HighSchoolRecord, type SettingsRecord } from "../types";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch (_e) {
    return null;
  }
}

function uid(prefix = "id"): string {
  return `${prefix}_${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
}

export const Repository = {
  // Session
  getCurrentUser(): CurrentUser | null {
    return safeParse<CurrentUser>(localStorage.getItem(LOCAL_KEYS.currentUser));
  },
  setCurrentUser(user: CurrentUser): void {
    localStorage.setItem(LOCAL_KEYS.currentUser, JSON.stringify(user));
  },
  clearCurrentUser(): void {
    localStorage.removeItem(LOCAL_KEYS.currentUser);
  },

  // Audit
  appendAudit(record: AuditRecord): void {
    const existing = safeParse<AuditRecord[]>(localStorage.getItem(LOCAL_KEYS.audit)) ?? [];
    existing.push(record);
    localStorage.setItem(LOCAL_KEYS.audit, JSON.stringify(existing));
  },
  listAudit(): AuditRecord[] {
    return safeParse<AuditRecord[]>(localStorage.getItem(LOCAL_KEYS.audit)) ?? [];
  },
  clearAudit(): void {
    localStorage.removeItem(LOCAL_KEYS.audit);
  },

  // Applications
  listApplications(): StudentApplicationRecord[] {
    return safeParse<StudentApplicationRecord[]>(localStorage.getItem(LOCAL_KEYS.students)) ?? [];
  },
  saveApplications(records: StudentApplicationRecord[]): void {
    localStorage.setItem(LOCAL_KEYS.students, JSON.stringify(records));
  },
  createApplication(partial: Omit<StudentApplicationRecord, "id" | "createdAt" | "updatedAt">): StudentApplicationRecord {
    const now = new Date().toISOString();
    const record: StudentApplicationRecord = { id: uid("app"), createdAt: now, updatedAt: now, ...partial };
    const all = Repository.listApplications();
    all.push(record);
    Repository.saveApplications(all);
    return record;
  },
  updateApplication(id: string, update: Partial<StudentApplicationRecord>): StudentApplicationRecord | null {
    const all = Repository.listApplications();
    const idx = all.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    const updated: StudentApplicationRecord = { ...all[idx], ...update, updatedAt: now };
    all[idx] = updated;
    Repository.saveApplications(all);
    return updated;
  },

  // Documents metadata (binary store stubbed to base64 for prototype)
  listDocuments(): DocumentMetadata[] {
    return safeParse<DocumentMetadata[]>(localStorage.getItem(LOCAL_KEYS.docs)) ?? [];
  },
  saveDocuments(records: DocumentMetadata[]): void {
    localStorage.setItem(LOCAL_KEYS.docs, JSON.stringify(records));
  },
  addDocument(meta: Omit<DocumentMetadata, "id" | "uploadedAt">): Result<DocumentMetadata> {
    const now = new Date().toISOString();
    const record: DocumentMetadata = { id: uid("doc"), uploadedAt: now, ...meta } as DocumentMetadata;
    const all = Repository.listDocuments();
    all.push(record);
    Repository.saveDocuments(all);
    return { ok: true, value: record };
  },
  removeDocument(id: string): Result<true> {
    const all = Repository.listDocuments();
    const next = all.filter(d => d.id !== id);
    Repository.saveDocuments(next);
    return { ok: true, value: true };
  },

  // Prototype reset utilities
  resetAll(): void {
    [LOCAL_KEYS.currentUser, LOCAL_KEYS.students, LOCAL_KEYS.docs, LOCAL_KEYS.audit].forEach(k => localStorage.removeItem(k));
  },
};

export const IdUtil = { uid };

// Registrations repo helpers (Phase 2)
export const RegistrationsRepo = {
  list(): RegistrationRecord[] {
    return safeParse<RegistrationRecord[]>(localStorage.getItem(LOCAL_KEYS.registrations)) ?? [];
  },
  saveAll(items: RegistrationRecord[]): void {
    localStorage.setItem(LOCAL_KEYS.registrations, JSON.stringify(items));
  },
  upsert(item: RegistrationRecord): void {
    const all = RegistrationsRepo.list();
    const idx = all.findIndex(r => r.id === item.id);
    if (idx >= 0) all[idx] = item; else all.push(item);
    RegistrationsRepo.saveAll(all);
  },
  update(id: string, update: Partial<RegistrationRecord>): RegistrationRecord | null {
    const all = RegistrationsRepo.list();
    const idx = all.findIndex(r => r.id === id);
    if (idx === -1) return null;
    const next = { ...all[idx], ...update } as RegistrationRecord;
    all[idx] = next;
    RegistrationsRepo.saveAll(all);
    return next;
  },
};

export const ConsentsRepo = {
  list(): ConsentRecord[] {
    return safeParse<ConsentRecord[]>(localStorage.getItem(LOCAL_KEYS.consents)) ?? [];
  },
  saveAll(items: ConsentRecord[]): void {
    localStorage.setItem(LOCAL_KEYS.consents, JSON.stringify(items));
  },
  add(item: ConsentRecord): void {
    const all = ConsentsRepo.list();
    all.push(item);
    ConsentsRepo.saveAll(all);
  },
};

export const ConsentTokensRepo = {
  list(): ConsentTokenRecord[] {
    return safeParse<ConsentTokenRecord[]>(localStorage.getItem(LOCAL_KEYS.consentTokens)) ?? [];
  },
  saveAll(items: ConsentTokenRecord[]): void {
    localStorage.setItem(LOCAL_KEYS.consentTokens, JSON.stringify(items));
  },
  upsert(t: ConsentTokenRecord): void {
    const all = ConsentTokensRepo.list();
    const idx = all.findIndex(x => x.token === t.token);
    if (idx >= 0) all[idx] = t; else all.push(t);
    ConsentTokensRepo.saveAll(all);
  },
  byToken(token: string): ConsentTokenRecord | undefined {
    return ConsentTokensRepo.list().find(x => x.token === token);
  }
}

export const RemindersRepo = {
  list(): ReminderRecord[] {
    return safeParse<ReminderRecord[]>(localStorage.getItem(LOCAL_KEYS.reminders)) ?? [];
  },
  saveAll(items: ReminderRecord[]): void {
    localStorage.setItem(LOCAL_KEYS.reminders, JSON.stringify(items));
  },
  add(item: ReminderRecord): void {
    const all = RemindersRepo.list();
    all.push(item);
    RemindersRepo.saveAll(all);
  },
}

// Admin-Lite repos
export const ProgramsRepo = {
  list(): ProgramRecord[] { return safeParse<ProgramRecord[]>(localStorage.getItem(LOCAL_KEYS.programs)) ?? [] },
  saveAll(items: ProgramRecord[]): void { localStorage.setItem(LOCAL_KEYS.programs, JSON.stringify(items)) },
  upsert(item: ProgramRecord): void { const all = ProgramsRepo.list(); const i = all.findIndex(x=>x.id===item.id); if(i>=0) all[i]=item; else all.push(item); ProgramsRepo.saveAll(all) },
  remove(id: string): void { ProgramsRepo.saveAll(ProgramsRepo.list().filter(x=>x.id!==id)) },
}
export const TermsRepo = {
  list(): TermRecord[] { return safeParse<TermRecord[]>(localStorage.getItem(LOCAL_KEYS.terms)) ?? [] },
  saveAll(items: TermRecord[]): void { localStorage.setItem(LOCAL_KEYS.terms, JSON.stringify(items)) },
  upsert(item: TermRecord): void { const all = TermsRepo.list(); const i = all.findIndex(x=>x.id===item.id); if(i>=0) all[i]=item; else all.push(item); TermsRepo.saveAll(all) },
  remove(id: string): void { TermsRepo.saveAll(TermsRepo.list().filter(x=>x.id!==id)) },
}
export const CoursesRepo = {
  list(): CourseRecord[] { return safeParse<CourseRecord[]>(localStorage.getItem(LOCAL_KEYS.courses)) ?? [] },
  saveAll(items: CourseRecord[]): void { localStorage.setItem(LOCAL_KEYS.courses, JSON.stringify(items)) },
  upsert(item: CourseRecord): void { const all = CoursesRepo.list(); const i = all.findIndex(x=>x.id===item.id); if(i>=0) all[i]=item; else all.push(item); CoursesRepo.saveAll(all) },
  remove(id: string): void { CoursesRepo.saveAll(CoursesRepo.list().filter(x=>x.id!==id)) },
}
export const SectionsRepo = {
  list(): SectionRecord[] { return safeParse<SectionRecord[]>(localStorage.getItem(LOCAL_KEYS.sections)) ?? [] },
  saveAll(items: SectionRecord[]): void { localStorage.setItem(LOCAL_KEYS.sections, JSON.stringify(items)) },
  upsert(item: SectionRecord): void { const all = SectionsRepo.list(); const i = all.findIndex(x=>x.id===item.id); if(i>=0) all[i]=item; else all.push(item); SectionsRepo.saveAll(all) },
  remove(id: string): void { SectionsRepo.saveAll(SectionsRepo.list().filter(x=>x.id!==id)) },
}
export const HighSchoolsRepo = {
  list(): HighSchoolRecord[] { return safeParse<HighSchoolRecord[]>(localStorage.getItem(LOCAL_KEYS.highSchools)) ?? [] },
  saveAll(items: HighSchoolRecord[]): void { localStorage.setItem(LOCAL_KEYS.highSchools, JSON.stringify(items)) },
  upsert(item: HighSchoolRecord): void { const all = HighSchoolsRepo.list(); const i = all.findIndex(x=>x.id===item.id); if(i>=0) all[i]=item; else all.push(item); HighSchoolsRepo.saveAll(all) },
  remove(id: string): void { HighSchoolsRepo.saveAll(HighSchoolsRepo.list().filter(x=>x.id!==id)) },
}
export const SettingsRepo = {
  get(): SettingsRecord { return safeParse<SettingsRecord>(localStorage.getItem(LOCAL_KEYS.settings)) ?? { registrationOpen: true } },
  set(s: SettingsRecord): void { localStorage.setItem(LOCAL_KEYS.settings, JSON.stringify(s)) },
}


