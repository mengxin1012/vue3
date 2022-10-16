<template>
  <CommCard title="交易用户数" :count="orderUser">
    <template #view>
      <v-chart :option="setOption()"></v-chart>
    </template>

    <template #bottom>
      <span>退货率</span>
      <span class="right">{{returnRate}}</span>
    </template>
  </CommCard>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue';
  export default defineComponent({
    name:'TradeUser'
  })
</script>
<script lang="ts" setup>
  import {useEchartsStore} from '@/stores/echarts'
  const echartsStore = useEchartsStore()

  const orderUser = computed(() => {
    return echartsStore.echartsData.orderUser
  })
  const returnRate = computed(() => {
    return echartsStore.echartsData.returnRate
  })
  const orderUserTrend = computed(() => {
    return echartsStore.echartsData.orderUserTrend
  })
  const orderUserTrendAxis = computed(() => {
    return echartsStore.echartsData.orderUserTrendAxis
  })

  const setOption = () => {
    return {
      xAxis:{
        data:orderUserTrendAxis.value,
        show:false,
      },
      grid:{
        left:0,
        right:0,
        top:0,
        bottom:0
      },

      yAxis:{
        show:false
      },
      series:{
        type:'bar',
        data:orderUserTrend.value,
        barWidth:'60%'
      }
    }
  }

</script>

<style lang="less" scoped>
</style>
