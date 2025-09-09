import { delay } from "../helpers/delay";

type Account = {
  firstName: string;
  lastName: string;
  pronouns?: string;
  username: string;
  email: string;
  avatarDataUrl?: string;
  twoFactorEnabled: boolean;
  passwordLastUpdatedAt?: string;
  passwordHash?: string; // prototype only
};

const STORAGE_KEY = "de.account";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T } catch { return null }
}

function getDefault(): Account {
  return {
    firstName: "Ada",
    lastName: "Lovelace",
    pronouns: "she/her",
    username: "ada",
    email: "ada@example.com",
    avatarDataUrl: undefined,
    twoFactorEnabled: false,
    passwordLastUpdatedAt: new Date().toISOString(),
    passwordHash: "demo",
  }
}

let cache: Account | null = null;

function ensure(): Account {
  if (cache) return cache;
  const stored = safeParse<Account>(localStorage.getItem(STORAGE_KEY));
  cache = stored ?? getDefault();
  if (!stored) localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  return cache;
}

function save() { if (cache) localStorage.setItem(STORAGE_KEY, JSON.stringify(cache)); }

export const accountService = {
  async get(): Promise<Account> { await delay(); return { ...ensure() } },
  async updateProfile(patch: Partial<Pick<Account, "firstName"|"lastName"|"pronouns">>): Promise<Account> {
    await delay(); cache = { ...ensure(), ...patch }; save(); return { ...cache! };
  },
  async updateAccount(patch: Partial<Pick<Account, "username"|"email">>, currentPassword: string): Promise<Account> {
    await delay(); const acc = ensure();
    if ((patch.username || patch.email) && acc.passwordHash && currentPassword !== acc.passwordHash) {
      throw new Error("Current password is incorrect");
    }
    cache = { ...acc, ...patch }; save(); return { ...cache! };
  },
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await delay(); const acc = ensure();
    if (acc.passwordHash && currentPassword !== acc.passwordHash) throw new Error("Current password is incorrect");
    cache = { ...acc, passwordHash: newPassword, passwordLastUpdatedAt: new Date().toISOString() }; save();
  },
  async setTwoFactor(enabled: boolean): Promise<Account> {
    await delay(); cache = { ...ensure(), twoFactorEnabled: enabled }; save(); return { ...cache! };
  },
  async updateAvatar(dataUrl: string | undefined): Promise<Account> {
    await delay(); cache = { ...ensure(), avatarDataUrl: dataUrl }; save(); return { ...cache! };
  }
}

export type { Account };


