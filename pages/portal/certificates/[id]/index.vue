<script setup lang="ts">
definePageMeta({
  name: "CertificateDetailsPortal",
  layout: "portal",
});

const { id } = useRoute().params;

const ui = reactive({
  editCertificateModal: false,
  deleteCertificateModal: false,
});

const certificateRequest = await useFetch(`/api/certificates/${id}`, {
  method: "GET",
});

const tabs = [
  {
    key: "Specializations",
    label: "Specializations",
    description:
      "All the specializations that are associated with this certificate",
  },
  {
    key: "Courses",
    label: "Courses",
    description:
      "Courses that are part of the certificate but not of any specialization",
  },
];
</script>
<template>
  <UContainer class="py-6">
    <div class="flex items-center mb-6">
      <div class="w-full" v-if="certificateRequest.data.value">
        <div class="flex items-center gap-2">
          <div class="text-3xl font-bold">
            {{ certificateRequest.data.value?.name }}
          </div>
          <UButton
            @click="ui.editCertificateModal = true"
            icon="i-heroicons-pencil"
            >Edit</UButton
          >
          <div class="px-3">
            <AppLoaderSpin
              :loading="certificateRequest.pending.value"
            ></AppLoaderSpin>
          </div>
          <div class="flex-1"></div>
          <UButton
            @click="ui.deleteCertificateModal = true"
            variant="ghost"
            color="red"
            icon="i-heroicons-trash"
          >
            <span class="sr-only">
              Delete {{ certificateRequest.data.value?.name }}
            </span>
          </UButton>
          <CertificateEditModal
            :certificate="certificateRequest.data.value"
            v-model="ui.editCertificateModal"
            @complete="
              () => {
                certificateRequest.refresh();
                ui.editCertificateModal = false;
              }
            "
            @cancel="ui.editCertificateModal = false"
          ></CertificateEditModal>
          <CertificateDeleteModal
            :certificate="certificateRequest.data.value"
            v-model="ui.deleteCertificateModal"
            @complete="
              () => {
                navigateTo({ name: 'CertificatesPortal' });
              }
            "
            @cancel="ui.deleteCertificateModal = false"
          ></CertificateDeleteModal>
        </div>
        <div class="text-gray-500 mt-2 max-w-lg text-sm">
          {{ certificateRequest.data.value?.description }}
        </div>
      </div>
    </div>
    <UTabs :items="tabs" class="w-full"></UTabs>
  </UContainer>
</template>
