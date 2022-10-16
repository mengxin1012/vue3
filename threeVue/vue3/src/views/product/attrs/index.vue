<template>
    <div>
<!--        inline变为行内元素.0-->
        <el-card class="md-5">
        <el-form :inline="true" :model="attrList" class="demo-form-inline">
            <el-form-item label="一级分类">
                <el-select v-model="attrList.one" placeholder="品牌" :disabled="flag">
                    <el-option :label="one.name" :value="one.id" v-for="(one,index) in oneType" :key="one.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="attrList.two" placeholder="二级列表" :disabled="flag">
                    <el-option :label="two.name" :value="two.id" v-for="(two,index) in twoType" :key="two.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="attrList.three" placeholder="三级列表" :disabled="flag">
                    <el-option :label="three.name" :value="three.id" v-for="(three,index) in threeType" :key="three.id" />
                </el-select>
            </el-form-item>
        </el-form>
        </el-card>

        <el-button type="primary" @click="addAttr" v-if="!flag" :disabled="!attrList.three">添加属性</el-button>
        <el-table :data="attrs" v-if="!flag">
            <el-table-column label="序号" type="index" prop="date" width="80" align="center"/>
            <el-table-column label="属性名称" prop="attrName" width="120"/>
            <el-table-column label="属性值名称列表">
                <template #default="{$index,row}">
                    <el-tag type="success" v-for="attr in row.attrValueList" :key="attr.id">
                    {{attr.valueName}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
                <template #default="{$index,row}">
                    <el-button type="primary" @click="handleEdit($index, row)" :icon="Edit"></el-button>

                    <el-popconfirm
                        confirm-button-text="确认"
                        cancel-button-text="取消"
                        :title="`你确认删除${row.attrName}吗`"
                        @confirm="deleteList($index, row)"
                    >
                        <template #reference>
                        <el-button type="danger" :icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>


        <el-form v-show="flag">
            <el-form-item>
                <el-input label="属性名" v-model="attrListInit.attrName" placeholder="输入属性名" style="width: 200px"/>
            </el-form-item>

        </el-form>

        <el-button type="primary" @click="addList" v-if="flag" :disabled="attrListInit.attrName.length?false:true">添加属性名</el-button>
        <el-button type="primary" v-if="flag" @click="cencal">取消</el-button>
<!--        添加属性 -->
        <el-table :data="attrListInit.attrValueList" v-if="flag">
            <el-table-column label="序号" width="80" type="index"/>
            <el-table-column label="属性值名称列表" >
                <template #default="{$index,row}">
                    <span v-if="!row.inputChange" @click="inputChange(row)">{{row.valueName}}</span>
<!--                    @blur="blurHandle($index,row)"-->
                    <el-input ref="inputRef" v-model="row.valueName" v-if="row.inputChange" @blur="blurHandle($index,row)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
                <template #default="{$index,row}">
                    <el-button type="danger" @click="handleDelete($index, row)" :icon="Delete" ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" v-show="flag" @click="setAttrList(attrListInit.id)" :disabled="!attrListInit.attrValueList.length">保存</el-button>
        <el-button type="primary" v-show="flag" @click="cencal">取消</el-button>
    </div>



</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, watch} from "vue";
import useAttrsApi from "@/api/attrs";
import {Delete, Edit} from '@element-plus/icons-vue'
import lodash from 'lodash'

//点击可修改
const inputChange=(row:attrValueType)=>{
    row.inputChange=true
    nextTick(()=>{
        console.log(inputRef.value)
        inputRef.value?.focus()
    })


}
//删除输入框数据
const handleDelete=($index:number,row:attrValueType)=>{
    attrListInit.value.attrValueList.splice($index,1)
}
//失焦回调
const blurHandle=($index:number,row:attrValueType)=>{
    row.inputChange=false
    inputType.value=false
    if(!row.valueName.length){
        attrListInit.value.attrValueList.splice($index,1)
        ElMessage.warning('属性名不能为空')
    }
    let result=attrListInit.value.attrValueList.some((item,index)=>{
        if($index!=index){
            return row.valueName==item.valueName
        }
    })
    if(result){
        attrListInit.value.attrValueList.splice($index,1)
        ElMessage.warning('属性名重复，请重新添加')
    }
}


const spanType=ref(false)


//表格代码
import { computed, ref} from 'vue'
import type {oneLists,attrValueType, twoLists, threeLists, selectList,attrType, attrTypes, attrValueTypes} from "@/api/interfaces";
import {ElMessage} from "element-plus";
//修改属性
const handleEdit = (index: number, row: attrType) => {
    flag.value=!flag.value
    if(!inputType.value){
        inputType.value=!inputType.value
    }
    attrListInit.value.attrName=row.attrName
    attrListInit.value=lodash.cloneDeep(row)
    console.log(valueList.value)

}
//列表实例
const inputRef=ref<HTMLInputElement>()

//外层info列表
const attrs=ref<attrTypes>()
//内层名称列表
const attrValue=ref<attrValueTypes>()
//显示隐藏的状态
const flag=ref(false)
//input框的显示隐藏
const inputType=ref(false)
//初始化名称列表
// const valueList=ref<attrValueType>({
// attrId:0,
    // id:0,
const valueList=ref({
    valueName:'',
    inputChange:false
})

const valueLists=ref<attrValueTypes>([])

//初始化添加的数据
const attrListInit=ref<attrType>({
        attrName:'',
        attrValueList:[],
        categoryId: 0,
        categoryLevel: 3,
})
//重置表单数据
const resetAttr=ref<attrType>({
    attrName:'',
    attrValueList:valueLists.value,
    categoryId: 0,
    categoryLevel: 3,
})
//组装数据 貌似多此一举了
const attrLists=ref(attrListInit.value)
//发送请求
const setAttrList=async ()=>{
    console.log('three',attrList.three)
    attrListInit.value.categoryId=(attrs.value[0] as attrType).categoryId
    //通过id判断是添加还是修改
    if(!attrListInit.value.id) {
        // attrListInit.value.attrValueList = lodash.cloneDeep(valueLists.value)
        await useAttrsApi.setAttrList(attrListInit.value)
        //每次发送请求后重置数据
        attrListInit.value = resetAttr.value
        //切换列表显示
        flag.value = !flag.value
        //重新获取列表
        await getAttrLists()
    }else{
        //发送请求添加和修改数据
        await useAttrsApi.setAttrList(attrListInit.value)
        //每次发送请求后重置数据
        attrListInit.value=resetAttr.value
        //重新获取列表
        await getAttrLists()
        //切换列表显示
        flag.value=!flag.value
        //取消后重置数据
        attrListInit.value=resetAttr.value
        attrListInit.value.attrName=''
        valueLists.value=[]
        valueList.value.valueName=''
    }



}
//点击添加属性
const addAttr=()=>{
    if(!flag.value){
        flag.value=!flag.value
    }
    attrListInit.value=lodash.cloneDeep(resetAttr.value)

}
//取消按钮
const cencal=()=>{
    //显示隐藏

    flag.value=!flag.value
    //input的框状态
    if(inputType.value){
        inputType.value=!inputType.value
    }
    //取消后重置数据
    attrListInit.value=resetAttr.value
    // attrListInit.value.attrName=''
    // valueLists.value=[]
    // valueList.value.valueName=''

}
//删除按钮
const deleteList=async (idx:number,row:attrType)=>{

    await useAttrsApi.deleteAttrList(row.id)
    getAttrLists()
}
//点击保存添加列表
const addList=()=>{
    if(!inputType.value){

        inputType.value=!inputType.value
    }
    valueList.value.inputChange=true
    attrListInit.value.attrValueList.push(lodash.cloneDeep(valueList.value))

    nextTick(()=>{
        console.log(inputRef.value)
        inputRef.value?.focus()
    })

//    保存后重置数据

}


//下面是三级联动
const attrList=reactive({
    one:'',
    two: '',
    three:''
})
//三级分类
const getdata=async()=>{
    let result=await useAttrsApi.getCategory1()
    oneType.value=result
}
//监视一级列表的变化
watch(()=>{attrList.one},async (nval,oval)=>{
    // 获取二级列表数据
    if(attrList.one&&!attrList.two){
        let result = await useAttrsApi.getCategory2(Number(attrList.one))
        twoType.value=result
    }

    // 当一级列表和二级列表都有值的时候 且 一级列表发生改变把二级和三级列表清空
    if(attrList.one&&attrList.two){
        attrList.two=''
        attrList.three=''
    }


},{immediate:true,deep:true})
//监视二级列表的变化
watch(()=>{attrList.two},async (nval,oval)=>{
    //当二级列表有值且三级列表有值 并且二级列表发生变化时 将三级列表清空
    if(attrList.two&&attrList.three) {
        attrList.three = ''
        console.log(twoType)
    }
    //发送请求获取三级列表数据
    if(attrList.two){
        let demo=await useAttrsApi.getCategory3(Number(attrList.two))
        threeType.value=demo
    }
},{deep:true})

//获取列表里的数据
const getAttrLists=async ()=>{
    let result=await useAttrsApi.getAttrList(Number(attrList.one),Number(attrList.two),Number(attrList.three))
    attrs.value=result
}
//列表监听 根据三级联动获取列表数据
watch(()=>{attrList.three}, (nval,oval)=>{
    getAttrLists()
},{deep:true})


//一级列表
const oneType=ref<oneLists>()
//二级列表
const twoType=ref<twoLists>()
//三级列表
const threeType=ref<threeLists>()
//渲染完后获取一级列表 联动发送请求
onMounted(()=>{
    getdata()
})
</script>

<style scoped>

</style>
