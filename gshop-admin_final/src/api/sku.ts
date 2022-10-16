import request from '@/utils/request'
import type {SpuImageData,SpuSaleAttrData} from './spu'

export interface SkuImgData {
  id?: number,
  skuId?: number,
  imgName: string,
  imgUrl: string,
  spuImgId: number,
  isDefault?: string
}

export interface SkuAttrValueData {
  id?: number,
  attrId: number | string,
  valueId: number | string,
  skuId?: number,
  attrName?: string,
  valueName?: string
}

export interface SkuSaleAttrValueData {
  id?: number,
  skuId?: number,
  spuId?: number,
  saleAttrValueId: number | string,
  saleAttrId: number | string,
  saleAttrName?: string,
  saleAttrValueName?: string
}


export type SkuInfoData = {
  id?: number | string,
  spuId?: number,
  price: number,
  skuName: string,
  skuDesc: string,
  weight: string,
  tmId?: number|string,
  category3Id?: number,
  skuDefaultImg: string,
  isSale?: number,
  skuImageList: SkuImgData[],
  skuAttrValueList: SkuAttrValueData[],
  skuSaleAttrValueList: SkuSaleAttrValueData[]
}

export type SkuPageListData = {
  records: SkuInfoData[]
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number
}

export default {
  // GET  /admin/product/cancelSale/{skuId}
  // cancelSale
  cancelSale(skuId: number) {
    return request.get<any, null>(`/admin/product/cancelSale/${skuId}`)
  },

  // GET /admin/product/onSale/{skuId}
  // onSale
  onSale(skuId: number) {
    return request.get<any, null>(`/admin/product/onSale/${skuId}`)
  },

  // DELETE /admin/product/deleteSku/{skuId}
  // deleteSku
  deleteSku(skuId: number) {
    return request.delete<any, null>(`/admin/product/deleteSku/${skuId}`)
  },


  // GET /admin/product/findBySpuId/{spuId}
  // findBySpuId
  // 获取spuid下的所有sku列表


  getSkuList(spuId: number) {
    return request.get<any, SkuInfoData[]>(`/admin/product/findBySpuId/${spuId}`)
  },


  // GET /admin/product/getSkuById/{skuId}
  // getSkuInfo
  getSkuInfo(skuId: number) {
    return request.get<any, SkuInfoData>(`/admin/product/getSkuById/${skuId}`)
  },

  // GET /admin/product/list/{page}/{limit}
  // index
  // 获取sku的分页列表
  getSkuPageList(page: number, limit: number) {
    return request.get<any,SkuPageListData>(`/admin/product/list/${page}/${limit}`)
  },

  // POST /admin/product/saveSkuInfo
  // saveSkuInfo
  // 添加sku
  saveSkuInfo(skuInfo:SkuInfoData) {
    return request.post<any, null>('/admin/product/saveSkuInfo', skuInfo)
  },

  // GET /admin/product/spuImageList/{spuId}
  // getSpuImageList

  getSpuImageList(spuId: number) {
    return request.get<any,SpuImageData[]>(`/admin/product/spuImageList/${spuId}`)
  },

  // GET /admin/product/spuSaleAttrList/{spuId}
  // getSpuSaleAttrList
  getSpuSaleAttrList(spuId: number) {
    return request.get<any,SpuSaleAttrData[]>(`/admin/product/spuSaleAttrList/${spuId}`)
  }
}