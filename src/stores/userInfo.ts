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
export const useUserInfoStore = defineStore('userInfo', {

	state: (): UserInfoState => ({
    token: getToken() as string,
    name: '',
    avatar: '',
    menuRoutes: []
  }),

	actions: {
    async login (username: string, password: string) {
      try {
        let result=await userApi.login(username,password)
        if(result){
          this.token=result.token
        }else {
          ElMessage.error('参数错误')
        }

      }catch (e){
        ElMessage.error('登录失败')
        return Promise.reject(e)
      }

    },

    async getInfo () {
      try {
        let result = await userApi.info()
        console.log(result)
        if (result){

          console.log(result)
        }
      }catch (e){
        ElMessage.error('登录失败')
        return Promise.reject(e)
      }
    },

    reset () {
      // 删除local中保存的token
      removeToken()
      // 提交重置用户信息的mutation
      this.token = ''
      this.name = ''
      this.avatar = ''
    },
	},
});
