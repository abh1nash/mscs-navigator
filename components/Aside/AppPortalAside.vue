<script setup lang="ts"></script>
<template>
  <div class="h-lvh flex flex-col bg-black">
    <div class="h-24 p-4">
      <NuxtLink :to="{ name: 'Home' }">
        <CULogo class="max-h-full mx-auto"></CULogo>
      </NuxtLink>
    </div>
    <div class="flex-1 overflow-auto"></div>
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
