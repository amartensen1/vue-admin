import { LOCAL_KEYS, type SectionRecord } from "../types";
import { sectionsSeed } from "../seed/sections";
import { delay } from "../helpers/delay";
import { idFactory } from "../helpers/idFactory";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

let db: SectionRecord[] | null = null;

function ensureDb(): SectionRecord[] {
  if (db) return db;
  const stored = safeParse<SectionRecord[]>(localStorage.getItem(LOCAL_KEYS.sections));
  db = stored ?? sectionsSeed.map(s => ({
    id: s.id,
    courseId: s.courseId,
    termId: s.termId,
    allowRegistration: s.allowRegistration,
    capacity: s.capacity,
    meetingInfo: s.meetingInfo,
  }));
  if (!stored) localStorage.setItem(LOCAL_KEYS.sections, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(LOCAL_KEYS.sections, JSON.stringify(db));
}

export const sectionsService = {
  async list(): Promise<SectionRecord[]> {
    await delay();
    return [...ensureDb()];
  },
  async get(id: string): Promise<SectionRecord | null> {
    await delay();
    const found = ensureDb().find(p => p.id === id) ?? null;
    return found ? { ...found } : null;
  },
  async create(input: Omit<SectionRecord, "id"> & { id?: string }): Promise<SectionRecord> {
    await delay();
    const next: SectionRecord = { id: input.id ?? idFactory("sect"), ...input };
    ensureDb().unshift(next);
    persist();
    return { ...next };
  },
  async update(id: string, patch: Partial<SectionRecord>): Promise<SectionRecord> {
    await delay();
    const all = ensureDb();
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Not found");
    all[idx] = { ...all[idx], ...patch };
    persist();
    return { ...all[idx] };
  },
  async remove(id: string): Promise<void> {
    await delay();
    db = ensureDb().filter(p => p.id !== id);
    persist();
  },
};


