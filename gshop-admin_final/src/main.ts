import { createApp } from 'vue'
import pinia from './stores'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElSvg from './components/SvgIcon/ElSvg'
import './permission'
import CategorySelector from '@/components/CategorySelector/index.vue'
import CommCard from '@/views/home/components/TopView/components/CommCard/index.vue'
import {vueEcharts} from '@/plugins/echarts'
import '@/mock'
import has from '@/directives'


const app = createApp(App)
app.component('CategorySelector',CategorySelector)
app.component('CommCard',CommCard)
app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(has)
  .use(ElSvg)
  .use(vueEcharts)
  .mount('#app')
