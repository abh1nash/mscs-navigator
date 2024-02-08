<script setup lang="ts">
const props = defineProps<{
  user: { firstName: string; lastName: string; id: string; email: string };
}>();

const emit = defineEmits<{
  complete: [];
  cancel: [];
}>();

const isLoading = ref(false);

const onDelete = async () => {
  try {
    isLoading.value = true;
    await $fetch(`/api/users/${props.user.id}`, {
      method: "DELETE",
    });
    emit("complete");
  } catch (err: any) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <UModal>
    <UCard>
      <div class="text-2xl font-bold mb-4">Delete User</div>
      <div class="mb-4">
        Are you sure you want to delete
        <span class="font-bold"
          >{{ props.user.firstName }} {{ props.user.lastName }}</span
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
