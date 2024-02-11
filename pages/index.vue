<script setup lang="ts">
definePageMeta({
  name: "Home",
});
const route = useRoute();
const query = computed(() => route.query);
const searchRequest = await useFetch("/api/public/search", {
  query,
});
</script>
<template>
  <div class="flex flex-col min-h-svh">
    <!-- <HomeBanner></HomeBanner> -->
    <div class="grid grid-cols-12 flex-1">
      <div
        class="col-span-3 px-4 sticky top-10 max-h-lvh py-8 overflow-auto border-r"
      >
        <ClientOnly>
          <HomeFilters></HomeFilters>
        </ClientOnly>
      </div>
      <div class="col-span-9 px-4 py-6">
        <UContainer>
          <div class="mb-4">
            <div class="flex items-center gap-2 h-12">
              <div>
                Showing {{ searchRequest.data?.value?.results.length }} of
                {{ searchRequest.data?.value?.pagination.total }}
              </div>
              <div>
                <AppLoaderSpin
                  :loading="searchRequest.pending.value"
                ></AppLoaderSpin>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <UCard v-for="result in searchRequest.data.value?.results">
              <div class="font-bold">
                {{ result.name }}
              </div>
            </UCard>
          </div>
        </UContainer>
      </div>
    </div>
  </div>
</template>
