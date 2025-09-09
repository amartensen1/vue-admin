import { defineStore } from "pinia";
import type { ProgramRecord } from "../types";
import { programsService } from "../services/programs.service";

type State = {
  items: ProgramRecord[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useProgramsStore = defineStore("programs", {
  state: (): State => ({ items: [], isLoading: false, hasError: false, errorMessage: undefined }),
  getters: {
    byId: (s) => (id: string) => s.items.find((x) => x.id === id) ?? null,
  },
  actions: {
    async fetchAll() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.items = await programsService.list(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? "Failed to load programs"; }
      finally { this.isLoading = false; }
    },
    async createOne(input: Omit<ProgramRecord, "id">) {
      const tempId = `temp_${Date.now()}`;
      const optimistic: ProgramRecord = { id: tempId, ...input } as ProgramRecord;
      this.items.unshift(optimistic);
      try {
        const created = await programsService.create(input);
        const idx = this.items.findIndex((x) => x.id === tempId);
        if (idx !== -1) this.items[idx] = created; else this.items.unshift(created);
      } catch (e) {
        this.items = this.items.filter((x) => x.id !== tempId);
        throw e;
      }
    },
    async updateOne(id: string, patch: Partial<ProgramRecord>) {
      const existing = this.items.find((x) => x.id === id);
      if (!existing) return;
      const prev = { ...existing };
      Object.assign(existing, patch);
      try { await programsService.update(id, patch); }
      catch (e) { Object.assign(existing, prev); throw e; }
    },
    async removeOne(id: string) {
      const prev = [...this.items];
      this.items = this.items.filter((x) => x.id !== id);
      try { await programsService.remove(id); }
      catch (e) { this.items = prev; throw e; }
    },
  },
});


