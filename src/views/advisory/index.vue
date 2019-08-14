<template>
  <div class="advisoryOut">
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <!-- 头 -->
      <commonHeader ref="head" :skip="'总收益'" :isBlack="isBlack" @back="back" :name="'我的咨询'" :color="color" :bgColor="bgColor" @skip="skip" :isBack="isBack" :returnImg="returnImg"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="advisoryContent" :style="{marginTop:this.headHeight}">
      <!-- 总收益 -->
      <div class="topBox">
        <div class="money">
          <div class="text">总收益（元）</div>
          <div class="number">{{this.total}}</div>
        </div>
        <div class="moneyDown">
          <ul>
            <li>
              <span class="number">{{count}}</span>
              <span class="text">咨询数</span>
            </li>
            <li>
              <span class="number">{{refCount}}</span>
              <span class="text">退费数</span>
            </li>
            <li>
              <span class="number">{{refRate}}</span>
              <span class="text">退费率%</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 列表 -->
      <div class="listBox">
        <ul>
          <li @click="toTurnRecord">
            <span>咨询记录</span>
            <img src="../../assets/more.png" alt="">
          </li>
          <li @click="toTurnFeeStandard">
            <span>资费标准</span>
            <img src="../../assets/more.png" alt="">
          </li>
          <li @click="toTurnServiceHours">
            <span>服务时间</span>
            <img src="../../assets/more.png" alt="">
          </li>
          <li @click="toBlankCard" class="notBorder">
            <span>银行账户</span>
            <img src="../../assets/more.png" alt="">
          </li>
        </ul>
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
      bgColor: '#358FF3',
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
      count: 0,
      // 退费数
      refCount: 0,
      // 退费率
      refRate: 0
    }
  },
  methods: {
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
    // 跳转咨询记录
    toTurnRecord () {
      this.$router.push({
        path: '/advisoryRecord',
        query: {}
      })
    },
    // 跳转资费标准
    toTurnFeeStandard () {
      this.$router.push({
        path: '/advFeeStandard',
        query: {}
      })
    },
    // 跳转服务时间
    toTurnServiceHours () {
      this.$router.push({
        path: '/serviceHours',
        query: {}
      })
    },
    toBlankCard(){
       this.$router.push({
        path: '/bindbankcard',
        query: {
          sverType:1
        }
      })
    },
    skip () {
      this.$router.push('/profit')
    },
    // 获取医生的收益。
    getEarnings () {
      ajax.GetEarnings().then((res) => {
        if (res.data.succeed) {
          let data = res.data.data
          this.total = parseInt(data.Total)
          this.count = data.Count
          this.refCount = data.RefundCount
          this.refRate = data.RefundRate
          // 能获取到数据，调用隐藏loading
          this.hideLoading()
        }
      })
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
    }
  },
  created () {
    this.hideLoading()
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    window['closeWebViewPage'] = this.closeWebViewPage
    window['dismissLoadingDialog'] = this.dismissLoadingDialog
    this.getEarnings()
  },
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    this.headHeight = `${headHeight / 37.5}rem`
    // 当前页面高度
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
    z-index:999;
  }
  .advisoryContent {
    position: fixed;
    width: 100%;
  }
  /* 总收益 */
  .topBox {
    position: relative;
    height: 228px;
    background-color: #358FF3;
    padding: 0 15px;
    margin-bottom: 20px;
  }
  .money {
    position: relative;
    width: 100%;
    height: 63%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .money .text {
    font-size: 12px;
    color: #fff;
    margin-bottom: 10px;
    opacity: 0.5;
  }
  .money .number {
    font-size: 36px;
    color: #fff;
    font-weight: bold;
  }
  .moneyDown {
    position: relative;
    width: 100%;
    height: 36%;
  }
  .moneyDown ul {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .moneyDown ul li {
    width: calc(100% / 3);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px 0;
  }
  .moneyDown ul li .number {
    font-size: 16px;
    color: #fff;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .moneyDown ul li .text {
    font-size: 12px;
    color: #fff;
    opacity: 0.5;
  }
  /* 列表 */
  .listBox {
    position: relative;
    width: 100%;
    background-color: #fff;
  }
  .listBox ul {
    padding: 0 15px;
  }
  .listBox ul li {
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #E6E9F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #303133;
    font-size: 14px;
  }
  .listBox ul li img {
    width: 9px;
    height: 12px;
  }
  .notBorder {
    border-bottom: 0px !important;
  }
</style>
