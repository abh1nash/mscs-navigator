<script setup lang="ts">
const props = defineProps<{
  module: {
    id: string;
    name: string;
    description?: string | null;
  };
  course: { slug: string; name: string };
}>();

const description = computed(() => {
  if (props.module.description) {
    return props.module.description.length > 50
      ? props.module.description.slice(0, 50) + "..."
      : props.module.description;
  }
  return "";
});

const state = reactive({
  showDeleteModal: false,
  showEditModal: false,
  showViewModal: false,
});

const items = (i: typeof props.module) => [
  [
    {
      label: "View",
      icon: "i-heroicons-eye-20-solid",
      click: () => (state.showViewModal = true),
    },
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
    <div class="flex items-center justify-between">
      <div class="text-xl font-bold">{{ module.name }}</div>
      <div class="flex items-center space-x-2">
        <UDropdown :items="items(module)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
          <CourseModuleDeleteModal
            v-model="state.showDeleteModal"
            @complete="
              () => {
                state.showDeleteModal = false;
                refreshNuxtData('course-' + course.slug);
              }
            "
            @cancel="() => (state.showDeleteModal = false)"
            :course="course"
            :module="module"
          ></CourseModuleDeleteModal>
          <CourseModuleEditModal
            v-model="state.showEditModal"
            @complete="
              () => {
                state.showEditModal = false;
                refreshNuxtData('course-' + course.slug);
              }
            "
            @cancel="() => (state.showEditModal = false)"
            :course="course"
            :module="module"
          ></CourseModuleEditModal>
          <CourseModuleViewModal
            v-model="state.showViewModal"
            @cancel="() => (state.showViewModal = false)"
            :course="course"
            :module="module"
          ></CourseModuleViewModal>
        </UDropdown>
      </div>
    </div>
    <div class="text-gray-500">
      {{ description }}
    </div>
  </UCard>
</template>
