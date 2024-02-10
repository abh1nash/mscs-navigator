<script setup lang="ts">
const props = defineProps<{
  course: {
    name: string;
    slug: string;
    code?: string | null;
    officialTimeEstimation?: number | null;
    officialDifficultyRating?: number | null;
    description?: string | null;
    prerequisites?: string | null;
  };
}>();

const description = computed(() => {
  if (props.course.description) {
    return props.course.description.length > 50
      ? props.course.description.slice(0, 50) + "..."
      : props.course.description;
  }
  return "";
});

const state = reactive({
  showDeleteModal: false,
  showEditModal: false,
});

const items = (i: typeof props.course) => [
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
        name: 'CourseDetailsPortal',
        params: { slug: course.slug },
      }"
      :aria-label="course.name"
    >
      <span class="absolute inset-0" aria-hidden="true"></span>
    </NuxtLink>
    <div class="flex items-center justify-between">
      <div class="text-xl font-bold">{{ course.name }}</div>
      <div class="flex items-center space-x-2">
        <UDropdown :items="items(course)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
          <CourseDeleteModal
            v-model="state.showDeleteModal"
            @complete="
              () => {
                state.showDeleteModal = false;
                refreshNuxtData('courses');
              }
            "
            @cancel="() => (state.showDeleteModal = false)"
            :course="course"
          ></CourseDeleteModal>
          <CourseEditModal
            v-model="state.showEditModal"
            @complete="
              () => {
                state.showEditModal = false;
                refreshNuxtData('courses');
              }
            "
            @cancel="() => (state.showEditModal = false)"
            :course="course"
          ></CourseEditModal>
        </UDropdown>
      </div>
    </div>
    <div class="text-gray-500">
      {{ description }}
    </div>
  </UCard>
</template>
