<script setup lang="ts">
const pages = [
  {
    name: "Certificates",
    icon: "i-heroicons-academic-cap",
    to: "/portal/certificates",
  },
  {
    name: "Specializations",
    icon: "i-heroicons-rectangle-group",
    to: "/portal/specializations",
  },
  {
    name: "Courses",
    icon: "i-heroicons-book-open",
    to: "/portal/courses",
  },
  {
    name: "Users",
    icon: "i-heroicons-user-group",
    to: "/portal/users",
  },
];
</script>
<template>
  <div class="h-lvh flex flex-col bg-black">
    <div class="h-24 p-4 mb-6">
      <NuxtLink :to="{ name: 'Home' }">
        <CULogo class="max-h-full"></CULogo>
      </NuxtLink>
    </div>
    <div class="flex-1 overflow-auto px-4 space-y-2">
      <NuxtLink
        v-for="page in pages"
        :to="page.to"
        class="flex items-center gap-2 group text-gray-300 dark:text-gray-400 hover:text-primary-500 border-transparen"
      >
        <span
          class="size-8 flex items-center justify-center bg-gray-900/50 group-hover:bg-primary-500 group-hover:text-black rounded-md"
        >
          <UIcon :name="page.icon" class="size-6"></UIcon>
        </span>
        <span class="text-sm">
          {{ page.name }}
        </span>
      </NuxtLink>
    </div>
    <div class="p-4 text-center">
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-left-start-on-rectangle"
        class="w-full hover:text-black"
        >Log Out</UButton
      >
    </div>
  </div>
</template>
