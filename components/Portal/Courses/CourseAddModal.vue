<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const emit = defineEmits<{
  complete: [];
  cancel: [];
}>();

const schema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  officialTimeEstimation: z.number().optional(),
  officialDifficultyRating: z.number().optional(),
  description: z.string().optional(),
  prerequisites: z.string().optional(),
});

const state = reactive({
  name: "",
  code: "",
  officialTimeEstimation: 0,
  officialDifficultyRating: 2,
  description: "",
  prerequisites: "",
});

const isLoading = ref(false);
const toast = useToast();
async function onSubmit(event: FormSubmitEvent<typeof schema>) {
  try {
    isLoading.value = true;
    await $fetch("/api/courses", {
      method: "POST",
      body: JSON.stringify(event.data),
    });
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err.data?.message || "Cannot create course",
      icon: "i-heroicons-x-circle-20-solid",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <UModal>
    <UCard>
      <div class="text-2xl font-bold mb-4">Add New Course</div>
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormGroup label="Name" required name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Course Code" name="code">
          <UInput v-model="state.code" />
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UTextarea v-model="state.description" />
        </UFormGroup>
        <UFormGroup
          label="Official Difficulty Rating"
          name="officialDifficultyRating"
        >
          <URange
            v-model="state.officialDifficultyRating"
            :min="1"
            :max="5"
          ></URange>
        </UFormGroup>
        <UFormGroup
          label="Official Time Estimation (in hours)"
          name="officialTimeEstimation"
        >
          <UInput v-model="state.officialTimeEstimation" type="number" />
        </UFormGroup>
        <UFormGroup label="Prerequisites" name="prerequisites">
          <UTextarea v-model="state.prerequisites" />
        </UFormGroup>
        <div class="flex gap-2">
          <UButton type="submit" :loading="isLoading"> Add Course </UButton>
          <UButton type="button" variant="ghost" @click="$emit('cancel')">
            Cancel
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
