<script setup lang="ts">
import PhGear from "~icons/ph/gear";
import PhHouse from "~icons/ph/house";
import PhMegaphone from "~icons/ph/megaphone";
import PhNotepad from "~icons/ph/notepad";
import PhShippingContainer from "~icons/ph/shipping-container";

const colorMode = useColorMode();
const isDark = computed({
  get () {
    return colorMode.value === "dark";
  },
  set () {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const navLinks = [
  { name: "Overview", path: "/", icon: PhHouse },
  { name: "Containers", path: "/containers", icon: PhShippingContainer },
  { name: "Reports", path: "/reports", icon: PhNotepad },
  { name: "Alerts", path: "/alerts", icon: PhMegaphone },
  { name: "Settings", path: "/settings", icon: PhGear },
];
</script>

<template>
  <nav class="flex flex-col flex-1">
    <ul class="flex flex-col gap-1 overflow-y-auto">
      <li
        v-for="link in navLinks"
        :key="link.path"
      >
        <ULink
          :to="link.path"
          class="flex items-center gap-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 border border-transparent px-3 py-2"
          active-class="!border-primary-500/50 !bg-primary-400/50 opacity-100"
        >
          <component :is="link.icon" class="w-5 h-5" />
          {{ link.name }}
        </ULink>
      </li>
    </ul>
    <div class="mt-auto">
      <ClientOnly>
        <UButton
          :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
          color="gray"
          variant="ghost"
          aria-label="Theme"
          class="w-full text-base px-3 py-2"
          @click="isDark = !isDark"
        >
          Switch Theme
        </UButton>
        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
    </div>
  </nav>
</template>
