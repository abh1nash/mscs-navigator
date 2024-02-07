<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  name: "Login",
});

const isLoading = ref(false);

const schema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

const state = reactive({
  email: undefined,
  password: undefined,
});

const toast = useToast();

const login = async (event: FormSubmitEvent<z.output<typeof schema>>) => {
  try {
    isLoading.value = true;
    await $fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(event.data),
    });

    toast.add({
      color: "green",
      title: "Success",
      icon: "i-heroicons-information-circle",
      description: "Logged in successfully.",
    });

    navigateTo({ name: "Dashboard" });
  } catch (err) {
    toast.add({
      color: "red",
      title: "Error",
      icon: "i-heroicons-information-circle",
      description: "An error occurred while trying to log in.",
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
          <div class="font-bold text-2xl">Log In</div>
        </template>

        <UForm
          @submit="login"
          :schema="schema"
          :state="state"
          class="grid gap-3"
        >
          <UFormGroup label="Email" name="email" required>
            <UInput
              :disabled="isLoading"
              icon="i-heroicons-envelope"
              placeholder="steve.wozniak@colorado.edu"
              v-model="state.email"
              type="email"
            />
          </UFormGroup>
          <UFormGroup label="Password" name="Password" required>
            <UInput
              :disabled="isLoading"
              placeholder="********"
              v-model="state.password"
              type="password"
            />
          </UFormGroup>
          <div class="text-center">
            <UButton :loading="isLoading" type="submit">Log In</UButton>
          </div>
        </UForm>
        <template #footer>
          <div class="text-center text-sm">
            <UButton variant="link" :to="{ name: 'ResetPassword' }"
              >Reset My Password</UButton
            >
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
