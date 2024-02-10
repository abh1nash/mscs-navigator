<script setup lang="ts">
definePageMeta({
  name: "CourseDetailsPortal",
  layout: "portal",
});
</script>
<template>
  <UContainer class="py-6">
    <div class="flex items-center mb-6">
      <div class="w-full">
        <div class="flex items-center gap-2">
          <div class="text-3xl font-bold">Course</div>
          <UButton icon="i-heroicons-pencil">Edit</UButton>
          <div class="flex-1"></div>
          <UButton variant="ghost" color="red" icon="i-heroicons-trash">
            <span class="sr-only"> Delete </span>
          </UButton>
        </div>
        <div class="text-gray-500 mt-2 max-w-lg text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
          repellendus odit commodi quis earum perferendis tenetur molestias
          dolorem aut in dolorum voluptas animi, illo iste delectus magnam eum a
          totam architecto reiciendis? Odit totam, explicabo temporibus mollitia
          necessitatibus rerum libero aspernatur, corrupti nemo sint ad magnam
          modi voluptas dolores velit?
        </div>
      </div>
    </div>
  </UContainer>
</template>
