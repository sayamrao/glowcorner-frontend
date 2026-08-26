// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'FamilyCorner — Baby Toys & Fun Learning',
      meta: [
        { name: 'description', content: 'Shop premium baby toys, educational games, RC cars & fun learning activities. Fast delivery, COD available, best prices in Pakistan.' },
        { name: 'theme-color', content: '#0891b2' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'FamilyCorner — Baby Toys & Fun Learning' },
        { property: 'og:description', content: 'Shop premium baby toys, educational games, RC cars & fun learning activities.' },
        { property: 'og:image', content: '/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap' },
      ],
    },
    pageTransition: false, //{ name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api/v1',
      appName: 'FamilyCorner',
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '923151992520',
    },
  },

  tailwindcss: {
    configPath: 'tailwind.config.ts',
    cssPath: '~/assets/css/main.css',
  },

  image: {
    quality: 80,
    formats: ['webp', 'avif'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },

  typescript: {
    strict: true,
    shim: false,
  },

  experimental: {
    payloadExtraction: true,
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/'],
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/products/**': { swr: 3600 },
    '/dashboard/**': { ssr: false },
    '/seller/**': { ssr: false },
    '/admin/**': { ssr: false },
  },
})
