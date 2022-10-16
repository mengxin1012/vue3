//引入创建上下文实例对象的方法createApp这个方法
import { createApp } from 'vue'
//引入pinia
import pinia from './stores'
//引入ElementPlus组件库
import ElementPlus from 'element-plus'
//yinruElementPlus组件库的中文包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//引入ElementPlus的样式文件
import 'element-plus/dist/index.css'
//引入App组件
import App from './App.vue'
//引入路由器对象
import router from './router'
//引入全局公共样式文件
import './styles/index.scss'
//引入Element中的svg格式图片的组件库
import ElSvg from './components/SvgIcon/ElSvg'
//引入执行路由权限相关的文件
import './permission'
import category from "@/components/category/index.vue";

const app = createApp(App)
app.component(category.name,category)

ElSvg(app)

app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')
