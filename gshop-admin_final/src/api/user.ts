import request from '@/utils/request'

enum UserApi {
  login = '/admin/acl/index/login',
  getUserInfo = '/admin/acl/index/info',
  logout = '/admin/acl/index/logout'
}

export interface UserInfoParams {
  username:string,
  password:string
}
export interface LoginData {
  token:string
}
export interface UserInfoData {
  name:string,
  avatar:string,
  buttons:string[],
  routes:string[],
  roles:string[]
}

export default {
  login(userInfo:UserInfoParams){
    return request.post<any,LoginData>(UserApi.login,userInfo)
  },
  getInfo(){
    return request.get<any,UserInfoData>(UserApi.getUserInfo)
  },
  logout(){
    return request.post<any,null>(UserApi.logout)
  }
}
