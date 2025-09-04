<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSessionStore } from "../stores/session";
import type { UserRole } from "../types";

const router = useRouter();
const route = useRoute();
const session = useSessionStore();

const email = ref("");
const role = ref<UserRole>("Counselor");
const error = ref<string | null>(null);

function onSubmit(e: Event) {
  e.preventDefault();
  error.value = null;
  if (!email.value || !email.value.includes("@")) {
    error.value = "Enter a valid email";
    return;
  }
  session.signIn(email.value.trim(), role.value);
  const next = (route.query.next as string) || "/apps";
  router.replace(next);
}
</script>

<template>
  <div class="min-h-[60vh] grid place-items-center px-2">
    <form class="w-full max-w-md space-y-4 bg-white p-4 sm:p-6 rounded shadow" @submit="onSubmit">
      <h1 class="text-lg font-semibold">Sign in (Demo)</h1>
      <p class="text-sm text-gray-600">No passwords. Choose a role and continue.</p>
      <div class="space-y-1">
        <label class="text-sm font-medium" for="email">Email</label>
        <input id="email" v-model="email" type="email" class="w-full border rounded px-3 py-2" placeholder="you@example.edu" required />
      </div>
      <div class="space-y-1">
        <label class="text-sm font-medium" for="role">Role</label>
        <select id="role" v-model="role" class="w-full border rounded px-3 py-2">
          <option value="Counselor">Counselor</option>
          <option value="CollegeStaff">CollegeStaff</option>
        </select>
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button type="submit" class="w-full bg-blue-600 text-white rounded px-3 py-2">Continue</button>
    </form>
  </div>
</template>

<style scoped>
</style>


