<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { token } = useRoute().params;

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long."),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match.",
        path: ["confirmPassword"],
      });
    }
  });
const { error } = await useFetch("/api/auth/reset-password/validate", {
  method: "GET",
  query: { token },
});

if (error.value) {
  throw createError({
    statusCode: 404,
    message: "Not found",
    fatal: true,
  });
}

const state = reactive({
  password: undefined,
  confirmPassword: undefined,
});

const isLoading = ref(false);
const toast = useToast();

const resetPassword = async (
  event: FormSubmitEvent<z.output<typeof schema>>
) => {
  try {
    isLoading.value = true;
    await $fetch("/api/auth/reset-password/" + token, {
      method: "POST",
      body: JSON.stringify(event.data),
    });
    toast.add({
      color: "green",
      title: "Success",
      icon: "i-heroicons-information-circle",
      description: "Password reset successfully.",
    });
    navigateTo({ name: "Login" });
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
  <UContainer class="flex items-center justify-center h-screen">
    <div class="w-full">
      <UCard class="max-w-md mx-auto">
        <template #header>
          <div class="font-bold text-2xl">Reset Password</div>
        </template>

        <UForm
          @submit="resetPassword"
          :schema="schema"
          :state="state"
          class="grid gap-3"
        >
          <UFormGroup label="New Password" name="password" required>
            <UInput
              name="password"
              :disabled="isLoading"
              v-model="state.password"
              type="password"
            />
          </UFormGroup>
          <UFormGroup label="Confirm Password" name="confirmPassword" required>
            <UInput
              :disabled="isLoading"
              v-model="state.confirmPassword"
              type="password"
            />
          </UFormGroup>
          <div class="text-center">
            <UButton :loading="isLoading" type="submit"
              >Reset My Password</UButton
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
