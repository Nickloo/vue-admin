import router from './router'
import store from './store'

const whiteList = ['/login'] //免登陆白名单

router.beforeEach(async (to, from, next) => {
  let token = localStorage.getItem('JWT_TOKEN')
  // 判断登陆状态
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      let hasRoles = store.state.permission.roles && store.state.permission.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        let userInfo = await store.dispatch('getUser')
        let roles = userInfo.roles
        let routes = await store.dispatch('getAsyncRoutes', roles)
        router.addRoutes(routes)
        next({ ...to, replace: true }) // 保证路由已挂载
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