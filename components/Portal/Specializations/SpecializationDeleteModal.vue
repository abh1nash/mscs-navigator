<script setup lang="ts">
const props = defineProps<{
  specialization: { slug: string; name: string };
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
    await $fetch(`/api/specializations/${props.specialization.slug}`, {
      method: "DELETE",
    });
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err.data?.message || "Cannot delete specialization",
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
      <div class="text-2xl font-bold mb-4">Delete Specialization</div>
      <div class="mb-4">
        Are you sure you want to delete
        <span class="font-bold">{{ props.specialization.name }}</span
        >? This action cannot be undone.
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
