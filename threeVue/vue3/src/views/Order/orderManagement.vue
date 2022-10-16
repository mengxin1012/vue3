<template>
    <el-card style="margin:10px">
        <el-button @click="sign">签收</el-button>
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item class="mt-5">
                <el-input style="width: 600px" v-model="inputValue" @blur="unFocused"></el-input>
                <div class="block ml-10">
                    <el-date-picker
                        v-model="searchOrder.createTimeBegin"
                        type="datetime"
                        placeholder="创建时间"
                        @change="createTime"
                    />
                </div>
                <div class="block ml-10">
                    <el-date-picker
                        v-model="searchOrder.createTimeEnd"
                        type="datetime"
                        placeholder="创建时间"
                        @change="TimeEnd"
                    />
                </div>
                <el-form-item class="mt-5" >
                    <el-select class="ml-10" v-model="orderStatus" @change="orderChange">
                        <el-option :label="sts.orderStatusName" :value="sts.orderStatus" v-for="(sts,idx) in status" :key="idx"></el-option>
                    </el-select>
                </el-form-item>

            </el-form-item>
<!--orderStatusName订单状态-->
            <el-button @click="reset">重置</el-button>
            <el-button @click="searchList">搜索</el-button>
            <el-table
                ref="multipleTableRef"
                :data="orderPageList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                border
                @row-click="showOrder"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" width="80" type="index" align="center"/>
                <el-table-column label="订单ID" prop="id" width="80" align="center"/>
                <el-table-column label="交易编号" prop="outTradeNo" align="center"/>
                <el-table-column label="商品备注" prop="orderComment" align="center"/>
                <el-table-column label="金额" prop="totalAmount" width="80" align="center"/>
                <el-table-column label="创建时间" prop="createTime" width="240" align="center"/>
                <el-table-column label="收货人" prop="consignee" width="80" align="center"/>
                <el-table-column label="收货人电话" prop="consigneeTel" align="center"/>
                <el-table-column label="订单状态" prop="orderStatus" width="120" align="center"/>
                <el-table-column label="送货地址" prop="deliveryAddress" align="center"/>
            </el-table>
<!--            分页器-->
            <div class="demo-pagination-block">
                <el-pagination
                    v-model:currentPage="page"
                    v-model:page-size="limit"
                    :page-sizes="[10, 15, 20, 25]"
                    :small="small"
                    :disabled="disabled"
                    :background="background"
                    layout=" prev, pager, next, jumper,->,total, sizes,"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-form>

    </el-card>
    <el-card style="padding: 10px">
        <el-button>订单详细</el-button>
        <el-table :data="orderShowList" style="width: 100%" border>
            <el-table-column label="序号" type="index" width="180" align="center"/>
            <el-table-column label="商品ID" prop="orderId" width="180" align="center"/>
            <el-table-column label="商品名称" prop="skuName" width="180" align="center"/>
            <el-table-column label="商品数量" prop="skuNum" width="180" align="center"/>
            <el-table-column label="单价" prop="orderPrice" width="180" align="center"/>
            <el-table-column label="创建事件" prop="createTime" width="180" align="center"/>
            <el-table-column label="总金额" prop="splitTotalAmount" width="180" align="center"/>
            <el-table-column label="图片" prop="imgUrl" width="180" align="center"/>
        </el-table>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { ElMessage } from 'element-plus'
import orderApi from '@/api/order'
import type {PageList,orderDetailList,searchOrderType} from '@/api/order'
import type {pageList} from "@/api/interfaces";
//当前页
const page=ref(1)
//每页条数
const limit=ref(10)
//总条数
const total=ref(0)
//未签收列表
const orderPageList=ref<PageList[]>()
//单个展示页
const orderShowList=ref<orderDetailList[]>()
//订单支付状态
const orderStatus=ref()
//两种支付状态
const status=ref([
    {orderStatusName:'已支付',orderStatus:'PAID'},
    {orderStatusName:'未支付',orderStatus:'UNPAID'},
    {orderStatusName:'已签收',orderStatus:'FINISHED'},
])
const saveValue=ref()
//初始化表单数据
const init=():searchOrderType=>({
    page:page.value,
    limit:limit.value,
    consignee:undefined,
    consigneeTel:undefined,
    deliveryAddress:undefined,
    outTradeNo:undefined,
    createTimeBegin:undefined,
    createTimeEnd:undefined
})
//搜索所需要的参数
const searchOrder=ref(init())
//输入框输入的数据
const inputValue=ref('')
//id数组 用来存储改变状态的订单
const orderIdList=ref()
//点击签收循环请求
const sign= async ()=>{
    await orderIdList.value.forEach(async (item)=> {
        await orderApi.getRecieveOrder(item.id)
        searchList()
        })


}

//组装数据 发送请求 收集数据
const getPage=async ()=>{
    let result=await orderApi.getOrderPage(page.value,limit.value)
    total.value=result.total
    orderPageList.value=result.records as PageList[]
}
//挂完玩获取分页数据
onMounted(()=>{
    getPage()
})
//每页条数发生改变时会触发的回调
const handleSizeChange = (val: number) => {
    limit.value=val
    searchList()
    // if()
    // orderApi.getSearchOrder()
}
//当前页发生变换的时候触发的回调
const handleCurrentChange = (val: number) => {
    page.value=val
    searchList()
}
//展示订单页的回调 需要发送请求
const showOrder=async (row:PageList)=>{

   let result=await orderApi.getShowOrder(row.id)
    orderShowList.value=result.orderInfo.orderDetailList
}
//订单状态
const orderChange=async (nvl:string)=>{
    searchOrder.value.orderStatus=nvl
    let result=await orderApi.getSearchOrder(page.value,limit.value,'orderStatus',searchOrder.value.orderStatus)
    total.value=result.total
    orderPageList.value=result.records
    console.log(searchOrder.value)
}
//搜索对应的数据
const searchList=async ()=>{
    //编号正则
    let orderNo = new RegExp(/[A-z]|[0-9]{1,}/)
    console.log(orderNo.test(inputValue.value))
    // let orderNo = new RegExp(/ATGUIGU16[0-9]{14}$/)
    //收件人 名称只能2-4
    let person = new RegExp(/^[^\x00-\xff]{1}/)
    //手机号判断
    let phone=new RegExp(/^1[0-9]/)
    //城市关键字 下面两个方法废弃
    let city=['省','市','区','路','县','街','号','城']
    let result=city.some(item=>{
        //search字符串方法 找到返回索引 找不到返回负1
        if (inputValue.value.search(item)<0){
            return false
        }else{
            return true
        }
    })
    if(phone.test(inputValue.value)){
        searchOrder.value.consigneeTel=inputValue.value
        let result=await orderApi.getSearchOrder(page.value,limit.value,'consigneeTel',searchOrder.value.consigneeTel)
        total.value=result.total
        orderPageList.value=result.records
        saveValue.value=inputValue.value
        // inputValue.value=''

    }else if(orderNo.test(inputValue.value)){
        searchOrder.value.outTradeNo=inputValue.value
        let result=await orderApi.getSearchOrder(page.value,limit.value,'outTradeNo',searchOrder.value.outTradeNo)
        total.value=result.total
        orderPageList.value=result.records
        saveValue.value=inputValue.value
        // inputValue.value=''
        //    匹配订单编号
    }else if(person.test(inputValue.value)){
        searchOrder.value.consignee=inputValue.value
        let result=await orderApi.getSearchOrder(page.value,limit.value,'consignee',searchOrder.value.consignee)
        if(result.records.length==0){
            searchOrder.value.consignee=''
            searchOrder.value.deliveryAddress=inputValue.value
            result=await orderApi.getSearchOrder(page.value,limit.value,'deliveryAddress',searchOrder.value.deliveryAddress)
            }
        total.value=result.total
        orderPageList.value=result.records
        saveValue.value=inputValue.value
        // inputValue.value=''
        //    中文符号也可以被匹配
    }else {
        inputValue.value=''
        saveValue.value=inputValue.value
    }
    // if(result){
    //     searchOrder.value.deliveryAddress=inputValue.value
    //     let result=await orderApi.getSearchOrder(page.value,limit.value,'deliveryAddress',searchOrder.value.deliveryAddress)
    //     if(result.records.length==0){
    //         result=await orderApi.getSearchOrder(page.value,limit.value,'consignee',searchOrder.value.consignee)
    //     }
    //     total.value=result.total
    //     orderPageList.value=result.records
    //     inputValue.value=''
    // }else
        }


//重置表单
const reset=async ()=>{
    searchOrder.value=init()
    page.value=1
    limit.value=10
    inputValue.value=''
    getPage()
}

//下拉框回调
const handleSelectionChange = (val:PageList[]) => {
    orderIdList.value=val
}





//时间选择器
const createTime=(nvl:string)=>{
    console.log(nvl)
}
//过期 时间
const TimeEnd=(nvl:string)=>{
    console.log(nvl)
}

//分页
const currentPage4 = ref(4)
const pageSize4 = ref(100)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
</script>

<style scoped>
.demo-datetime-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
}
.demo-datetime-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}
.demo-datetime-picker .block:last-child {
    border-right: none;
}
.demo-datetime-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}
</style>
