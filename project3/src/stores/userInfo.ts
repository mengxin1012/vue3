import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import {ElMessage} from 'element-plus'
import {staticRoutes} from '@/router/routes'
import userApi from '@/api/index'



/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
const userInfoType={
    avatar:'',
    buttons:[],
    name:'',
    roles:[],
    message:'',
}
export const useUserInfoStore = defineStore('userInfo', {

	state: (): UserInfoState => ({
    token: getToken() as string,
      userinfo:userInfoType,
    menuRoutes: []
  }),

	actions: {
    async login(username: string, password: string) {
      try {
        let result=await userApi.login(username,password)
          this.menuRoutes=staticRoutes
          this.token=result.token
        setToken(result.token)
      }catch (e){
        ElMessage.error('登录失败')
        return Promise.reject(e)
      }

    },

    async getInfo () {
      try {
        let result = await userApi.info()
        this.userinfo=result
      }catch (e){
        ElMessage.error('登录失败')
        return Promise.reject(e)
      }
    },

    async reset () {
      // 删除local中保存的token
      await userApi.logout()
      removeToken()
      // 提交重置用户信息的mutation
      this.token = ''
        this.userinfo=userInfoType
    },
	},
});
