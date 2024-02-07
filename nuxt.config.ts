// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@vue-email/nuxt"],
  build: { transpile: ["@pluink/node"] },
  appConfig: {
    plunkAPIKey: process.env.PLUNK_API_KEY,
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
              "50": "#f7f7f7",
              "100": "#eceded",
              "200": "#dedfdf",
              "300": "#c7c9c8",
              "400": "#a2a4a3",
              "500": "#979a99",
              "600": "#878988",
              "700": "#797c7b",
              "800": "#666767",
              "900": "#535554",
              "950": "#353636",
            },
          },
        },
      },
    },
  },
});
