import { LOCAL_KEYS, type TermRecord } from "../types";
import { termsSeed } from "../seed/terms";
import { delay } from "../helpers/delay";
import { idFactory } from "../helpers/idFactory";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

let db: TermRecord[] | null = null;

function ensureDb(): TermRecord[] {
  if (db) return db;
  const stored = safeParse<TermRecord[]>(localStorage.getItem(LOCAL_KEYS.terms));
  db = stored ?? termsSeed.map(t => ({ id: t.id, name: t.name, isActive: t.isActive, customDates: t.customDates }));
  if (!stored) localStorage.setItem(LOCAL_KEYS.terms, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(LOCAL_KEYS.terms, JSON.stringify(db));
}

export const termsService = {
  async list(): Promise<TermRecord[]> {
    await delay();
    return [...ensureDb()];
  },
  async get(id: string): Promise<TermRecord | null> {
    await delay();
    const found = ensureDb().find(p => p.id === id) ?? null;
    return found ? { ...found } : null;
  },
  async create(input: Omit<TermRecord, "id"> & { id?: string }): Promise<TermRecord> {
    await delay();
    const next: TermRecord = { id: input.id ?? idFactory("term"), ...input };
    ensureDb().unshift(next);
    persist();
    return { ...next };
  },
  async update(id: string, patch: Partial<TermRecord>): Promise<TermRecord> {
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


