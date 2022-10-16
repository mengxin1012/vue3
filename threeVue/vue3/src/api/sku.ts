import request from '@/utils/request'
import type {recordInfo, skuList, tradeList} from './interfaces'

/*
*
* 商品SKU接口 : Sku Manage ControllerShow/HideList OperationsExpand Operations
GET /admin/product/cancelSale/{skuId}
cancelSale

DELETE /admin/product/deleteSku/{skuId}
deleteSku

GET /admin/product/findBySpuId/{spuId}
findBySpuId

GET /admin/product/getSkuById/{skuId}
getById

GET /admin/product/inner/findSkuInfoByKeyword/{keyword}
findSkuInfoByKeyword

POST /admin/product/inner/findSkuInfoBySkuIdList
findSkuInfoBySkuIdList

// * 页面的初始化数据
GET /admin/product/list/{page}/{limit}
index

GET /admin/product/onSale/{skuId}
onSale

POST /admin/product/saveSkuInfo
saveSkuInfo

GET /admin/product/spuImageList/{spuId}
getSpuImageList

GET /admin/product/spuSaleAttrList/{spuId}
getSpuSaleAttrList

POST /admin/product/updateSkuInfo
updateSkuInfo
* */

export default {
    getSkuInfo(page:number,limit:number){
        return request.get<any,skuList>(`/admin/product/list/${page}/${limit}`)
    },
    onSave(skuId:number){
        return request.get<any,null>(`/admin/product/onSale/${skuId}`)
    },
    cance(skuId:number){
        return request.get<any,null>(`/admin/product/cancelSale/${skuId}`)
    },
    delet(skuId:number){
        return request.delete<any,null>(`/admin/product/deleteSku/${skuId}`)
    },
    skuById(skuId:number){
        return request.get<any,recordInfo>(`/admin/product/getSkuById/${skuId}`)
    }
}