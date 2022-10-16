import request from '@/utils/request'

export interface SpuImageData {
  name?: string
  url?: string
  id?: number,
  imgName: string,
  imgUrl: string,
  spuId?: number,
  response?:any,
  isDefault?:string
}

interface SpuSaleAttrValueData {
  baseSaleAttrId: number | string,
  id?: number,
  isChecked?: string,
  saleAttrName?: string,
  saleAttrValueName: string | undefined,
  spuId?: number,
}

export type SpuSaleAttrData = {
  attrIdValueId?:string
  baseSaleAttrId: number | string,
  id?: number,
  saleAttrName: string,
  spuId?: number,
  spuSaleAttrValueList: SpuSaleAttrValueData[],
  inputVisible?:boolean
  saleAttrValueName?:string
}

export type SpuInfoData = {
  category3Id: number | string,
  description: string,
  id?: number | string,
  spuImageList: SpuImageData[],
  spuName: string,
  spuSaleAttrList: SpuSaleAttrData[],
  tmId: number | string,
}



export interface BaseSaleAttrData {
  id: number,
  name: string
}

type SpuPageListData = {
  records: SpuInfoData[],
  total: number,
  size: number,
  current: number,
  orders: [],
  optimizeCountSql: boolean,
  hitCount: boolean,
  countId: null,
  maxLimit: null,
  searchCount: boolean,
  pages: number
}



export default {
  // GET /admin/product/baseSaleAttrList
  // getBaseSaleAttrList
  getBaseSaleAttrList() {
    return request.get<any,BaseSaleAttrData[]>('/admin/product/baseSaleAttrList')
  },

  // DELETE /admin/product/deleteSpu/{spuId}
  // deleteSpu
  remove(spuId: number) {
    return request.delete<any,null>(`/admin/product/deleteSpu/${spuId}`)
  },


  // GET /admin/product/getSpuInfo/{spuId}
  // 获取spu基本信息
  getSpuInfo(spuId: number) {
    return request.get<any,SpuInfoData>(`/admin/product/getSpuInfo/${spuId}`)
  },


  // POST /admin/product/saveSpuInfo
  // saveSpuInfo
  // POST /admin/product/updateSpuInfo
  // 更改spu信息
  addOrUpdate(spuInfo:SpuInfoData) {
    return request.post<any,null>(`/admin/product/${spuInfo.id ? 'updateSpuInfo' : 'saveSpuInfo'}`, spuInfo)
  },

  // GET /admin/product/{page}/{limit}
  getPageList(page: number, limit: number,category3Id:number) {
    return request.get<any,SpuPageListData>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
  }
}