<template>
    <div>
        <el-table border :data="skuInfos?.records" style="width: 100%">
            <el-table-column label="序号" type="index" align="center" width="80"/>
            <el-table-column label="名称" prop="skuName"/>
            <el-table-column label="描述" prop="skuDesc"/>
            <el-table-column label="默认图片">
                <template #default="{row}">
                    <img :src="row.skuDefaultImg" style="width: 120px"/>
                </template>
            </el-table-column>
            <el-table-column label="重量 (KG)" prop="weight"/>
            <el-table-column label="价格 (元)" prop="price"/>
            <el-table-column label="操作" align="center">
                <template #default="{$index,row}">
                    <el-tooltip :content="row.isSale?'下床':'上床'">
                        <el-button size="small" :type="row.isSale?'success':'info'" @click="handleSave($index, row)"
                                   :icon="row.isSale?Top:Bottom"></el-button>
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

        <el-drawer
            v-model="drawer"
            title="I am the title"
            :direction="direction"
            :before-close="handleClose"
            size="50%"
        >
            <div>名称:<span>{{data.skuName}}</span></div>
            <div>描述:<span>{{data.skuDesc}}</span></div>
            <div>价格:<span>{{data.skuDesc}}</span></div>
            <div>平台属性:<span v-for="list in data.skuAttrValueList"><el-tag>{{list.attrName}}-{{list.valueName}}</el-tag></span></div>
            <div>销售属性:<span v-for="li in data.skuSaleAttrValueList"><el-tag>{{li.saleAttrName}}-{{li.saleAttrValueName}}</el-tag></span></div>
            <div>商品图片:<span v-for="img in data.skuImageList"><img :src="img.imgUrl" style="width: 120px"/></span></div>
        </el-drawer>

        <!--    分液器-->
        <div class="demo-pagination-block">
            <el-pagination
                v-model:currentPage="skuInfos.current"
                v-model:page-size="skuInfos.size"
                :small="small"
                :disabled="disabled"
                :background="background"
                layout="prev, pager, next, jumper"
                :total="skuInfos.total"
                @current-change="handleSizeChange"

            />
        </div>
    </div>
    <!--    @size-change="handleSizeChange"-->
    <!--    @current-change="handleCurrentChange"-->
</template>


<script setup lang="ts">


//表格代码
import {computed, onMounted, ref} from 'vue'
import skuApi from '@/api/sku'
import type {recordInfo, skuList} from '@/api/interfaces'
import {Delete, Edit, Top, Share,InfoFilled, Bottom} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
const drawer=ref(false)
const data=ref()
const handleShare = async (index: number, row: recordInfo) => {
    let result = await skuApi.skuById(row.id)
    data.value=result
    console.log(result)
    drawer.value=true
}
//x修改
const handleEdit = (index: number, row: recordInfo) => {
    ElMessage.success('正在开发中')
}
//删除
const handleDelete = async (index: number, row: recordInfo) => {
    await skuApi.delet(row.id)
    getSkuList()
}
//保存的回调
const handleSave = async (index: number, row: recordInfo) => {
    if (row.isSale) {
        await skuApi.cance(row.id)
        ElMessage.success('下床成功')
        getSkuList()
    } else {
        await skuApi.onSave(row.id)
        ElMessage.success('上床成功')
        getSkuList()
    }

}
//对话框状态
const dialogVisible = ref(true)
// 页码
const pageNo = ref(1)
//每页条数
const limit = ref(10)
//初始数据
const SkuInfo = () => {
    return {
        current: 1,
        pages: 2,
        records: [],
        searchCount: true,
        size: 10,
        total: 0
    }
}
//切换当前页的时候发请求重新获取数据
const handleSizeChange = () => {
    console.log(skuInfos.value)
    getSkuList()
}
const skuInfos = ref<skuList>(SkuInfo())
//组件切换时获取数据
const getSkuList = async () => {
    let result = await skuApi.getSkuInfo(skuInfos.value.current, skuInfos.value.size)
    skuInfos.value = result
    console.log(skuInfos)
}

onMounted(() => {
    getSkuList()
})
</script>

<style scoped>

</style>
