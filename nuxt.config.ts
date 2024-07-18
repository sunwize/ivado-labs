// https://nuxt.com/docs/api/configuration/nuxt-config
import Icons from "unplugin-icons/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@nuxt/ui"],
  css: ["~/app.css"],
  vite: {
    plugins: [
      Icons({
        compiler: "vue3",
      }),
    ],
  },
});
