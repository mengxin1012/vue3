import request from '@/utils/request'

export interface CategoryData {
  id: number,
  createTime: string
  updateTime: string,
  name: string,
  category2Id?: number
  category1Id?: number
}



export default {
  // GET /admin/product/getCategory1
  // getCategory1
  getCategory1(){
    return request.get<any,CategoryData[]>('/admin/product/getCategory1')
  },

  // GET /admin/product/getCategory2/{category1Id}
  // getCategory2
  getCategory2(category1Id:number | string){
    return request.get<any,CategoryData[]>(`/admin/product/getCategory2/${category1Id}`)
  },

  // GET /admin/product/getCategory3/{category2Id}
  // getCategory3
  getCategory3(category2Id:number | string){
    return request.get<any,CategoryData[]>(`/admin/product/getCategory3/${category2Id}`)
  }
}