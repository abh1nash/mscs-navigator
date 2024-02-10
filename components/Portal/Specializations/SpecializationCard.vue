<script setup lang="ts">
const props = defineProps<{
  specialization: {
    name: string;
    description?: string | null;
    difficulty?: number | null;
    slug: string;
  };
}>();

const description = computed(() => {
  if (props.specialization.description) {
    return props.specialization.description.length > 50
      ? props.specialization.description.slice(0, 50) + "..."
      : props.specialization.description;
  }
  return "";
});

const state = reactive({
  showDeleteModal: false,
  showEditModal: false,
});

const items = (i: typeof props.specialization) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => (state.showEditModal = true),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => (state.showDeleteModal = true),
    },
  ],
];
</script>
<template>
  <UCard class="hover:ring-primary-500 relative">
    <NuxtLink
      :to="{
        name: 'SpecializationDetailsPortal',
        params: { slug: specialization.slug },
      }"
      :aria-label="specialization.name"
    >
      <span class="absolute inset-0" aria-hidden="true"></span>
    </NuxtLink>
    <div class="flex items-center justify-between">
      <div class="text-xl font-bold">{{ specialization.name }}</div>
      <div class="flex items-center space-x-2">
        <UDropdown :items="items(specialization)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
          <SpecializationDeleteModal
            v-model="state.showDeleteModal"
            @complete="
              () => {
                state.showDeleteModal = false;
                refreshNuxtData('specializations');
              }
            "
            @cancel="() => (state.showDeleteModal = false)"
            :specialization="specialization"
          ></SpecializationDeleteModal>
          <SpecializationEditModal
            v-model="state.showEditModal"
            @complete="
              () => {
                state.showEditModal = false;
                refreshNuxtData('specializations');
              }
            "
            @cancel="() => (state.showEditModal = false)"
            :specialization="specialization"
          ></SpecializationEditModal>
        </UDropdown>
      </div>
    </div>
    <div class="text-gray-500">
      {{ description }}
    </div>
  </UCard>
</template>
