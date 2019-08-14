<template>
  <div class="detailsOuter">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :name="headName" :isBlack="isBlack" @back="back" :skip="'确定'" :color="color" :bgColor="bgColor" @skip="skip" :isBack="isBack" :returnImg="returnImg">\</commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:contentHeight}">
      <div class="title">你可以自定义价格，也可以选择下面的参考价</div>
      <div class="design" @click="toTurnDesign">自定义</div>
      <div class="list">
        <ul>
          <li v-for="(i,index) in cost" :key="index" @click="takeCost(i,index)">
            <span>{{i.name}}元/次</span>
            <img src="@/assets/advisory/yes.png" alt="" v-if="i.choose">
          </li>
          <li class="last" @click="noProvide">不提供</li>
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
      bgColor: '#ffffff',
      color: '#303133',
      // 传给原生的值（判断字体是否是黑色）
      isBlack: true,
      // 头部元素高度
      headHeight: '',
      // 头部名称
      headName: '',
      // 头部是否要返回按钮
      isBack: true,
      // 返回按钮图片
      returnImg: require('@/assets/backB.png'),
      // 内容高度
      contentHeight: '',
      // 价格
      cost: [{
        name: '49',
        choose: false
      },
      {
        name: '99',
        choose: false
      },
      {
        name: '149',
        choose: false
      },
      {
        name: '199',
        choose: false
      },
      {
        name: '249',
        choose: false
      },
      {
        name: '299',
        choose: false
      }
      ],
      // 图文
      graphic: '',
      // 电话
      telphone: '',
      // 视频
      Video: '',
      // 弹窗
      showConfirm: false,
      // 弹窗提示
      titleConfirm: '',
      contentConfirm: '',
      // 金额
      pay: '',
      graphicCost: ''
    }
  },
  methods: {
    // 头部返回按钮
    back () {
      window.history.go(-1)
    },
    // 确认按钮
    skip () {
      if (this.graphic !== undefined) {
        let info = {
          GraphicCost: this.pay,
          Graphic: 1
        }
        ajax.ModifyService(info).then((res) => {
          if (res.data.succeed) {
            // 没有开通跳转服务时间
            if (this.isNotOpen === 0) {
              this.$router.replace({
                path: '/serviceHours',
                query: {
                  isNotOpen: this.isNotOpen
                }
              })
            } else {
              // 开通过直接跳转资费标准首页
              this.$router.replace({
                path: '/advFeeStandard',
                query: {}
              })
            }
          }
        })
      } else if (this.telphone !== undefined) {
        let info = {
          TelphoneCost: this.pay,
          Telphone: 1
        }
        ajax.ModifyService(info).then((res) => {})
      } else {
        let info = {
          VideoCost: this.pay,
          Video: 1
        }
        ajax.ModifyService(info).then((res) => {})
      }
    },
    // 跳转自定义
    toTurnDesign () {
      this.$router.push({
        path: '/feeStandardDesign',
        query: {
          graphic: this.graphic,
          telphone: this.telphone,
          video: this.video,
          // 是否开通
          isNotOpen: this.isNotOpen
        }
      })
    },
    // 清除同意咨询协议
    clearAgree () {
      // 1同意，0不同意
      let info = {
        type: 0
      }
      ajax.AgreeAskContract(info).then((res) => {
        // 跳转到原生首页
        if (this.origin == 'YunyiDoctApp') {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('backToMainPage', null, (data) => {})
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('backToMainPage', null, (data) => {})
          }
        }
      })
    },
    // 不提供---返回上一级
    noProvide () {
      this.titleConfirm = '提示'
      this.contentConfirm = '是否关闭咨询服务'
      let _this = this
      function beforeClose (action, done) {
        if (action === 'confirm') {
          if (_this.graphic !== undefined) {
            let info = {
              GraphicCost: 0,
              Graphic: 0
            }
            ajax.ModifyService(info).then((res) => {
              if (res.data.succeed) {
                // 不同意协议，并返回原生首页
                _this.clearAgree()
                done()
              }
            })
          } else if (_this.telphone !== undefined) {
            let info = {
              TelphoneCost: 0,
              Telphone: 0
            }
            ajax.ModifyService(info).then((res) => {})
          } else {
            let info = {
              VideoCost: 0,
              Video: 0
            }
            ajax.ModifyService(info).then((res) => {})
          }
        } else {
          done()
        }
      }
      this.$dialog.confirm({
        title: this.titleConfirm,
        message: this.contentConfirm,
        beforeClose
      })
    },
    // 提交价钱
    takeCost (data, index) {
      for (let i = 0; i < this.cost.length; i++) {
        this.cost[i].choose = false
      }
      this.pay = data.name
      data.choose = true
    }
  },
  created () {
    // jsBridge
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    window['closeWebViewPage'] = this.closeWebViewPage
    window['backToMainPage'] = this.backToMainPage
    // 图文，电话，视频
    this.graphic = this.$route.query.graphic
    this.telphone = this.$route.query.telphone
    this.video = this.$route.query.video
    this.graphicCost = this.$route.query.graphicCost
    for (let i = 0; i < this.cost.length; i++) {
      if (this.graphicCost == this.cost[i].name) {
        this.cost[i].choose = true
      }
    }
    // 是否开通
    this.isNotOpen = this.$route.query.isNotOpen
    if (this.isNotOpen == 0) {
      this.headName = '设置资费标准'
    } else {
      this.headName = '资费标准'
    }
  },
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    this.headHeight = `${headHeight / 37.5}rem`
    // 内容的高度
    this.contentHeight = `calc(100vh - ${headHeight}px)`
  }
}
</script>

<style scoped>
  .headOuter {
    position: fixed;
    top: 0;
    width: 100%;
  }
  .content {
    position: fixed;
    width: 100%;
    border-bottom: 1px solid #E6E9F0;
    font-size: 14px;
  }
  .title {
    position: relative;
    padding: 0 15px;
    height: 44px;
    color: #909399;
    line-height: 44px;
  }
  .design {
    position: relative;
    padding: 0 15px;
    height: 44px;
    color: #303133;
    line-height: 44px;
    background-color: #fff;
    margin-bottom: 10px;
  }
  .list {
    position: relative;
    width: 100%;
    background-color: #fff;
  }
  .list ul {
    padding: 0 15px;
  }
  .list ul li {
    position: relative;
    width: 100%;
    height: 44px;
    color: #303133;
    line-height: 44px;
    border-bottom: 1px solid #E6E9F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list ul li img {
    width: 12px;
    height: 10px;
  }
  .last {
    border-bottom: 0 !important;
  }
</style>
