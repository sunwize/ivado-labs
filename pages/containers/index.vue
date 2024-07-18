<script setup lang="ts">
import { format } from "date-fns";

import Card from "~/components/Card.vue";
import ContainerValidationModal from "~/components/ContainerValidationModal.vue";
import { analytics as mockContainerAnalytics, containers as mockContainers } from "~/mocks/containers";
import { type Container, Priority, Status } from "~/types/containers";
import PhBoatThin from "~icons/ph/boat-thin";
import PhCalendarCheckThin from "~icons/ph/calendar-check-thin";
import PhCircleWavyCheckFill from "~icons/ph/circle-wavy-check-fill";
import PhClockClockwiseThin from "~icons/ph/clock-clockwise-thin";

const containers = ref(mockContainers);
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "origin",
    label: "Origin",
  },
  {
    key: "destination",
    label: "Destination",
  },
  {
    key: "supply_type",
    label: "Supply Type",
    sortable: true,
  },
  {
    key: "expected_arrival_date",
    label: "Expected Arrival Date",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "priority",
    label: "Priority",
    sortable: true,
  },
  {
    key: "verified",
    label: "Verified",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
  },
];
const search = ref("");
const priorityEditor = reactive({
  visible: false,
  priority: Priority.Low,
});
const containerValidationModal = reactive<{ visible: boolean; container: Container | null; }>({
  visible: false,
  container: null,
});
const statusColors = {
  [Status.InTransit]: "blue",
  [Status.Pending]: "gray",
  [Status.Arrived]: "primary",
};
const statusLabels = {
  [Status.InTransit]: "In Transit",
  [Status.Pending]: "Pending",
  [Status.Arrived]: "Arrived",
};
const priorityColors = {
  [Priority.High]: "red",
  [Priority.Medium]: "yellow",
  [Priority.Low]: "green",
};
const priorityLabels = {
  [Priority.High]: "High",
  [Priority.Medium]: "Medium",
  [Priority.Low]: "Low",
};
const analyticsIcons = {
  [Status.InTransit]: PhBoatThin,
  [Status.Arrived]: PhCalendarCheckThin,
  [Status.Pending]: PhClockClockwiseThin,
};

const filteredContainers = computed(() => {
  if (!search.value) {
    return containers.value;
  }

  const s = search.value.toLowerCase();
  return containers.value.filter((container) => {
    const priority = priorityLabels[container.priority].toLowerCase();
    const status = statusLabels[container.status].toLowerCase();
    return priority.includes(s) || status.includes(s) ||
        Object.values(container).some((value) => {
          return String(value).toLowerCase().includes(s);
        });
  });
});

const formatDate = (date: string) => {
  return format(new Date(date), "d MMM, yyyy");
};

const openPriorityEditor = (priority: Priority) => {
  priorityEditor.priority = priority;
  priorityEditor.visible = true;
};

const openContainerValidationModal = (container: Container) => {
  containerValidationModal.container = container;
  containerValidationModal.visible = true;
};

const onContainerVerified = () => {
  if (containerValidationModal.container) {
    containerValidationModal.container.verified = true;
  }
  containerValidationModal.visible = false;
};
</script>

<template>
  <div class="flex flex-col flex-1">
    <div class="p-4">
      <h1 class="font-bold text-3xl">
        Containers
      </h1>
    </div>
    <hr class="dark:border-white/20">
    <div class="flex-1 p-4">
      <div class="grid grid-cols-3 gap-4 mb-4">
        <Card
          v-for="(analytics, index) in mockContainerAnalytics"
          :key="index"
        >
          <div class="flex items-center gap-4">
            <component
              :is="analyticsIcons[analytics.status]"
              class="w-12 h-12 opacity-80"
            />
            <div class="leading-snug">
              <p class="text-sm opacity-80">
                {{ statusLabels[analytics.status] }}
              </p>
              <p class="font-medium text-lg">
                {{ analytics.total }}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div class="flex items-stretch justify-between gap-2 border dark:border-white/20 rounded-t-md p-4">
        <UInput
          v-model="search"
          placeholder="Filter containers..."
        />
        <UBadge
          color="red"
          variant="outline"
        >
          208 high priority containers
        </UBadge>
      </div>
      <UTable
        :rows="filteredContainers"
        :columns="columns"
        :sort="{ column: 'priority', direction: 'asc' }"
        class="border-x dark:border-white/20"
      >
        <template #status-data="{ row }: { row: Container }">
          <UBadge
            :color="statusColors[row.status]"
            size="sm"
          >
            {{ statusLabels[row.status] }}
          </UBadge>
        </template>
        <template #priority-data="{ row }: { row: Container }">
          <UBadge
            :color="priorityColors[row.priority]"
            size="sm"
          >
            {{ priorityLabels[row.priority] }}
          </UBadge>
        </template>
        <template #expected_arrival_date-data="{ row }: { row: Container }">
          {{ formatDate(row.expected_arrival_date) }}
        </template>
        <template #verified-data="{ row }: { row: Container }">
          <PhCircleWavyCheckFill
            v-if="row.verified"
            class="text-primary-400 w-5 h-5"
          />
          <p v-else />
        </template>
        <template #actions-data="{ row }: { row: Container }">
          <div class="flex items-center gap-2">
            <UButton
              color="white"
              @click="openPriorityEditor(row.priority)"
            >
              Change Priority
            </UButton>
            <UButton
              v-if="!row.verified"
              variant="outline"
              @click="openContainerValidationModal(row)"
            >
              Verify
            </UButton>
          </div>
        </template>
      </UTable>
      <div class="flex justify-end border dark:border-white/20 rounded-b-md p-4">
        <UPagination
          :max="5"
          :page-count="10"
          :total="100"
          :model-value="1"
        />
      </div>
    </div>
    <PriorityEditorModal
      v-model="priorityEditor.visible"
      v-model:priority="priorityEditor.priority"
    />
    <ContainerValidationModal
      v-model="containerValidationModal.visible"
      @confirm="onContainerVerified()"
    />
  </div>
</template>
