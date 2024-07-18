<script setup lang="ts">
import { add, format, sub } from "date-fns";

const generateArrivals = () => {
  const dataSample = [8421, 12802, 6234, 7321, 8543, 5463, 11382, 9382, 12342, 8234];
  const prioritySample = [12, 11, 16, 18, 12, 19, 17, 11, 14, 15];
  const arrivalsByDay = new Array(10)
    .fill(0)
    .map((_, index) => ({
      x: format(add(new Date(), { days: index }), "E, dd MMM"),
      y: dataSample[index],
    }));
  const priorityArrivalsByDay = new Array(10)
    .fill(0)
    .map((_, index) => ({
      x: "High priority",
      y: Math.floor(dataSample[index] * prioritySample[index] / 100),
    }));

  return [
    {
      name: "Arrivals",
      data: arrivalsByDay,
    },
    {
      name: "High priority",
      data: priorityArrivalsByDay,
    },
  ];
};

const generateAlgorithmPerformance = () => {
  const dataSample = [1252, 1211, 1633, 1867, 1528, 1939, 1732, 1111, 1234, 1435];
  const falsePositives = [22, 13, 31, 22, 14, 26, 38, 31, 28, 19];
  const containersPerDay = new Array(10)
    .fill(0)
    .map((_, index) => ({
      x: format(sub(new Date(), { days: index }), "E, dd MMM"),
      y: dataSample[index],
    }))
    .reverse();
  const falsePositivesPerDay = new Array(10)
    .fill(0)
    .map((_, index) => ({
      x: "False positives",
      y: falsePositives[index],
    }))
    .reverse();

  return [
    {
      name: "AI detected high priority containers",
      data: containersPerDay,
    },
    {
      name: "False positives",
      data: falsePositivesPerDay,
    },
  ];
};

const generateTruckTraffic = () => {
  const days = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"].reverse();
  const hours = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  return days.map(day => ({
    name: day,
    data: hours.map(hour => ({
      x: hour,
      y: Math.floor(Math.random() * 500),
    })),
  }));
};
</script>

<template>
  <div>
    <div class="p-4">
      <h1 class="font-bold text-3xl">
        Overview
      </h1>
    </div>
    <hr class="dark:border-white/20">
    <div class="p-4">
      <ClientOnly>
        <div class="grid grid-cols-12 gap-4 mb-4">
          <Card class="col-span-6">
            <div class="flex justify-between mb-4">
              <p class="text-lg font-medium">
                Container arrivals by day
              </p>
              <DateRangerPicker />
            </div>
            <ApexChart
              :options="{
                chart: {
                  type: 'bar',
                  stacked: true,
                },
                series: generateArrivals(),
                colors: ['#3b81f4', '#ed4343'],
                dataLabels: {
                  enabled: false
                },
              }"
            />
          </Card>
          <Card class="col-span-6">
            <div class="flex justify-between">
              <p class="text-lg font-medium mb-4">
                Algorithm false positives
              </p>
              <DateRangerPicker />
            </div>
            <ApexChart
              :options="{
                chart: {
                  type: 'bar',
                  stacked: true,
                },
                series: generateAlgorithmPerformance(),
                colors: ['#22C55E', '#ed4343'],
                dataLabels: {
                  enabled: false
                },
              }"
            />
          </Card>
        </div>
        <div class="grid grid-cols-12 gap-4">
          <Card class="col-span-6">
            <div class="flex justify-between">
              <p class="text-lg font-medium mb-4">
                Priority containers by supply type
              </p>
              <DateRangerPicker />
            </div>
            <ApexChart
              class="flex justify-center"
              :options="{
                chart: {
                  type: 'donut',
                  width: '80%',
                },
                series: [2344, 1255, 813],
                colors: ['#3b81f4', '#a754f5', '#f23f5d'],
                labels: ['Medical Supplies', 'Medical Equipment', 'Pharmaceuticals'],
                plotOptions: {
                  pie: {
                    donut: {
                      size: '50%',
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          showAlways: true,
                          label: 'Total',
                        },
                      }
                    }
                  }
                },
                legend: {
                  show: true,
                  position: 'bottom'
                },
                dataLabels: {
                  enabled: false
                }
              }"
            />
          </Card>
          <Card class="col-span-6">
            <div class="flex justify-between">
              <p class="text-lg font-medium mb-4">
                Trucks traffic
              </p>
              <DateRangerPicker />
            </div>
            <ApexChart
              :options="{
                chart: {
                  type: 'heatmap'
                },
                series: generateTruckTraffic(),
                plotOptions: {
                  heatmap: {
                    colorScale: {
                      ranges: [
                        {
                          from: 0,
                          to: 100,
                          color: '#D0F7DF',
                          name: 'low',
                        },
                        {
                          from: 100,
                          to: 300,
                          color: '#79E8A2',
                          name: 'medium',
                        },
                        {
                          from: 300,
                          to: 500,
                          color: '#22C55E',
                          name: 'high',
                        },
                      ]
                    }
                  }
                },
                legend: {
                  show: false,
                },
              }"
            />
          </Card>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
