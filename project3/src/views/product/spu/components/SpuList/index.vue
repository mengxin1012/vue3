<template>
  <div>
    <el-button type="primary" :icon="Plus" @click="addSpu" :disabled="!categoryStore.category3Id" class="mb-10">添加SPU</el-button>
    <!-- <el-button type="primary" :icon="Plus" @click="addSpu" class="mb-10">添加SPU</el-button> -->

    <el-table :data="spuList" border class="mb-10">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column label="SPU名称" property="spuName"></el-table-column>
      <el-table-column label="SPU描述" property="description"></el-table-column>
      <el-table-column label="操作" width="240">
        <template #default="{ row, $index }">
          <el-button type="success" :icon="Plus" size="small" title="新增SKU" @click="addSku(row)"></el-button>
          <el-button type="warning" :icon="Edit" size="small" title="修改SPU" @click="editSpu(row)"></el-button>
          <el-button type="info"    :icon="InfoFilled" size="small" title="查看SKU列表" @click="showSkuList(row)"></el-button>
          <el-popconfirm :title="`确定要删除[${ row.spuName }]吗?`" @confirm="deleteSpu(row)">
            <template #reference>
              <el-button type="danger"  :icon="Delete" size="small" title="删除SPU"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:currentPage="page"
      v-model:page-size="limit"
      :total="total"
      :page-sizes="[3, 6, 9]"
      layout="prev, pager, next, jumper, -> , sizes, total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

      <el-dialog v-model="dialogTableVisible" :before-close="beforeClose" :title="`[${ skuDialogTitle }]的sku列表`" width="80%">
        <el-table :data="skuList" v-loading="skuLoading">
          <el-table-column property="skuName" label="名称"/>
          <el-table-column property="price" label="价格"/>
          <el-table-column property="weight" label="重量" />
          <el-table-column label="默认图片">
            <template #default="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width: 60px;height: 60px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import spuApi, { type SpuListModel, type SpuModel } from '@/api/spu'
import skuApi, { type SkuModel } from '@/api/sku'
import { SPUSTATUS } from '../../index.vue'
import { Plus, Delete, Edit, InfoFilled } from '@element-plus/icons-vue'
import { useCategoryStore } from '@/stores/category';
import { ElMessage } from 'element-plus';
const categoryStore = useCategoryStore(); // 拿到sotre
const emits = defineEmits(['update:modelValue', 'spuInfo']);

const addSpu = () => {
  emits('update:modelValue', SPUSTATUS.SPUFORM)
}

// 把当前要编辑的spu传给父组件,在让父组件传给 spuform
const editSpu = (row: SpuModel) => {
  emits('spuInfo', row); // 把数据给父组件
  emits('update:modelValue', SPUSTATUS.SPUFORM) // 切换界面的显示
}
// 删除spu
const deleteSpu = async (row: SpuModel) => {
  try {
    await spuApi.delete(row.id as number);
    ElMessage.success('删除成功')
    if (spuList.value?.length == 1 && page.value != 1) {
      page.value -= 1;
    }
    getPage();
  } catch (error) {
    console.error(error);
    ElMessage.success('删除失败')
  }
}
// 添加sku
const addSku = (row: SpuModel) => {
  emits('update:modelValue', SPUSTATUS.SKUFORM);
  emits('spuInfo', row); // 把数据给父组件
}
// 以后再开发中,所有涉及到的网络请求都要考虑到loading这个事,
// 可以先不写,但是一定要有
// 展示skuList
const skuDialogTitle = ref('');
const dialogTableVisible = ref(false);
const skuLoading = ref(false); // 加载 loding 蒙层展示
const skuList = ref<SkuModel[]>();
const showSkuList = async (row: SpuModel) => {
  dialogTableVisible.value = true;
  skuDialogTitle.value = row.spuName;
  skuLoading.value = true; // 发请求前变成true
  try {
    let result = await skuApi.findBySpuId(row.id as number);
    skuList.value = result
    skuLoading.value = false;
  } catch (error) {
    console.log(error);
    ElMessage.error('获取sku列表信息失败');
    skuLoading.value = false;
  }
}
// 管理 skuList 弹窗 要清除数据
const beforeClose = (done: any) => {
  skuList.value = [];
  done(); // 关闭弹窗
}







// 分页
const page = ref(1);
const limit = ref(3);
const total = ref(0);
const handleSizeChange = (val: number) => { // 每页条数变化
  limit.value = val; // 组装数据
  getPage(); // 发送请求
}
const handleCurrentChange = (val: number) => { // 页码的变化
  page.value = val; // 组装数据
  getPage(); // 发送请求
}

// 表格展示数据
const spuList = ref<SpuListModel>();
const getPage = async () => {
  try {
    let result = await spuApi.getPage(page.value, limit.value, categoryStore.category3Id as number);
    total.value = result.total;
    spuList.value = result.records;
  } catch (error) {
    console.error(error);
    ElMessage.error('获取SPU列表失败,请重试')
  }
}

watch(() => categoryStore.category3Id, (nval) => {
  if (!nval) {
    // 清除页面表格数据
    spuList.value = [];
    return
  }
  getPage();
}, { immediate: true })


</script>

<style scoped>

</style>