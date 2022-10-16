import request from '@/utils/request'

export interface AttrValueData {
  id?: number,
  createTime?: string,
  updateTime?: string,
  valueName: string,
  attrId?: number,
  isEdit?:boolean
}

export type AttrData = {
  attrIdValueId?:string,
  id?: number | string,
  createTime?: string,
  updateTime?: string,
  attrName: string,
  categoryId: number,
  categoryLevel: number,
  attrValueList:AttrValueData[]
}

export default {
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // attrInfoList
  getList(category1Id:number,category2Id:number,category3Id:number){
    return request.get<any,AttrData[]>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  remove(attrId:number){
    return request.delete<any,null>(`/admin/product/deleteAttr/${attrId}`)
  },


  // POST /admin/product/saveAttrInfo
  addOrUpdate(attr:AttrData){
    return request.post<any,null>('/admin/product/saveAttrInfo',attr)
  }
}