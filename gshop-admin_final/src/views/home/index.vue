<template>
  <div class="home">
    <TopView></TopView>
    <MiddleView></MiddleView>
    <BottomView></BottomView>
  </div>
</template>

<script lang="ts">

export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
import TopView from './components/TopView/index.vue'
import MiddleView from './components/MiddleView/index.vue'
import BottomView from './components/BottomView/index.vue'
import {onMounted} from 'vue'
import { useUserInfoStore } from '@/stores/userInfo';
import type {UserInfoData} from '@/api/user'
import {useEchartsStore} from '@/stores/echarts'
const userInfoStore = useUserInfoStore()
const echartsStore = useEchartsStore()

onMounted(() => {
  echartsStore.getEchartsData()
})

</script>

<style scoped>
.home{
  padding: 20px;
  background-color: #ddd;
}
</style>


