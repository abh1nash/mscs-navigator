<script setup lang="ts"></script>
<template>
  <div>
    <AppMainHeader class="fixed top-0"></AppMainHeader>
    <div class="flex-1">
      <slot></slot>
    </div>
    <div class="h-10 w-full bg-primary"></div>
  </div>
</template>
