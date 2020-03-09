import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
/**
 * routes中设置基础路由
 * asyncRoutes中设置需要根据角色权限动态加载的页面路由
 */
export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue'),
    hidden: true, // 为true时在页面导航中隐藏
  }
]

export const asyncRoutes = [
  {
    path: '/page1',
    name: 'Page1',
    component: () => import('../views/RolePage1.vue'),
    meta: { roles: ['super', 'admin'] }
  },
  {
    path: '/page2',
    name: 'Page2',
    component: () => import('../views/RolePage2.vue'),
    meta: { roles: ['super', 'kefu'] }
  },
  {
    path: '/page3',
    name: 'Page3',
    component: () => import('../views/RolePage3.vue'),
    meta: { roles: ['super', 'kefu'] }
  },
  { path: '*', redirect: '/404', hidden: true }
]


export default new VueRouter({
  routes
})
