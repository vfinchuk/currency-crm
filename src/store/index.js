import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import info from './modules/info'
import category from './modules/category'
import record from './modules/record'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    setError (state, error) {
      state.error = error
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    async fetchCurrency () {
      const key = process.env.VUE_APP_FIXER
      const res = await fetch(`http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,UAH`)
      return await res.json()
    }
  },
  getters: {
    error: s => s.error
  },
  modules: { auth, info, category, record }
})
