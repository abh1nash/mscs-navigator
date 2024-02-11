<script setup lang="ts"></script>
<template>
  <section>
    <div class="cu-banner flex items-center h-64 md:h-80 pt-12">
      <UContainer>
        <h1 class="text-6xl font-extrabold text-white">Be Boulder.</h1>
      </UContainer>
    </div>
  </section>
</template>
<style scoped>
.cu-banner {
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/cu-aerial-crop.jpg");
  background-size: cover;
}
</style>
