<script setup lang="ts">
import PhRobot from "~icons/ph/robot";
import PhX from "~icons/ph/x";

type Emits = {
    (event: "confirm"): void
}

const emits = defineEmits<Emits>();

const modelValue = defineModel<boolean>({ default: false });

const onConfirm = () => {
  modelValue.value = false;
  emits("confirm");
};
</script>

<template>
  <UModal v-model="modelValue">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="font-bold text-lg">
            Container Validation
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

      <UAlert
        color="primary"
        variant="outline"
        title="Medical Content Detected"
        description="This container may contain medical content."
        class="mb-4"
      >
        <template #icon>
          <PhRobot />
        </template>
      </UAlert>
      <p>Do you confirm that this container contains medical content?</p>

      <template #footer>
        <div class="flex items-center justify-end gap-2">
          <UButton
            color="white"
            @click="modelValue = false"
          >
            Cancel
          </UButton>
          <UButton @click="onConfirm()">
            Confirm
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
