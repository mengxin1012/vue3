<template>
  <el-form :model="spuForm" label-width="100px">
    <el-form-item label="SPU名称">
      <el-input v-model="spuForm.spuName" type="text" placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spuForm.tmId" placeholder="请选择">
        <el-option
          v-for="tm in trademarkList"
          :key="tm.id"
          :value="(tm.id as number)"
          :label="tm.tmName"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input v-model="spuForm.description" type="textarea" :rows="3" placeholder="SPU描述"></el-input>
    </el-form-item>
    <!-- 收集图片的时候,直接拿一个单独的变量来收集 -->
    <el-form-item label="SPU图片">
      <el-upload
        v-model:file-list="(spuImageList as any)"
        :action="`${ env }/admin/product/upload`"
        list-type="picture-card"
        :on-success="handlerSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" style="width:100%;" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <div class="mb-10">
        <el-select v-model="attrIdAttrVal" :placeholder="`还有${ saleAttrList?.length }个未选择`" class="mr-10">
          <el-option
            v-for="bsa in saleAttrList"
            :key="bsa.id"
            :value="`${bsa.id}:${bsa.name}`"
            :label="bsa.name"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="addSaleAttr">添加销售属性</el-button>
      </div>
      <el-table :data="spuForm.spuSaleAttrList" border>
        <el-table-column type="index" label="序号" align="center" width="80" />
        <el-table-column label="属性名" prop="saleAttrName" width="200" />
        <el-table-column label="属性值名称列表">
          <template #default="{ row, $index }">
            <el-tag
              v-for="(saleAttrVal, idx) in row.spuSaleAttrValueList"
              :key="idx"
              class="mr-5"
              closable
              @close="row.spuSaleAttrValueList.splice(idx, 1)"
            >{{ saleAttrVal.saleAttrValueName }}</el-tag>
            
            <el-input
              v-if="row.inputVisible"
              ref="inputRef"
              v-model="row.inputValue"
              class="w-100"
              size="small"
              @keyup.enter="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            />
            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)">
              新增
            </el-button>
          
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row, $index }">
            <el-button type="danger" :icon="Delete" size="small" title="删除属性名" @click="spuForm.spuSaleAttrList.splice($index, 1)"></el-button>
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
import { Plus, Delete } from '@element-plus/icons-vue'
import { SPUSTATUS } from '../../index.vue'
import { ref, onMounted, computed, nextTick } from 'vue'
import { ElMessage, type UploadProps, type UploadUserFile, type InputInstance } from 'element-plus'
import trademarkApi, { type TrademarkListModel } from '@/api/trademark';
import spuApi, { type BaseSaleListModel, type SpuImageListModel, type SpuModel, type SpuSaleAttrListModel, type SpuSaleAttrModel } from '@/api/spu';
import { useCategoryStore } from '@/stores/category'
import { cloneDeep } from 'lodash';
const env = import.meta.env.VITE_API_URL; // 拿到 '/app-dev' || '/app-prod'
const inputRef = ref<InputInstance>(); // 始终保持页面中只有一个input显示的时候,它拿的就是显得是那个input

const categoryStore = useCategoryStore();
const emits = defineEmits(['update:modelValue', 'spuInfo']);

const props = defineProps<{
  spuInfo: SpuModel
}>()
// const spuForm = props.spuInfo; // 拿到父组件传过来的数据 // 这是编辑的时候


const initSpuForm = () => ({
  category3Id: undefined, // 保存之前再赋值
  spuName: '', // spu名称
  description: '', // 描述
  tmId: undefined, // 品牌
  spuSaleAttrList: [], // 销售属性列表
  spuImageList: [] // 图片列表
})
const spuForm = ref<SpuModel>(  initSpuForm()  ); // 新增-初始化数据, 页面只要打开就执行这一句











// 图片列表
const dialogVisible = ref(false); // 显示预览
const dialogImageUrl = ref(''); // 预览图片的url
// 上传成功的回调
// response 上传图片的响应
// uploadFile 当前上传的这个图片的相关属性(里面有图片名称、图片大小、response上传的响应等)
// uploadFiles  所有的图片列表,每个成员都是一个 uploadFile
//   uploadFiles
const handlerSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {

  // 注意: 这是新增的逻辑
  const tempImgList: SpuImageListModel = []; // 临时的中间变量

  uploadFiles.forEach(item => {

    // 这里需要注意:
    //  只有新上传的图片有response这个属性,编辑的时候,返回的图片列表中是没有response这个属性的
    if (item.response) { // 新上传的图片
      tempImgList.push({
        imgName: item.name,
        imgUrl: (item.response as any).data,
        // 注意:这里upload组件预览图片的时候是需要url和name这两个属性的
        name: item.name,
        url: (item.response as any).data,
        response: item.response // 为了第二次循环的时候,第一张图片还有response这个属性
      })
    } else {
      tempImgList.push(item as any);
    }
  })

  spuImageList.value = tempImgList;

}
// 删除的回调
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  spuImageList.value = uploadFiles as any;
}
// 预览的回调
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url! // 让编译通过,告诉ts两个类型不一样,但是你别管,编译通过即可
  dialogVisible.value = true
}


// 收集销售属性
// 收集销售属性下拉框数据的时候,即需要收集到id,还需要收集到name
const attrIdAttrVal = ref('');
// 下卡框选择到内容的时候,attrIdAttrVal就收集到了`id:name`
// 当点击添加按钮的时候,应该把当前收集的这个数据,拆开创建一个 销售属性的对象
//    添加到 spuForm.spuSaleAttrList
//    拿着添加好的值去展示
// 当将销售属性添加到 表格中的时候,此时下拉框的的数据将要发生变化
//    已经添加到表格的销售属性不能在下拉框中去显示
//    下拉框不能写死,要么使用computed 要么使用watch
//    同时需要清除掉刚刚选中的值 attrIdAttrVal - 点击按钮的时候
// 收集属性值列表数据 - 需要两个值
//    1. 控制显示隐藏
//    2. 记录输入内容
//    把这两个数据放到当前 row 当中

// 下拉框真实展示的数据,需要过滤掉表格中以存在的数据
// baseSaleAttrList -> 原始数据
// saleAttrList 过滤后的数据
const saleAttrList = computed(() => {
  // filter 满足条件的会被过滤留下,不满足条件的会被过滤掉
  return baseSaleAttrList.value?.filter(item => {
    // spuForm.value.spuSaleAttrList - 表格数据
    const isRepate = spuForm.value.spuSaleAttrList.some(row => {
      return row.saleAttrName == item.name
    })
    return !isRepate
  })
})

const addSaleAttr = () => {
  if (!attrIdAttrVal.value) return

  const [baseSaleAttrId, saleAttrName] = attrIdAttrVal.value.split(':');
  // 创建 销售属性对象
  spuForm.value.spuSaleAttrList.push({
    baseSaleAttrId: Number(baseSaleAttrId), // 类型不同,需要强转
    saleAttrName,
    spuSaleAttrValueList: [] // 属性值列表也比有
  })

  attrIdAttrVal.value = '';// 清除已选择的值

}

// 属性值列表交互
const showInput = (row: SpuSaleAttrModel) => {
  row.inputVisible = true; // 之前的数据是没有这个值的,在点击新增属性值按钮的时候是第一次添加这个值
  /**
  vue2中,初始化的时候没有这个值,后期给添加上这个值是不会响应式的
    只能使用$set()来设置响应式
  vue3中,只要你给数据添加属性就会响应式(ref和reactive)
   */
  
  
  nextTick(() => {
    inputRef.value?.focus();
  })
}
  // 失焦的时候,将输入的内容添加到 SpuSaleAttrValueListModel 属性值列表中
const handleInputConfirm = (row: SpuSaleAttrModel) => {
  // 判断有没有输入的值
  if (!row.inputValue) {
    row.inputVisible = false;
    return;
  } else {
    // 添加之前要去重
    const isRepate = row.spuSaleAttrValueList.map(item => item.saleAttrValueName).includes(row.inputValue);
    if (isRepate) { // 有重复
      row.inputValue = ""; // 请内容
      row.inputVisible = false; // 切显示
      ElMessage.error('输入属性值重复,请重试')
      return;
    }
    
    // 将值添加到属性值列表中(添加进去自动v-for循环就会显示)
    row.spuSaleAttrValueList.push({
      baseSaleAttrId: row.baseSaleAttrId,
      saleAttrValueName: row.inputValue,
    })
    // 清空输入的内容
    row.inputValue = "";
    // 切换显示
    row.inputVisible = false;
  }
}




// 保存
const onSave = async () => {
  // 组装数据 - 自动收集的数据(v-model收集的)不需要管 - 需要处理间接收集的数据
  spuForm.value.spuImageList = (spuImageList.value as SpuImageListModel).map(item => {
    // 判断是新上传的图片还是之前就有的图片
    if (item.id) { // 老图片,编辑回显的图片,直接拿就行
      return item
    } else {
      return {
        imgName: item.imgName as string,
        imgUrl: item.imgUrl as string
      }
    }
  })

  // 清除数据(这个可以没有,因为对后端不会造成影响)
  spuForm.value.spuSaleAttrList.forEach(item => {
    delete item.inputVisible
    delete item.inputValue
  })

  if (!spuForm.value.category3Id) {
    spuForm.value.category3Id = categoryStore.category3Id;
  }

  // 简单校验
  const { spuName, tmId, category3Id, spuImageList: imgList, spuSaleAttrList } = spuForm.value;
  if ( !(spuName && tmId && category3Id && imgList.length && spuSaleAttrList.length) ) {
    ElMessage.error('名称、品牌、图片列表、销售属性列表为必填项,请检查')
    return
  }

  // 发送请求
  try {
    await spuApi.saveSpu(spuForm.value);
    ElMessage.success('保存成功');
    cancelSave();
  } catch (error) {
    console.error(error)
    ElMessage.success('保存失败');
  }
}

// 取消保存
const cancelSave = () => {
  emits('update:modelValue', SPUSTATUS.SPULIST)
  emits('spuInfo');
}








// 品牌下拉数据
const trademarkList = ref<TrademarkListModel>();
const getTrademarkList = async () => {
  try {
    let result = await trademarkApi.getList();
    trademarkList.value = result;
  } catch (error) {
    console.error(error);
    ElMessage.error('获取品牌下拉数据失败');
  }
}
// 获取销售属性下拉
const baseSaleAttrList = ref<BaseSaleListModel>()
const getBaseSaleAttrList = async () => {
  try {
    let result = await spuApi.getSaleAttrList();
    baseSaleAttrList.value = result;
  } catch (error) {
    console.error(error);
    ElMessage.error('获取销售属性下拉数据失败');
  }
}
// 获取当前spu的图片列表
const spuImageList = ref<SpuImageListModel>()

const getSpuImageList = async () => {
  try {
    let result = await spuApi.getSpuImageList(spuForm.value.id as number);
    spuImageList.value = result.map(item => {
      return {
        ...item,
        name: item.imgName, // 图片upload组件展示需要
        url: item.imgUrl // 图片upload组件展示需要
      }
    });
  } catch (error) {
    console.error(error);
    ElMessage.error('获取SPU的图片列表失败');
  }
}
// 获取当前spu的销售属性列表
const getSpuSaleAttrList = async () => {
  try {
    let result = await spuApi.getSpuSaleAttrList(spuForm.value.id as number);
    spuForm.value.spuSaleAttrList = result;
  } catch (error) {
    console.error(error);
    ElMessage.error('获取SPU的销售属性列表失败');
  }
}


// 编辑,编辑回显数据是回显的父组件传过来的spuInfo这个数据
// 当前组件被销毁的时候,父组件没有把它内部的 spuInfo 给重置了
// 当再次点击'新增'进来的时候,会重新把父组件的 spuInfo 这个数据传过来,又有了
// 在点击保存和取消的时候,都需要告诉父组件把父组件内部的 spuInfo 给重置了
const initData = async () => {
  if (props.spuInfo.id) {
    // 重新给spuForm赋值
    spuForm.value = cloneDeep(props.spuInfo); // 深拷贝,不能影响主界面的值

    await getSpuImageList(); // 获取当前spu的图片列表
    await getSpuSaleAttrList(); // 获取当前spu的销售属性列表
    
  }
  getTrademarkList(); // 品牌下拉数据
  getBaseSaleAttrList(); // 获取销售属性下拉
}

onMounted(() => {
  initData();
})
</script>

<style scoped>
</style>