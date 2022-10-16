import request from "@/utils/request";
import type {pageList, recordType, tradeMarks, saleAttrs, saveSale} from './interfaces'
/*
*
* /admin/product/1/3?category3Id=1 get
* 获取初始化信息
* /admin/product/baseTrademark/getTrademarkList
* get
* /admin/product/baseSaleAttrList
*get
*
* id
:
21617
logoUrl
:
"http://47.93.148.192:8080/group1/M00/07/68/rBHu8mNJURyAXjZ5AAAS6pwrg18216.jpg"
tmName
:
"4444"
*
* id
:
1
name
:
"颜色"
*
* 图片列表和销售属性列表
* get(`/admin/product/spuImageList/${tmid}`)
* get(`/admin/product/spuSaleAttrList/${tmid}`)
*
* */

export default {
    getPage(page:number,limit:number,category3Id:number){
        return request.get<any,pageList>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
    },
    getTrademarkList(){
        return request.get<any,tradeMarks>('/admin/product/baseTrademark/getTrademarkList')
    },
    baseSaleAttrList(){
        return request.get<any,saleAttrs>('/admin/product/baseSaleAttrList')
    },
    onSave(data:saveSale){
        return request.post<any,null>('/admin/product/saveSpuInfo',data)
    },
    updateSaleAttr(tmid:number){
        return request.get(`/admin/product/spuSaleAttrList/${tmid}`)
    },
    updateImg(tmid:number){
        return request.get(`/admin/product/spuImageList/${tmid}`)
    }
}