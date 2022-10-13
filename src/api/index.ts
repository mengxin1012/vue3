import request from '@/utils/request'


// get /admin/acl/index/info
// info
// post /admin/acl/index/login
// login
// post /admin/acl/index/logout
// logout
interface loginType{
    username:string,
    password:string,
}

export default {
    login(username:string,password:string){
        return request.post('/admin/acl/index/login',{username,password})
    },
    info(){
        return request.get('/admin/acl/index/info')
    },
    logout(){
        return request.post('/admin/acl/index/logout')
    }
}