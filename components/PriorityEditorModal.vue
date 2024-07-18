<script setup lang="ts">
import { Priority } from "~/types/containers";
import PhX from "~icons/ph/x";

type Emits = {
    (event: "submit", value: Priority): void;
}

const emits = defineEmits<Emits>();

const modelValue = defineModel<boolean>({ default: false });
const priority = defineModel<Priority>("priority", { default: Priority.Low });

const priorityOptions = [
  {
    name: "Low",
    value: Priority.Low,
  },
  {
    name: "Medium",
    value: Priority.Medium,
  },
  {
    name: "High",
    value: Priority.High,
  },
];

const onSubmit = () => {
  modelValue.value = false;
  emits("submit", priority.value);
};
</script>

<template>
  <UModal v-model="modelValue">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="font-bold text-lg">
            Priority Editor
          </h1>
          <UButton
            color="white"
            variant="link"
            @click="modelValue = false"
          >
            <PhX />
          </UButton>
        </div>
      </template>
      <USelect
        v-model="priority"
        :options="priorityOptions"
        option-attribute="name"
      />
      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <UButton
            color="white"
            @click="modelValue = false"
          >
            Cancel
          </UButton>
          <UButton @click="onSubmit()">
            Submit
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
