<script setup lang="ts">
definePageMeta({
  name: "CertificatesPortal",
  layout: "portal",
  middleware: ["auth"],
});

const query = reactive({
  page: 1,
  limit: 10,
  query: "",
});

const certificatesRequest = useFetch("/api/certificates", {
  method: "GET",
  key: "certificates",
  query,
});

const state = reactive({
  addCertificateModal: false,
});
</script>
<template>
  <UContainer class="py-6">
    <div class="flex items-center mb-12">
      <div class="text-3xl font-bold">
        Certificates
        <UButton
          @click="state.addCertificateModal = true"
          icon="i-heroicons-plus"
          >Add</UButton
        >
        <CertificateAddModal
          v-model="state.addCertificateModal"
          @complete="
            () => {
              certificatesRequest.refresh();
              state.addCertificateModal = false;
            }
          "
          @cancel="state.addCertificateModal = false"
        ></CertificateAddModal>
      </div>
      <div class="px-3">
        <AppLoaderSpin
          :loading="certificatesRequest.pending.value"
        ></AppLoaderSpin>
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
      <div
        v-for="certificate in certificatesRequest.data?.value?.results"
        :key="certificate.id"
      >
        <CertificateCard
          :certificate="{
            id: certificate.id,
            name: certificate.name,
            description: certificate.description || '',
          }"
        />
      </div>
    </div>
  </UContainer>
</template>
