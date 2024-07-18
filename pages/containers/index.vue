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
const hideVerified = ref(false);
const priorityEditor = reactive<{ visible: boolean; container: Container | null; }>({
  visible: false,
  container: null,
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
  const s = search.value.toLowerCase();
  return containers.value.filter((container) => {
    if (container.verified && hideVerified.value) {
      return false;
    }

    const priority = priorityLabels[container.priority].toLowerCase();
    const status = statusLabels[container.status].toLowerCase();
    return priority.includes(s) || status.includes(s) ||
        Object.values(container).some((value) => {
          return String(value).toLowerCase().includes(s);
        });
  });
});

const verifiedContainers = computed(() => containers.value.filter(container => container.verified));

const formatDate = (date: string) => {
  return format(new Date(date), "d MMM, yyyy");
};

const openPriorityEditor = (container: Container) => {
  priorityEditor.container = container;
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

const onPrioritySubmitted = (priority: Priority) => {
  if (priorityEditor.container) {
    priorityEditor.container.priority = priority;
  }
  priorityEditor.visible = false;
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
        <div class="flex items-center gap-2">
          <UInput
            v-model="search"
            placeholder="Filter containers..."
          />
          <UButton
            :color="hideVerified ? 'primary' : 'white'"
            :variant="hideVerified ? 'outline' : 'solid'"
            @click="hideVerified = !hideVerified"
          >
            <UCheckbox
              v-model="hideVerified"
              class="pointer-events-none"
            >
              <template #label>
                <span class="-ml-1">Hide verified</span>
              </template>
            </UCheckbox>
          </UButton>
        </div>
        <div class="flex items-center gap-2">
          <UBadge
            variant="soft"
            size="lg"
          >
            <PhCircleWavyCheckFill />
            <span class="ml-1">{{ verifiedContainers.length }} verified containers</span>
          </UBadge>
          <UBadge
            color="red"
            variant="soft"
            size="lg"
          >
            208 high priority containers
          </UBadge>
        </div>
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
            class="text-primary-500 w-6 h-6"
          />
          <p v-else />
        </template>
        <template #actions-data="{ row }: { row: Container }">
          <div class="flex items-center gap-2">
            <UButton
              color="white"
              @click="openPriorityEditor(row)"
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
      :priority="priorityEditor.container?.priority"
      @submit="onPrioritySubmitted"
    />
    <ContainerValidationModal
      v-model="containerValidationModal.visible"
      @confirm="onContainerVerified()"
    />
  </div>
</template>
