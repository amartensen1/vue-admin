import { LOCAL_KEYS, type ConsentTokenRecord } from "../types";
import { consentTokensSeed } from "../seed/consent-tokens";
import { delay } from "../helpers/delay";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

let db: ConsentTokenRecord[] | null = null;

function ensureDb(): ConsentTokenRecord[] {
  if (db) return db;
  const stored = safeParse<ConsentTokenRecord[]>(localStorage.getItem(LOCAL_KEYS.consentTokens));
  db = stored ?? [...consentTokensSeed];
  if (!stored) localStorage.setItem(LOCAL_KEYS.consentTokens, JSON.stringify(db));
  return db;
}

function persist() {
  if (db) localStorage.setItem(LOCAL_KEYS.consentTokens, JSON.stringify(db));
}

export const consentTokensService = {
  async list(): Promise<ConsentTokenRecord[]> { await delay(); return [...ensureDb()] },
  async byToken(token: string): Promise<ConsentTokenRecord | undefined> { await delay(); return ensureDb().find(t => t.token === token) },
  async upsert(token: ConsentTokenRecord): Promise<void> {
    await delay();
    const all = ensureDb();
    const idx = all.findIndex(t => t.token === token.token);
    if (idx >= 0) all[idx] = token; else all.unshift(token);
    persist();
  },
};


