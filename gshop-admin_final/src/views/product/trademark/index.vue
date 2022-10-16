<template>
  <el-card shadow="hover">
    <template #header>
      <el-button @click="showAddDialog" type="primary" size="default" icon="ele-Plus">添加</el-button>
    </template>

    <el-table border :data="trademarkList">
      <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template v-slot="{row,$index}">
          <el-image :src="row.logoUrl" style="width:100px;height:60px"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row,$index}">
          <el-button type="warning" size="small" icon="ele-Edit" @click="showUpdateDialog(row)">修改</el-button>
          <el-button type="danger" size="small" icon="ele-Delete" @click="deleteTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      style="margin-top:20px"
      v-model:currentPage="page"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 10]"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getTrademarkList"
    />
    <el-dialog v-model="dialogFormVisible" :title="tmForm.id?'修改品牌':'添加品牌'">
      <el-form style="width:80%" :rules="rules" :model="tmForm" ref="tmFormRef">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/app-dev/admin/product/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                上传的图片必须是jpg且不能大于2M
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addOrUpdate"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
export default defineComponent({
  name: 'Trademark'
})
</script>
<script lang="ts" setup>
// import trademarkAPI from '@/api/trademark'
import  { type TrademarkData, default as trademarkAPI } from '@/api/trademark'
import {ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadProps} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'


const page = ref(1)
const limit = ref(3)
const trademarkList = ref<TrademarkData[]>([])
const total = ref(0)
const dialogFormVisible = ref(false)
const tmForm = ref<TrademarkData>({
  tmName:'',
  logoUrl:''
})

const tmFormRef = ref<FormInstance>()

const rules = ref<FormRules>({
  tmName: [
    { required: true, message: '品牌名称必须输入', trigger: 'blur' },
    // { min: 2, max: 10, message: '长度必须是2-10', trigger: 'change' },
    { validator: validateTmName, trigger: 'change' }
  ],
  logoUrl: [
    {
      required: true,
      message: '必须上传图片',
      trigger: 'change',
    },
  ],
})

// 自定义校验规则

function validateTmName(rule: any, value: any, callback: any){
  if(value.length >= 2 && value.length <= 10){
    callback()
  }else{
    callback(new Error('品牌名称长度必须2-10之间'))
  }
}

onMounted(() => {
  getTrademarkList()
})

const getTrademarkList = async (pager = 1) => {
  page.value = pager
  try {
    const result = await trademarkAPI.getPageList(page.value,limit.value)
    trademarkList.value = result.records
    total.value = result.total
  } catch (error) {
    ElMessage.error('获取品牌列表失败')
  }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  tmForm.value.logoUrl = response.data
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const showAddDialog = () => {
  dialogFormVisible.value = true
  tmForm.value = {
    logoUrl:'',
    tmName:""
  }
  tmFormRef.value?.clearValidate()
}

const showUpdateDialog = (row: TrademarkData) => {
  dialogFormVisible.value = true
  tmForm.value = {...row}
}

const addOrUpdate = async () => {
  const trademark = tmForm.value
  try {
    const valid = await tmFormRef.value?.validate()
    if(valid){
      try {
        await trademarkAPI.addOrUpdate(trademark)
        ElMessage.success(trademark.id?'修改品牌成功':'添加品牌成功')
        dialogFormVisible.value = false
        getTrademarkList(trademark.id?page.value:1)
      } catch (error) {
        ElMessage.error(trademark.id?'修改品牌失败':'添加品牌失败')
      }
    }else{
      ElMessage.error('校验不通过')
    }
  } catch (error) {
    
  }
  
  
}

const deleteTrademark = (row:TrademarkData) => {
   ElMessageBox.confirm(
    `你确定要删除${row.tmName}吗？`,
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await trademarkAPI.remove(row.id as number)
        ElMessage.success('删除品牌成功')
        getTrademarkList(trademarkList.value.length > 1?page.value:page.value - 1)
      } catch (error) {
        ElMessage.success('删除品牌失败')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}



</script>

<style scoped>
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