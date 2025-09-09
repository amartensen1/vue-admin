import { defineStore } from "pinia";
import type { AuditRecord, CurrentUser, UserRole } from "../types";
import { sessionService } from "../services/session.service";
import { auditService } from "../services/audit.service";

export const useSessionStore = defineStore("session", {
  state: () => ({
    currentUser: null as CurrentUser | null,
  }),
  getters: {
    isSignedIn: (s) => !!s.currentUser,
    role: (s): UserRole | null => s.currentUser?.role ?? null,
  },
  actions: {
    async hydrate(): Promise<void> {
      this.currentUser = await sessionService.getCurrent();
    },
    async signIn(email: string, role: UserRole): Promise<void> {
      const user: CurrentUser = {
        id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
        email,
        role,
        signedInAt: new Date().toISOString(),
      };
      this.currentUser = user;
      await sessionService.setCurrent(user);
      const audit: AuditRecord = {
        id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
        ts: new Date().toISOString(),
        actorId: user.id,
        actorRole: user.role,
        action: "SIGN_IN",
        meta: { email },
      };
      await auditService.append(audit);
    },
    async signOut(): Promise<void> {
      if (this.currentUser) {
        const user = this.currentUser;
        await auditService.append({
          id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
          ts: new Date().toISOString(),
          actorId: user.id,
          actorRole: user.role,
          action: "SIGN_OUT",
        });
      }
      this.currentUser = null;
      await sessionService.clearCurrent();
    },
  },
});


