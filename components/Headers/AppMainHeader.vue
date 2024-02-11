<script setup lang="ts">
const nav = ref<HTMLElement | null>(null);

const { height } = useElementSize(nav);
const { y } = useWindowScroll();
</script>
<template>
  <div ref="nav" class="h-16 w-full flex items-center bg-black px-4 z-10">
    <div :class="[y > height ? 'size-12' : 'h-6 w-64', 'transition-all']">
      <NuxtLink to="/">
        <CULogo class="max-h-full" :include-text="y < height"></CULogo>
      </NuxtLink>
    </div>
    <div class="flex-1"></div>
    <div>
      <UButton :to="{ name: 'Login' }">Portal</UButton>
    </div>
  </div>
</template>
