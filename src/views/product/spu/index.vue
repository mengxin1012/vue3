<template>
  <div>
    <el-card class="mb-10">
      <!-- 1的时候是列表,不能禁用, 不是1的时候是编辑,都禁用 -->
      <CategorySelector :disabled="showStatus != SPUSTATUS.SPULIST"></CategorySelector>
    </el-card>

    <el-card>
      <SpuList v-if="showStatus == SPUSTATUS.SPULIST" v-model="showStatus" @spuInfo="changeSpuInfo"></SpuList>
      <SpuForm v-if="showStatus == SPUSTATUS.SPUFORM" v-model="showStatus" :spuInfo="spuInfo" @spuInfo="changeSpuInfo"></SpuForm>
      <SkuForm v-if="showStatus == SPUSTATUS.SKUFORM" v-model="showStatus" :spuInfo="spuInfo" @spuInfo="changeSpuInfo"></SkuForm>
    </el-card>
  </div>
</template>


<script lang="ts">
/**
步骤:
1. 分析页面
2. 三个界面切换 - 枚举 - vue3的v-model
  把SpuList和SpuForm的切换先做出来了(禁用状态: 1.spuList新增按钮 2.CategorySelector禁用)
3. spuList的静态搭建
4. spu所有涉及到的接口 - ts类型限制(花了很长时间)
5. spuList 调接口,展示数据
6. spuFomr的静态展示
7. spuForm请求接口拿数据 新增拿两个接口数据 修改拿4个接口数据
----------------------------------------------------------------
8. 先去做新增(由于编辑比较复杂)
  目标: 新增什么?spu - 新增了一个符合spuModel接口(interface)的数据,调用的保存接口
      看一下保存的时候的数据格式,才能知道你要收集什么数据格式
  8.1 创建一个 spuForm 这个数据用来收集数据
    收集数据分为直接收集 和 间接收集
      直接收集的数据:   spuName、tmId、description
      间接收集的数据:   spuSaleAttrList、spuImageList
      spuImageList - 单独拿了个变量收集的
      spuSaleAttrList 给 每一个数据添加了一个 inputVisible 和 inputValue 来收集的
    点击保存的时候,查看数据,看和完成版项目的数据是否一致
    调用接口放一放,等编辑的时候回显数据检验完成之后,再调接口
9. 编辑回显数据 - 查看新增的交互逻辑是否存在问题
*/
export enum SPUSTATUS {
  SPULIST = 1,
  SPUFORM = 2,
  SKUFORM = 3,
}
</script>
<script setup lang="ts">
// 这个script中的内容是 setup 这个函数中的内容
import SpuList from './components/SpuList/index.vue'
import SpuForm from './components/SpuForm/index.vue'
import SkuForm from './components/SkuForm/index.vue'
import { ref } from 'vue';
import type { SpuModel } from '@/api/spu';


// 创建一个spu初始值
const initSpuInfo = (): SpuModel => ({
  spuName: '', // spu名称
  description: '', // spu描述
  category3Id: undefined, // 三级分类的id
  tmId: undefined, // 品牌id
  spuSaleAttrList: [], // spu销售属性列表
  spuImageList: []  // spu图片列表
})
const spuInfo = ref<SpuModel>( initSpuInfo() )
const changeSpuInfo = (row: SpuModel) => {
  if (row) {
    spuInfo.value = row; // 设置编辑要回显的数据
  } else {
    spuInfo.value = initSpuInfo(); // 重置为空模板
  }
}









const showStatus = ref(1);
// 修改showStatus可选的方式
// 1. props 子 -> defineProps
// 2. 自定义事件 -> defineEmits
// 3. 子组件直接修改父组件数据 -> 模板中$parent 传给函数 通过传的这个东西调用 修改父组件数据 父组件需要 defineExpose 将可修改的数据说明
// 4. 父子组件之间的数据同步 - v-model
//    4.1. 子组件要展示这个数据 需要在子组件中使用  defineProps(['modelValue'])
//    4.2. 修改父组件数据需要在子组件中 defineEmits(['update:modelValue'])
</script>

<style scoped>

</style>