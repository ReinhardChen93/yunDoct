<template>
  <div class="serviceOuter">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :skip="'暂不开通'" :isBlack="isBlack" @back="back" @skip="skip" :name="headName" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="content" :style="{marginTop:this.headHeight}">
      <div class="timeBox">
        <div class="timeBox-title">
          <span>开始时间</span>
          <span>结束时间</span>
        </div>
        <div class="timeBox-time">
          <span @click="setStartTime">{{start}}</span>
          <img src="../../../../assets/advisory/time.png" alt="">
          <span @click="setEndTime">{{end}}</span>
        </div>
      </div>
      <div class="setTime">
        <span>服务时间</span>
        <span>{{start}}—{{end}}</span>
      </div>
      <div class="btn">
        <div @click="btnSave">保存</div>
      </div>
    </div>
    <van-popup v-model="showBottom" position="bottom">
      <div class="timeComponents">
        <van-datetime-picker v-model="currentTime" type="time" :min-hour="0" :max-hour="23" @confirm="confirmDate" @cancel="closeDate" />
      </div>
    </van-popup>
  </div>
</template>

<script>
  import commonHeader from '@/components/header/commonHeader'
  import ajax from '@/api/index'
  import {
    setTimeout
  } from 'timers'
  export default {
    data() {
      return {
        // 头部元素颜色
        bgColor: '#ffffff',
        color: '#303133',
        // 传给原生的值（判断字体是否是黑色）
        isBlack: true,
        // 头部元素高度
        headHeight: 0,
        // 头部名称
        headName: '',
        // 头部是否要返回按钮
        isBack: true,
        // 返回按钮图片
        returnImg: require('@/assets/backB.png'),
        // 当前时间
        currentTime: '0',
        // 是否显示底部时间弹窗
        showBottom: false,
        // 时间状态0是开始时间1是结束时间
        state: 0,
        // 开始时间
        start: '00:00',
        // 结束时间
        end: '00:00',
        // 用来判断开始时间是否大于结束时间的
        startHour: 0,
        startMinute: 0,
        endHour: 0,
        endMinute: 0
      }
    },
    components: {
      commonHeader
    },
    methods: {
      back() {
        window.history.go(-1)
      },
      // 清除同意咨询协议
      clearAgree() {
        // 1同意，0不同意
        let info = {
          type: 0
        }
        ajax.AgreeAskContract(info).then((res) => {
          if (res.data.succeed) {
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
        })
      },
      // 暂不开通
      skip() {
        this.titleConfirm = '提示'
        this.contentConfirm = '是否关闭咨询服务'
        let _this = this
        function beforeClose(action, done) {
          console.log(action)
          if (action === 'confirm') {
            let info = {
              GraphicCost: 0,
              Graphic: 0,
              TelphoneCost: 0,
              Telphone: 0,
              VideoCost: 0,
              Video: 0
            }
            ajax.ModifyService(info).then((res) => {
              if (res.data.data) {
                _this.clearAgree()
                done()
              }
            })
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
      // 设置开始时间
      setStartTime() {
        this.showBottom = true
        this.state = 1
      },
      // 设置结束时间
      setEndTime() {
        if (this.state === 0) {
          this.$dialog.alert({
            title: '提示',
            message: '请先设置开始时间'
          }).then(() => {})
        } else {
          this.showBottom = true
          this.state = 2
        }
      },
      // 时间确认按钮
      confirmDate() {
        this.showBottom = false
        if (this.state === 1) {
          let startTime = this.currentTime
          // 将获取到的时间差分成时和分
          this.startHour = parseInt(startTime.split(':')[0])
          this.startMinute = parseInt(startTime.split(':')[1])
          if (startTime == 0) {
            this.start = '00:00'
          } else {
            this.start = startTime
          }
        } else if (this.state === 2) {
          let endTime = this.currentTime
          // 将获取到的时间差分成时和分
          this.endHour = parseInt(endTime.split(':')[0])
          this.endMinute = parseInt(endTime.split(':')[1])
          // 对开始时间和结束时间进行对比
          if (this.endHour > this.startHour) {
            this.end = endTime
            // 提示设置成功，并跳转咨询首页
          } else if (this.endHour == this.startHour) {
            if (this.endMinute > this.startMinute) {
              this.end = endTime
              // 提示设置成功，并跳转咨询首页
            } else {
              this.$dialog.alert({
                title: '提示',
                message: '开始时间不可以大于或等于结束时间'
              }).then(() => {})
            }
          } else {
            this.$dialog.alert({
              title: '提示',
              message: '开始时间不可以大于或等于结束时间'
            }).then(() => {})
          }
        }
      },
      // 时间取消按钮
      closeDate() {
        this.showBottom = false
      },
      // 保存按钮
      btnSave() {
        let info = {
          startTime: this.start,
          endTime: this.end
        }
        ajax.SetOnlineTimes(info).then((res) => {
          // 1同意，0不同意
          let info1 = {
            type: 1
          }
          ajax.AgreeAskContract(info1).then((res) => {
            this.$toast.success('保存成功')
            setTimeout(() => {
              this.$router.push({
                path: '/advisoryIndex',
                query: {
                  // 判断是否是没开通
                  isNotOpen: 1
                }
              })
            }, 2000)
          })
        })
      },
      // 获取时间信息
      getTime() {
        ajax.GetHospDoctInfo().then((res) => {
          let data = res.data.data
          if (data.OnlineStartTime != '') {
            this.start = data.OnlineStartTime
          }
          if (data.OnlineEndTime!= '') {
            this.end = data.OnlineEndTime
          }
        })
      }
    },
    created() {
      // jsBridge
      this.origin = this.$cookie.get('origin')
      this.userAgent = window.navigator.userAgent.toUpperCase()
      window['closeWebViewPage'] = this.closeWebViewPage
      // 是否开通
      this.isNotOpen = this.$route.query.isNotOpen
      if (this.isNotOpen == 0) {
        this.headName = '设置服务时间'
      } else {
        this.headName = '服务时间'
      }
      this.getTime()
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight / 37.5}rem`
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
    padding-top: 10px;
  }
  .timeBox {
    position: relative;
    padding: 0 15px;
    background-color: #fff;
  }
  .timeBox-title {
    position: relative;
    width: 100%;
    padding: 16px 0;
    display: flex;
    justify-content: space-between;
    color: #909399;
    font-size: 14px;
  }
  .timeBox-time {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32px;
    color: #303133;
  }
  .timeBox-time span {
    padding-bottom: 25px;
  }
  .timeBox-time img {
    width: 24px;
    height: 24px;
    padding-bottom: 25px;
  }
  .setTime {
    position: relative;
    padding: 12px 15px;
    color: #303133;
    font-size: 14px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  .btn {
    position: relative;
    padding: 0 15px;
    margin-top: 40px;
  }
  .btn div {
    position: relative;
    width: 100%;
    height: 44px;
    background-color: #358FF3;
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 44px;
    border-radius: 22px;
  }
  .timeComponents {
    /* position: fixed; */
    width: 100%;
    bottom: 0;
    z-index: 9999;
  }
</style>
