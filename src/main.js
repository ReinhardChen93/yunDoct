/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './plugins/vant.js'
import 'amfe-flexible/index.js'
import router from './router'
import axios from 'axios'
import "@/assets/icon/iconfont.css" // 图标字体

// jsBridge
import Bridge from './config/bridge'
Vue.prototype.$bridge = Bridge

//import Vconsole from 'vconsole'
//let vConsole = new Vconsole()

// 自适应
import 'amfe-flexible/index.js'
// cookiec
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

Vue.config.productionTip = false

import { List, Tab, Tabs, Field, Cell, CellGroup, Picker, Popup, Button, Toast, Lazyload, ImagePreview, Icon, PullRefresh, ActionSheet, Image, Dialog, DatetimePicker, Loading, Checkbox, CheckboxGroup, Uploader } from 'vant'
Vue.use(List).use(Tab).use(Tabs).use(Field).use(Cell).use(CellGroup).use(Picker).use(Popup).use(Button).use(Toast).use(Lazyload).use(ImagePreview).use(Icon).use(PullRefresh).use(ActionSheet).use(Image).use(Dialog).use(DatetimePicker).use(Loading).use(Checkbox).use(CheckboxGroup).use(Uploader)

// 路由拦截
let loginStatus = true
router.beforeEach((to, from, next) => {
  // 存在不需要加载loading插件的组件
  if (to.meta.routerStatus === true) {
    loginStatus = false
    next()
  } else {
    loginStatus = true
    next()
  }
})
// 发送请求操作,在请求头里加入sessionId
axios.interceptors.request.use(requestConfig => {
  //let Authorizations = `${VueCookie.get("Authorization")}`
  let Authorizations = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwianRpIjoiMWZhOGM4MzUtODhlZS00YTBmLWFmNDMtNWYyMmZhM2U3NDg2IiwiaWF0IjoiMDgvMTIvMjAxOSAwMToxNDoyMiIsInN1aWQiOiI0NTMiLCJydWlkIjoiNDAxOSIsInB3ZCI6IkE0QzZFNDI4OUNCNTE5MEQzNjNCNzIyNTVFOUNGRDc4IiwibmJmIjoxNTY1NTcyNDYyLCJleHAiOjE1NjYwMDQ0NjIsImlzcyI6ImFwaS55dWFueWl6YWl4aWFuLmNvbSIsImF1ZCI6Inl1bnlpIn0.iJZi3mCFPaBMl8MMAYAgaSJ5KMN-O1M9oPF-1_V7nmM`
  requestConfig.headers.Authorization = Authorizations
  // 显示加载插件
  if (loginStatus) {
    store.commit('showLoading')
  }
  return requestConfig;
}, error => {
  return Promise.reject(error);
});

// 请求响应
axios.interceptors.response.use(response => {
  // 响应成功--关闭加载插件
  store.commit('hideLoading')
  // 请求参数后为false弹窗
  if (!response.data.succeed) {
    Dialog.alert({
      title: '错误',
      message: `${response.data.msg}`
    }).then(() => {
      // on close
    })
  }
  return response;
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        Dialog.alert({
          title: '错误',
          message: `请重新登录`
        }).then(() => {
          // on close
        })
        break;
    }
  }
  return Promise.reject(error);
})

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
