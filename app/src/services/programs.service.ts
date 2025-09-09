import { LOCAL_KEYS, type ProgramRecord } from "../types";
import { programsSeed } from "../seed/programs";
import { delay } from "../helpers/delay";
import { idFactory } from "../helpers/idFactory";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

let db: ProgramRecord[] | null = null;

function ensureDb(): ProgramRecord[] {
  if (db) return db;
  const stored = safeParse<ProgramRecord[]>(localStorage.getItem(LOCAL_KEYS.programs));
  db = stored ?? programsSeed.map(p => ({ id: p.id, name: p.name, internal_name: p.internal_name }));
  if (!stored) localStorage.setItem(LOCAL_KEYS.programs, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(LOCAL_KEYS.programs, JSON.stringify(db));
}

export const programsService = {
  async list(): Promise<ProgramRecord[]> {
    await delay();
    return [...ensureDb()];
  },
  async get(id: string): Promise<ProgramRecord | null> {
    await delay();
    const found = ensureDb().find(p => p.id === id) ?? null;
    return found ? { ...found } : null;
  },
  async create(input: Omit<ProgramRecord, "id"> & { id?: string }): Promise<ProgramRecord> {
    await delay();
    const next: ProgramRecord = { id: input.id ?? idFactory("prog"), ...input };
    ensureDb().unshift(next);
    persist();
    return { ...next };
  },
  async update(id: string, patch: Partial<ProgramRecord>): Promise<ProgramRecord> {
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


