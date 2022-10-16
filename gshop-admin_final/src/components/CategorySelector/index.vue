<template>
  <el-form :inline="true" :disabled="disabled">
    <el-form-item label="一级分类">
      <el-select v-model="category1Id"  placeholder="请选择" @change="handlerCategory1">
        <el-option v-for="(c1, index) in category1List" :key="c1.id" :label="c1.name" :value="c1.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select v-model="category2Id"  placeholder="请选择" @change="handlerCategory2">
        <el-option v-for="(c2, index) in category2List" :key="c2.id" :label="c2.name" :value="c2.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select v-model="category3Id"  placeholder="请选择">
        <el-option v-for="(c3, index) in category3List" :key="c3.id" :label="c3.name" :value="c3.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
export default defineComponent({
  name: 'CategorySelector'
})
</script>
<script lang="ts" setup>
import {useCategoryStore} from '@/stores/category'
import { storeToRefs } from 'pinia';

const props = defineProps<{
  disabled:boolean
}>()

const categoryStore = useCategoryStore()
onMounted(() => {
  categoryStore.getCategory1List()
})

const {category1List,category2List,category3List,category1Id,category2Id,category3Id} = storeToRefs(categoryStore)

const handlerCategory1 = (category1Id:number) => { 
  categoryStore.getCategory2List(category1Id)
}

const handlerCategory2 = (category2Id:number) => {
  categoryStore.getCategory3List(category2Id)
}

// const handlerCategory3 = (category3Id:number) => {
//   categoryStore.saveCategory3Id(category3Id)
// }






</script>

<style lang="less" scoped>
</style>
