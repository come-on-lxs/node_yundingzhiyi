import Cookies from 'js-cookie'
import { getUserInfo } from '@/api/login'

const state = {
  userInfo: {}
}

const mutations={
  GET_USER: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        commit('GET_USER', res.data)
        resolve({
          routes: []
        })
      }).catch(e => {
        reject(e)
      })
    })
  },
  resetToken() {
    return new Promise(resolve => {
      localStorage.removeItem('hasLogin')
      localStorage.removeItem('token')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
