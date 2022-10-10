import request from '@/utils/request'

// getCategory1   GET    /admin/product/getCategory1
// getCategory2   GET    /admin/product/getCategory2/{category1Id}
// getCategory3   GET    /admin/product/getCategory3/{category2Id}

export interface CategoryModel {
  id: number,
  name: string,
  category1Id?: number,
  category2Id?: number
}

export type CategoryListModel = CategoryModel[];

export default {
  getCategory1List() {
    return request.get<any, CategoryListModel>(`/admin/product/getCategory1`)
  },
  getCategory2List(category1Id: number) {
    return request.get<any, CategoryListModel>(`/admin/product/getCategory2/${category1Id}`)
  },
  getCategory3List(category2Id: number) {
    return request.get<any, CategoryListModel>(`/admin/product/getCategory3/${category2Id}`)
  }
}