import { defineStore } from "pinia";
import type { TermRecord } from "../types";
import { termsService } from "../services/terms.service";

type State = {
  items: TermRecord[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useTermsStore = defineStore("terms", {
  state: (): State => ({ items: [], isLoading: false, hasError: false, errorMessage: undefined }),
  getters: {
    byId: (s) => (id: string) => s.items.find((x) => x.id === id) ?? null,
  },
  actions: {
    async fetchAll() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.items = await termsService.list(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? "Failed to load terms"; }
      finally { this.isLoading = false; }
    },
    async createOne(input: Omit<TermRecord, "id">) {
      const tempId = `temp_${Date.now()}`;
      const optimistic: TermRecord = { id: tempId, ...input } as TermRecord;
      this.items.unshift(optimistic);
      try {
        const created = await termsService.create(input);
        const idx = this.items.findIndex((x) => x.id === tempId);
        if (idx !== -1) this.items[idx] = created; else this.items.unshift(created);
      } catch (e) {
        this.items = this.items.filter((x) => x.id !== tempId);
        throw e;
      }
    },
    async updateOne(id: string, patch: Partial<TermRecord>) {
      const existing = this.items.find((x) => x.id === id);
      if (!existing) return;
      const prev = { ...existing };
      Object.assign(existing, patch);
      try { await termsService.update(id, patch); }
      catch (e) { Object.assign(existing, prev); throw e; }
    },
    async removeOne(id: string) {
      const prev = [...this.items];
      this.items = this.items.filter((x) => x.id !== id);
      try { await termsService.remove(id); }
      catch (e) { this.items = prev; throw e; }
    },
  },
});


