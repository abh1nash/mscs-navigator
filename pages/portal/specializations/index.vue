<script setup lang="ts">
definePageMeta({
  name: "SpecializationsPortal",
  layout: "portal",
});

const query = reactive({
  page: 1,
  limit: 10,
  query: "",
});
</script>
<template>
  <UContainer class="py-6">
    <div class="flex items-center mb-12">
      <div class="text-3xl font-bold">
        Title
        <UButton icon="i-heroicons-plus">Add</UButton>
      </div>
      <div class="flex-1"></div>
      <div class="flex items-center space-x-2">
        <UInput
          v-model="query.query"
          placeholder="Filter"
          icon="i-heroicons-magnifying-glass"
        ></UInput>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4"></div>
  </UContainer>
</template>
