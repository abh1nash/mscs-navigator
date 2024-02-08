<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { UserRole } from "@prisma/client";

const props = defineProps<{
  user: {
    firstName: string;
    lastName: string;
    id: string;
    email: string;
    role: UserRole;
  };
}>();

const emit = defineEmits<{
  complete: [];
  cancel: [];
}>();

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
});

const state = reactive({
  firstName: props.user.firstName,
  lastName: props.user.lastName,
  email: props.user.email,
  role: props.user.role,
});

const rolesToDisplay = Object.values(UserRole).filter(
  (role) => role !== UserRole.SUPER_ADMIN
);

const isLoading = ref(false);
const toast = useToast();
async function onSubmit(event: FormSubmitEvent<typeof schema>) {
  try {
    isLoading.value = true;
    await $fetch("/api/users/" + props.user.id, {
      method: "PUT",
      body: JSON.stringify(event.data),
    });
    emit("complete");
  } catch (err: any) {
    toast.add({
      title: "Error",
      description: err.data?.message || "Cannot update user",
      icon: "i-heroicons-x-circle-20-solid",
      color: "red",
    });
  } finally {
    isLoading.value = false;
  }
}

onUnmounted(() => {
  state.firstName = "";
  state.lastName = "";
  state.email = "";
  state.role = UserRole.STUDENT;
  isLoading.value = false;
});
</script>
<template>
  <UModal>
    <UCard>
      <div class="text-2xl font-bold mb-4">Edit User Details</div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Role" name="role" required>
          <USelectMenu v-model="state.role" :options="rolesToDisplay" />
        </UFormGroup>
        <UFormGroup label="First Name" name="firstName" required>
          <UInput v-model="state.firstName" />
        </UFormGroup>
        <UFormGroup label="Last Name" name="lastName" required>
          <UInput v-model="state.lastName" />
        </UFormGroup>
        <UFormGroup label="Email" name="email" required>
          <UInput v-model="state.email" />
        </UFormGroup>
        <div class="flex gap-2">
          <UButton :loading="isLoading" type="submit">Update User</UButton>
          <UButton @click="emit('cancel')" variant="ghost">Cancel</UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>
