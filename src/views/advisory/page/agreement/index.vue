<template>
  <div class="advisoryOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :name="'用户协议'" @back="back" :isBlack="isBlack" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="advisoryContent" :style="{marginTop:this.headHeight,height: this.contentHeight}">
      <!-- 协议头部 -->
      <div class="agreement-header">
        <span>“云医在线”个人医疗咨询服务合作协议</span>
        <span>(财务条款)</span>
      </div>
      <!-- 协议正文 -->
      <div class="agreement-content">
        <div class="content-box">
          <p class="content-title">1.云医在线服务：</p>
          <p>&nbsp;&nbsp;甲方向乙方提供的“云医在线”软件系统医疗服务平台及其附随提供医疗咨询服务款项的代收代付服务，乙方可在本协议签署并履行后通过甲方网站使用云医在线服务。</p>
        </div>
        <div class="content-box">
          <p class="content-title">2.交易流量：</p>
          <p>&nbsp;&nbsp;指根据甲方软件系统所统计的含“用户识别代码”的用户及用户通过“支付宝”“微信”“一网通”等支付端口所发生的“云医在线”医疗服务相关的全部交易流量。</p>
        </div>
        <div class="content-box">
          <p class="content-title">3.医疗服务平台及代收代付服务：</p>
          <p>&nbsp;&nbsp;为乙方提供“云医在线”医疗服务软件平台，以及乙方与用户间各种形式的医疗咨询服务款项代收代付的服务。甲方向乙方提供云医在线后台管理帐号，用于后者即时查询双方项目合作中乙方的款项收支明细和余额。</p>
        </div>
        <div class="content-box">
          <p class="content-title">4.提供在线查询系统：</p>
          <p>&nbsp;&nbsp;为乙方设立网上交易查询功能，为乙方提供信息管理和信息查询服务系统，用于二十四小时即时在线查询。</p>
        </div>
        <div class="content-box">
          <p class="content-title">5.服务费用：</p>
          <p>&nbsp;&nbsp;在本协议有效期内，甲方支付平台免费提供给乙方使用，不向乙方收取任何费用，但甲方保留随时向乙方收取支付平台使用费的权利，甲方需提早通知乙方，乙方如不同意该收费标准，则甲方有权在通知之日起的后终止提供服务。 如双方对收费标准达成一致，则可另订立收费协议作为本协议的补充条款后实施，也可另立合同后实施。
          </p>
        </div>
        <div class="content-box">
          <p class="content-title">6.结算和退款：</p>
          <p>&nbsp;&nbsp;甲乙双方根据云医在线提供的交易流水查询系统，以月为一结算周期，并于交易业务发生的次月20日前将其保管或受托管理的乙方的医疗咨询服务款项汇入乙方的指定帐号。该帐户信息应准确且限合法的银行帐户，乙方将承担因帐户信息不正确而造成的相应损失。</p>
        </div>
      </div>
    </div>
    <!-- 协议底部 -->
    <div class="agreement-footer">
      <div>
        <p @click="getNotAgree">不同意</p>
        <p @click="getAgree">同意</p>
      </div>
      <commonBottom class="bottom-style" />
    </div>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
  import commonBottom from '@/components/bottom/commonBottom'
  import ajax from '@/api/index'
  export default {
    name: 'agreement',
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
        // 按钮是否显示
        // BtnDisable: false
        contentHeight: ''
      }
    },
    components: {
      commonHeader,
      commonBottom
    },
    methods: {
      // 关闭原生loding
      hideLoading() {
        // 跳转到原生首页
        if (this.origin === 'YunyiDoctApp') {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('dismissLoadingDialog', null, (data) => {})
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('dismissLoadingDialog', null, (data) => {})
          }
        }
      },
      getAgree() {
        this.$router.push({
          path: '/bindbankcard'
        })
      },
      // 不同意
      getNotAgree() {
        // 跳转到原生首页
        this.back()
      },
      // 返回
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
      }
      // 这是之前同意按钮当滚动到底部才显示的监听方法
      // handleScroll (e) {
      //   console.log(e)
      //   // 变量scrollTop是滚动条滚动时，距离顶部的距离
      //   var scrollTop = e.target.scrollingElement.scrollTop
      //   console.log(scrollTop)
      //   // 变量windowHeight是可视区的高度
      //   var windowHeight = e.target.scrollingElement.clientHeight
      //   // 变量scrollHeight是滚动条的总高度
      //   var scrollHeight = e.target.scrollingElement.scrollHeight
      //   // 滚动条到底部的条件
      //   if (scrollTop + windowHeight == scrollHeight) {
      //     this.BtnDisable = true
      //   }
      // }
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight}px`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight}px)`
      // 内容高度
      this.contentHeight = `calc(${this.navHeight} - ${44 / 37.5}rem)`
    },
    created() {
      this.origin = this.$cookie.get('origin')
      this.userAgent = window.navigator.userAgent.toUpperCase()
      window['dismissLoadingDialog'] = this.dismissLoadingDialog
      window['closeWebViewPage'] = this.closeWebViewPage
      this.hideLoading()
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
  .headOuter>>>.customHeader {
    border-bottom: 1px solid #E6E9F0;
    color: #303133;
  }
  .advisoryOut {
    background: rgba(255, 255, 255, 1);
    color: #303133;
    font-size: 14px;
  }
  .advisoryContent {
    /* position: fixed; */
    width: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    font-size: 14px;
  }
  .agreement-header {
    margin: 20px 0;
  }
  .agreement-header span {
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
  .agreement-content {
    margin: 0 15px 71px 15px;
    font-size: 14px;
    color: #303133;
  }
  .content-box {
    margin-bottom: 20px;
  }
  .content-box:last-child {
    margin-bottom: 0;
  }
  .content-title {
    font-weight: bold;
  }
  .agreement-content p {
    display: inline;
  }
  .agreement-footer {
    box-sizing: border-box;
    position: fixed;
    width: 100%;
    bottom: 0;
    line-height: 44px;
    padding: 0 15px;
    background: #ffffff;
    border-top: 1px solid rgba(48, 49, 51, 0.1);
    z-index: 9999;
  }
  .agreement-footer div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .agreement-footer p:nth-child(2) {
    color: #358FF3;
  }
</style>
