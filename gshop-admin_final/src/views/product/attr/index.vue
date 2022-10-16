<template>
  <div>
    <el-card>
      <CategorySelector :disabled="!isShowList"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <div v-if="isShowList">
        <el-button @click="showAddDiv" :disabled="!categoryStore.category3Id" type="primary" size="default" icon="ele-Plus">添加属性</el-button>
        <el-table :data="attrList" border>
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column label="属性名称" width="150" prop="attrName">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template v-slot="{ row, $index }">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id">
                {{attrValue.valueName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template v-slot="{row,$index}">
              <el-button type="warning" size="small" icon="ele-Edit" title="修改" @click="showUpdateDiv(row)"></el-button>
              <el-popconfirm :title="`你确定要删除${row.attrName}吗？`" @confirm="deleteAttr(row)">
                <template #reference>
                  <el-button type="danger" size="small" icon="ele-Delete" title="删除"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div v-else>
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input @blur="checkRepeat" clearable v-model="attrForm.attrName" placeholder="输入属性名"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" :disabled="!attrForm.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>
        <el-table border style="margin-top:20px" :data="attrForm.attrValueList">
          <el-table-column label="序号" type="index" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="{row,$index}">
              <el-input ref="inputRef" @blur="toLook(row,$index)" @keyup.enter="toLook(row,$index)" v-if="row.isEdit" v-model="row.valueName" placeholder="输入属性值名称" size="small"></el-input>
              <span v-else @click="toEdit(row)">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{row,$index}">
              <el-popconfirm :title="`你确定要删除${row.valueName}`" @confirm="deleteAttrValue($index)">
                <template #reference>
                  <el-button type="danger" size="small" icon="ele-Delete" title="删除属性值"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="save" type="primary" :disabled="!attrForm.attrValueList.length">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import { watch,nextTick,computed,defineComponent, ref} from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
export default defineComponent({
  name: 'Attr'
})
</script>

<script lang="ts" setup>

import { useCategoryStore } from '@/stores/category'
import attrApi from '@/api/attr'
import type { AttrData,AttrValueData } from '@/api/attr'
import cloneDeep from 'lodash/cloneDeep'

const inputRef = ref<HTMLInputElement>()

const categoryStore = useCategoryStore()
const attrList = ref<AttrData[]>([])
const isShowList = ref(true)
const attrForm = ref<AttrData>({
  attrName: "",
  attrValueList: [
    // {
    //   "attrId": 0,
    //   "valueName": "string"
    // }
  ],
  categoryId: 0,
  categoryLevel: 3,
})

const getAttrList = async () => {
  const { category1Id, category2Id, category3Id } = storeToRefs(categoryStore)
  try {
    const result = await attrApi.getList(
      category1Id.value as number,
      category2Id.value as number,
      category3Id.value as number
    )
    attrList.value = result
  } catch (error) {
    ElMessage.error('获取属性列表失败')
  }

}
watch(() => categoryStore.category3Id, (newVal, oldVal) => {
  if (!categoryStore.category3Id){
    attrList.value = []
    return 
  }
  getAttrList()
},{immediate:true})


const showAddDiv = () => {
  isShowList.value = false
  attrForm.value = {
    attrName: "",
    attrValueList: [
    ],
    categoryId: categoryStore.category3Id as number,
    categoryLevel: 3,
  }
}

const showUpdateDiv = (row:AttrData) => {
  isShowList.value = false
  attrForm.value = cloneDeep(row)
  attrForm.value.attrValueList.forEach(item => item.isEdit = false)
}

const addAttrValue = () => {
  attrForm.value.attrValueList.push({
    attrId: attrForm.value.id as number,
    valueName: "",
    isEdit:true
  })
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const toEdit = (row:AttrValueData) => {
  row.isEdit = true
  nextTick(() => {
    inputRef.value?.focus()
  })
} 

const toLook = (row:AttrValueData,index:number) => {
  if(!row.valueName || !row.valueName.trim()){
    attrForm.value.attrValueList.splice(index,1)
    return 
  }
  let isRepeat = attrForm.value.attrValueList.some(item => {
    if(item !== row){
      return item.valueName === row.valueName
    }
  })
  if(isRepeat){
    ElMessage.error('属性值不能重复!!!')
    row.valueName = ''
    return 
  }
  row.isEdit = false
}

const checkRepeat = (event:FocusEvent) => {
  let isRepeat = attrList.value.some(item => item.attrName === attrForm.value.attrName)
  if(isRepeat){
    ElMessage.error('属性已经存在')
    attrForm.value.attrName = ''
    
  }
}


const save = async () => {
  let attr = attrForm.value

  attr.attrValueList.filter(item => {
    if(item.valueName !== '' && item.valueName.trim() !== ''){
      delete item.isEdit
      return true
    }
  })

  try {
    await attrApi.addOrUpdate(attr)
    ElMessage.success('保存属性成功')
    isShowList.value = true
    getAttrList()
  } catch (error) {
    ElMessage.error('保存属性失败')
  }
}


const deleteAttrValue = (index:number) => {
  attrForm.value.attrValueList.splice(index,1)
}

const deleteAttr = async (row:AttrData) => {
  try {
    await attrApi.remove(row.id as number)
    ElMessage.success('删除属性成功')
    getAttrList()
  } catch (error) {
    ElMessage.error('删除属性失败')
  }
}
</script>

<style lang="less" scoped>
</style>
