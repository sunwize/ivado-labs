<script setup lang="ts">
import ApexCharts from "apexcharts";

type Props = {
    options: ApexCharts.ApexOptions;
}

const props = defineProps<Props>();

const colorMode = useColorMode();

const chartElement = ref<HTMLDivElement>();
let chart: ApexCharts | null = null;
const defaultOptions = computed(() => ({
  theme: {
    mode: colorMode.value,
  },
}));

const updateChart = () => {
  chart?.updateOptions({
    ...defaultOptions,
    ...props.options,
  });
};

watch(() => props.options, () => {
  updateChart();
}, { deep: true });

watch(defaultOptions, () => {
  updateChart();
}, { deep: true });

onMounted(() => {
  chart = new ApexCharts(chartElement.value, {
    ...defaultOptions.value,
    ...props.options,
  });
  chart.render();
});

onUnmounted(() => {
  chart?.destroy();
});
</script>

<template>
  <div ref="chartElement" />
</template>
