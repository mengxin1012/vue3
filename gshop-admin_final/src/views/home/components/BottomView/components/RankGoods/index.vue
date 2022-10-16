<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <div class="header">
        <span>分类销售排行</span>
        <el-radio-group v-model="radio" size="small">
          <el-radio-button label="品类" />
          <el-radio-button label="商品" />
        </el-radio-group>
      </div>
    </template>
    <v-chart :option="setOption()" style="height:410px"></v-chart>
  </el-card>

</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'RankGoods'
})
</script>
<script lang="ts" setup>
const radio = ref('品类')
const setOption = () => {
  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '40',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ]
      }
    ]
  };
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.el-card__header) {
  padding: 16.5px 20px;
}
</style>
