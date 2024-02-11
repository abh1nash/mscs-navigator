<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";

const props = defineProps<{ specialization: { slug: string } }>();

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
    await $fetch(`/api/specializations/${props.specialization.slug}/course`, {
      method: "POST",
      body: JSON.stringify(event.data),
    });
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err.data?.message || "Cannot add course to specialization",
      icon: "i-heroicons-x-circle-20-solid",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <UModal class="overflow-y-auto" :ui="{ base: 'overflow-visible' }">
    <UCard>
      <div class="flex gap-2 text-2xl font-bold mb-4">
        <div>Add Course to Specialization</div>
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

          <div class="flex gap-2">
            <UButton
              :loading="isLoading"
              type="submit"
              :disabled="!state.courseId"
              >Add To Specialization</UButton
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
