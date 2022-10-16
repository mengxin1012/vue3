<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      {{ spu.spuName }}
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称" v-model="skuForm.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格">
      <el-input placeholder="价格" v-model="skuForm.price" type="number"></el-input>
    </el-form-item>
    <el-form-item label="重量">
      <el-input placeholder="重量" v-model="skuForm.weight" type="number"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuForm.skuDesc"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item :label="attr.attrName" v-for="(attr, index) in attrInfoList" :key="attr.id">
          <el-select v-model="attr.attrIdValueId" placeholder="请选择">
            <el-option :value="`${attr.id}:${attrValue.id}`" :label="attrValue.valueName" v-for="(attrValue, index) in attr.attrValueList"
              :key="attrValue.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true" label-width="100px">
        <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id">
          <el-select placeholder="请选择" v-model="saleAttr.attrIdValueId">
            <el-option :value="`${saleAttr.id}:${saleAttrValue.id}`" :label="saleAttrValue.saleAttrValueName"
              v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片列表">
      <el-table :data="spuImageList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="图片">
          <template v-slot="{ row, $index }">
            <el-image :src="row.imgUrl" style="width:100px;height: 80px;"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-button @click="setDefault(row)" v-if="row.isDefault === '0'" type="primary" size="small">设为默认</el-button>
            <el-tag v-else type="warning" size="small">默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="emits('updateShowState',1)">取消</el-button>
    </el-form-item>
  </el-form>

</template>
<script lang="ts">
import type { SpuImageData, SpuInfoData, SpuSaleAttrData } from '@/api/spu.js';
import { defineComponent, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: 'SkuForm'
})
</script>
<script lang="ts" setup>
import attrApi, { type AttrData } from '@/api/attr'
import skuApi, { type SkuAttrValueData, type SkuImgData, type SkuInfoData, type SkuSaleAttrValueData } from '@/api/sku'
import { useCategoryStore } from '@/stores/category'
const emits = defineEmits(['updateShowState'])
const props = defineProps<{
  initSpu: SpuInfoData
}>()

const categoryStore = useCategoryStore()
const spu = props.initSpu
const skuForm = ref<SkuInfoData>({
  price: 0,
  skuName: '',
  skuDesc: '',
  weight: '',
  skuDefaultImg: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})

const attrInfoList = ref<AttrData[]>([])
const spuImageList = ref<SpuImageData[]>([])
const spuSaleAttrList = ref<SpuSaleAttrData[]>([])
const skuImageList = ref<SkuImgData[]>([])

const getAttrInfoList = async () => {
  try {
    const result = await attrApi.getList(
      categoryStore.category1Id as number,
      categoryStore.category2Id as number,
      categoryStore.category3Id as number,
    )
    attrInfoList.value = result
  } catch (error) {
    ElMessage.error('获取平台属性列表失败')
  }
}
const getSpuImageList = async () => {
  try {
    const result = await skuApi.getSpuImageList(spu.id as number)
    result.forEach(item => item.isDefault = '0' )
    spuImageList.value = result
  } catch (error) {
    ElMessage.error('获取spu图片列表失败')
  }
}
const getSpuSaleAttrList = async () => {
  try {
    const result = await skuApi.getSpuSaleAttrList(spu.id as number)
    spuSaleAttrList.value = result
  } catch (error) {
    ElMessage.error('获取spu销售属性列表失败')
  }
}


const handleSelectionChange = (val:SkuImgData[]) => {
  skuImageList.value = val
}

const setDefault = (row:SpuImageData) => {
  spuImageList.value.forEach(item => item.isDefault = '0')
  row.isDefault = '1'
  skuForm.value.skuDefaultImg = row.imgUrl
}

const save = async () => {
  let sku = skuForm.value
  sku.spuId = spu.id as number
  sku.tmId = spu.tmId
  sku.category3Id = spu.category3Id as number
  sku.skuImageList = skuImageList.value
  sku.skuAttrValueList = attrInfoList.value.reduce((prev,item) => {
    if(item.attrIdValueId){
      let [attrId,valueId] = item.attrIdValueId.split(':')
      prev.push({attrId,valueId})
    }
    return prev
  },[] as SkuAttrValueData[])

  sku.skuSaleAttrValueList = spuSaleAttrList.value.reduce((prev,item) => {
    if(item.attrIdValueId){
      let [saleAttrId,saleAttrValueId] = item.attrIdValueId.split(':')
      prev.push({saleAttrId,saleAttrValueId})
    }
    return prev
  },[] as SkuSaleAttrValueData[])
  try {
    skuApi.saveSkuInfo(sku)
    ElMessage.success('保存sku成功')
    emits('updateShowState',1)
  } catch (error) {
    ElMessage.error('保存sku失败')
  }
}



onMounted(async () => {
  getAttrInfoList()
  getSpuImageList()
  getSpuSaleAttrList()
})

</script>

<style lang="less" scoped>
</style>
