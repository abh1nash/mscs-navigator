<script setup lang="ts">
definePageMeta({
  name: "UsersPortal",
  layout: "portal",
});

const queryParams = reactive({
  page: 1,
  limit: 10,
  query: "",
});

const state = reactive({
  addUserModal: false,
});

const deleteModals = reactive<{ [key: string]: boolean }>({});
const editModals = reactive<{ [key: string]: boolean }>({});

const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "email", label: "Email" },
  { key: "created", label: "Created" },
  { key: "updated", label: "Updated" },
  { key: "actions" },
];

const usersData = await useLazyFetch("/api/users", {
  query: queryParams,
  watch: [queryParams],
});

const items = (row: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  created: string;
  updated: string;
}) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => (editModals[row.id] = true),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => (deleteModals[row.id] = true),
    },
  ],
];
</script>
<template>
  <UContainer class="py-6">
    <div class="flex items-center mb-12">
      <div class="text-3xl font-bold">
        Users
        <UButton @click="state.addUserModal = true" icon="i-heroicons-plus"
          >Add</UButton
        >
        <UserAddModal
          v-model="state.addUserModal"
          @complete="
            () => {
              state.addUserModal = false;
              usersData.refresh();
            }
          "
        />
      </div>
      <div class="flex-1"></div>
      <div class="flex items-center space-x-2">
        <UInput
          v-model="queryParams.query"
          placeholder="Filter"
          icon="i-heroicons-magnifying-glass"
        ></UInput>
      </div>
    </div>
    <div>
      <UTable
        :loading="usersData.pending.value"
        :columns="columns"
        :rows="usersData.data.value?.results"
      >
        <template #name-data="{ row }">
          {{ row.firstName }} {{ row.lastName }}
        </template>
        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
          <UserDeleteModal
            v-model="deleteModals[row.id]"
            :user="row"
            @complete="
              () => {
                deleteModals[row.id] = false;
                usersData.refresh();
              }
            "
            @cancel="deleteModals[row.id] = false"
          ></UserDeleteModal>
          <UserEditModal
            v-model="editModals[row.id]"
            :user="row"
            @complete="
              () => {
                editModals[row.id] = false;
                usersData.refresh();
              }
            "
            @cancel="editModals[row.id] = false"
          ></UserEditModal>
        </template>
      </UTable>
      <UPagination
        v-if="(usersData.data?.value?.pagination.total || 0) > 10"
        v-model="queryParams.page"
        :page-count="
          Math.ceil(
            (usersData.data?.value?.pagination.total || 0) / queryParams.limit
          )
        "
        :total="items.length"
      />
    </div>
  </UContainer>
</template>
