// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@vue-email/nuxt", "@vueuse/nuxt", "nuxt-rating"],
  appConfig: {
    plunkAPIKey: process.env.PLUNK_API_KEY,
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  routeRules: {
    "/portal/**": {
      ssr: false,
    },
    "**": {
      ssr: false,
    },
  },
  vite: {
    resolve: {
      alias: {
        ".prisma/client/index-browser":
          "./node_modules/.prisma/client/index-browser.js",
      },
    },
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            "cu-gold": {
              "50": "#faf8f2",
              "100": "#f4f0e0",
              "200": "#e8e0c0",
              "300": "#dacb97",
              "400": "#cfb87c",
              "500": "#be9c51",
              "600": "#b18745",
              "700": "#936d3b",
              "800": "#775835",
              "900": "#61482d",
              "950": "#332517",
            },
            "cu-grey": {
              "50": "#f5f6f6",
              "100": "#e6e7e7",
              "200": "#cfd2d2",
              "300": "#adb1b3",
              "400": "#848a8c",
              "500": "#696f71",
              "600": "#565a5c",
              "700": "#4d4f51",
              "800": "#434547",
              "900": "#3b3d3e",
              "950": "#252627",
            },
          },
        },
      },
    },
  },
});
