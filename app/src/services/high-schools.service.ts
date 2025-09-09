import { LOCAL_KEYS, type HighSchoolRecord } from "../types";
import { highSchoolsSeed } from "../seed/high-schools";
import { delay } from "../helpers/delay";
import { idFactory } from "../helpers/idFactory";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

let db: HighSchoolRecord[] | null = null;

function ensureDb(): HighSchoolRecord[] {
  if (db) return db;
  const stored = safeParse<HighSchoolRecord[]>(localStorage.getItem(LOCAL_KEYS.highSchools));
  db = stored ?? highSchoolsSeed.map(h => ({ id: h.id, name: h.name }));
  if (!stored) localStorage.setItem(LOCAL_KEYS.highSchools, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(LOCAL_KEYS.highSchools, JSON.stringify(db));
}

export const highSchoolsService = {
  async list(): Promise<HighSchoolRecord[]> {
    await delay();
    return [...ensureDb()];
  },
  async get(id: string): Promise<HighSchoolRecord | null> {
    await delay();
    const found = ensureDb().find(p => p.id === id) ?? null;
    return found ? { ...found } : null;
  },
  async create(input: Omit<HighSchoolRecord, "id"> & { id?: string }): Promise<HighSchoolRecord> {
    await delay();
    const next: HighSchoolRecord = { id: input.id ?? idFactory("hs"), ...input };
    ensureDb().unshift(next);
    persist();
    return { ...next };
  },
  async update(id: string, patch: Partial<HighSchoolRecord>): Promise<HighSchoolRecord> {
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


