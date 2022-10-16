<template>
  <div>
    <el-button type="primary" size="default" icon="ele-Plus" @click="showAddSpuForm">添加SPU</el-button>
    <el-table :data="spuList" border style="margin: 20px 0;">
      <el-table-column lable="序号" width="80" align="center" type="index"></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row,$index}">
          <el-button type="success" size="small" icon="ele-Plus" title="添加sku" @click="showAddSkuForm(row)"></el-button>
          <el-button type="warning" size="small" icon="ele-Edit" title="修改spu" @click="showUpdateSpuForm(row)"></el-button>
          <el-button type="info" size="small" icon="ele-InfoFilled" title="查看sku列表" @click="showSkuList(row)"></el-button>
          <el-button type="danger" size="small" icon="ele-Delete" title="删除spu" @click="deleteSpu(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getSpuList"
      v-model:currentPage="page"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 6, 10]"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    />

    <el-dialog v-model="dialogTableVisible" :title="`${spu?.spuName}的sku列表`">
      <el-table v-loading="loading" :data="skuList">
        <el-table-column property="skuName" label="名称" />
        <el-table-column property="price" label="价格" />
        <el-table-column property="weight" label="重量" />
        <el-table-column property="skuDefaultImg" label="默认图片">
          <template v-slot="{row,$index}">
            <el-image :src="row.skuDefaultImg"></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref,watch } from 'vue';
  import { ElMessage } from 'element-plus';
  import type { SkuInfoData } from '@/api/sku.js';
  export default defineComponent({
    name:'SpuList'
  })
</script>
<script lang="ts" setup>
  import spuApi from '@/api/spu'
  import type {SpuInfoData} from '@/api/spu'
  import {useCategoryStore} from '@/stores/category'
  import skuApi from '@/api/sku'
  const dialogTableVisible = ref(false)
  const spu = ref<SpuInfoData>()
  const skuList = ref<SkuInfoData[]>([])
  const loading = ref(true)
  const page = ref(1)
  const limit = ref(3)
  const spuList = ref<SpuInfoData[]>([])
  const total = ref(0)
  const categoryStore = useCategoryStore()
  const getSpuList = async (pager = 1) => {
    page.value = pager
    try {
      const result = await spuApi.getPageList(page.value,limit.value,categoryStore.category3Id as number)
      spuList.value = result.records
      total.value = result.total
    } catch (error) {
      ElMessage.error('获取spu分页列表失败')
    }
  }

  const handleSizeChange = (size:number) => {
    limit.value = size
    getSpuList()
  }

  const showAddSpuForm = () => {
    emits('updateShowState',2)
  }



  const showUpdateSpuForm = (row:SpuInfoData) => {
    emits('updateShowState',2,row)
  }

  const showAddSkuForm = (row:SpuInfoData) => {
    emits('updateShowState',3,row)
  }

  const emits = defineEmits(['updateShowState'])

  watch(() => categoryStore.category3Id,(newVal,oldVal) => {
    if(!categoryStore.category3Id){
      spuList.value = []
      return 
    }
    getSpuList()
  },{immediate:true})

  const deleteSpu = async (row:SpuInfoData) => {
    try {
      await spuApi.remove(row.id as number)
      ElMessage.success('删除spu成功')
      getSpuList(spuList.value.length > 1? page.value : page.value - 1)
    } catch (error) {
      ElMessage.error('删除spu失败')
    }
  }

  const showSkuList = async (row:SpuInfoData) => {
    dialogTableVisible.value = true
    spu.value = row
    skuList.value = []
    loading.value = true
    try {
      const result = await skuApi.getSkuList(row.id as number)
      skuList.value = result
    } catch (error) {
      ElMessage.error('获取sku列表失败')
    }
    loading.value = false
  }


</script>

<style lang="less" scoped>
</style>
