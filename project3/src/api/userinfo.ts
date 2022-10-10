import request from '@/utils/request'
// GET /admin/acl/index/info
// POST /admin/acl/index/login
// POST /admin/acl/index/logout

interface LoginParamsModel {
  username: string,
  password: string
}

interface TokenModel {
  token: string
}

export interface UserInfoModel {
  name: string,
  avatar: string,
  buttons: string[],
  roles: string[],
  routes: string[]
}

// 期望,我们拿到的数据直接是可以设置类型,这个类型根据接口的返回数据的样子来设置

export default {
  login(loginParams: LoginParamsModel) {
    return request.post<any, TokenModel>('/admin/acl/index/login', loginParams); // 第一个any是用来占位的, 第二个才是我们真正用的
  },
  info() {
    return request.get<any, UserInfoModel>('/admin/acl/index/info')
  },
  logout() {
    return request.post<any, null>('/admin/acl/index/logout')
  }
}