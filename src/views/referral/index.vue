<template>
  <div class="referralOut">
    <!-- 头 -->
    <div class="topImg"></div>
    <commonHeader ref="head" :isBlack="isBlack" @back="back" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    <!-- 内容 -->
    <div class="referralContent" :style="{marginTop:this.headHeight+'rem',height: this.contentHeight+'rem'}">
      <div class="referralTitle">
        <h4></h4>
        <p>智慧医疗 互联互通</p>
      </div>
      <div class="referralMenu" @click="goPage(1)">
        <div class="menu-left">
          <i class="referral-icon"></i>
          <p>双向转诊</p>
        </div>
        <div class="menu-right">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="referralMenu">
        <div class="menu-left">
          <i class="consultation-icon"></i>
          <p>远程会诊</p>
        </div>
        <div class="menu-right">
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="referralMenu">
        <div class="menu-left">
          <i class="remote-icon"></i>
          <p>远程预约</p>
        </div>
        <div class="menu-right">
          <van-icon name="arrow" />
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
    data() {
      return {
        // 头部元素颜色
        bgColor: '',
        color: '#fff',
        // 传给原生的值（判断字体是否是黑色）
        isBlack: false,
        // 头部元素高度
        headHeight: '',
        // 头部是否要返回按钮
        isBack: true,
        // 返回按钮图片
        returnImg: require('@/assets/backW.png'),
        // 内容高度
        contentHeight: '',
        data: '',
        // 总收益
        total: 0,
        // 咨询数
        count: '',
        // 退费数
        refCount: '',
        // 退费率
        refRate: ''
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
      goPage(index) {
        console.log(typeof index)
        switch (index) {
          case 1:
            this.$router.push({
              path: '/doubleReferral',
              query: {}
            })
            break
          case 2:
            this.$router.push({
              path: '/serviceHours',
              query: {}
            })
            break
          case 3:
            this.$router.push({
              path: '/serviceHours',
              query: {}
            })
            break
        }
      },
      // 关闭原生loding
      hideLoading() {
        //跳转到原生首页
        if (this.origin == 'YunyiDoctApp') {
          if (this.userAgent.indexOf("IPHONE") > -1) {
            this.$bridge.callhandler('dismissLoadingDialog', null, (data) => {})
          } else {
            // Android
            //第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('dismissLoadingDialog', null, (data) => {})
          }
        }
      }
    },
    created() {
      this.origin = this.$cookie.get('origin')
      console.log('tag', this.origin)
      this.userAgent = window.navigator.userAgent.toUpperCase()
      window['closeWebViewPage'] = this.closeWebViewPage
      console.log('tag', this.$cookie.get('Authorization'))
      // 关闭原生loding
      this.hideLoading()
    },
    mounted() {
      // 头部元素高度
      this.headHeight = ((this.$refs.head.$el.offsetHeight) / 37.5).toFixed(2)
      console.log('tag', this.headHeight)
      // 当前页面高度
      let clientHeight = ((parseFloat(`${document.body.clientHeight}`)) / 37.5).toFixed(2)
      console.log('tag', clientHeight)
      this.contentHeight = (clientHeight - this.headHeight).toFixed(2)
      console.log('tag', this.contentHeight)
    }
  }
</script>

<style scoped>
  .referralContent {
    position: fixed;
    width: 100%;
  }
  .topImg {
    height: 289px;
    width: 375px;
    background: url("~@/assets/referral/titleremote.png") no-repeat;
    background-size: contain;
    position: fixed;
  }
  .referralTitle {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 20px 35px;
    color: #fff;
    letter-spacing: 1px;
  }
  .referralTitle h4 {
    font-size: 22px;
    height: 22px;
    width: 124px;
    background: url("~@/assets/referral/referralText.png") no-repeat;
    background-size: contain;
  }
  .referralTitle p {
    margin-top: 10px;
    font-size: 14px;
  }
  .referralMenu:not(:first-child) {
    margin: 26px 15px 15px 15px;
  }
  .referralMenu {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 8px 0px rgba(238, 238, 238, 0.5);
    border-radius: 4px;
    margin: 20px 15px;
    font-size: 18px;
    padding: 35px 30px;
  }
  .menu-left {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .menu-left i {
    height: 30px;
    width: 30px;
    background-size: contain;
    margin-right: 18px;
  }
  .menu-right>>>.van-icon {
    color: #D6D7DC;
  }
  .referral-icon {
    background: url("~@/assets/referral/referral.png") no-repeat;
  }
  .consultation-icon {
    background: url("~@/assets/referral/consultation.png") no-repeat;
  }
  .remote-icon {
    background: url("~@/assets/referral/remote.png") no-repeat;
  }
</style>
