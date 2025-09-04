import { defineStore } from "pinia";
import { Repository } from "../repo/storage";
import type { AuditRecord, CurrentUser, UserRole } from "../types";

export const useSessionStore = defineStore("session", {
  state: () => ({
    currentUser: Repository.getCurrentUser() as CurrentUser | null,
  }),
  getters: {
    isSignedIn: (s) => !!s.currentUser,
    role: (s): UserRole | null => s.currentUser?.role ?? null,
  },
  actions: {
    signIn(email: string, role: UserRole): void {
      const user: CurrentUser = {
        id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
        email,
        role,
        signedInAt: new Date().toISOString(),
      };
      this.currentUser = user;
      Repository.setCurrentUser(user);
      const audit: AuditRecord = {
        id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
        ts: new Date().toISOString(),
        actorId: user.id,
        actorRole: user.role,
        action: "SIGN_IN",
        meta: { email },
      };
      Repository.appendAudit(audit);
    },
    signOut(): void {
      if (this.currentUser) {
        const user = this.currentUser;
        Repository.appendAudit({
          id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
          ts: new Date().toISOString(),
          actorId: user.id,
          actorRole: user.role,
          action: "SIGN_OUT",
        });
      }
      this.currentUser = null;
      Repository.clearCurrentUser();
    },
  },
});


