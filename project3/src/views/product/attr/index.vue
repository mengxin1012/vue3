<template>
  <div>
    <el-card class="mb-10">
      <CategorySelector :disabled="isEdit"></CategorySelector>
    </el-card>
    <el-card>
      <!-- 列表展示 -->
      <div v-show="!isEdit">
        <!-- <el-button type="primary" :icon="Plus" :disabled="!categoryStore.category3Id" @click="isEdit = true">添加属性</el-button> -->
        <el-button class="mb-10" type="primary" :icon="Plus" @click="isEdit = true">添加属性</el-button>

        <el-table :data="attrList" border>
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column label="属性名" property="attrName" width="160"></el-table-column>
          <el-table-column label="属性值列表">
            <template #default="{ row, $index }">
              <el-tag class="mr-10" type="success" v-for="attrVal in row.attrValueList">
                {{ attrVal.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row, $index }">
              <el-button type="warning" :icon="Edit" size="small" title="修改" @click="editAttr(row)"></el-button>
              
              <el-popconfirm :title="`确认要删除[${ row.attrName }]吗?`" @confirm="deleteAttr(row)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" size="small" title="删除"></el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 编辑模式 -->
      <div v-show="isEdit">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrForm.attrName" placeholder="输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <div class="mb-10">
          <el-button type="primary" :disabled="!attrForm.attrName" @click="addAttrVal">添加属性值</el-button>
          <el-button @click="onCancelSave">取消</el-button>
        </div>
        <el-table :data="attrForm.attrValueList" border class="mb-10">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{ row, $index }">
              <!-- 这里使用v-if 不能使用v-show 按下不表 -->
              <el-input v-if="row.inputVisible" ref="inputRef" type="text" v-model="row.valueName" size="small" @blur="inputBlur(row, $index)" />
              <div v-else @click="inputFocus(row)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ row, $index }">
              <el-popconfirm :title="`确定要删除[${ row.valueName }]吗?`" @confirm="removeAttrVal(row, $index)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" size="small" title="删除"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-button type="primary" :disabled="!(attrForm.attrName && attrForm.attrValueList.length)" @click="onSave">保存</el-button>
          <el-button @click="onCancelSave">取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
分析:
1. 三级联动 - 用组件去做(全局公用组件)
  1.1 静态搭建
  1.2 接口做好 - 去查看接口返回的数据,使用TS限制数据格式
  1.3 数据展示 - 交互
  1.4 当选择完3id的时候(如何让attr组件知道,3id有值了) - 有两个交互
    按钮可用
    获取主体内容列表展示数据
2. 主体内容
  2.1 把编辑和列表展示切换搞定 - 三级分类的禁用
  ---------------------------------------------
  2.2 准备api
  2.2 列表展示页
    静态展示
    调用接口拿数据,展示数据
  2.3 新增/编辑页面
    静态展示
    新增 - 收集数据 - 声明一个变量来收集数据 - 做新增
      收集属性名,v-model直接绑定收集即可
      添加属性值禁用状态 ->  当属性名有值的时候,才可以点击 '添加属性值' 
      点击'添加属性值'交互 -> 点击添加完属性值,表格多一行(这个行的数据要先关注,至于交互 放一放)
      删除属性值 -> 点击删除这一行的时候,表格删除掉这行的数据
      保存按钮禁用状态 -> 保存按钮-只有属性名和属性值列表都有值,才能点
    编辑回显
      深拷贝数据 给form表单即可
    调用接口,保存数据
      一定要校验数据的合法性,不能让空值保存了
  2.4 删除
    删除主界面的数据
  ----------------------------------------
  2.5 新增/编辑
    需求:点击属性值表格中属性值名称列要切换状态,并且可以输入内容
    1. 需要一个控制切换 input 和 div 的一个值 - boolean
    2. 再输入input的时候一个值去记录输入的内容 - 将会展示到只读状态的显示
        这个值我们已经有了,在添加属性值表格的时候,默认我们给了个值
    ----
    这里需要做的事情还有很多(需求):
    1. 默认新增需要展示input,不应该展示div - 且input要聚焦
    2. 在输入内容的时候,不能有重复属性值
    3. 让页面中始终最多只有一个input
      (--按下不表 -- 因为这里我们只使用了一个变量 inputRef 来收集这个组件实例 - 这里永远获取到的是当前显示的那一个input)
    步骤:
    1. 添加 inputVisible 这个数据(在添加属性值列表的时候,同时加上这个数据) - ts限制类型中也需加
    2. 通过模板中点击div和input失焦 来 切换 inputVisible 的值
    3. 在input失焦的时候  inputVisible为false  input隐藏的时候,做了限制条件
      3.1 当输入内容为空的时候,把之前的添加的新数据干掉
      3.2 当输入内容和已存在内容重复的时候,,把之前的添加的新数据干掉
      3.3 然后让 inputVisible变为false
    4. 在聚焦的时候 - 点击div的时候,新增数据的时候也应该自动聚焦
      使用 nextTick 等待DOM更新完毕之后,才能获取到input框 然后调用聚焦
*/
import { Plus, Delete, Edit } from '@element-plus/icons-vue'
import { useCategoryStore } from '@/stores/category'
import attrApi, { type AttrModel, type AttrValueModel } from '@/api/attr'
import { watch, ref, nextTick } from 'vue';
import { ElMessage, type InputInstance } from 'element-plus';
import { cloneDeep } from 'lodash';
const inputRef = ref<InputInstance>(); // 限制类型,告诉我们获取到的是一个 el-input 的组件实例

const categoryStore = useCategoryStore();
// 切换编辑状态
const isEdit = ref(false); // 页面是否是编辑状态

// 新增收集数/编辑回显数据
const initAttrForm = () => ({
  attrName: '',
  attrValueList: [],
  categoryId: undefined, // 在保存之前校验一下去赋值(初始化的时候赋值也可以)
  categoryLevel: 3
})
const attrForm = ref<AttrModel>(initAttrForm())

// 添加属性值回调
const addAttrVal = () => {
  attrForm.value.attrValueList.push({
    valueName: '', // 空是对的,但是没法保存,随便写先写死,在表格属性值名称列交互的时候,具体修改 放一放
    // 这里新增一个前端本地使用的切换 属性值只读/编辑的布尔值
    inputVisible: true
  })

  // 需要让input聚焦
  nextTick(() => {
    inputRef.value?.focus();
  })
}
// input聚焦
const inputFocus = (row: AttrValueModel) => { // 点击div触发的
  row.inputVisible = true; // 然input显示的
  // 需要让input聚焦
  nextTick(() => {
    // 数据改变等待DOM,DOM更新异步的,inputRef在获取实例的时候,这个组件实例必须存在才能获取到
    // 由于DOM更新是异步的,这里直接拿,拿不到el-input这个组件,需要等DOM更新完成
    inputRef.value?.focus();
  })
}
// input失焦 - 编辑属性值
const inputBlur = (row: AttrValueModel, index: number) => {
  // 失焦的时候,如果有值,切换显示div
  //            如果没有值,把之前的添加的数据干掉
  if (row.valueName) {
    // 切换 - 在切换的时候,这个值已存在呢? 当有重复的内容的时候,给提示,并且把刚刚添加的给干掉
    // 重复
    const isRepate = attrForm.value.attrValueList.some((item, idx) => {
      if (idx != index) { // 不能拿自己和自己做判断,所以需要一个下标限制
        return item.valueName == row.valueName
      }
    })
    if (isRepate) {
      ElMessage.error('输入的属性值由重复,请重试')
      attrForm.value.attrValueList.splice(index, 1);
      return
    }

    row.inputVisible = false;
  } else {
    // 删除空的
    attrForm.value.attrValueList.splice(index, 1);
  }
}

// 删除属性值回调
const removeAttrVal = (row: AttrValueModel, index: number) => {
  // db check
  attrForm.value.attrValueList.splice(index, 1);
}

// 编辑回显数据
const editAttr = (row: AttrModel) => {
  attrForm.value = cloneDeep(row); // 回显数据
  isEdit.value = true; // 显示编辑页
}

// 保存
const onSave = async () => {
  // 校验合法性 - 属性名 和 属性值列表 必须存在才能保存
  if ( !(attrForm.value.attrName && attrForm.value.attrValueList.length) ) {
    ElMessage.error('[属性名] 和 [属性值列表] 必须有值');
    return
  }
  // 给保存的数据赋 分类的id 值
  if (!attrForm.value.categoryId) { // 新增没有这个值,编辑有这个值
    attrForm.value.categoryId = categoryStore.category3Id;
  }
  // 调接口
  try {
    await attrApi.save(attrForm.value);
    ElMessage.success('保存成功'); // 给个提示
    onCancelSave(); // 显示列表页,重置表单数据
    getList(); // 获取数据
  } catch (error) {
    console.error(error);
    ElMessage.error('保存失败');
  }
}

// 取消
const onCancelSave = () => {
  // 重置表单数据
  attrForm.value = initAttrForm();
  // 显示主页列表
  isEdit.value = false;
}


// 删除主界面数据
const deleteAttr = async (row: AttrModel) => {
  try {
    await attrApi.delete(row.id as number);
    ElMessage.success('删除成功'); // 提示
    getList(); // 重新获取数据
  } catch (error) {
    console.error(error);
    ElMessage.error('删除失败');
  }
}





// 列表展示数据
const attrList = ref<AttrModel[]>();
// 获取数据
const getList = async () => {
  try {
    const { category1Id, category2Id, category3Id } = categoryStore;
    let result = await attrApi.getAttrInfoList(category1Id as number, category2Id as number, category3Id as number);
    attrList.value = result;
  } catch (error) {
    console.error(error);
    ElMessage.error('获取平台属性列表失败');
  }
}
// 监听获取到3id的变化,列表展示数据
watch(() => categoryStore.category3Id, async (nval) => {
  // 获取数据
  if (!nval) {
    attrList.value = []
    return
  }
  getList();
}, { immediate: true })







// 深拷贝总结
// 原始数据
// const obj = {
//   name: '张三',
//   age: 33,
//   fun: { // 这个地址不会改变
//     run: '跑的快',
//     eat: '吃得多'
//   }
// }
// 1. Object.assign({}, obj)  只能拷贝第一层,第二层的对象没有办法拷贝
// const obj1 = Object.assign({}, obj);
// 2. 扩展运算符 - 只能拷贝第一层,第二层的对象没有办法拷贝
// const obj1 = {
//   ...obj
// }
// 3. 使用json拷贝 - 数组和对象都没问题,函数不行
// const obj1 = JSON.parse(JSON.stringify(obj));
// 4. 使用第三方(lodash - cloneDeep) - 或者自己写递归去拷贝(面试的时候可能会手写 - 面试精讲准本)



</script>

<style scoped>

</style>