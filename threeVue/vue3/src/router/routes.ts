import type { RouteRecordRaw } from 'vue-router';
/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      hidden：        是否隐藏此路由
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

/**
 * 静态路由（默认路由）
 */
 export const staticRoutes: Array<RouteRecordRaw> = [
	{
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true
    }
  },

  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: { 
        title: '首页', 
        icon: 'ele-HomeFilled', 
      }
    }]
  },
    {
        path: '/product',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '商品信息',
            icon: 'ele-GoodsFilled',
        },
        children: [
            {
            path: 'trademark/list',
            // name: 'Home',
            component: () => import('@/views/product/trademark/index.vue'),
            meta: {
                title: '品牌管理',
            }
        },
            {
                path: 'attrs/list',
                // name: 'Home',
                component: () => import('@/views/product/attrs/index.vue'),
                meta: {
                    title: '平台属性管理',
                }
            },
            {
                path: 'spu/list',
                // name: 'Home',
                component: () => import('@/views/product/spu/index.vue'),
                meta: {
                    title: 'SPU管理',
                }
            },
            {
                path: 'sku/list',
                // name: 'Home',
                component: () => import('@/views/product/sku/index.vue'),
                meta: {
                    title: 'SKU管理',
                }
            },
]
    },

  /* 匹配任意的路由 必须最后注册 */
  { 
    path: '/:pathMatch(.*)', 
    name: 'Any',
    redirect: '/404', 
    meta: {
      hidden: true 
    }
  }
];


/**
 * 定义动态路由
 */
export const allAsyncRoutes: Array<RouteRecordRaw> = [];