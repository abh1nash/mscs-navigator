export default defineAppConfig({
  ui: {
    primary: "cu-gold",
    gray: "cu-grey",
    button: {
      variant: {
        solid:
          "shadow-sm text-black dark:text-gray-900 bg-{color}-500 hover:bg-{color}-600 disabled:bg-{color}-500 dark:bg-{color}-400 dark:hover:bg-{color}-500 dark:disabled:bg-{color}-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{color}-500 dark:focus-visible:outline-{color}-400",
      },
    },
  },
});
