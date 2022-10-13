## 说明
* 基于Vue3的电商中台管理项目
* 技术栈: TS + Vue3 + VueRouter4 + Pinia + ElementPlus
* 当前为完成版
* 学习参见 文档 文件夹下的MD文件


## 项目介绍
前台、后台、前端、后端区别

## 项目目录介绍
> 注意:
> .env.development .env.production 理解成项目的环境变量
> vite通过 import.meta.env.VITE_API_URL 拿到文件中设置的环境变量

## 接口文档
- 权限管理: http://39.98.123.211:8170/swagger-ui.html
- 商品管理：http://39.98.123.211:8510/swagger-ui.html

## 托管git
vue3base地址: https://gitee.com/newsegmentfault/0425vue3base
项目地址: https://gitee.com/newsegmentfault/gulishop-admin_0425
线上地址: http://101.43.227.123:5555/home

## 修改小功能
* 登录页边距
* 登录页背景图
* 登录按钮文字
* 退出登录文字

目的: 熟悉页面的解构
* sideBar 侧边栏 - 使用了 递归组件 sidebarItem 渲染菜单栏
* navBar 顶部导航 - 修改"退出登录"的文字
* appMain 页面的主要显示区域 - 使用 componet组件 的is属性来渲染组件,is中配置哪个组件,就显示哪个组件

