<script setup lang="ts">
const props = defineProps<{
  certificate: {
    id: string;
    name: string;
    description?: string;
  };
}>();

const state = reactive({
  showDeleteModal: false,
  showEditModal: false,
});

const items = (i: typeof props.certificate) => [
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

const refresh = () => {
  refreshNuxtData("certificates");
  state.showDeleteModal = false;
  state.showEditModal = false;
};
</script>
<template>
  <UCard>
    <div class="flex items-center justify-between">
      <div class="text-xl font-bold">{{ props.certificate.name }}</div>
      <div class="flex items-center space-x-2">
        <UDropdown :items="items(certificate)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
          <CertificateDeleteModal
            v-model="state.showDeleteModal"
            @complete="refresh"
            :certificate="certificate"
          ></CertificateDeleteModal>
          <CertificateEditModal
            v-model="state.showEditModal"
            @complete="refresh"
            :certificate="certificate"
          ></CertificateEditModal>
        </UDropdown>
      </div>
    </div>
    <div class="text-gray-500">{{ props.certificate.description }}</div>
  </UCard>
</template>
