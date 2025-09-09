import { defineStore } from "pinia";
import type { Account } from "../services/account.service";
import { accountService } from "../services/account.service";

type State = {
  item: Account | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
};

export const useAccountStore = defineStore("account", {
  state: (): State => ({ item: null, isLoading: false, hasError: false, errorMessage: undefined }),
  actions: {
    async fetch() {
      this.isLoading = true; this.hasError = false; this.errorMessage = undefined;
      try { this.item = await accountService.get(); }
      catch (e: any) { this.hasError = true; this.errorMessage = e?.message ?? 'Failed to load account'; }
      finally { this.isLoading = false }
    },
    async updateProfile(patch: { firstName?: string; lastName?: string; pronouns?: string }) {
      this.item = await accountService.updateProfile(patch);
    },
    async updateAccount(patch: { username?: string; email?: string }, currentPassword: string) {
      this.item = await accountService.updateAccount(patch, currentPassword);
    },
    async changePassword(currentPassword: string, newPassword: string) {
      await accountService.changePassword(currentPassword, newPassword);
      if (this.item) this.item.passwordLastUpdatedAt = new Date().toISOString();
    },
    async setTwoFactor(enabled: boolean) {
      this.item = await accountService.setTwoFactor(enabled);
    },
    async updateAvatar(dataUrl?: string) {
      this.item = await accountService.updateAvatar(dataUrl);
    }
  }
});


