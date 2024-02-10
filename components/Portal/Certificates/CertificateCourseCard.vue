<script setup lang="ts">
const props = defineProps<{
  certificate: {
    id: string;
  };
  course: {
    name: string;
    id: string;
    slug: string;
    description?: string | null;
    difficulty?: number | null;
  };
}>();

const emit = defineEmits<{
  complete: [];
}>();

const isLoading = ref(false);
const toast = useToast();
const onDelete = async () => {
  try {
    isLoading.value = true;
    await $fetch(`/api/certificates/${props.certificate.id}/course`, {
      method: "DELETE",
      body: JSON.stringify({ courseId: props.course.id }),
    });
    refreshNuxtData(`certificate-${props.certificate.id}`);
  } catch (err: any) {
    toast.add({
      title: "Error",
      description:
        err.data?.message || "Cannot remove course from the certificate",
      icon: "i-heroicons-x-circle-20-solid",
      color: "red",
    });
  }
};
</script>
<template>
  <UCard class="hover:ring-primary-500 relative">
    <div class="flex items-center justify-between">
      <div class="flex-1 text-lg font-bold truncate">
        {{ course.name }}
      </div>
      <div>
        <UButton
          @click="onDelete"
          variant="ghost"
          icon="i-heroicons-trash"
          color="red"
        >
          <span class="sr-only">Remove</span>
        </UButton>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <UButton
        :to="{
          name: 'CourseDetailsPortal',
          params: { slug: course.slug },
        }"
        class="bg-primary-500/10 text-primary hover:bg-primary-500/20"
        icon="i-heroicons-eye"
      >
        Details
      </UButton>
    </div>
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center"
    >
      <AppLoaderSpin :loading="true"></AppLoaderSpin>
    </div>
  </UCard>
</template>
