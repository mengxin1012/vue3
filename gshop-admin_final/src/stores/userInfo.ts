import { defineStore } from 'pinia'
import userApi from '@/api/user'
import type { UserInfoParams, UserInfoData } from '@/api/user'
import { ElMessage } from 'element-plus'
import { staticRoutes,allAsyncRoutes,anyRoute } from '@/router/routes'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'
import cloneDeep from 'lodash/cloneDeep'


function addRoutes(routes: RouteRecordRaw[]) {
  routes.forEach(item => router.addRoute(item))
}

function resetRouter() {
  let routes = router.getRoutes()

  routes.forEach(item => {
    if (item.name) {
      router.removeRoute(item.name)
    }
  })
  addRoutes(staticRoutes)
}


function filterAsyncRoutes(allAsyncRoutes: RouteRecordRaw[],routeNames: string[]){
  const asyncRoutes = allAsyncRoutes.filter(item => {
    if(routeNames.indexOf(item.name as string) !== -1){
      if(item.children && item.children.length){
        item.children = filterAsyncRoutes(item.children,routeNames)
      }
      return true
    }
  })
  return asyncRoutes
}

type UserInfoStoreState = {
  token: string,
  userInfo: UserInfoData,
  menuRoutes: RouteRecordRaw[]
}

function initUserInfo():UserInfoData {
  return {
    name: '',
    avatar: '',
    buttons: [],
    roles: [],
    routes: []
  }
}

export const useUserInfoStore = defineStore('userInfo', {
  state(): UserInfoStoreState {
    return {
      token: localStorage.getItem('token_key') || '',
      userInfo: initUserInfo(),
      menuRoutes: staticRoutes
    }
  },
  actions: {
    async login(userInfo: UserInfoParams) {
      try {
        const result = await userApi.login(userInfo)
        this.token = result.token
        localStorage.setItem('token_key', result.token)
        return 'ok'
      } catch (error) {
        ElMessage.error('登录失败')
        return Promise.reject(error)
      }
    },

    async getInfo() {
      try {
        const result = await userApi.getInfo()
        this.userInfo = result
        let asyncRoutes = filterAsyncRoutes(cloneDeep(allAsyncRoutes),result.routes)
        this.menuRoutes = staticRoutes.concat(asyncRoutes,anyRoute)
        addRoutes(asyncRoutes.concat(anyRoute))
        return 'ok'
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async reset() {
      this.token = ''
      this.userInfo = initUserInfo()
      localStorage.removeItem('token_key')
    },

    async logout() {
      try {
        await userApi.logout()
        this.reset()
        resetRouter()
        return 'ok'
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
})