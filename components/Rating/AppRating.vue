<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    ratingSize?: string;
    readOnly?: boolean;
    modelValue?: number;
  }>(),
  { ratingSize: "20px", readOnly: false, modelValue: 0 }
);
const emit = defineEmits<{
  "update:modelValue": [number];
}>();
</script>
<template>
  <NuxtRating
    :read-only="readOnly"
    :rating-size="ratingSize"
    active-color="#cfb87c"
    :rating-value="modelValue"
    @rating-selected="
      (value) => emit('update:modelValue', value == modelValue ? 0 : value)
    "
  ></NuxtRating>
</template>
