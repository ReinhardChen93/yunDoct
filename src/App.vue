<template>
  <div id="app">
    <loading v-show="LOADING"></loading>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件 -->
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件 -->
    </router-view>
  </div>
</template>
<script>
import Loading from './components/loading'
import {
  mapState
} from 'vuex'
export default {
  created () {
    if (localStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(localStorage.getItem('store'))))
    }
    // 在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  components: {
    Loading
  },
  computed: {
    ...mapState([
      'LOADING'
    ])
  }
}
</script>
<style>
  * {
    padding: 0px;
    font-family: "微软雅黑";
    margin: 0px;
    /*ios平滑弹性滚动*/
  }
  ul li {
    list-style: none;
  }
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-y: hidden;
    overflow-x: hidden;
  }
  body {
    margin: 0;
    background: rgba(248, 248, 248, 1);
  }
  html,
  body {
    height: 100vh;
    background: #F8F8F8;
  }
  a {
    text-decoration: none;
  }
</style>
