import { defineStore } from "pinia";
import type { SectionRecord } from "../types";
import { sectionsService } from "../services/sections.service";

type State = {
  items: SectionRecord[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useSectionsStore = defineStore("sections", {
  state: (): State => ({ items: [], isLoading: false, hasError: false, errorMessage: undefined }),
  getters: {
    byId: (s) => (id: string) => s.items.find((x) => x.id === id) ?? null,
  },
  actions: {
    async fetchAll() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.items = await sectionsService.list(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? "Failed to load sections"; }
      finally { this.isLoading = false; }
    },
    async createOne(input: Omit<SectionRecord, "id">) {
      const tempId = `temp_${Date.now()}`;
      const optimistic: SectionRecord = { id: tempId, ...input } as SectionRecord;
      this.items.unshift(optimistic);
      try {
        const created = await sectionsService.create(input);
        const idx = this.items.findIndex((x) => x.id === tempId);
        if (idx !== -1) this.items[idx] = created; else this.items.unshift(created);
      } catch (e) {
        this.items = this.items.filter((x) => x.id !== tempId);
        throw e;
      }
    },
    async updateOne(id: string, patch: Partial<SectionRecord>) {
      const existing = this.items.find((x) => x.id === id);
      if (!existing) return;
      const prev = { ...existing };
      Object.assign(existing, patch);
      try { await sectionsService.update(id, patch); }
      catch (e) { Object.assign(existing, prev); throw e; }
    },
    async removeOne(id: string) {
      const prev = [...this.items];
      this.items = this.items.filter((x) => x.id !== id);
      try { await sectionsService.remove(id); }
      catch (e) { this.items = prev; throw e; }
    },
  },
});


