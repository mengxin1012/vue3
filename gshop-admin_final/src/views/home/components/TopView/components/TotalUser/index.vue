<template>
  <CommCard title="累积用户数" :count="usersTotal">
    <template #view>
      <v-chart :option="setOption()"></v-chart>
    </template>

    <template #bottom>
      <div class="bottom">
        <div>
          <span>日同比</span>
          <span class="count">{{ userGrowthLastDay }}</span>
          <span class="down"></span>
        </div>
        <div>
          <span>月同比</span>
          <span class="count">{{ userGrowthLastMonth }}</span>
          <span :class="'up'"></span>
        </div>
      </div>
    </template>
  </CommCard>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TotalUser'
})
</script>
<script lang="ts" setup>
import { useEchartsStore } from '@/stores/echarts'
import { computed } from 'vue'
const echartsStore = useEchartsStore()
const usersTotal = computed(() => {
  return echartsStore.echartsData.usersTotal
})
const usersLastDay = computed(() => {
  return echartsStore.echartsData.usersLastDay
})
const usersLastMonth = computed(() => {
  return echartsStore.echartsData.usersLastMonth
})
const userGrowthLastDay = computed(() => {
  return echartsStore.echartsData.userGrowthLastDay
})
const userGrowthLastMonth = computed(() => {
  return echartsStore.echartsData.userGrowthLastMonth
})

const setOption = () => {
  return {
    xAxis: {
      type: 'value',
      show: false,
      max:usersTotal.value,
      min:0
    },
    tooltip:{
      trigger:'axis'
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    yAxis: {
      type: 'category',
      show: false
    },
    series: {
      name:'用户增长量',
      itemStyle:{
        color:'red'
      },
      type: 'bar',
      barWidth:'30%',
      showBackground:true,
      label:{
        show:true,
        distance:50,
        color:'red',
        position:'right',
        formatter(){
          return '|'
        }
      },
      data: [usersTotal.value - usersLastMonth.value]
    }
  }
}

  // "usersTotal": 1177965,
  // "usersLastDay": 1000000,
  // "usersLastMonth": 800000,
  // "userGrowthLastDay": "17.70",
  // "userGrowthLastMonth": "47.12",
</script>

<style lang="less" scoped>
.bottom {
  display: flex;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;

    .count {
      margin: 0 5px;
    }
  }
}
</style>
