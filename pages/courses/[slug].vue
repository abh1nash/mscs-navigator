<script setup lang="ts">
definePageMeta({
  name: "CourseDetails",
});

const slug = useRoute().params.slug;

const { data, error } = await useFetch(`/api/public/courses/${slug}`);

if (error.value) {
  throw createError({
    statusCode: 404,
    message: error.value.data.message || "Course not found",
    fatal: true,
  });
}

const modules = computed(() => {
  return (
    data.value?.modules.map((module) => ({
      label: module.name,
      content: module.description || "",
    })) || []
  );
});

const user = useUser();

const ui = reactive({
  showAddReviewModal: false,
});
</script>
<template>
  <div>
    <div class="grid grid-cols-12 min-h-svh">
      <div class="col-span-8 pt-20">
        <UContainer>
          <div class="text-md text-gray-300 tracking-widest">
            {{ data?.code }}
          </div>
          <h1 class="text-6xl font-bold max-w-3xl">
            {{ data?.name }}
          </h1>
          <UCard class="my-6 max-w-3xl">
            <div class="grid grid-cols-3 gap-4">
              <div class="flex gap-2">
                <div
                  class="size-10 bg-primary/20 text-primary text-2xl rounded-md flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-academic-cap"></UIcon>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-xs">Final Type</div>
                  <div>{{ data?.finalType }}</div>
                </div>
              </div>
              <div class="flex gap-2">
                <div
                  class="size-10 bg-primary/20 text-primary text-2xl rounded-md flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-clock"></UIcon>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-xs">Official Time</div>
                  <div>{{ data?.officialTimeEstimation }} hours</div>
                </div>
              </div>
              <div class="flex gap-2">
                <div
                  class="size-10 bg-primary/20 text-primary text-2xl rounded-md flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-user-group"></UIcon>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-xs">Students Time</div>
                  <div>12 hours</div>
                </div>
              </div>
              <div class="flex gap-2">
                <div
                  class="size-10 bg-primary/20 text-primary text-2xl rounded-md flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-star"></UIcon>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-xs">Overall Rating</div>
                  <div>
                    <AppRating :model-value="1.4" read-only></AppRating>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <div
                  class="size-10 bg-primary/20 text-primary text-2xl rounded-md flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-building-library"></UIcon>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-xs">Instructor Effectiveness</div>
                  <div>
                    <AppRating :model-value="2.4" read-only></AppRating>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <div
                  class="size-10 bg-primary/20 text-primary text-2xl rounded-md flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-chart-bar"></UIcon>
                </div>
                <div class="flex-1">
                  <div class="font-bold text-xs">Difficulty</div>
                  <div>
                    <AppRating :model-value="3.8" read-only></AppRating>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h2 class="font-bold">Description</h2>
              <p>
                {{ data?.description }}
              </p>
            </div>
            <div>
              <h2 class="font-bold">Modules</h2>
              <UAccordion :items="modules">
                <template #default="{ item }">
                  <UButton
                    variant="ghost"
                    class="text-left border-b border-primary-100 rounded-none"
                  >
                    {{ item.label }}
                  </UButton>
                </template>
              </UAccordion>
            </div>
          </div>
        </UContainer>
      </div>
      <div class="col-span-4 bg-gray-50 dark:bg-gray-950 pt-16 px-4">
        <div class="py-4 flex gap-2">
          <h2 class="font-bold text-2xl">Reviews</h2>

          <ClientOnly>
            <UButton
              v-if="user"
              @click="() => (ui.showAddReviewModal = true)"
              icon="i-heroicons-plus"
              >Add Review</UButton
            >
            <CourseReviewAddModal
              v-model="ui.showAddReviewModal"
              @cancel="() => (ui.showAddReviewModal = false)"
              :course="data!"
            ></CourseReviewAddModal>
          </ClientOnly>
        </div>
        <div class="grid gap-4">
          <UCard>
            <AppRating :model-value="3.4" class="mb-2"></AppRating>
            <div class="font-bold">Andrew S.</div>
            <div class="text-sm">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Distinctio nisi, veniam architecto voluptates earum facere et
              magnam accusantium fugiat placeat?
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
