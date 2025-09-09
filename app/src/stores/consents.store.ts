import { defineStore } from "pinia";
import type { ConsentRecord } from "../types";
import { consentsService } from "../services/consents.service";

type State = {
  items: ConsentRecord[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useConsentsStore = defineStore("consents", {
  state: (): State => ({ items: [], isLoading: false, hasError: false, errorMessage: undefined }),
  actions: {
    async fetchAll() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.items = await consentsService.list(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? 'Failed to load consents'; }
      finally { this.isLoading = false; }
    },
    async add(item: ConsentRecord) {
      this.items.push(item);
      await consentsService.add(item);
    }
  }
});


