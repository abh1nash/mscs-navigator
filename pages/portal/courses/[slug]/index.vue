<script setup lang="ts">
definePageMeta({
  name: "CourseDetailsPortal",
  layout: "portal",
  middleware: ["auth"],
});

const { slug } = useRoute().params;

const courseRequest = await useFetch(`/api/courses/${slug}`, {
  key: `course-${slug}`,
});

const ui = reactive({
  showEditModal: false,
  showDeleteModal: false,
  addModuleModal: false,
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
    <div class="grid grid-cols-3 gap-4">
      <div
        class="min-h-24 relative bg-gray-50 hover:bg-gray-100 text-gray-400 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg border border-dashed flex items-center justify-center"
      >
        <div class="text-center">
          <div>
            <UIcon name="i-heroicons-plus" class="size-8"></UIcon>
          </div>
          <div aria-hidden="true">Add Module</div>
        </div>
        <button
          @click="ui.addModuleModal = true"
          class="absolute inset-0"
          aria-label="Add Module"
        ></button>
        <CourseModuleAddModal
          v-if="courseRequest.data.value"
          :course="courseRequest.data.value"
          v-model="ui.addModuleModal"
          @complete="
            () => {
              courseRequest.refresh();
              ui.addModuleModal = false;
            }
          "
          @cancel="ui.addModuleModal = false"
        ></CourseModuleAddModal>
      </div>
      <CourseModuleCard
        v-if="courseRequest.data.value"
        v-for="module in courseRequest.data.value?.modules"
        :key="module.id"
        :course="courseRequest.data.value"
        :module="module"
      ></CourseModuleCard>
    </div>
  </UContainer>
</template>
