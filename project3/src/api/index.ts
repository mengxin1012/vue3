import request from '@/utils/request'
import type {setModel, loginType, userModel} from "@/api/interfaces/interfaces";

// get /admin/acl/index/info
// info
// post /admin/acl/index/login
// login
// post /admin/acl/index/logout
// logout


export default {
    login(username:string,password:string){
        return request.post<any,setModel>('/admin/acl/index/login',{username,password})
        // return request.post('/admin/acl/index/login',{username,password})
    },
    info(){
        return request.get<any,userModel>('/admin/acl/index/info')
    },
    logout(){
        return request.post('/admin/acl/index/logout')
    }
}