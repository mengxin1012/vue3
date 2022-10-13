<template>
  <!-- :model="" -->
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <div>{{ spuInfo.spuName }}</div>
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="skuForm.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input type="number" v-model="skuForm.price" placeholder="价格(元)"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input type="number" v-model="skuForm.weight" placeholder="重量(千克)"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input type="textarea" v-model="skuForm.skuDesc" :rows="3" placeholder="规格描述"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">

      <el-form :inline="true">

        <el-form-item :label="attrInfo.attrName" v-for="attrInfo in attrInfoList">

          <el-select v-model="attrInfo.attrIdValueId" placeholder="请选择">
            <el-option
              v-for="attrVal in attrInfo.attrValueList"
              :value="`${attrInfo.id}:${attrVal.id}`"
              :label="attrVal.valueName"
            ></el-option>
          </el-select>


        </el-form-item>


      </el-form>

    </el-form-item>

    <el-form-item label="销售属性">

      <el-form :inline="true">


        <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in saleAttrList">
          
          <el-select v-model="saleAttr.attrIdValueId" placeholder="请选择">
            <el-option
              v-for="saleAttrVal in saleAttr.spuSaleAttrValueList"
              :value="`${saleAttr.id}:${saleAttrVal.id}`"
              :label="saleAttrVal.saleAttrValueName"
            ></el-option>
          </el-select>

        </el-form-item>



      </el-form>

    </el-form-item>

    <el-form-item label="图片列表">

      <el-table :data="spuImageList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="80"></el-table-column>
        <el-table-column label="图片">
          <template #default="{ row, $index}">
            <img :src="row.imgUrl" style="width: 60px;height: 60px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row, $index}">
            <el-tag v-if="row.isDefault == '1'" type="success">默认</el-tag>
            <el-button v-else type="primary" size="small" @click="setDefault(row)">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button @click="cancelSave">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
/**
 * 1. 静态展示
 * 2. 初始化数据展示(调用了三个接口)
 * 3. 交互 - 收集数据
 *    直接收集
 *    间接收集
 */
import type { SpuModel } from '@/api/spu';
import { onMounted, ref } from 'vue';
import { SPUSTATUS } from '../../index.vue';
import skuApi, { type SkuModel } from '@/api/sku'
import attrApi, { type AttrModel } from '@/api/attr'
import spuApi, { type SpuSaleAttrListModel, type SpuImageListModel, type SpuImageModel } from '@/api/spu'
import { useCategoryStore } from '@/stores/category'
import { ElMessage } from 'element-plus';
const categoryStore = useCategoryStore();

const props = defineProps<{
  spuInfo: SpuModel
}>()

const emits = defineEmits(['update:modelValue', 'spuInfo'])


// 初始值
const initSkuForm = (): SkuModel => ({
  spuId: undefined, // 保存的时候去收集
  tmId: undefined, // 保存的时候去收集
  category3Id: undefined, // 保存的时候去收集
  price: undefined,
  skuName: '',
  skuDesc: '',
  weight: '',
  skuDefaultImg: '', // 默认图片 - 交互间接收集
  createTime: '', // 不重要忽略
  skuImageList: [], // 图片列表
  skuAttrValueList: [], // 平台属性
  skuSaleAttrValueList: [] // 销售属性
})

const skuForm = ref<SkuModel>(initSkuForm())


// 设置默认图片
const setDefault = (row: SpuImageModel) => {
  // 排他
  spuImageList.value?.forEach(item => item.isDefault = '0')
  row.isDefault = '1'
}
// 图片列表选择
const handleSelectionChange = (val: SpuImageModel[]) => {
  skuForm.value.skuImageList = val; // 收集图片列表
}



const onSave = async () => {
  // 校验
  // 组装数据
  // 默认图片收集
  skuForm.value.skuDefaultImg = spuImageList.value?.find(item => item.isDefault == '1')?.imgUrl!;
  // 平台属性
  skuForm.value.skuAttrValueList = attrInfoList.value?.filter(item => item.attrIdValueId).map(item => {
    const [attrId,  valueId] = (item.attrIdValueId as string).split(':');
    return {
      attrId,
      valueId
    }
  })!
  // 销售属性
  skuForm.value.skuSaleAttrValueList = saleAttrList.value?.filter(item => item.attrIdValueId).map(item => {
    const [saleAttrId, saleAttrValueId] = (item.attrIdValueId as string).split(':');
    return {
      saleAttrId,
      saleAttrValueId
    }
  })!
  skuForm.value.spuId = props.spuInfo.id;
  skuForm.value.tmId = props.spuInfo.tmId;
  skuForm.value.category3Id = categoryStore.category3Id;
  // 发送请求
  try {
    await skuApi.save(skuForm.value);
    ElMessage.success('保存成功');
    cancelSave(); // 切换主界面
  } catch (error) {
    console.log(error);
    ElMessage.error('保存失败');
  }
}

const cancelSave = () => {
  emits('update:modelValue', SPUSTATUS.SPULIST);
  emits('spuInfo'); // 初始化父组件的spuInfo
}


// 获取平台属性
const attrInfoList = ref<AttrModel[]>()
const getAttrInfoList = async () => {
  try {
    const { category1Id, category2Id, category3Id } = categoryStore;
    let result = await attrApi.getAttrInfoList(category1Id as number, category2Id as number, category3Id as number)
    attrInfoList.value = result;
    console.log('平台属性', result);
  } catch (error) {
    console.log(error);
    ElMessage.error('获取平台属性失败,请重试')
  }
}

const spuImageList = ref<SpuImageListModel>()
const getSpuImageList = async () => {
  try {
    let result = await spuApi.getSpuImageList(props.spuInfo.id as number)
    spuImageList.value = result;
    console.log('图片列表', result);
  } catch (error) {
    console.log(error);
    ElMessage.error('获取图片列表失败,请重试')
  }
}


const saleAttrList = ref<SpuSaleAttrListModel>()
const getSpuSaleAttrList = async () => {
  try {
    let result = await spuApi.getSpuSaleAttrList(props.spuInfo.id!)
    saleAttrList.value = result;
    console.log('spu销售属性列表', result);
  } catch (error) {
    console.log(error);
    ElMessage.error('获取SPU销售属性列表失败,请重试')
  }
}


const initData = () => {
  getAttrInfoList(); // 获取平台属性
  getSpuImageList(); // 获取图片列表
  getSpuSaleAttrList(); // 获取spu销售属性列表
}

onMounted(() => {
  initData();
})

</script>

<style scoped>

</style>