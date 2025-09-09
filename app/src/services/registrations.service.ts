import { LOCAL_KEYS, type RegistrationRecord } from "../types";
import { registrationsSeed } from "../seed/registrations";
import { delay } from "../helpers/delay";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

let db: RegistrationRecord[] | null = null;

function ensureDb(): RegistrationRecord[] {
  if (db) return db;
  const stored = safeParse<RegistrationRecord[]>(localStorage.getItem(LOCAL_KEYS.registrations));
  db = stored ?? [...registrationsSeed];
  if (!stored) localStorage.setItem(LOCAL_KEYS.registrations, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(LOCAL_KEYS.registrations, JSON.stringify(db));
}

export const registrationsService = {
  async list(): Promise<RegistrationRecord[]> {
    await delay();
    return [...ensureDb()];
  },
  async get(id: string): Promise<RegistrationRecord | null> {
    await delay();
    const found = ensureDb().find(r => r.id === id) ?? null;
    return found ? { ...found } : null;
  },
  async upsert(record: RegistrationRecord): Promise<RegistrationRecord> {
    await delay();
    const all = ensureDb();
    const idx = all.findIndex(r => r.id === record.id);
    if (idx >= 0) all[idx] = record; else all.unshift(record);
    persist();
    return { ...record };
  },
};


