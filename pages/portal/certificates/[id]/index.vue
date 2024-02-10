<script setup lang="ts">
definePageMeta({
  name: "CertificateDetailsPortal",
  layout: "portal",
});

const { id } = useRoute().params;

const ui = reactive({
  editCertificateModal: false,
  deleteCertificateModal: false,
  addSpecializationModal: false,
  addCourseModal: false,
});

const certificateRequest = await useFetch(`/api/certificates/${id}`, {
  method: "GET",
  key: `certificate-${id}`,
});

const tabs = [
  {
    key: "specializations",
    label: "Specializations",
    description:
      "All the specializations that are associated with this certificate",
  },
  {
    key: "courses",
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
    <UTabs :items="tabs" class="w-full">
      <template #item="{ item }">
        <div
          class="grid grid-cols-3 gap-4"
          v-if="item.key == 'specializations'"
        >
          <CertificateSpecializationCard
            v-if="certificateRequest.data.value"
            v-for="{ id, specialization } in certificateRequest.data.value
              ?.specializations"
            :key="id"
            :specialization="specialization"
            :certificate="certificateRequest.data.value"
          ></CertificateSpecializationCard>
          <div
            class="min-h-24 relative bg-gray-50 hover:bg-gray-100 text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg border border-dashed flex items-center justify-center"
          >
            <div class="text-center">
              <div>
                <UIcon name="i-heroicons-plus" class="size-8"></UIcon>
              </div>
              <div aria-hidden="true">Add Specialization</div>
            </div>
            <button
              @click="ui.addSpecializationModal = true"
              class="absolute inset-0"
              aria-label="Add Specialization"
            ></button>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4" v-if="item.key == 'courses'">
          <CertificateCourseCard
            v-if="certificateRequest.data.value"
            v-for="{ id, course } in certificateRequest.data.value?.courses"
            :key="id"
            :course="course"
            :certificate="certificateRequest.data.value"
          ></CertificateCourseCard>
          <div
            class="min-h-24 relative bg-gray-50 hover:bg-gray-100 text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg border border-dashed flex items-center justify-center"
          >
            <div class="text-center">
              <div>
                <UIcon name="i-heroicons-plus" class="size-8"></UIcon>
              </div>
              <div aria-hidden="true">Add Course</div>
            </div>
            <button
              @click="ui.addCourseModal = true"
              class="absolute inset-0"
              aria-label="Add Specialization"
            ></button>
          </div>
        </div>
      </template>
    </UTabs>
    <CertificateAddSpecializationModal
      v-if="certificateRequest.data.value"
      :certificate="certificateRequest.data.value"
      v-model="ui.addSpecializationModal"
      @complete="
        () => {
          certificateRequest.refresh();
          ui.addSpecializationModal = false;
        }
      "
      @cancel="ui.addSpecializationModal = false"
    ></CertificateAddSpecializationModal>
    <CertificateAddCourseModal
      v-if="certificateRequest.data.value"
      :certificate="certificateRequest.data.value"
      v-model="ui.addCourseModal"
      @complete="
        () => {
          certificateRequest.refresh();
          ui.addCourseModal = false;
        }
      "
      @cancel="ui.addCourseModal = false"
    ></CertificateAddCourseModal>
  </UContainer>
</template>
