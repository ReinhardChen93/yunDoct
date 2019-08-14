<template>
  <div class="bottomOuter">
    <div class="iphoneBottom" v-if="iphonex"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        iphonex: false
      }
    },
    methods: {
      // 机型判断
      iphoneOrIphonex() {
        let origin = this.$cookie.get('origin')
        if (origin === 'YunyiDoctApp') {
          let userAgent = window.navigator.userAgent.toUpperCase()
          if (userAgent.indexOf('IPHONE') > -1) {
            if (window.screen.width <= 414 && window.screen.width >= 375 && window.screen.height >= 812 && window.screen.height <= 896) {
              // 是iphoneX
              this.iphonex = true
            } else {
              // 不是iphoneX
              this.iphonex = false
            }
          }
        }
      }
    },
    created() {
      this.iphoneOrIphonex()
    }
  }
</script>

<style scope>
  .iphoneBottom {
    width: 100%;
    height: 34px;
    z-index: 999;
    bottom: 0;
  }
</style>
