<template>
    <div v-if="modelValue==STATUS.SPUFROM" >
            <el-form v-model="spuFrom" label-width="100px">
                <el-form-item label="SPU名称" >
                    <el-input v-model="spuFrom.spuName"/>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select placeholder="请输入属性" v-model="spuFrom.tmId">
                        <el-option :label="trade.tmName" :value="trade.id" v-for="trade in tradeMark" :key="trade.id"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="SPU描述" >
                    <el-input type="textarea" v-model="spuFrom.description"/>
                </el-form-item>
                <el-form-item label="SPU图片">
                        <el-upload
                            v-model:file-list="spuImg"
                            :action=action
                            list-type="picture-card"
                            :on-preview="handlePreview"
                            :on-success="handleSuccess"
                            :on-remove="handleRemove"
                        >
                            <el-icon><Plus /></el-icon>
                    </el-upload>
                    <el-dialog v-model="dialogVisible" >
                        <img w-full :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
                </el-form-item>
<!--                v-model="form.region"-->
                <el-form-item label="销售属性" >
                    <el-select  :placeholder="saleList" v-model="saleValue" @change="saleChange">
                        <el-option :label="sale.name" :value="`${sale.id}-${sale.name}-${index}`" v-for="(sale,index) in saleAttr" :key="sale.id"/>
                    </el-select>
                    <el-button type="primary" @click="addSale">添加属性名</el-button>
                </el-form-item>
                <el-table :data="spuFrom.spuSaleAttrList">
                    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
                    <el-table-column label="属性值名称列表">
                        <template #default="{row,$index}">
                            <el-tag
                                v-for="(sale,index) in row.spuSaleAttrValueList" :key="sale.baseSaleAttrId"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(row.spuSaleAttrValueList,index)"
                            >
                                {{ sale.saleAttrName}}
                            </el-tag>
                            <el-input
                                v-if="row.inputVisible"
                                ref="InputRef"
                                v-model="inputValue"
                                style="width: 80px"
                                size="small"
                                @blur="handleInputConfirm(row,$index)"
                            />
                            <el-button v-else size="small" @click="showInput(row,$index)">
                                + 新增
                            </el-button>
                        </template>
                    </el-table-column>
<!--                    单词点击同步问题-->
                    <el-table-column label="操作">
                        <template #default="{row,$index}">
                            <el-button type="danger" :icon="Delete" @click="removeAttr(row,$index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>

        <el-button @click="onSave">保存</el-button>
        <el-button @click="cencal">取消</el-button>
    </div>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, onMounted, ref, computed, nextTick, watch} from 'vue'
import {STATUS} from "@/views/product/spu/index.vue";
import type {
    tradeMarks,
    saleAttrs,
    recordType,
    spuImgModels,
    spuSale,
    saveSale,
    formSale,
    spuImgModel
} from "@/api/interfaces";
import spaApi from '@/api/spu'
import {Delete, Edit, Top, Share,InfoFilled, Bottom,Plus} from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile ,ElInput } from 'element-plus'
import {ElMessage} from "element-plus";
import useCategoryStore from "@/stores/category";
import Pubsub from 'pubsub-js'
import lodash from "lodash";
const category=useCategoryStore()
//品牌属性
const tradeMark=ref<tradeMarks>([])
//销售属性
const saleAttr=ref<saleAttrs>([])
//初始化表单模板数据
const init=():saveSale=>({
    category3Id:undefined,
    description:undefined,
    spuImageList:[],
    spuName:'',
    spuSaleAttrList:[],
    tmId:undefined
})



//创建一个常量接受表单数据
const spuFrom=ref(init())
//图片地址
const dialogImageUrl = ref('')
// 显示隐藏
const dialogVisible = ref(false)
//图片提交地址
const action=`${import.meta.env.VITE_API_URL}/admin/product/upload`
//绑定一个数组
const spuImg=ref<spuImgModels>()
//属性值列表
const saleValueList=ref([])

const saleValue=ref('')
//文本显示
const text=ref('还有三条未选择')
//dom挂载后获取品牌和销售属性
//自定义属性值的input
const inputValue = ref('')
const InputRef = ref<InstanceType<typeof ElInput>>()
const baseSaleAttrId=ref()
const inputVisible=ref(true)

// 编辑的回调
const attrInit=(type:string, data:any)=>{
    spuFrom.value.spuSaleAttrList=data
    console.log(data)
}
const imgInit=(type:string, data:any)=>{
    spuImg.value=data
    spuImg.value=spuImg.value?.map(item=>({
        name:item.imgName,
        url:item.imgUrl,
        response:{data:item.imgUrl},
        imgName:item.imgName,
        imgUrl:item.imgUrl,
    }))
    console.log(data)
}
Pubsub.subscribe('attrinit',attrInit)
Pubsub.subscribe('imginit',imgInit)
//获取props和自定义事件
const props=defineProps<{
    modelValue:number
}>()
const emit=defineEmits<{
    (e:'update:modelValue',status:number):void
}>()
//方法区域

//获取品牌下拉框 列表数据
const getSpuForm=async ()=>{
    try {
        let result = await spaApi.getTrademarkList()
        tradeMark.value=result
    }catch (e){
        ElMessage.error('获取品牌失败')
    }
}
//获取销售属性 数据
const getAttrList=async ()=>{
    try {
        let result=await spaApi.baseSaleAttrList()
        saleAttr.value=result
    }catch (e){
        ElMessage.error('获取销售属性失败')
    }

}
//删除图片的回调
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}
//图片预览
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    //感叹号为了不飘红
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
//图片上传成功的回调
const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile,uploadFiles) => {
    console.log(uploadFiles)
    let result=uploadFiles.map(item=>({
        imgName:item.name,
        name:item.name,
        response:item.response,
        imgUrl:(item.response as any).data,
        url:(item.response as any).data,

    }))
    spuImg.value=result
    spuFrom.value.spuImageList=spuImg.value
}

//状态改变的回调
const saleChange=()=>{
    let result=saleValue.value.split('-')[1]

}
// 添加属性名到表格
const addSale=()=>{
    if(!saleValue.value) return
    let result=saleValue.value.split('-')[0]
    let data=saleValue.value.split('-')[1]
    let index=saleValue.value.split('-')[2]
    let saleList={baseSaleAttrId:result,saleAttrName:data,inputVisible:false,spuSaleAttrValueList:[]}
    spuFrom.value.spuSaleAttrList?.push(saleList)
    saleAttr.value.splice(Number(index),1)
    saleValue.value=''
}
// 通过计算属性获取获取销售属性
const saleList=computed({
    get(){
        if(saleAttr.value.length!=0){
            return `还剩${saleAttr.value.length}条数据未选择`
        }else {
            return `没有啦！！！`
        }

    },
    set(nva){
        saleList.value=nva
    }
})

//删除tag的回调
const handleClose = (row: spuSale[],id:number) => {
    row.splice(id, 1)

}

const showInput = (row:formSale,index:number) => {
    row.inputVisible=true
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })

}

const handleInputConfirm = (row:formSale,index:number) => {

    if (inputValue.value) {
        let result={baseSaleAttrId:row.baseSaleAttrId,saleAttrName:inputValue.value,saleAttrValueName:inputValue.value}
        row.spuSaleAttrValueList?.push(result)
        console.log(row.spuSaleAttrValueList)

    }
    row.inputVisible=false
    inputVisible.value = false
    inputValue.value = ''
}
//删除表格中对应数据
const removeAttr=(row:spuSale,index:number)=>{
    spuFrom.value.spuSaleAttrList?.splice(index,1)
    saleAttr.value.splice(index,0,{id:row.baseSaleAttrId,name:row.saleAttrName})
}
const onSave=async ()=>{
    try {
        console.log(spuFrom.value)
        await spaApi.onSave(spuFrom.value)
        emit('update:modelValue',1)
        Pubsub.publish('getPageInit','s')
        cencal()
    }catch (e){
        ElMessage.error(e)
    }
}
watch(()=>category.category3Id,(nvl,ovl)=>{
    spuFrom.value.category3Id=nvl

},{immediate:true})
const cencal=()=>{
    spuFrom.value=init()
    spuImg.value=[]
    emit('update:modelValue',1)
}

onMounted(()=>{
    getSpuForm()
    getAttrList()
})

</script>

<style scoped>

</style>
