// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase', '@nuxt/ui', '@pinia/nuxt', 'nuxt-headlessui'],
  supabase: {
    // Options
    redirect: false
  }
})
