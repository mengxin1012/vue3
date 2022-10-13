import request from '@/utils/request'
//将二次封装的axios引入
//引入 类型数据
import type {tokenT,configType} from './interfaces'
export default {
    //登录接口
    login(username:string,password:string){
        return request.post<any,tokenT>('/admin/acl/index/login',{username,password})
    },
    //用户信息接口
    info(){
        return request.get<any,configType>('/admin/acl/index/info')
    },
    //登出接口
    logout(){
        return request.post('/admin/acl/index/logout')
    }
}