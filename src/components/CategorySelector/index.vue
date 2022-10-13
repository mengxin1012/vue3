<template>
  <!-- :model="form" :rules="rules" -->
  <el-form  ref="form" :inline="true" :disabled="disabled">
    <el-form-item label="一级分类">
      <el-select v-model="categoryStore.category1Id" placeholder="请选择" @change="changeCategory1Id">
        <el-option
          v-for="c1 in categoryStore.category1List"
          :key="c1.id"
          :value="c1.id"
          :label="c1.name"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="二级分类">
      <el-select v-model="categoryStore.category2Id" placeholder="请选择" @change="changeCategory2Id">
        <el-option
          v-for="c2 in categoryStore.category2List"
          :key="c2.id"
          :value="c2.id"
          :label="c2.name"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="三级分类">
      <el-select v-model="categoryStore.category3Id" placeholder="请选择">
        <el-option
          v-for="c3 in categoryStore.category3List"
          :key="c3.id"
          :value="c3.id"
          :label="c3.name"
        ></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category'
const categoryStore = useCategoryStore(); // 拿到store

defineProps<{
  disabled: boolean
}>()


const changeCategory2Id = () => {
  // 获取Category3List
  categoryStore.getCategory3List();
}

const changeCategory1Id = () => {
  // 获取Category2List
  categoryStore.getCategory2List();
}

onMounted(() => {
  categoryStore.getCategory1List();
})

</script>

<style scoped>

</style>