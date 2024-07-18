<script setup lang="ts">
import Sidebar from "~/components/Sidebar.vue";
</script>

<template>
  <div class="flex flex-1 max-h-dvh overflow-hidden dark:bg-slate-900">
    <div class="flex flex-col w-full max-w-[250px] flex-1 shrink-0 border-r dark:border-white/20 px-2 py-4">
      <Sidebar />
    </div>
    <div class="flex flex-col flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>
