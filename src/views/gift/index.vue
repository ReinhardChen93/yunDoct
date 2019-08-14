<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'我的礼物'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div class="box" v-if="data.length!=0">
        <div class="box-item" v-for="item in data" :key="item.GiftId" @click="toGiftActive(item)">
          <div class="box-item-left">
            <img :src="item.Image2">
            <span>{{item.GiftName}}</span>
          </div>
          <div class="box-item-right">
            <span class="MR10">{{item.Amount}}{{item.Unit}}</span>
            <span class="iconfont iconziyuan1"></span>
          </div>
        </div>
      </div>
      <NAN :height='this.contentHeight' v-else></NAN>
      <commonBottom class="bottom-style" />
    </div>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
  import commonBottom from '@/components/bottom/commonBottom'
  // ajax
  import ajax from '@/api/index'
  export default {
    components: {
      commonHeader,
      commonBottom
    },
    data() {
      return {
        // 头部元素颜色
        bgColor: '#ffffff',
        color: '#303133',
        // 传给原生的值（判断字体是否是黑色）
        isBlack: true,
        // 头部元素高度
        headHeight: '',
        // 头部是否要返回按钮
        isBack: true,
        // 返回按钮图片
        returnImg: require('@/assets/backB.png'),
        // 内容高度
        contentHeight: '',
        // nav高度
        navHeight: 0,
        data: []
      }
    },
    methods: {
      back() {
        // 跳转到原生首页
        if (this.origin == 'YunyiDoctApp') {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('closeWebViewPage', null, (data) => {})
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('closeWebViewPage', null, (data) => {})
          }
        }
      },
      GetMyGifts() {
        ajax.GetMyGifts().then(res => {
          console.log(res)
          if (res.data.succeed) {
            this.data = res.data.data
          }
        })
      },
      toGiftActive(item) {
        this.$router.push({
          path: '/giftActive',
          query: {
            name: item.GiftName,
            giftId: item.GiftId
          }
        })
      },
      // 隐藏原生loading
      hideLoading() {
        // 跳转到原生首页
        if (this.origin == 'YunyiDoctApp') {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('dismissLoadingDialog', null, (data) => {})
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('dismissLoadingDialog', null, (data) => {})
          }
        }
      }
    },
    created: function() {
      this.origin = this.$cookie.get('origin')
      this.userAgent = window.navigator.userAgent.toUpperCase()
      this.hideLoading()
      window['closeWebViewPage'] = this.closeWebViewPage
      window['dismissLoadingDialog'] = this.dismissLoadingDialog
      this.GetMyGifts()
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight / 37.5}rem`
      // 减去nav页面后body高度
      this.navHeight = `calc(100vh - ${headHeight / 37.5}rem)`
      // 内容高度
      this.contentHeight = `calc(100vh - ${headHeight}px)`
    }
  }
</script>

<style scoped>
  .headOuter {
    position: fixed;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    z-index: 999;
  }
  .content {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    /*ios平滑弹性滚动*/
    font-size: 14px;
  }
  .box {
    padding-top: 10px;
  }
  .box-item {
    width: 100%;
    background: #fff;
    padding: 0 15px;
    height: 60px;
    line-height: 60px;
    display: flex;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .box-item-left {
    flex: 8;
    font-size: 16px;
    color: #333;
    font-weight: 400;
  }
  .box-item-left img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    transform: translateY(10px);
  }
  .box-item-right {
    flex: 2;
    text-align: right;
    color: #909399;
  }
  .MR10 {
    margin-right: 10px;
  }
</style>
