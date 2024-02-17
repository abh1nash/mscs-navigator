export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();
  if (process.server) {
    const { data } = await useFetch("/api/users/me");
    if (data.value) {
      user.value = data.value;
    }
  } else {
    const result = await $fetch("/api/users/me");
    if (result) {
      user.value = result;
    }
  }
});
