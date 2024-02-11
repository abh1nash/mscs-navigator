<template>
  <NuxtLoadingIndicator
    :color="false"
    class="bg-gradient-to-l from-primary-700 to-primary-500"
  ></NuxtLoadingIndicator>
  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>
