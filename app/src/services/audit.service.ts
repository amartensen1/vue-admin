import { LOCAL_KEYS, type AuditRecord } from "../types";
import { delay } from "../helpers/delay";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

export const auditService = {
  async append(record: AuditRecord): Promise<void> {
    await delay();
    const existing = safeParse<AuditRecord[]>(localStorage.getItem(LOCAL_KEYS.audit)) ?? [];
    existing.push(record);
    localStorage.setItem(LOCAL_KEYS.audit, JSON.stringify(existing));
  },
  async list(): Promise<AuditRecord[]> {
    await delay();
    return safeParse<AuditRecord[]>(localStorage.getItem(LOCAL_KEYS.audit)) ?? [];
  },
  async clear(): Promise<void> {
    await delay();
    localStorage.removeItem(LOCAL_KEYS.audit);
  },
};


