import { USER_INFO, TOKEN } from '../../config/mockData'
const user = {
  state: {
    username: "",
    roles: []
  },
  mutations: {
    SET_USER: (state, data) => {
      state.username = data.username,
        state.roles = data.roles
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    }
  },
  actions: {
    /**
     * 模拟登录
     */
    async login() {
      localStorage.JWT_TOKEN = TOKEN
      return TOKEN
    },
    /**
     * 模拟获取用户信息 
     */
    async getUser({ commit }) {
      let userInfo = USER_INFO
      commit('SET_USER', userInfo)
      commit('SET_ROLES', userInfo.roles) // 保存roles信息到store中
      return userInfo
    }
  },
}
export default user