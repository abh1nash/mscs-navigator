<script setup lang="ts">
import { z } from "zod";
const props = defineProps<{
  course: {
    name: string;
    slug: string;
  };
}>();

const emit = defineEmits<{
  complete: [];
  cancel: [];
}>();

const schema = z.object({
  rating: z.number().min(0).max(5),
  instructorRating: z.number().min(0).max(5),
  difficultyRating: z.number().min(0).max(5),
  timeTaken: z.number().min(1),
  comment: z.string(),
});
const state = reactive({
  rating: 0,
  instructorRating: 0,
  difficultyRating: 0,
  timeTaken: 0,
  comment: "",
});
const onSubmit = () => {};
</script>
<template>
  <UModal>
    <UCard>
      <div class="text-2xl font-bold mb-4">Add Review</div>
      <div class="text-sm p-2 mb-3 rounded-md bg-gray-50">
        <strong>Course</strong>
        <br />
        {{ course.name }}
      </div>
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormGroup
          name="timeTaken"
          label="Time taken to complete the course (in hours)"
        >
          <UInput v-model="state.timeTaken" type="number"></UInput>
        </UFormGroup>
        <UFormGroup name="rating" label="Course Rating">
          <AppRating v-model="state.rating"></AppRating>
        </UFormGroup>
        <UFormGroup name="instructorRating" label="Instructor Rating">
          <AppRating v-model="state.instructorRating"></AppRating>
        </UFormGroup>
        <UFormGroup name="difficultyRating" label="Difficulty Rating">
          <AppRating v-model="state.difficultyRating"></AppRating>
        </UFormGroup>
        <UFormGroup name="comment" label="Comment">
          <UTextarea resize v-model="state.comment"></UTextarea>
        </UFormGroup>
        <div class="flex gap-2">
          <UButton type="submit"> Add Review </UButton>
          <UButton type="button" variant="ghost" @click="emit('cancel')">
            Cancel
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
