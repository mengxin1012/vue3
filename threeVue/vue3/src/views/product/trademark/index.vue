<template>
    <div>
        <!-- Form -->
        <el-button :icon="Search" type="primary"  @click="dialogFormVisible = true"
        >添加</el-button
        >
        <el-dialog v-model="dialogFormVisible" title="添加品牌" @close="reset">
            <el-form :model="tradeLists" :rules="rules" ref="ruleFormRef">
                <el-form-item label="品牌名称" placeholder="请输入品牌" :label-width="formLabelWidth" prop="tmName">
                    <el-input v-model="tradeLists.tmName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="品牌LOGO" prop="logoUrl">
                    <el-upload
                        class="avatar-uploader"
                        :action="action"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                    >
                        <img v-if="tradeLists.logoUrl" :src="tradeLists.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                </el-form-item>

            </el-form>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="reset">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
      </span>
            </template>
        </el-dialog>

        <el-table :data="tradeFrom" >
            <el-table-column label="序号" type="index" width="120" align="center"/>
            <el-table-column label="名称" index="index" prop="tmName" />
            <el-table-column label="LOGO图片" >
                <template #default="{row}">
                    <img :src="row.logoUrl" style="width: 80px"/>
                </template>
            </el-table-column>
            <el-table-column label="编辑">
                <template #default="{row,$index}">
                    <el-button type="" @click="handleEdit($index, row)">修改</el-button>
                    <el-button type="danger" @click="handleDelete($index, row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
<!--        分页器-->
        <div class="demo-pagination-block">
            <el-pagination
                v-model:currentPage="pageNo"
                v-model:page-size="limit"
                :page-sizes="[3, 6, 9, 12]"
                layout="prev,pager,next,jumper,->,sizes,total"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>



</template>

<script lang="ts" setup>
import {computed, ref, reactive, onMounted} from 'vue'
import type { UploadProps } from 'element-plus'
import { ElMessage ,ElMessageBox,type FormRules,type FormInstance} from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import tradeApi from '@/api/trademarkpage'
import type {trademarkList, tradeMarkLists} from "@/api/interfaces";
import lodash from 'lodash'
const action=`${import.meta.env.VITE_API_URL}/admin/product/upload`
//获取form实例
const ruleFormRef = ref<FormInstance>()
//添加图片
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    console.log(response)
    tradeLists.value.logoUrl = response.data
    ruleFormRef.value?.validateField("logoUrl",(valid)=>{})
}
//设置效验规则
const rules=reactive<FormRules>({
    tmName: [
        {required: true, message: '请输入品牌名称', trigger: 'blur'},
        {min: 2, message: '名称长度不能小于2', trigger: 'blur'},
    ],
    logoUrl: [
        {
            required: true,
            message: '请上传图片',
            trigger: 'change',
        },
    ],
})
//submitForm(ruleFormRef)
//效验数据
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            PostSave()
        } else {
            console.log('error submit!', fields)
        }
    })
}




//保存数据
const PostSave=async ()=>{
    if(tradeLists.value.id){
        //调用edit接口
        await tradeApi.edit(tradeLists.value)
    }else {
        //调用save接口
        await tradeApi.save(tradeLists.value)
    }
    tradeLists.value=resetTrade()
    reset()
    getTradeList()
}
//取消的方法
const reset=()=>{
    dialogFormVisible.value = false
    tradeLists.value=resetTrade()
    getTradeList()
}
//上传图片之前的效验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('图片必须是JPG格式')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片不能大于2m')
        return false
    }

    return true
}


const dialogFormVisible = ref(false)
//点击修改按钮的回调
const handleEdit = (index: number, row: trademarkList) => {
    dialogFormVisible.value=true
    tradeLists.value=lodash.cloneDeep(row)
    console.log(tradeLists.value==row)

}
//点击删除的回调
const handleDelete = async (index: number, row: trademarkList) => {
    try {
        await ElMessageBox.confirm(
            '您将要删除您的品牌属性',
            '确认删除吗',
            {
                confirmButtonText: 'OK',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        await tradeApi.delete(row.id as number)
        getTradeList()
    }catch (e){
        if(e=='cancel') return
        ElMessage.error('删除失败')
    }
}
//初始化对话框数据
const resetTrade=()=>({
    id:0,
    tmName:'',
    logoUrl:''
})
//每个品牌的数据 id 名称 logo
const tradeLists=ref<trademarkList>(resetTrade())
//返回的整个页面的数据
const tradeFrom=ref<tradeMarkLists>()
//获取页面需要的数据
const getTradeList=async ()=>{
    let result=await tradeApi.pageModel(pageNo.value,limit.value)
    tradeFrom.value=result.records
    total.value=result.total
}
//挂载后的回调
onMounted(()=>{
    //发请求获取数据
    getTradeList()
})

//分页器
//总条数
const total=ref(0)
//当前页数
const pageNo=ref(1)
//每页展示条数
const limit=ref(3)
//每页显示几条的下拉框
const handleSizeChange = (val: number) => {
    limit.value=val
    getTradeList()
}
//切换页面时触发的回调
const handleCurrentChange = (val: number) => {
    pageNo.value=val
    getTradeList()
}
</script>

<style scoped>
.el-button--text {
    margin-right: 15px;
}
.el-select {
    width: 300px;
}
.el-input {
    width: 300px;
}
.dialog-footer button:first-child {
    margin-right: 10px;
}
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
