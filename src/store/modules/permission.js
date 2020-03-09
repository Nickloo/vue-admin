import { routes, asyncRoutes } from '../../router/index'

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
    /**根据角色获取路由配置,并保存用户角色 */
    getAsyncRoutes({ commit }, roles) {
      let filterRoutes = GenerateRoutes(asyncRoutes, roles)
      let res = routes.concat(filterRoutes)
      commit('SET_ROUTES', res)
      return res
    }
  }
}
export default permission