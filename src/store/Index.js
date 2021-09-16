/* In order to use Vuex in IE11, a polyfill is required */
// import 'es6-promise/auto'

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    // Define what is persistent data, anything else would be in memory
    createPersistedState(
      {
        key: 'standupland',
        paths: [
          'users'
        ]
      }
    )
  ],
  state: {
    users: []
  },
  actions: {
    storeUser ({ commit, state }, data) {
      commit('saveUser', data)
    },
    removeUser ({ commit, state }, data) {
      commit('deleteUser', data)
    },
    removeAllUsers ({ commit }) {
      commit('deleteAllUsers')
    },
  },
  mutations: {
    saveUser (state, data) {
      state.users.push(data)
    },
    deleteUser (state, index) {
      Vue.delete(state.users, index)
    },
    deleteAllUsers (state) {
      console.log('Removing all users')
      state.users = []
      console.log(state.users)
    }
  },
  getters: {
    users: (state) => {
      return state.users
    }
  }
})
