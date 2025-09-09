import { defineStore } from "pinia";
import type { RegistrationRecord } from "../types";
import { registrationsService } from "../services/registrations.service";

type State = {
  items: RegistrationRecord[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useRegistrationsStore = defineStore("registrations", {
  state: (): State => ({ items: [], isLoading: false, hasError: false, errorMessage: undefined }),
  getters: {
    byId: (s) => (id: string) => s.items.find((x) => x.id === id) ?? null,
  },
  actions: {
    async fetchAll() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.items = await registrationsService.list(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? "Failed to load registrations"; }
      finally { this.isLoading = false; }
    },
    async upsertOne(record: RegistrationRecord) {
      const idx = this.items.findIndex(x => x.id === record.id);
      if (idx >= 0) this.items[idx] = record; else this.items.unshift(record);
      try { await registrationsService.upsert(record); }
      catch (e) { /* keep optimistic; prototype */ throw e; }
    },
  },
});


