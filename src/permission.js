import router from './router'
import store from './store'
/**
 * whiteList中配置免登录的路径，在后台系统中主要为登录页和404页面
 */
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