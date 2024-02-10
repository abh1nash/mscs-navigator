<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { CourseType } from "@prisma/client";

const props = defineProps<{ certificate: { id: string } }>();

const emit = defineEmits<{
  complete: [];
  cancel: [];
}>();

const query = reactive({
  page: 1,
  limit: 20,
  query: "",
});

const state = reactive({
  courseId: "",
  type: "",
});
const coursesRequest = await useLazyFetch("/api/courses", {
  query,
});

const options = computed(() => {
  return coursesRequest.data.value?.results.map((s) => ({
    label: s.name,
    value: s.id,
  }));
});

const isLoading = ref(false);
const toast = useToast();

async function onSubmit(event: FormSubmitEvent<{ courseId: string }>) {
  try {
    isLoading.value = true;
    await $fetch(`/api/certificates/${props.certificate.id}/course`, {
      method: "POST",
      body: JSON.stringify(event.data),
    });
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err.data?.message || "Cannot add course to certificate",
      icon: "i-heroicons-x-circle-20-solid",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <UModal class="overflow-y-auto">
    <UCard>
      <div class="flex gap-2 text-2xl font-bold mb-4">
        <div>Add Course to Certificate</div>
      </div>
      <div>
        <UForm :state="state" @submit="onSubmit" class="space-y-4">
          <UFormGroup required label="Course" name="courseId">
            <USelectMenu
              v-model="state.courseId"
              v-model:query="query.query"
              :loading="coursesRequest.pending.value"
              searchable
              placeholder="Select a course"
              value-attribute="value"
              :options="options"
            />
          </UFormGroup>

          <UFormGroup label="Type" required name="type">
            <USelect
              :options="
                Object.values(CourseType).map((type) => ({
                  label: type,
                  value: type,
                }))
              "
              v-model="state.type"
            ></USelect>
          </UFormGroup>
          <div class="flex gap-2">
            <UButton
              :loading="isLoading"
              type="submit"
              :disabled="!state.courseId || !state.type"
              >Add To Certificate</UButton
            >
            <UButton
              typee="button"
              @click="
                () => {
                  state.courseId = '';
                  emit('cancel');
                }
              "
              variant="ghost"
              >Cancel</UButton
            >
          </div>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>
