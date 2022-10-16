<template>
  <div>
    <div class="title">{{ activeIndex === '1' ? '销售排名' : '访问排名' }}</div>
    <div class="item" v-for="(item, index) in activeIndex === '1'?orderRank:userRank" :key="index">
      <div class="no" :class="{active:index < 3}">{{item.no}}</div>
      <div class="name">{{item.name}}</div>
      <div class="count">{{item.count}}</div>
    </div>
  </div>

</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
  name: 'RightView'
})
</script>
<script lang="ts" setup>
import { useEchartsStore } from '@/stores/echarts'
const echartsStore = useEchartsStore()
const props = defineProps(['activeIndex'])
const orderRank = computed(() => {
  return echartsStore.echartsData.orderRank
})
const userRank = computed(() => {
  return echartsStore.echartsData.userRank
})



</script>

<style lang="less" scoped>
.title{
  margin: 40px 0 10px 0;
  font-size: 14px;
}
.item{
  font-size: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  .no{
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    &.active{
      background-color: #000;
      border-radius: 50%;
      color: #fff;
    }

  }
  .name{
    margin-left: 10px;
    flex: 1;
  }
}
</style>
