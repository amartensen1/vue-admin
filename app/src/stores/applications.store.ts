import { defineStore } from "pinia";
import type { StudentApplicationRecord, DocumentMetadata } from "../types";
import { applicationsService } from "../services/applications.service";

type State = {
  items: StudentApplicationRecord[];
  docs: DocumentMetadata[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useApplicationsStore = defineStore("applications", {
  state: (): State => ({ items: [], docs: [], isLoading: false, hasError: false, errorMessage: undefined }),
  getters: {
    byId: (s) => (id: string) => s.items.find(x => x.id === id) ?? null,
    docsByApp: (s) => (appId: string) => s.docs.filter(d => d.applicationId === appId),
  },
  actions: {
    async fetchAll() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try {
        const [items, docs] = await Promise.all([
          applicationsService.list(),
          applicationsService.listDocuments(),
        ]);
        this.items = items;
        this.docs = docs;
      } catch (e: any) {
        this.hasError = true; this.errorMessage = e?.message ?? 'Failed to load applications';
      } finally { this.isLoading = false }
    },
    async saveAll(items: StudentApplicationRecord[]) {
      this.items = items;
      await applicationsService.saveAll(items);
    },
    async updateOne(id: string, patch: Partial<StudentApplicationRecord>) {
      const idx = this.items.findIndex(x => x.id === id);
      if (idx === -1) return;
      const prev = { ...this.items[idx] };
      this.items[idx] = { ...this.items[idx], ...patch, updatedAt: new Date().toISOString() } as StudentApplicationRecord;
      try {
        const updated = await applicationsService.update(id, patch);
        if (updated) this.items[idx] = updated;
      } catch (e) {
        this.items[idx] = prev; throw e;
      }
    },
    async addDocument(meta: Omit<DocumentMetadata, 'id' | 'uploadedAt'>) {
      const res = await applicationsService.addDocument(meta);
      if (res.ok) {
        this.docs.push(res.value);
      }
      return res;
    },
    async removeDocument(id: string) {
      const prev = [...this.docs];
      this.docs = this.docs.filter(d => d.id !== id);
      try { await applicationsService.removeDocument(id) }
      catch (e) { this.docs = prev; throw e }
    }
  }
});


