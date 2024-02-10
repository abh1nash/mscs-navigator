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
  specializationId: "",
  type: "",
});
const specializationsRequest = await useLazyFetch("/api/specializations", {
  query,
});

const options = computed(() => {
  return specializationsRequest.data.value?.results.map((s) => ({
    label: s.name,
    value: s.id,
  }));
});

const isLoading = ref(false);
const toast = useToast();

async function onSubmit(event: FormSubmitEvent<{ specializationId: string }>) {
  try {
    isLoading.value = true;
    await $fetch(`/api/certificates/${props.certificate.id}/specialization`, {
      method: "POST",
      body: JSON.stringify(event.data),
    });
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description:
        err.data?.message || "Cannot add specialization to certificate",
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
        <div>Add Specialization to Certificate</div>
      </div>
      <div>
        <UForm :state="state" @submit="onSubmit" class="space-y-4">
          <UFormGroup required label="Specialization" name="specializationId">
            <USelectMenu
              v-model="state.specializationId"
              v-model:query="query.query"
              :loading="specializationsRequest.pending.value"
              searchable
              placeholder="Select a specialization"
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
              :disabled="!state.specializationId || !state.type"
              >Add To Certificate</UButton
            >
            <UButton
              typee="button"
              @click="
                () => {
                  state.specializationId = '';
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
