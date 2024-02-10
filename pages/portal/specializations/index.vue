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

const specializationsRequest = useFetch("/api/specializations", {
  key: "specializations",
  query,
});

const ui = reactive({
  showAddModal: false,
});
</script>
<template>
  <UContainer class="py-6">
    <div class="flex items-center mb-12">
      <div class="text-3xl font-bold">
        Specializations
        <UButton @click="ui.showAddModal = true" icon="i-heroicons-plus"
          >Add</UButton
        >
        <SpecializationAddModal
          v-model="ui.showAddModal"
          @complete="
            () => {
              ui.showAddModal = false;
              specializationsRequest.refresh();
            }
          "
          @cancel="() => (ui.showAddModal = false)"
        ></SpecializationAddModal>
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
    <div class="grid grid-cols-3 gap-4">
      <SpecializationCard
        v-for="specialization in specializationsRequest.data.value?.results"
        :specialization="specialization"
      ></SpecializationCard>
    </div>
  </UContainer>
</template>
