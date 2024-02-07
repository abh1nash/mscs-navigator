<script setup lang="ts">
defineProps<{ link: string }>();
</script>
<template>
  <e-html lang="en">
    <e-heading as="h2"> Reset Password </e-heading>
    <e-text>
      You are receiving this email because we received a password reset request
      for your account. Please click the link below to reset your password.
    </e-text>
    <e-button :href="link">Reset My Password</e-button>
    <e-text>
      If you did not request a password reset, no further action is required.
    </e-text>
  </e-html>
</template>
