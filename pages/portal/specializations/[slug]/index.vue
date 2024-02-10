<script setup lang="ts">
definePageMeta({
  name: "SpecializationDetailsPortal",
  layout: "portal",
});

const { slug } = useRoute().params;

const specializationRequest = await useFetch(`/api/specializations/${slug}`, {
  method: "GET",
});
</script>
<template>
  <UContainer class="py-6">
    <div class="flex items-center mb-6">
      <div class="w-full">
        <div class="flex items-center gap-2">
          <div class="text-3xl font-bold">
            {{ specializationRequest.data.value?.name }}
          </div>
          <UButton icon="i-heroicons-pencil">Edit</UButton>
          <div class="flex-1"></div>
          <UButton variant="ghost" color="red" icon="i-heroicons-trash">
            <span class="sr-only"> Delete </span>
          </UButton>
        </div>
        <div class="text-gray-500 mt-2 max-w-lg text-sm">
          {{ specializationRequest.data.value?.description }}
        </div>
      </div>
    </div>
  </UContainer>
</template>
