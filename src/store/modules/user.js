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
  },
  actions: {
    /**
     * 模拟登陆
     */
    login() {
      localStorage.JWT_TOKEN = TOKEN
    },
    /**
     * 模拟获取用户信息 
     */
    getUser({ commit }) {
      let userInfo = USER_INFO
      commit('SET_USER', userInfo)
      return userInfo
    }
  },
}
export default user