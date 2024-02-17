<script setup lang="ts">
definePageMeta({
  name: "SpecializationDetailsPortal",
  layout: "portal",
  middleware: ["auth"],
});

const { slug } = useRoute().params;

const specializationRequest = await useFetch(`/api/specializations/${slug}`, {
  method: "GET",
  key: `specialization-${slug}`,
});

const ui = reactive({
  addCourseModal: false,
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
          <div class="px-3">
            <AppLoaderSpin
              :loading="specializationRequest.pending.value"
            ></AppLoaderSpin>
          </div>
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
    <div class="grid grid-cols-3 gap-4">
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
        <SpecializationAddCourseModal
          v-if="specializationRequest.data.value"
          :specialization="specializationRequest.data.value"
          v-model="ui.addCourseModal"
          @complete="
            () => {
              specializationRequest.refresh();
              ui.addCourseModal = false;
            }
          "
          @cancel="ui.addCourseModal = false"
        ></SpecializationAddCourseModal>
      </div>
      <SpecializationCourseCard
        v-if="specializationRequest.data.value"
        v-for="course in specializationRequest.data.value?.courses"
        :key="course.id"
        :specialization="specializationRequest.data.value"
        :course="course"
      ></SpecializationCourseCard>
    </div>
  </UContainer>
</template>
