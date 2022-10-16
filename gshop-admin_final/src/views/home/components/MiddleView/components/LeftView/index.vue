<template>
  <v-chart :option="setOption()" autoresize></v-chart>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
  name: 'LeftView'
})
</script>
<script lang="ts" setup>
import { useEchartsStore } from '@/stores/echarts'
const props = defineProps(['activeIndex'])
// "orderFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
// "orderFullYear": [410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290],
// "userFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
// "userFullYear": [110, 120, 90, 220, 175, 212, 192, 95, 88, 120, 250, 310],
const echartsStore = useEchartsStore()
const orderFullYear = computed(() => {
  return echartsStore.echartsData.orderFullYear
})
const orderFullYearAxis = computed(() => {
  return echartsStore.echartsData.orderFullYearAxis
})
const userFullYearAxis = computed(() => {
  return echartsStore.echartsData.userFullYearAxis
})
const userFullYear = computed(() => {
  return echartsStore.echartsData.userFullYear
})

const setOption = () => {
  return {
    xAxis: {
      data: props.activeIndex === '1' ? orderFullYearAxis.value : userFullYearAxis.value,
      axisTick:{
        alignWithLabel:true
      }
    },

    tooltip:{
      trigger:'item'
    },

    title: {
      text: props.activeIndex === '1' ? '销售趋势' : '访问趋势',
      textStyle: {
        fontSize: 14
      },
      top: '5%'
    },
    grid: {
      left: 40,
      right: 40,
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dotted'
        }
      }

    },

    series: {
      type: 'bar',
      barWidth: '30%',
      data: props.activeIndex === '1' ? orderFullYear.value : userFullYear.value,

    }
  }
}
</script>

<style lang="less" scoped>
</style>
