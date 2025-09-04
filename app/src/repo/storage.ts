import { LOCAL_KEYS, type AuditRecord, type CurrentUser, type DocumentMetadata, type Result, type StudentApplicationRecord } from "../types";

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


