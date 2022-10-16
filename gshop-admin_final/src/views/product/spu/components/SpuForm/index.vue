<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spuForm.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spuForm.tmId" placeholder="请选择">
        <el-option :value="(tm.id as string)" v-for="(tm, index) in trademarkList" :key="index" :label="tm.tmName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input placeholder="SPU描述" type="textarea" :rows="4" v-model="spuForm.description"></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <!--  -->
      <el-upload
        v-model:file-list="(spuImageList as any)"
        action="/app-dev/admin/product/upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handlerSuccess"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-select v-model="unsaleAttrIdName" :placeholder="unUseSaleAttrList.length > 0?`还有${unUseSaleAttrList.length}未选择`:'没有啦！！！'">
        <el-option :value="`${item.id}:${item.name}`" :label="item.name" v-for="(item, index) in unUseSaleAttrList" :key="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" size="default" @click="addSaleAttr">添加销售属性</el-button>
      <el-table border :data="spuSaleAttrList">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值名称列表">
          <!-- @close="handleClose(tag)" -->
          <template v-slot="{row,$index}">
            <el-tag
              v-for="(attrValue, index) in row.spuSaleAttrValueList" :key="attrValue.id"
              class="mx-1"
              closable
              :disable-transitions="false"
            >
              {{ attrValue.saleAttrValueName  }}
            </el-tag>
            <!--  -->
            <el-input
              v-if="row.inputVisible"
              v-model="row.saleAttrValueName"
              size="small"
              ref="InputRef"
              style="width:100px"
              class="ml-1 w-20"
              @keyup.enter="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            />
            <!--  -->
            <el-button @click="showInput(row)" v-else class="button-new-tag ml-1" size="small">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row,$index}">
            <el-button type="danger" icon="ele-Delete" size="small" title="删除"></el-button>
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
  import { ElMessage, type UploadFile, type UploadFiles, type UploadProps } from 'element-plus';
  import { Plus } from '@element-plus/icons-vue'
  import { defineComponent,nextTick,onMounted,ref } from 'vue';
  import type { BaseSaleAttrData, SpuImageData, SpuInfoData, SpuSaleAttrData } from '@/api/spu.js';
  import type { TrademarkData } from '@/api/trademark';
  import spuApi from '@/api/spu'
  import skuApi from '@/api/sku'
  import trademarkApi from '@/api/trademark'
  import { computed } from '@vue/reactivity';
  import { useCategoryStore } from '@/stores/category';
  export default defineComponent({
    name:'SpuForm'
  })
</script>
<script lang="ts" setup>
  const props = defineProps<{
    initSpu:SpuInfoData
  }>()
  const categoryStore = useCategoryStore()
  const emits = defineEmits(['updateShowState'])
  const unsaleAttrIdName = ref('')
  const trademarkList = ref<TrademarkData[]>([])
  const baseSaleAttrList = ref<BaseSaleAttrData[]>([])
  const spuImageList = ref<SpuImageData[]>([])
  const spuSaleAttrList = ref<SpuSaleAttrData[]>([])
  const InputRef = ref<HTMLInputElement>()
  const spuForm = props.initSpu
  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)
  const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    // console.log(uploadFile, uploadFiles)
    spuImageList.value = uploadFiles as any
  }
  const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
  }

  const handlerSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles):void => {
    spuImageList.value = uploadFiles as any
  }

  const getTrademarkList = async () => {
    try {
      const result = await trademarkApi.getList()
      trademarkList.value = result
    } catch (error) {
      ElMessage.error('获取品牌列表失败')
    }
  }
  const getBaseSaleAttrList = async () => {
    try {
      const result = await spuApi.getBaseSaleAttrList()
      baseSaleAttrList.value = result
    } catch (error) {
      ElMessage.error('获取基础销售属性列表失败')
    }
  }
  const getSpuImageList = async () => {
    try {
      const result = await skuApi.getSpuImageList(spuForm.id as number)
      result.forEach(item => {
        item.name = item.imgName
        item.url = item.imgUrl
      })
      spuImageList.value = result
    } catch (error) {
      ElMessage.error('获取SPU图片列表失败')
    }
  }
  const getSpuSaleAttrList = async () => {
    try {
      const result = await skuApi.getSpuSaleAttrList(spuForm.id as number)
      spuSaleAttrList.value = result
    } catch (error) {
      ElMessage.error('获取SPU销售属性列表失败')
    }
  }

  const unUseSaleAttrList = computed(() => {
    return baseSaleAttrList.value.filter(item => {
      return spuSaleAttrList.value.every(item1 => item.name !== item1.saleAttrName)
    })
  })

  const addSaleAttr = () => {
    let [baseSaleAttrId,saleAttrName] = unsaleAttrIdName.value.split(':')
    let obj:SpuSaleAttrData = {
      baseSaleAttrId,
      saleAttrName,
      spuSaleAttrValueList:[]
    }
    spuSaleAttrList.value.push(obj)
    unsaleAttrIdName.value = ''
  }

  const showInput = (row:SpuSaleAttrData) => {
    row.inputVisible = true
    nextTick(() => {
      InputRef.value?.focus()
    })
    
  }

  const handleInputConfirm = (row:SpuSaleAttrData) => {
    if(row.saleAttrValueName === '' || row.saleAttrValueName?.trim() === ''){
      row.saleAttrValueName = ''
      row.inputVisible = false
      return 
    }

    let isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === row.saleAttrValueName)
    if(isRepeat){
      ElMessage.error('属性值名称不能重复')
      row.saleAttrValueName = ''
      row.inputVisible = false
      return 
    }

    let {baseSaleAttrId,saleAttrValueName} = row
    let obj = {baseSaleAttrId,saleAttrValueName}
    row.spuSaleAttrValueList.push(obj)
    row.saleAttrValueName = ''
    row.inputVisible = false
  }


  const save = async () => {
    let spu = spuForm
    spu.category3Id = categoryStore.category3Id
    let spuImageList1:SpuImageData[] = spuImageList.value.map(item => {
      return {
        imgName:item.name as string,
        imgUrl:item.imgUrl || item.response.data as string,
      }
    })
    spu.spuImageList = spuImageList1
    spu.spuSaleAttrList = spuSaleAttrList.value.map(item => {
      delete item.saleAttrValueName
      delete item.inputVisible
      return item
    })
    try {
      await spuApi.addOrUpdate(spu)
      ElMessage.success('保存spu成功')
      emits('updateShowState',1)
    } catch (error) {
      ElMessage.error('保存spu失败')
    }
  }

  onMounted(() => {
    if(spuForm.id){
      getTrademarkList()
      getBaseSaleAttrList()
      getSpuImageList()
      getSpuSaleAttrList()
    }else{
      getTrademarkList()
      getBaseSaleAttrList()
    }
  })

</script>

<style lang="less" scoped>
</style>
