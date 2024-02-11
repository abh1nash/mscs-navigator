<script setup lang="ts">
import { CourseType } from "@prisma/client";

const filterOptionsRequest = await useFetch("/api/public/filter-options");

const query = useRoute().query;

const courseTypeOptions = [
  { label: "All", value: "ALL" },
  { label: "Pathway", value: CourseType.PATHWAY },
  { label: "Breadth", value: CourseType.BREADTH },
  { label: "Elective", value: CourseType.ELECTIVE },
  { label: "Outside Elective", value: CourseType.OUTSIDE_ELECTIVE },
  { label: "Other", value: CourseType.OTHER },
];

const state = reactive({
  query: query.query as string,
  certificate: query.certificate as string,
  type: (query.type as CourseType | "ALL") || "ALL",
  timeMin: parseInt(query.timeMin as string) || undefined,
  timeMax: parseInt(query.timeMax as string) || undefined,
  officialDifficultyRating:
    parseInt(query.officialDifficultyRating as string) || 0,
  perceivedDifficulty: query.perceivedDifficulty as string,
  instructorEffectiveness: query.instructorEffectiveness as string,
  rating: query.rating as string,
});

const search = () => {
  console.log("ready");
  navigateTo({
    name: "Home",
    query: {
      ...state,
      type: state.type === "ALL" ? undefined : state.type,
      timeMin: state.timeMin || undefined,
      timeMax: state.timeMax || undefined,
      officialDifficultyRating: state.officialDifficultyRating || undefined,
    },
  });
};
</script>
<template>
  <div>
    <UForm @submit="search" :state="query" class="space-y-4">
      <UFormGroup name="query" label="Query">
        <UInput
          v-model="state.query"
          icon="i-heroicons-magnifying-glass"
          placeholder="Search"
        ></UInput>
      </UFormGroup>
      <UFormGroup name="certificate" label="Certificate">
        <USelectMenu
          v-model="state.certificate"
          key="value"
          value-attribute="value"
          :options="filterOptionsRequest.data?.value?.certificates"
        ></USelectMenu>
      </UFormGroup>
      <UFormGroup name="type" label="Type">
        <USelectMenu
          v-model="state.type"
          key="value"
          value-attribute="value"
          :options="courseTypeOptions"
        ></USelectMenu>
      </UFormGroup>
      <UFormGroup name="time" label="Time Commitment (hrs)">
        <div class="grid grid-cols-2 gap-2">
          <UInput
            v-model="state.timeMin"
            type="number"
            placeholder="Min"
          ></UInput>

          <UInput
            v-model="state.timeMax"
            type="number"
            placeholder="Max"
          ></UInput>
        </div>
      </UFormGroup>
      <div class="grid grid-cols-2 gap-2">
        <UFormGroup name="difficulty" label="Difficulty">
          <AppRating v-model="state.officialDifficultyRating"></AppRating>
        </UFormGroup>
        <!-- <UFormGroup name="perceivedDifficulty" label="Perceived Difficulty">
          <AppRating></AppRating>
        </UFormGroup> -->
      </div>
      <!-- <div class="grid grid-cols-2 gap-2">
        <UFormGroup name="instructorEffectiveness" label="Effectiveness">
          <AppRating></AppRating>
        </UFormGroup>
        <UFormGroup name="rating" label="Overall Rating">
          <AppRating></AppRating>
        </UFormGroup>
      </div> -->
      <div class="flex gap-2 py-2">
        <UButton type="submit" color="primary">Search</UButton>
        <UButton type="reset" variant="ghost">Clear</UButton>
      </div>
    </UForm>
  </div>
</template>
