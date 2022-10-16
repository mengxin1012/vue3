<template>
<CommCard title="今日订单" :count="orderToday">
  <template #view>
    <div ref="divRef" class="main"></div>
  </template>

  <template #bottom>
    <span>昨日订单量</span>
    <span class="right">{{orderLastDay}}</span>
  </template>
</CommCard>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
import type { EChartsType } from 'echarts';
  export default defineComponent({
    name:'TodayOrder'
  })
</script>
<script lang="ts" setup>
  import {useEchartsStore} from '@/stores/echarts'
  import {computed,onMounted, ref, watch} from 'vue'
  import {$echarts} from '@/plugins/echarts'
  import debounce from 'lodash/debounce'
  // "orderToday": 2562061,
  // "orderLastDay": 2100000,
  // "orderTrend": [610, 432, 220, 534, 790, 430, 220, 320, 532, 320, 834, 690, 530, 220],
  // "orderTrendAxis": ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  const divRef = ref<HTMLDivElement>()
  const echartsStore = useEchartsStore()
  const orderToday = computed(() => {
    return echartsStore.echartsData.orderToday
  })
  const orderLastDay = computed(() => {
    return echartsStore.echartsData.orderLastDay
  })
  const orderTrend = computed(() => {
    return echartsStore.echartsData.orderTrend
  })
  const orderTrendAxis = computed(() => {
    return echartsStore.echartsData.orderTrendAxis
  })
  const chart = ref<EChartsType>()

  const setOption = () => {
    return {
      xAxis:{
        data:orderTrendAxis.value,
        show:false,
        boundaryGap:false
      },
      yAxis:{
        show:false
      },
      grid:{
        left:0,
        right:0,
        top:0,
        bottom:0,
        
      },
      series:{
        type:'line',
        data:orderTrend.value,
        smooth:true,
        itemStyle:{
          opacity:0
        },
        lineStyle:{
          opacity:0
        },
        areaStyle:{
          color:'hotpink'
        }
      }
    }
  }

  onMounted(() => {
    chart.value = $echarts.init(divRef.value as HTMLDivElement)
    chart.value.setOption(setOption())

    window.addEventListener('resize',debounce(() => {
      chart.value?.resize()
    },100))
  })

  watch(orderLastDay,() => {
    chart.value?.setOption(setOption())
  })




</script>

<style lang="less" scoped>
.main{
  height: 50px;
}
</style>
