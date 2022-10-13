import type { RouteRecordRaw } from "vue-router";
import type {userModel} from "@/api/interfaces/interfaces";

// 用户信息包括权限数据
export interface UserInfoState {
  token: string;
    userinfo:userModel
  menuRoutes: RouteRecordRaw[] // 用于生成导航菜单的路由列表
}




