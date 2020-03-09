## 前言

> 总结一种比较常见的权限控制方法，主要使用vue-router的addRoutes根据用户权限动态添加路由实现。本文主要在前端对权限进行配置。


## 主要知识点

* vue
* vue-router
* vuex
* vue-cli

## 基本项目项目结构
> 使用vue-cli生成项目

* 目录结构

```
├─public
│      favicon.ico
│      index.html
│      
└─src
    │  App.vue
    │  main.js
    │  
    ├─assets
    │      logo.png
    │      
    ├─components
    │      HelloWorld.vue
    │      
    ├─router
    │      index.js
    │      
    ├─store
    │  │  index.js
    │  │  
    │  └─modules
    │          permission.js
    │          user.js
    │          
    └─views
            About.vue
            Home.vue
            Login.vue
│  babel.config.js
│  package.json
```
* 主要文件
1. src/router/index.js
2. src/store/user.js
3. src/store/permission.js
## 权限设计基本原理
* 基本原理
```
根据后台返回的用户角色信息在前端配置当前用户可以访问的路由，然后通过addRoutes动态添加。
```
* 后台返回的用户信息
```json
{
    username:"张三",
    role:["admin","kefu"] //用户的角色
}
```
## 实现
### 配置router（src/router/index.js）
1. routes
> 配置不需要权限的基础路由如登陆页面，404页面等。如：

```js
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
```
2. asyncRoutes
> 配置需要权限的路由，将可访问路由的角色信息配置到路由的meta属性中，如：

```js
export const asyncRoutes = [
    {
        path: '/page1',
        name: 'Page1',
        component: () => import('../views/RolePage1.vue'),
        meta: { roles: ['admin'] } // 表示拥有admin角色的用户可以访问当前路由
        meta: { roles: ['admin','kefu'] } // 表示拥有admin和kefu角色的用户可以访问当前路由
    },
    { path: '*', redirect: '/404', hidden: true } // 配置重定向404页面
]
```

3. 注意

> 如果需要配置重定向404页面的话，需要配置在asyncRoutes的最后


4. 完整示例

```js
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

```

### 编写permission的module（src/store/modules/permission）

1. 作用

> 根据用户角色和配置的路由生成当前用户可以访问的路由配置

2. 主要函数
 >`getAsyncRoutes`获取生成的路由，`hasPermission`判断是否有，`GenerateRoutes`根据角色和`asyncRoutes`生成需要添加的路由

* getAsyncRoutes

```js
/**根据角色获取路由配置,并保存用户角色 */
getAsyncRoutes({ commit }, roles) {
  let filterRoutes = GenerateRoutes(asyncRoutes, roles)
  let res = routes.concat(filterRoutes)
  commit('SET_ROUTES', res)
  return res
}
```
* GenerateRoutes

```js
/**
 * 根据角色和配置生成当前用户的路由
 * @param {array} routes 配置的路由
 * @param {array} roles 用户角色
 */
let GenerateRoutes = (routes, roles) => {
  let res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = GenerateRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
```

* hasPermission

```js
/**
 * 通过meta中的roles信息判断用户是否有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
```

3. 完整示例

```js
import { routes, asyncRoutes } from '../../router/index.js'

/**
 * 通过meta中的roles信息判断用户是否有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 根据角色和配置生成当前用户的路由
 * @param {array} routes 配置的路由
 * @param {array} roles 用户角色
 */
let GenerateRoutes = (routes, roles) => {
  let res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = GenerateRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
const permission = {
  state: {
    roles: [],
    routes: routes // 用于配置页面导航等
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    }
  },
  actions: {
    /**根据角色获取路由配置 */
    getAsyncRoutes({ commit }, roles) {
      commit('SET_ROLES', roles) // 保存roles信息到store中
      let filterRoutes = GenerateRoutes(asyncRoutes, roles)
      let res = routes.concat(filterRoutes)
      commit('SET_ROUTES', res)
      return res
    }
  }
}
export default permission
```

### 编写全局路由钩子

1. 逻辑流程图

![](https://user-gold-cdn.xitu.io/2020/3/9/170be678ae69a623?w=1016&h=745&f=png&s=89424)
2. 实现

```js
const whiteList = ['/login', '/404'] // 免登录白名单

router.beforeEach(async (to, from, next) => {
  let token = localStorage.getItem('JWT_TOKEN')
  // 判断登录状态
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      let hasRoles = store.state.user.roles && store.state.user.roles.length > 0
      if (!hasRoles) {
        let userInfo = await store.dispatch('getUser')
        let routes = await store.dispatch('getAsyncRoutes', userInfo.roles)
        router.addRoutes(routes)
        next({ ...to, replace: true }) // 保证路由已挂载
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})
```
3. 注意

- 需要判断`store`中是否已经保存了`roles`，否则会死循环
- 添加新的路由后使用`next({ ...to, replace: true })`保证路由已挂载完成



