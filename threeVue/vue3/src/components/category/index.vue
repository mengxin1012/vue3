<template>
    <el-card class="md-5">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="一级分类">
                <el-select v-model="store.category1Id" placeholder="品牌" @change="store.getCate2">
                    <el-option :label="c1.name" :value="c1.id" v-for="c1 in store.categoryList" :key="c1.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="store.category2Id" placeholder="二级列表" @change="store.getCate3">
                    <el-option :label="c2.name" :value="c2.id" v-for="c2 in store.category2List" :key="c2.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select placeholder="三级列表" v-model="store.category3Id" :disabled="flag">
                    <el-option :label="c3.name" :value="c3.id" v-for="c3 in store.category3List" :key="c3.id" />
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script lang="ts">
export default {
    name:'CateGory'
}
</script>
<script setup lang="ts">
import {onMounted, reactive} from "vue";
import userStore from "@/stores/category";
const store=userStore()

const changeHandle=(id:number)=>{
    console.log(123)
    store.getCate2(id)
}

const attrList=reactive({
    one:'',
    two: '',
    three:''
})
const getcate1List=()=>{
    store.getCate1()
}

onMounted(()=>{
    getcate1List()
    })
</script>

<style scoped>

</style>
