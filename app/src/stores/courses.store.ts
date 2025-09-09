import { defineStore } from "pinia";
import type { CourseRecord } from "../types";
import { coursesService } from "../services/courses.service";

type State = {
  items: CourseRecord[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useCoursesStore = defineStore("courses", {
  state: (): State => ({ items: [], isLoading: false, hasError: false, errorMessage: undefined }),
  getters: {
    byId: (s) => (id: string) => s.items.find((x) => x.id === id) ?? null,
  },
  actions: {
    async fetchAll() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.items = await coursesService.list(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? "Failed to load courses"; }
      finally { this.isLoading = false; }
    },
    async createOne(input: Omit<CourseRecord, "id">) {
      const tempId = `temp_${Date.now()}`;
      const optimistic: CourseRecord = { id: tempId, ...input } as CourseRecord;
      this.items.unshift(optimistic);
      try {
        const created = await coursesService.create(input);
        const idx = this.items.findIndex((x) => x.id === tempId);
        if (idx !== -1) this.items[idx] = created; else this.items.unshift(created);
      } catch (e) {
        this.items = this.items.filter((x) => x.id !== tempId);
        throw e;
      }
    },
    async updateOne(id: string, patch: Partial<CourseRecord>) {
      const existing = this.items.find((x) => x.id === id);
      if (!existing) return;
      const prev = { ...existing };
      Object.assign(existing, patch);
      try { await coursesService.update(id, patch); }
      catch (e) { Object.assign(existing, prev); throw e; }
    },
    async removeOne(id: string) {
      const prev = [...this.items];
      this.items = this.items.filter((x) => x.id !== id);
      try { await coursesService.remove(id); }
      catch (e) { this.items = prev; throw e; }
    },
  },
});


