import request from '@/utils/request'
import type {tradeList, trademarkList} from './interfaces'

//
// delete /admin/product/baseTrademark/remove/{id}
//
// 删除BaseTrademark
//
// post /admin/product/baseTrademark/save
//
// 新增BaseTrademark
//
// put /admin/product/baseTrademark/update
//
// 修改BaseTrademark
//
// get /admin/product/baseTrademark/{page}/{limit}
//
// 分页列表


export default {
    pageModel(page:number,limit:number){
        return request.get<any,tradeList>(`/admin/product/baseTrademark/${page}/${limit}`)
    },
    save(data:trademarkList){
        return request.post<any,null>('/admin/product/baseTrademark/save',data)
    },
    edit(data:trademarkList){
        return request.put<any,null>('/admin/product/baseTrademark/update',data)
    },
    delete(id:number){
        return request.delete<any,null>(`/admin/product/baseTrademark/remove/${id}`)
    }
}
