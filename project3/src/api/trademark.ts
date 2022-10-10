import request from '@/utils/request'
// 删除  DELETE  /admin/product/baseTrademark/remove/{id}
// 新增  POST    /admin/product/baseTrademark/save
// 修改  PUT     /admin/product/baseTrademark/update
// 分页  GET     /admin/product/baseTrademark/{page}/{limit}
// -----------------
// 获取所有品牌列表  GET   /admin/product/baseTrademark/getTrademarkList  ---  用于保存spu下拉展示

export interface TrademarkModel {
  id?: number,
  logoUrl: string,
  tmName: string
}

export type TrademarkListModel = TrademarkModel[]

export interface TrademarkPageModel {
  records: TrademarkListModel,
  total: number,
  size: number,
  current: number,
  pages: number
}

export default {
  getPage(page: number, limit: number) {
    return request.get<any, TrademarkPageModel>(`/admin/product/baseTrademark/${ page }/${ limit }`);
  },
  add(data: TrademarkModel) {
    return request.post<any, null>('/admin/product/baseTrademark/save', data);
  },
  update(data: TrademarkModel) {
    return request.put<any, null>('/admin/product/baseTrademark/update', data);
  },
  delete(id: number) {
    return request.delete<any, null>(`/admin/product/baseTrademark/remove/${ id }`);
  },
  // -----------------------------------------------
  // 新增展示下拉框数据
  getList() {
    return request.get<any, TrademarkListModel>(`/admin/product/baseTrademark/getTrademarkList`)
  }
}