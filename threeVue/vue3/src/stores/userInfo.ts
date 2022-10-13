import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
import type { UserInfoState } from './interface';
import {ElMessage} from 'element-plus'
import {staticRoutes} from '@/router/routes'
import userApi from '@/api/index'
//初始化用户数据
const resetInfo={
  avatar:[],
  buttons:[],
  roles:[],
  routes:[],
  name:''
}
/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

	state: (): UserInfoState => ({
    token: getToken() as string,
      //用户数据的对象
      userInfo:resetInfo,
    menuRoutes: []
  }),

	actions: {
    //  登录的方法
    async login (username: string, password: string) {

      try {
        //发请求拿数据
        let result=await userApi.login(username,password)
        //将token放到localstorage中
        setToken(result.token)
        //设置state中的token
        this.token=result.token

      }catch (e){
        ElMessage.error('登录失败')
        //失败返回失败的promise
        return Promise.reject(e)
      }
    },

    async getInfo () {
      try {
        //获取用户信息
        let result=await userApi.info()
        //将用户信息放在store中
        this.userInfo=result
        //权限信息 暂时写死
        this.menuRoutes=staticRoutes
      }catch (e){
        ElMessage.error('获取用户信息失败')
        return Promise.reject(e)
      }
    },

    async reset () {
      //退出登录的接口
      await userApi.logout()
      // 删除local中保存的token
      removeToken()
      // 提交重置用户信息的mutation
      this.token = ''
      //将store中的用户数据初始化
      this.userInfo=resetInfo
    },
	},
});
