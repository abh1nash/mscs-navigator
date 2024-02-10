<script setup lang="ts">
definePageMeta({
  name: "CourseDetailsPortal",
  layout: "portal",
});

const { slug } = useRoute().params;

const courseRequest = await useFetch(`/api/courses/${slug}`);

const ui = reactive({
  showEditModal: false,
  showDeleteModal: false,
});
</script>
<template>
  <UContainer class="py-6">
    <div class="flex items-center mb-6">
      <div class="w-full">
        <div class="flex items-center gap-2">
          <div class="text-3xl font-bold">
            {{ courseRequest.data.value?.name }}
          </div>
          <UButton @click="ui.showEditModal = true" icon="i-heroicons-pencil"
            >Edit</UButton
          >
          <div class="px-3">
            <AppLoaderSpin
              :loading="courseRequest.pending.value"
            ></AppLoaderSpin>
          </div>
          <div class="flex-1"></div>
          <UButton
            @click="ui.showDeleteModal = true"
            variant="ghost"
            color="red"
            icon="i-heroicons-trash"
          >
            <span class="sr-only"> Delete </span>
          </UButton>
          <CourseEditModal
            v-if="courseRequest.data.value"
            v-model="ui.showEditModal"
            :course="courseRequest.data.value"
            @complete="
              () => {
                courseRequest.refresh();
                ui.showEditModal = false;
              }
            "
            @cancel="() => (ui.showEditModal = false)"
          ></CourseEditModal>
          <CourseDeleteModal
            v-if="courseRequest.data.value"
            v-model="ui.showDeleteModal"
            :course="courseRequest.data.value"
            @complete="
              () => {
                ui.showDeleteModal = false;
                navigateTo({ name: 'CoursesPortal' });
              }
            "
            @cancel="() => (ui.showDeleteModal = false)"
          ></CourseDeleteModal>
        </div>
        <div class="text-gray-500 mt-2 max-w-lg text-sm">
          {{ courseRequest.data.value?.description }}
        </div>
      </div>
    </div>
  </UContainer>
</template>
