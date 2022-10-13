import request from '@/utils/request'
import type {oneList, oneLists, twoLists, threeLists, attrType, attrValueType,attrTypes,attrValueTypes} from './interfaces'

// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
//
// attrInfoList
//
// delete /admin/product/deleteAttr/{attrId}
//
// deleteAttr
//
// get /admin/product/getAttrValueList/{attrId}
//
// getAttrValueList
//
// post /admin/product/saveAttrInfo
/*
*

    get /admin/product/getCategory1

        getCategory1

    get /admin/product/getCategory2/{category1Id}

        getCategory2

    get /admin/product/getCategory3/{category2Id}

        getCategory3
        * /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
        *
        * /admin/product/getAttrValueList/{attrId}
        * get 获取属性名称列表
        *
        *
        * /admin/product/deleteAttr/{attrId}
        * delete 删除数据
        *
        *
        *
        * /admin/product/saveAttrInfo
        * post 添加数据
*/
export default {
    getCategory1(){
        return request.get<any,oneLists>('/admin/product/getCategory1')
    },
    getCategory2(category1Id:number){
        return request.get<any,twoLists>(`/admin/product/getCategory2/${category1Id}`)
    },
    getCategory3(category2Id:number){
        return request.get<any,threeLists>(`/admin/product/getCategory3/${category2Id}`)
    },
    getAttrList(category1Id:number,category2Id:number,category3Id:number){
        return request.get<any,attrTypes>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },
    getAttrValue(attrId:number){
        return request.get<any,attrValueTypes>(`/admin/product/getAttrValueList/${attrId}`)
    },
    deleteAttrList(attrId:number){
        return request.delete<any,null>(`/admin/product/deleteAttr/${attrId}`)
    },
    setAttrList(attrList:attrType){
        return request.post<any,null>('/admin/product/saveAttrInfo',attrList)
    }

}