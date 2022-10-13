<template>
  <el-card>
    <template #header>
      <!-- <el-button type="primary" :icon="Plus" @click="dialogFormVisible = true">添加</el-button> -->

      <!-- <el-button
        v-if="userStore.userinfo.buttons.includes('btn.Trademark.add')"
        type="primary"
        :icon="Plus"
        @click="dialogFormVisible = true"
      >添加</el-button> -->

      <el-button
        v-permissionBtn="`btn.Trademark.add`"
        type="primary"
        :icon="Plus"
        @click="dialogFormVisible = true"
      >添加</el-button>

    </template>
    <!-- 
      html中table表格中tr是行
      element中 el-table-column 表格里面都是列,每一行是数组中的一条数据,每一列是当前这条数据中要展示的字段(就是属性)
      自定义展示内容的时候,需要使用 el-table-column 的插槽,在内部写模板
        通过 #default="{ row, $index }" 可以拿到当前行的数据,可以拿到下标
    -->
    <el-table :data="trademarkList" border class="mb-10">
      <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
      <el-table-column label="品牌名称" property="tmName"></el-table-column>
      <el-table-column label="品牌LOGO" property="logoUrl">
        <template #default="{ row, $index }">
          <img :src="row.logoUrl" style="width: 80px;height: 80px;">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row, $index }">
          <el-button type="warning" :icon="Edit" @click="editTrademark(row, $index)" v-permissionBtn="`btn.Trademark.update`">编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="removeTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      @size-change="handleSizeChange"    每页条数变化回调
      @current-change="handleCurrentChange"   页码变化回调
      这个分页器连续数被省略掉了
    -->
    <el-pagination v-model:currentPage="page" v-model:page-size="limit" :total="total" :page-sizes="[3, 6, 9]"
      layout="prev, pager, next, jumper, -> , sizes, total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
    <!-- 弹窗 -->
    <el-dialog v-model="dialogFormVisible" :title="tmForm.id ? `修改品牌` : `添加品牌`"
      :close-on-press-escape="false" :close-on-click-modal="false" :before-close="beforeClose">
      <!--
        表单在点击保存之前需要校验数据
        校验数据需要两个条件
          1.配置表单的 rules 属性
          2.配置 form-item 的prop属性
        此时表单校验只有变化(失焦 变化)的时候会校验(只有在变化的时候才会触发规则)
        点击保存这个按钮的时候也需要触发校验规则去校验
      -->
      <el-form :model="tmForm" :rules="rules" ref="tmFormRef" style="width: 500px;" label-width="100px">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="tmForm.tmName" placeholder="请输入品牌名称"/>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- 
            点击上传,选择图片后走 :before-upload , 校验图片是否是我们想要的格式和大小
            校验通过会上传至 actions="" 地址
            上传成功之后,返回数据之后会走 :on-success 回调
          -->
          <el-upload
            class="avatar-uploader"
            :action="`${ env }/admin/product/upload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                上传图片必须是jpg且不能大于2M
              </div>
            </template>
          </el-upload>

        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancelSave(tmFormRef)">取消</el-button>
          <el-button type="primary" @click="onSave(tmFormRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<!-- 
步骤:
1. 静态页面搭建
2. 数据展示
  2.1 准备接口 - 根据接口文档拿到返回的数据类型,给api用TS限制类型
  2.2 页面请求数据,展示
3. 交互
  3.1 翻页
  3.2 新增
    3.2.1 弹框的展示,注意里面放的是form表单,收集输入的数据
      收集数据使用 tmForm 这个对象收集数据,这个数据是符合 定义的品牌的interface(接口),有两个值 tmName 和 logoUrl
      首先需要有 tmForm 对象
      3.2.1.1 收集品牌名称
                将 tmForm.tmName 绑定到 input 标签上,使用v-model收集
      3.2.1.2 收集图片 - 文件上传
                图片上传 使用的是 el-upload 组件,点击上传,选择图片后走 :before-upload , 校验图片是否是我们想要的格式和大小
                校验通过会上传至 actions="" 配置的地址
                上传成功之后,返回数据之后会走 :on-success 回调
                在回调当中 收集返回的 url
    3.2.2 点击弹框保存之前应该校验表单
      校验数据需要两个条件
        1.配置表单的 rules 属性
        2.配置 form-item 的prop属性
      此时表单校验只有变化(失焦 变化)的时候会校验(只有在变化的时候才会触发规则)
      点击保存这个按钮的时候 也 需要触发校验规则去校验
    3.2.3 按理来说,现在该点击保存按钮发请求,但是我们发现编辑也使用的这个弹框,也使用的这套校验规则,所以先把编辑做完(在保存之前)
    ----------------------------------------------------------------------------------------------------------------
    3.2.4 点击编辑按钮,弹出弹框,回显表格这一条数据
      当再次点击保存,又走了一个校验规则
      规则通过应该发送请求,更新这一条数据
    3.2.5
      发请求,此时新增应该调用新增的接口,修改应该调用修改的接口,如何区分是新增还是修改?
      新增是没有id的,而修改是有id的,根据id的存在与否来调用不同的接口
  3.3 编辑(略,在新增中)
  3.4 删除
-----
trademark 涉及到的较重要的点
el-table的使用
el-form的使用 - 表单校验
文件上传:
1. 选择本地图片
2. 使用el-upload组件上传这张图片(图片是以二进制的形式上传)
3. 后端会返回一个图片的url (拓展:返回的url是服务器地址拼接的这张图片在服务器中的静态资源位置,一般在企业中图片是有专门的服务)
4. 有url预览没问题
5. 收集 trademerk 表单数据,再次提交创建一个新的trademark

所有要删除数据库数据的操作,都应该来 double check
-->
<script setup lang="ts">
import { Plus, Delete, Edit } from '@element-plus/icons-vue'
import { onMounted, ref, reactive } from 'vue';
import trademarkApi, { type TrademarkListModel, type TrademarkModel } from '@/api/trademark';
import { ElMessage, type UploadProps, type FormRules, type FormInstance, ElMessageBox } from 'element-plus';
import { cloneDeep } from 'lodash'
import { useUserInfoStore } from '@/stores/userInfo'
const env = import.meta.env.VITE_API_URL; // 拿到 '/app-dev' || '/app-prod'
const userStore = useUserInfoStore();

const page = ref(1);
const limit = ref(3);
const total = ref(0);
// 表格展示数据,是一个数组,数组中是每一个trademark
const trademarkList = ref<TrademarkListModel>();

onMounted(() => {
  getPage();
})

// 获取分页数据
const getPage = async () => {
  try {
    let result = await trademarkApi.getPage(page.value, limit.value);
    trademarkList.value = result.records; // 给表格数据赋值
    total.value = result.total; // 总条数
  } catch (error) {
    ElMessage.error('获取品牌分页数据失败');
  }
}

// 分页
const handleSizeChange = (val: number) => { // 每页条数变化
  limit.value = val; // 组装数据
  getPage(); // 发送请求
}
const handleCurrentChange = (val: number) => { // 页码的变化
  page.value = val; // 组装数据
  getPage(); // 发送请求
}



// 新增
const tmFormRef = ref<FormInstance>();
const dialogFormVisible = ref(false); // 控制弹窗的显示和隐藏
const onCancelSave = (formEl: FormInstance | undefined) => {
  formEl?.resetFields(); // 重置校验规则,让报红的地方消失
  tmForm.value = { tmName: '', logoUrl: '' }; // 初始化数据,重置表单
  dialogFormVisible.value = false; // 隐藏弹框
}
const beforeClose = (done: any) => {
  onCancelSave(tmFormRef.value);
}

const onSave = async (formEl: FormInstance | undefined) => { // 类型是element plus 定义好的,引入即可
  if (!formEl) return
  // formEl.validate 调用validate走一遍校验规则
  await formEl.validate(async (valid, fields) => { // valid 是一个布尔值,如果所有的规则校验通过,它为true,否则它为false
    if (valid) {
      // 调接口,发请求
      try {
        await trademarkApi[tmForm.value.id ? 'update' : 'add'](tmForm.value); // 调用接口
        ElMessage.success('保存成功'); // 给个提示
        onCancelSave(formEl); // 关闭弹窗
        getPage(); // 刷新数据
      } catch (error) {
        console.error(error);
        ElMessage.error('保存品牌数据失败,请重试');
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 收集新增数据
const tmForm = ref<TrademarkModel>({
  tmName: '',
  logoUrl: ''
})
// 表单校验规则
const rules = reactive<FormRules>({
  tmName: [
    { required: true, message: '品牌名称必填', trigger: 'blur' },
    { min: 2, message: '最少需要两个字符', trigger: 'blur' },
  ],
  logoUrl: [
    { required: true, message: '品牌LOGP必填', trigger: 'change' },
  ],
})


// 编辑回显数据
const editTrademark = (row: TrademarkModel, index: number) => {
  tmForm.value = cloneDeep(row); // 回显数据  -  需要深拷贝
  dialogFormVisible.value = true; // 显示弹框
}

// 删除
const removeTrademark = async (row: TrademarkModel) => {
  try {
    const res =  await ElMessageBox.confirm(
      `确认要删除[${ row.tmName }]吗?`,
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    // 判断当前页面是不是只有一条数据,如果只有一条数据,需要让页面往前走一页
    if (trademarkList.value?.length == 1 && page.value != 1) {
      page.value -= 1;
    }
    // 调用api
    await trademarkApi.delete(row.id as number); // 删除
    ElMessage.success('删除成功'); // 给个提示
    getPage(); // 重新获取数据
  } catch (error) {}
}




// 弹框form表单的文件上传
// 上传要调用的函数
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  tmForm.value.logoUrl = response.data;
}
// 上传前限制的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片必须是JPG格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片不能大于2M!')
    return false
  }
  return true
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