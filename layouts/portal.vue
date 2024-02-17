<script setup lang="ts">
const user = useUser();

if (!user.value) {
  navigateTo({
    name: "Login",
  });
}
</script>
<template>
  <div>
    <div class="min-h-screen grid grid-cols-12">
      <div class="col-span-2 sticky top-0 left-0">
        <AppPortalAside />
      </div>
      <div class="col-span-10 2xl:col-span-11">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
