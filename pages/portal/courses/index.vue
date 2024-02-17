<script setup lang="ts">
definePageMeta({
  name: "CoursesPortal",
  layout: "portal",
  middleware: ["auth"],
});

const query = reactive({
  page: 1,
  limit: 10,
  query: "",
});

const coursesRequest = useFetch(`/api/courses`, {
  key: "courses",
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
        Courses
        <UButton @click="ui.showAddModal = true" icon="i-heroicons-plus"
          >Add</UButton
        >
        <CourseAddModal
          v-model="ui.showAddModal"
          @complete="
            () => {
              coursesRequest.refresh();
              ui.showAddModal = false;
            }
          "
          @cancel="() => (ui.showAddModal = false)"
        ></CourseAddModal>
      </div>
      <div class="px-3">
        <AppLoaderSpin :loading="coursesRequest.pending.value"></AppLoaderSpin>
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
      <CourseCard
        v-for="course in coursesRequest.data.value?.results"
        :course="course"
      ></CourseCard>
    </div>
  </UContainer>
</template>
