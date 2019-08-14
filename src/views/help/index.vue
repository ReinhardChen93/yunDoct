<template>
  <div>
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <!-- 头 -->
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'帮助与反馈'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg"></commonHeader>
    </div>
    <div class="Content" :style="{marginTop:this.headHeight}">
      <div class="helpbox">
        <div class="helpbox-title">
          <div class="helpbox-title-left" @click="opentel">
            <span class="iconfont iconphone margin10"></span>客服电话
          </div>
          <div class="helpbox-title-right" @click="openFeed">
            <span class="iconfont iconopinion margin10"></span>意见反馈
          </div>
        </div>
        <div class="helpboxList">
          <div class="helpbox-list" v-for="item in list" :key="item.ClassId" @click="consultation(item)">
            <div class="helpbox-list-left">
              {{item.Name}}
            </div>
            <div class="helpbox-list-right">
              <span class="iconfont iconziyuan1"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 头部
import commonHeader from '@/components/header/commonHeader'
// ajax
import ajax from '@/api/index'
export default {
  components: {
    commonHeader
  },
  data () {
    return {
      // 头部元素颜色
      bgColor: '#fff',
      color: '#333',
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
      // 0：患者，1：医生。默认为：0
      type: 1,
      list: []
    }
  },
  created () {
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    this.hideLoading()
    this.GetHelpClasss()
    window['closeWebViewPage'] = this.closeWebViewPage
    window['dismissLoadingDialog'] = this.dismissLoadingDialog
    window['callTelephone'] = this.callTelphone
    window['goToFeedBackPage'] = this.goToFeedBackPage
  },
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    this.headHeight = `${headHeight / 37.5}rem`
    // 当前页面高度
    this.contentHeight = `calc(100vh - ${headHeight}px)`
  },
  methods: {
    GetHelpClasss () {
      ajax.GetHelpClasss(this.type).then(res => {
        this.list = res.data.data
      })
    },
    back () {
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
    // 隐藏原生loading
    hideLoading () {
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
    },
    opentel () {
      this.$dialog.confirm({
        title: '拨打电话',
        message: '0871-65736500'
      }).then(() => {
        // on confirm
        let data = {
          mobile: '0871-65736500'
        }
        // 跳转到原生首页
        if (this.origin == 'YunyiDoctApp') {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('callTelephone', data, (data) => {})
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('callTelephone', data, (data) => {})
          }
        }
      }).catch(() => {
        // on cancel
      })
    },
    openFeed () {
      if (this.origin == 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          this.$bridge.callhandler('goToFeedBackPage', null, (data) => {})
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callHandler('goToFeedBackPage', null, (data) => {})
        }
      }
    },
    consultation (item) {
      this.$router.push({
        path: '/consultationlist',
        query: {
          name: item.Name,
          classId: item.ClassId
        }
      })
    }
  }
}
</script>

<style scoped>
  .headOuter {
    position: fixed;
    top: 0;
    width: 100%;
  }
  .Content {
    position: fixed;
    width: 100%;
  }
  .helpbox-title {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
    background: #fff;
    font-size: 14px;
    height: 44px;
    padding: 12px 0;
    box-sizing: border-box;
    border-top: 1px solid #E6E9F0;
  }
  .margin10 {
    margin-right: 10px;
  }
  .helpbox-title-left {
    text-align: center;
    flex: 1;
    border-right: 1px solid #E6E9F0;
  }
  .helpbox-title-right {
    flex: 1;
    text-align: center;
  }
  .helpbox-nav {
    background: #fff;
  }
  .helpboxList {
    background: #fff;
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
  }
  .helpbox-list {
    border-bottom: 1px solid #E6E9F0;
    padding: 12px 0;
    box-sizing: border-box;
    height: 44px;
    display: flex;
    font-size: 14px;
  }
  .helpbox-list-left {
    flex: 8;
    text-align: left;
    color: #333;
  }
  .helpbox-list-right {
    flex: 2;
    text-align: right;
    color: #D8D8D8;
  }
</style>
