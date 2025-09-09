import { defineStore } from "pinia";
import type { AuditRecord } from "../types";
import { auditService } from "../services/audit.service";

type State = {
  items: AuditRecord[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useAuditStore = defineStore("audit", {
  state: (): State => ({ items: [], isLoading: false, hasError: false, errorMessage: undefined }),
  actions: {
    async fetchAll() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.items = await auditService.list(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? 'Failed to load audit'; }
      finally { this.isLoading = false; }
    },
    async append(record: AuditRecord) {
      this.items.push(record);
      await auditService.append(record);
    }
  }
});


