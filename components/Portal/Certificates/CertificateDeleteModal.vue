<script setup lang="ts">
const props = defineProps<{
  certificate: { id: string; name: string };
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
    await $fetch(`/api/certificates/${props.certificate.id}`, {
      method: "DELETE",
    });
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err.data?.message || "Cannot delete certificate",
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
      <div class="text-2xl font-bold mb-4">Delete Certificate</div>
      <div class="mb-4">
        Are you sure you want to delete
        <span class="font-bold">{{ props.certificate.name }}</span
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
