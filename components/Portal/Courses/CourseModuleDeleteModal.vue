<script setup lang="ts">
const props = defineProps<{
  module: {
    id: string;
    name: string;
  };
  course: { slug: string; name: string };
}>();

const emit = defineEmits<{
  complete: [];
  cancel: [];
}>();

const isLoading = ref(false);
const toast = useToast();
const onDelete = async () => {
  try {
    isLoading.value = true;
    await $fetch(
      `/api/courses/${props.course.slug}/modules/${props.module.id}`,
      {
        method: "DELETE",
      }
    );
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err.data?.message || "Cannot delete module",
      icon: "i-heroicons-x-circle-20-solid",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <UModal>
    <UCard>
      <div class="text-2xl font-bold mb-4">Delete Module</div>
      <div class="mb-4">
        Are you sure you want to delete
        <span class="font-bold">{{ props.module.name }}</span> from
        {{ props.course.name }}? This action cannot be undone.
      </div>
      <div class="flex gap-2">
        <UButton
          :loading="isLoading"
          @click="onDelete"
          icon="i-heroicons-trash-20-solid"
          >Delete</UButton
        >
        <UButton @click="emit('cancel')" variant="ghost">Cancel</UButton>
      </div>
    </UCard>
  </UModal>
</template>
