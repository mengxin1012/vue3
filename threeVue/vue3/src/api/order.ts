import request from "@/utils/request";
//导入二次封装的axios


/*
* GET /admin/order/recieve/{orderId}
签收订单

GET /admin/order/show/{orderId}
show

GET /admin/order/{page}/{limit}
获取订单分页列表
*
* */
//类型区域
// 当前页 总页数 每页数据 允许搜索  每页条数 总条数
export interface Page{
    current:number,
    pages:number,
    records:PageList[],
    searchCount:boolean,
    size:number,
    total:number
}
//分页中 每条数据类型
export interface PageList{
    activityReduceAmount:null,
    consignee:string,
    consigneeTel:string,
    couponAmount:null,
    couponInfo:null,
    createTime:string,
    deliveryAddress:string,
    expireTime:string,
    feightFee:null,
    feightFeeReduce:null,
    id:number,
    imgUrl:null,
    operateTime:null,
    orderComment:string,
    orderDetailList:orderDetailList[],
    orderDetailVoList:null,
    orderStatus:string,
    orderStatusName:string,
    originalTotalAmount:null,
    outTradeNo:string,
    parentOrderId:null,
    paymentWay:string,
    processStatus:string,
    provinceId:null,
    refundableTime:null,
    totalAmount:number,
    trackingNo:null,
    tradeBody:string,
    userId:number,
    wareId:null
}
//订单列表
export interface orderDetailList{
    activityRule:null,
    couponInfoList:null,
    createTime:string,
    hasStock:null,
    id:number,
    imgUrl:string,
    orderId:number,
    orderPrice:number,
    refundStatus:string,
    refundStatusString:string,
    skuId:number,
    skuName:string,
    skuNum:number,
    sourceId:number,
    sourceType:string,
    splitActivityAmount:0|number,
    splitCouponAmount:0|number,
    splitTotalAmount:number
}
//展示接口类型
export interface showList{
    date1:string,
    orderInfo:PageList,
    time1:string
}

//检索数据需要的类型
export interface searchOrderType{
    page:number,
    limit:number,
    consignee?:string|undefined,
    consigneeTel?:string|undefined,
    orderStatus?:string,
    deliveryAddress?:string|undefined,
    outTradeNo?:string|undefined,
    createTimeBegin?:string|undefined,
    createTimeEnd?:string|undefined
}

export default {
    getOrderPage(page:number,limit:number){
        return request.get<any,Page>(`/admin/order/${page}/${limit}`)
    },
    getShowOrder(orderId:number){
        return request.get<any,showList>(`/admin/order/show/${orderId}`)
    },
    getRecieveOrder(orderId:number){
        return request.get(`/admin/order/recieve/${orderId}`)
    },
    getSearchOrder(page:number,limit:number,str:string,data:string){
        return request.get<any,Page>(`/admin/order/${page}/${limit}?${str}=${data}&`)
    }
}