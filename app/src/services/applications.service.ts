import { LOCAL_KEYS, type StudentApplicationRecord, type DocumentMetadata, type Result } from "../types";
import { delay } from "../helpers/delay";
import { idFactory } from "../helpers/idFactory";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

export const applicationsService = {
  async list(): Promise<StudentApplicationRecord[]> {
    await delay();
    return safeParse<StudentApplicationRecord[]>(localStorage.getItem(LOCAL_KEYS.students)) ?? [];
  },
  async saveAll(records: StudentApplicationRecord[]): Promise<void> {
    await delay();
    localStorage.setItem(LOCAL_KEYS.students, JSON.stringify(records));
  },
  async create(partial: Omit<StudentApplicationRecord, "id" | "createdAt" | "updatedAt">): Promise<StudentApplicationRecord> {
    await delay();
    const now = new Date().toISOString();
    const record: StudentApplicationRecord = { id: idFactory("app"), createdAt: now, updatedAt: now, ...partial };
    const all = (await this.list());
    all.push(record);
    await this.saveAll(all);
    return record;
  },
  async update(id: string, patch: Partial<StudentApplicationRecord>): Promise<StudentApplicationRecord | null> {
    await delay();
    const all = await this.list();
    const idx = all.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    const updated: StudentApplicationRecord = { ...all[idx], ...patch, updatedAt: now };
    all[idx] = updated;
    await this.saveAll(all);
    return updated;
  },
  async listDocuments(): Promise<DocumentMetadata[]> {
    await delay();
    return safeParse<DocumentMetadata[]>(localStorage.getItem(LOCAL_KEYS.docs)) ?? [];
  },
  async saveDocuments(records: DocumentMetadata[]): Promise<void> {
    await delay();
    localStorage.setItem(LOCAL_KEYS.docs, JSON.stringify(records));
  },
  async addDocument(meta: Omit<DocumentMetadata, "id" | "uploadedAt">): Promise<Result<DocumentMetadata>> {
    await delay();
    const now = new Date().toISOString();
    const record: DocumentMetadata = { id: idFactory("doc"), uploadedAt: now, ...meta } as DocumentMetadata;
    const all = await this.listDocuments();
    all.push(record);
    await this.saveDocuments(all);
    return { ok: true, value: record };
  },
  async removeDocument(id: string): Promise<Result<true>> {
    await delay();
    const all = await this.listDocuments();
    const next = all.filter(d => d.id !== id);
    await this.saveDocuments(next);
    return { ok: true, value: true };
  },
};


