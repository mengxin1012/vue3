<template>
  <el-card class="middle">
    <div class="top">
      <el-menu class="menu" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">销售额</el-menu-item>
        <el-menu-item index="2">访问量</el-menu-item>
      </el-menu>
      <el-radio-group v-model="radio">
        <el-radio-button label="今日" />
        <el-radio-button label="本周" />
        <el-radio-button label="本月" />
        <el-radio-button label="今年" />
      </el-radio-group>

      <el-date-picker 
        v-model="value2" 
        type="daterange" 
        unlink-panels 
        range-separator="To"
        start-placeholder="开始日期" 
        end-placeholder="结束日期" 
        value-format="YYYY-MM-DD"
        :shortcuts="shortcuts" />
    </div>
    <el-row :gutter="20" style="height:300px">
      <el-col :span="18" :offset="0">
        <LeftView :activeIndex="activeIndex"></LeftView>
      </el-col>
      <el-col :span="6" :offset="0">
        <RightView :activeIndex="activeIndex"></RightView>
      </el-col>
    </el-row>
    


  </el-card>


</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'MiddleView'
})
</script>
<script lang="ts" setup>
import LeftView from './components/LeftView/index.vue'
import RightView from './components/RightView/index.vue'
const activeIndex = ref('1')
const radio = ref('今日')

const value2 = ref('')
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const handleSelect = (index: string) => {
  activeIndex.value = index
}
</script>

<style lang="less" scoped>

.middle {
  margin-top: 20px;

  :deep(.el-card__body) {
    padding: 0 20px;
    
    .top{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #aaa;
      .menu {
          flex: 5;
          border-bottom: none;
        }
      
        .el-radio-group {
          margin-right: 20px;
        }
    }
    

  }


}
</style>
