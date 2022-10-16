import request from '@/utils/request'

export interface TrademarkData {
  id?: number | string,
  tmName: string,
  logoUrl: string
}

type TrademarkInfoData = {
  records: TrademarkData[],
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number
}

export default {
  // DELETE /admin/product/baseTrademark/remove/{id}
  // 删除BaseTrademark
  remove(id: number) {
    return request.delete<any, null>(`/admin/product/baseTrademark/remove/${id}`)
  },
  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  addOrUpdate(trademark: TrademarkData) {
    if (trademark.id) {
      return request.put<any, null>('/admin/product/baseTrademark/update',trademark)
    } else {
      return request.post<any, null>('/admin/product/baseTrademark/save',trademark)
    }
  },
  // GET /admin/product/baseTrademark/{page}/{limit}
  getPageList(page: number, limit: number) {
    return request.get<any,TrademarkInfoData>(`/admin/product/baseTrademark/${page}/${limit}`)
  },

  getList(){
    return request.get<any,TrademarkData[]>('/admin/product/baseTrademark/getTrademarkList')
  }
}
