<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <span>关键词搜索</span>
    </template>
    <div class="main">
      <el-row :gutter="10">
        <el-col :span="12" :offset="0">
          <div class="title">搜索用户数</div>
          <div class="count">{{ totalUserCount }}</div>
          <div class="view">
            <v-chart :option="setOption(true)" autoresize></v-chart>
          </div>
        </el-col>
        <el-col :span="12" :offset="0">
          <div class="title">搜索量</div>
          <div class="count">{{ totalSearchCount }}</div>
          <div class="view">
            <v-chart :option="setOption(false)" autoresize></v-chart>
          </div>
        </el-col>
      </el-row>
      <div style="height:280px">
        <el-table stripe :data="tableData">
          <el-table-column label="排名" type="index" align="center">
          </el-table-column>
          <el-table-column label="关键字" prop="word">
          </el-table-column>
          <el-table-column label="搜索数量" prop="count">
          </el-table-column>
          <el-table-column label="搜索用户数" prop="user">
          </el-table-column>
          <el-table-column label="搜索占比" prop="percent">
          </el-table-column>
        </el-table>
      </div>

      <!-- @size-change="sizeChange"
        @current-change="currentChange" -->
      <el-pagination v-model:currentPage="page" v-model:page-size="pageSize" layout="prev, pager, next"
        :total="allTableData.length" />

    </div>
  </el-card>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'SearchKeyword'
})
</script>
<script lang="ts" setup>
import { useEchartsStore } from '@/stores/echarts'
import { computed, ref } from '@vue/reactivity';
const echartsStore = useEchartsStore()
const page = ref(1)
const pageSize = ref(5)

const searchWordList = computed(() => {
  return echartsStore.echartsData.searchWord
})
const userCountList = computed(() => {
  return searchWordList.value.map(item => item.user)
})
const wordList = computed(() => {
  return searchWordList.value.map(item => item.word)
})
const searchCountList = computed(() => {
  return searchWordList.value.map(item => item.count)
})
const totalUserCount = computed(() => {
  return userCountList.value.reduce((prev, item) => {
    prev += item
    return prev
  }, 0)
})
const totalSearchCount = computed(() => {
  return searchCountList.value.reduce((prev, item) => {
    prev += item
    return prev
  }, 0)
})

const allTableData = computed(() => {
  return searchWordList.value.map(item => {
    return {
      word: item.word,
      count: item.count,
      user: item.user,
      percent: (item.user / totalUserCount.value * 100).toFixed(2) + '%'
    }
  })
})
const tableData = computed(() => {
  return allTableData.value.slice((page.value - 1) * 5, page.value * 5)
})

const setOption = (flag: boolean) => {
  return {
    xAxis: {
      show: false,
      data: wordList.value
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    yAxis: {
      show: false
    },
    series: {
      type: 'line',
      data: flag ? userCountList.value : searchCountList.value,
      itemStyle: {
        opacity: 0
      },
      lineStyle: {
        color: 'hotpink'
      },
      areaStyle: {
        color: 'skyblue'
      },
      smooth: true
    }
  }
}

</script>

<style lang="less" scoped>
.title {
  font-size: 14px;
  color: #aaa;
}

.count {
  font-size: 22px;
  letter-spacing: 1px;
}

.view {
  height: 50px;
}
</style>
