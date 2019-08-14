/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    memberId: '', // 成员ID
    memName: '', // 成员姓名
    reqId: '', // 医院id
    LOADING: false
  },
  mutations: {
    SET_MEMBERID(state, id) {
      state.memberId = id
    },
    SET_MEMNAME(state, name) {
      state.memName = name
    },
    SET_reqId(state, reqid) {
      state.reqId = reqid
    },
    showLoading(state) {
      state.LOADING = true
    },
    hideLoading(state) {
      state.LOADING = false
    }
  },
  actions: {

  }
})
