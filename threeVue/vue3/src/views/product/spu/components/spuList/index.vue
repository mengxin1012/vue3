<template>
    <div v-if="modelValue==STATUS.SPULIST">


        <!--    表格-->
        <el-button type="primary" @click="emit('update:modelValue',2)">添加SPU</el-button>

        <el-table :data="spuList?.records" style="width: 100%">
            <el-table-column label="序号" type="index" align="center" width="80"/>
            <el-table-column label="SPU名称" prop="spuName" />
            <el-table-column label="SPU描述" prop="description" />
            <el-table-column label="操作" align="center">
                <template #default="{$index,row}">
                    <el-tooltip content="'下床'">
                        <el-button size="small" type="success" :icon="Plus" @click="handleSave($index, row)"></el-button>
                    </el-tooltip>
                    <el-tooltip content="编辑">
                        <el-button size="small" type="primary" @click="handleEdit($index,row)" :icon="Edit"></el-button>
                    </el-tooltip>
                    <el-tooltip content="详细数据展示">
                        <el-button size="small" type="info" @click="handleShare($index,row)" :icon="InfoFilled"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除">
                        <el-popconfirm
                            confirm-button-text="确认"
                            cancel-button-text="取消"
                            :title="`你确认删除吗`"
                            @confirm="handleDelete($index,row)"
                        >
                            <template #reference>
                                <el-button size="small" type="danger" :icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </el-tooltip>
                </template>


            </el-table-column>
        </el-table>


        <!--    分液器-->
        <div class="demo-pagination-block">
            <el-pagination
                v-model:currentPage="page"
                v-model:page-size="limit"
                :small="small"
                :disabled="disabled"
                :background="background"
                :page-sizes="[3, 6, 9, 12]"
                layout="prev,pager,next,jumper,->,sizes,total"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>



</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useCategroyStore from "@/stores/category";
import {ElMessage} from "element-plus";
import type {pageList ,saveSale} from "@/api/interfaces";
import {reactive, defineEmits, defineProps, watch, onMounted} from "vue";
import {Delete, Edit, Top, Share,InfoFilled, Bottom,Plus} from '@element-plus/icons-vue'
import {STATUS} from '../../index.vue'
import spuApi from '@/api/spu'
import Pubsub from 'pubsub-js'
const prop=defineProps<{
modelValue:number
}>()
const emit=defineEmits<{
    (e:'update:modelValue',status:number):void
}>()
const flags=ref(STATUS.SPULIST==prop.modelValue)
// const formInline = reactive({
//     user: '',
//     region: '',
// })

const onSubmit = () => {
    console.log('submit!')
}
const handleSizeChange=(nvl:number)=>{
    limit.value=nvl
    getPage()
}
const handleCurrentChange=(nvl:number)=>{
    console.log(nvl)
    page.value=nvl
    getPage()

}

//表格代码

const cateStore=useCategroyStore()
// interface User {
//     date: string
//     name: string
//     address: string
// }
const handleShare=($index:number,row:saveSale)=>{
    emit('update:modelValue',3)
}


const handleEdit = async (index: number, row: saveSale) => {
    try {
        let spuSaleAttrList=await spuApi.updateSaleAttr(row.id as number)
        let spuImageList=await spuApi.updateImg(row.id as number)
        Pubsub.publish('attrinit', spuSaleAttrList)
        Pubsub.publish('imginit', spuImageList)
        emit('update:modelValue',2)
    }catch (e){
        ElMessage.error('获取图片事变')
    }
}


const handleDelete = (index: number, row: saveSale) => {
    console.log(index, row)
}

const page=ref(1)
const limit=ref(3)
const total=ref()
// 列表渲染
const spuList=ref<pageList>()
const getPage=async ()=>{
    try {
        let result=await spuApi.getPage(page.value,limit.value,cateStore.category3Id!)
        spuList.value=result
        total.value=result.total
    }catch (e){
        ElMessage.error('获取失败')
    }
}
watch(()=>cateStore.category3Id,(nval,oval)=>{
    if(nval){
        getPage()
    }
},{immediate:true})
const getPageInit=()=>{
    getPage()
}
Pubsub.subscribe('getPageInit', getPageInit)
onMounted(()=>{
    getPage()


})
</script>

<style scoped>

</style>
