<template>
  <CommCard title="今日销售额" :count="salesToday">
    <template #view>
      <div class="middle">
        <div class="content">
          <span>日同比</span>
          <span class="count">{{ salesGrowthLastDay }}</span>
          <span :class="{ up: salesGrowthLastDay > 0, down: salesGrowthLastDay < 0 }"></span>
        </div>
        <div class="content">
          <span>月同比</span>
          <span class="count">{{ salesGrowthLastMonth }}</span>
          <span :class="{ up: salesGrowthLastMonth > 0, down: salesGrowthLastMonth < 0 }"></span>
        </div>
      </div>
    </template>

    <template #bottom>
      <span>昨日销售额</span>
      <span class="right">{{ salesLastDay }}</span>
    </template>
  </CommCard>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'TodaySale'
})
</script>
<script lang="ts" setup>
import { computed } from 'vue'
import { useEchartsStore } from '@/stores/echarts'
// salesToday": 30346799,
// "salesLastDay":   36000000,
// "salesGrowthLastDay": -19.16,
//  "salesGrowthLastMonth": 56.67,
const echartsStore = useEchartsStore()
const salesToday = computed(() => {
  return echartsStore.echartsData.salesToday
})
const salesLastDay = computed(() => {
  return echartsStore.echartsData.salesLastDay
})
const salesGrowthLastDay = computed(() => {
  return echartsStore.echartsData.salesGrowthLastDay
})
const salesGrowthLastMonth = computed(() => {
  return echartsStore.echartsData.salesGrowthLastMonth
})
</script>

<style lang="less" scoped>
.middle {
  height: 100%;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .content {
    display: flex;
    align-items: center;
  }

  .count {
    margin: 0 5px;
  }
}


</style>
