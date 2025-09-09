import { LOCAL_KEYS, type CourseRecord } from "../types";
import { coursesSeed } from "../seed/courses";
import { delay } from "../helpers/delay";
import { idFactory } from "../helpers/idFactory";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

let db: CourseRecord[] | null = null;

function ensureDb(): CourseRecord[] {
  if (db) return db;
  const stored = safeParse<CourseRecord[]>(localStorage.getItem(LOCAL_KEYS.courses));
  db = stored ?? coursesSeed.map(c => ({ id: c.id, title: c.title, programId: c.programId, code: c.code }));
  if (!stored) localStorage.setItem(LOCAL_KEYS.courses, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(LOCAL_KEYS.courses, JSON.stringify(db));
}

export const coursesService = {
  async list(): Promise<CourseRecord[]> {
    await delay();
    return [...ensureDb()];
  },
  async get(id: string): Promise<CourseRecord | null> {
    await delay();
    const found = ensureDb().find(p => p.id === id) ?? null;
    return found ? { ...found } : null;
  },
  async create(input: Omit<CourseRecord, "id"> & { id?: string }): Promise<CourseRecord> {
    await delay();
    const next: CourseRecord = { id: input.id ?? idFactory("course"), ...input };
    ensureDb().unshift(next);
    persist();
    return { ...next };
  },
  async update(id: string, patch: Partial<CourseRecord>): Promise<CourseRecord> {
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


