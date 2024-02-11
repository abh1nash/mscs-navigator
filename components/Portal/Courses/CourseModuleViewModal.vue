<script setup lang="ts">
const props = defineProps<{
  module: {
    id: string;
    name: string;
    description?: string | null;
  };
}>();

const emit = defineEmits<{
  complete: [];
  cancel: [];
}>();
</script>
<template>
  <UModal>
    <UCard>
      <div class="text-2xl font-bold mb-4">{{ module.name }}</div>
      <div class="mb-4">
        {{ module.description || "No description available." }}
      </div>
      <UButton type="button" variant="ghost" @click="$emit('cancel')">
        Done
      </UButton>
    </UCard>
  </UModal>
</template>
