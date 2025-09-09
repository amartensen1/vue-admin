import { defineStore } from "pinia";
import type { ConsentTokenRecord } from "../types";
import { consentTokensService } from "../services/consent-tokens.service";

type State = {
  items: ConsentTokenRecord[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useConsentTokensStore = defineStore("consentTokens", {
  state: (): State => ({ items: [], isLoading: false, hasError: false, errorMessage: undefined }),
  getters: {
    byToken: (s) => (token: string) => s.items.find(t => t.token === token),
    activeByRegistrationId: (s) => (registrationId: string) => s.items.find(t => t.registrationId === registrationId && !t.usedAt),
  },
  actions: {
    async fetchAll() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.items = await consentTokensService.list(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? 'Failed to load consent tokens'; }
      finally { this.isLoading = false; }
    },
    async upsert(token: ConsentTokenRecord) {
      const idx = this.items.findIndex(t => t.token === token.token);
      if (idx >= 0) this.items[idx] = token; else this.items.unshift(token);
      await consentTokensService.upsert(token);
    },
  }
});


