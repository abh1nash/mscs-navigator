<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const props = defineProps<{
  certificate: {
    id: string;
    name: string;
    description?: string | null;
  };
}>();

const emit = defineEmits<{
  complete: [];
  cancel: [];
}>();

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const state = reactive({
  name: props.certificate.name,
  description: props.certificate.description || "",
});

const isLoading = ref(false);
const toast = useToast();
async function onSubmit(event: FormSubmitEvent<typeof schema>) {
  try {
    isLoading.value = true;
    await $fetch("/api/certificates/" + props.certificate.id, {
      method: "PUT",
      body: JSON.stringify(event.data),
    });
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err.data?.message || "Cannot update certificate",
      icon: "i-heroicons-x-circle-20-solid",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}

onUnmounted(() => {
  isLoading.value = false;
  state.name = "";
  state.description = "";
});
</script>
<template>
  <UModal>
    <UCard>
      <div class="text-2xl font-bold mb-4">Edit Certificate</div>
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-2"
      >
        <UFormGroup label="Name" required name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UTextarea v-model="state.description" />
        </UFormGroup>
        <div class="flex gap-2">
          <UButton type="submit" :loading="isLoading">
            Update Certificate
          </UButton>
          <UButton type="button" variant="ghost" @click="$emit('cancel')">
            Cancel
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
