<script setup lang="ts">
definePageMeta({
  name: "ResetPassword",
});

const state = reactive({
  email: undefined,
});

const isLoading = ref(false);

const toast = useToast();
const resetPassword = async () => {
  try {
    isLoading.value = true;
    const result = await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(state),
    });
    toast.add({
      color: "green",
      title: "Success",
      icon: "i-heroicons-information-circle",
      description: result.message || "Password reset link sent to your email.",
    });
  } catch (err) {
    toast.add({
      color: "red",
      title: "Error",
      icon: "i-heroicons-information-circle",
      description: "An error occurred while trying to reset your password.",
    });
  } finally {
    isLoading.value = false;
  }
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
              name="email"
              :disabled="isLoading"
              v-model="state.email"
              icon="i-heroicons-envelope"
              placeholder="youremail@colorado.edu"
              type="email"
            />
          </UFormGroup>
          <div class="text-center">
            <UButton :loading="isLoading" type="submit"
              >Send Password Reset Link</UButton
            >
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
