<script setup lang="ts">
defineProps<{ variant?: "primary" | "secondary" | "ghost"; size?: "sm" | "md" | "lg"; disabled?: boolean; type?: 'button' | 'submit' | 'reset' }>();
defineEmits(["click"]);
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
      size === 'sm' ? 'px-2 py-1 text-xs' : size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm',
      variant === 'secondary' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : variant === 'ghost' ? 'bg-transparent text-muted hover:bg-gray-100' : 'bg-primary text-white hover:opacity-90'
    ]"
    :disabled="disabled"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
  
</template>

<style scoped>
</style>


