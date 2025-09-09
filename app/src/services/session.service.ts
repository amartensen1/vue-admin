import { LOCAL_KEYS, type CurrentUser } from "../types";
import { delay } from "../helpers/delay";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

export const sessionService = {
  async getCurrent(): Promise<CurrentUser | null> {
    await delay();
    return safeParse<CurrentUser>(localStorage.getItem(LOCAL_KEYS.currentUser));
  },
  async setCurrent(user: CurrentUser): Promise<void> {
    await delay();
    localStorage.setItem(LOCAL_KEYS.currentUser, JSON.stringify(user));
  },
  async clearCurrent(): Promise<void> {
    await delay();
    localStorage.removeItem(LOCAL_KEYS.currentUser);
  },
};


