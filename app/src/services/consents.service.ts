import { LOCAL_KEYS, type ConsentRecord } from "../types";
import { consentsSeed } from "../seed/consents";
import { delay } from "../helpers/delay";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

let db: ConsentRecord[] | null = null;

function ensureDb(): ConsentRecord[] {
  if (db) return db;
  const stored = safeParse<ConsentRecord[]>(localStorage.getItem(LOCAL_KEYS.consents));
  db = stored ?? [...consentsSeed];
  if (!stored) localStorage.setItem(LOCAL_KEYS.consents, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(LOCAL_KEYS.consents, JSON.stringify(db));
}

export const consentsService = {
  async list(): Promise<ConsentRecord[]> { await delay(); return [...ensureDb()] },
  async add(item: ConsentRecord): Promise<void> { await delay(); ensureDb().push(item); persist() },
};


