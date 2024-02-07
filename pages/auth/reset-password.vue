<script setup lang="ts">
definePageMeta({
  name: "ResetPassword",
});

const state = reactive({
  email: undefined,
});
const resetPassword = () => {
  console.log("Reset Password");
};
</script>
<template>
  <UContainer class="flex items-center justify-center h-screen bg-gray-100">
    <div class="w-full">
      <UCard class="max-w-md mx-auto">
        <template #header>
          <div class="font-bold text-2xl">Reset Password</div>
        </template>

        <UForm @submit="resetPassword" :state="state" class="grid gap-3">
          <UFormGroup label="Email" required>
            <UInput
              icon="i-heroicons-envelope"
              placeholder="youremail@colorado.edu"
              type="email"
            />
          </UFormGroup>
          <div class="text-center">
            <UButton type="submit">Send Password Reset Link</UButton>
          </div>
        </UForm>
        <template #footer>
          <div class="text-center text-sm">
            <UButton variant="link" :to="{ name: 'Login' }"
              >Back to Login</UButton
            >
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
