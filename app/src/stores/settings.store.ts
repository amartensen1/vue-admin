import { defineStore } from "pinia";
import type { SettingsRecord } from "../types";
import { settingsService } from "../services/settings.service";

type State = {
  item: SettingsRecord | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useSettingsStore = defineStore("settings", {
  state: (): State => ({ item: null, isLoading: false, hasError: false, errorMessage: undefined }),
  actions: {
    async fetch() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.item = await settingsService.get(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? "Failed to load settings"; }
      finally { this.isLoading = false; }
    },
    async save(patch: Partial<SettingsRecord>) {
      const prev = this.item ? { ...this.item } : null;
      if (!this.item) this.item = { registrationOpen: true };
      Object.assign(this.item, patch);
      try { this.item = await settingsService.set(patch); }
      catch (e) { if (prev) this.item = prev; throw e; }
    }
  }
});


