<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const props = defineProps<{
  specialization: {
    name: string;
    description?: string | null;
    difficulty?: number | null;
    slug: string;
  };
}>();

const emit = defineEmits<{
  complete: [];
  cancel: [];
}>();

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.number().min(1).max(5).optional(),
});

const state = reactive({
  name: props.specialization.name,
  description: props.specialization.description || "",
  difficulty: props.specialization.difficulty || 2,
});

const isLoading = ref(false);
const toast = useToast();
async function onSubmit(event: FormSubmitEvent<typeof schema>) {
  try {
    isLoading.value = true;
    await $fetch("/api/specializations/" + props.specialization.slug, {
      method: "PUT",
      body: JSON.stringify(event.data),
    });
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err.data?.message || "Cannot update specialization",
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
  state.difficulty = 2;
});
</script>
<template>
  <UModal>
    <UCard>
      <div class="text-2xl font-bold mb-4">Edit Specialization</div>
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
        <UFormGroup label="Difficulty" name="difficulty">
          <URange
            v-model="state.difficulty"
            :min="1"
            :max="5"
            class="mb-6"
          ></URange>
        </UFormGroup>
        <div class="flex gap-2">
          <UButton type="submit" :loading="isLoading">
            Update Specialization
          </UButton>
          <UButton type="button" variant="ghost" @click="$emit('cancel')">
            Cancel
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
