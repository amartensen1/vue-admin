import { LOCAL_KEYS, type SettingsRecord } from "../types";
import { settingsSeed } from "../seed/settings";
import { delay } from "../helpers/delay";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

let db: SettingsRecord | null = null;

function ensureDb(): SettingsRecord {
  if (db) return db;
  const stored = safeParse<SettingsRecord>(localStorage.getItem(LOCAL_KEYS.settings));
  db = stored ?? { ...settingsSeed };
  if (!stored) localStorage.setItem(LOCAL_KEYS.settings, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(LOCAL_KEYS.settings, JSON.stringify(db));
}

export const settingsService = {
  async get(): Promise<SettingsRecord> {
    await delay();
    return { ...ensureDb() };
  },
  async set(patch: Partial<SettingsRecord>): Promise<SettingsRecord> {
    await delay();
    db = { ...ensureDb(), ...patch };
    persist();
    return { ...db } as SettingsRecord;
  },
};


