<template>
  <div class="heard-wrapper" ref="title">
    <div :class="[iphone?'iphone':'',iphonex?'iphonex':'']" :style="{'background-color':bgColor}" v-if="iphone==true || iphonex==true"></div>
    <div class="customHeader" :style="{'background-color':bgColor,'color':color}">
      <div class="returnImg" v-if="isBack" @click="backBtn">
        <img :src="returnImg" />
      </div>
      <div class="returnImg1" v-else>
        <span class="backName" v-show="backName!==''" @click="backFun">{{backName}}</span>
      </div>
      <span class="name">{{name}}</span>
      <div class="skipBox">
        <span class="skip" v-show="skip!==''" @click="skipFun">{{skip}}</span>
        <span v-show="moreList!==undefined" @click="openpopup"><van-icon name="ellipsis" size="18px" /></span>
        <span v-show="moment!==undefined" @click="momentFun" ><i class="iconfont iconadd moment"></i></span>
      </div>
    </div>
    <!-- 打开二级菜单 -->
    <div class="popup" v-show="isShow" @click.stop="closepopup">
      <div :class="['popup-box',iphone?'iphoneTop':'',iphonex?'iphonexTop':'']">
        <img src="@/assets/top.png" class="topimg">
        <div class="popup-item" v-for="(item,index) in moreList" :key="index" @click="clickEvent(item,index)">
          <span :class="['iconfont',iconhistory = item.class]"></span>
          <span class="popup-text">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'customHeader',
    props: ['name', 'skip', 'bgColor', 'color', 'isBack', 'returnImg', 'backName', 'isBlack', 'moreList', 'clickEventObj','moment',],
    // name(标题) skip(文字右侧按钮) moreList(更多右侧按钮和二级菜单，传入moreList[{class:'svg名字',name:'菜单名字'，path:'路由地址'}]) bgColor(背景颜色) color(字体颜色) isBack(布尔值) returnImg(返回按钮图片) backName(返回按钮上的文字) isBlack(字体颜色布尔值) clickEventObj(父组件接收事件，参数为Object,下标index) moment(圈子加号)
    data() {
      return {
        iphonex: false,
        iphone: false,
        origin: '',
        isShow: false
      }
    },
    mounted() {},
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
              this.iphone = true
            }
          }
        }
      },
      // 回退
      backBtn() {
        // window.history.go(-1)
        this.$emit('back')
      },
      skipFun() {
        this.$emit('skip')
      },
      backFun() {
        this.$emit('backName')
      },
      momentFun(){
        this.$emit('moment')
      },
      openpopup() {
        this.isShow = true
      },
      closepopup() {
        this.isShow = false
      },
      clickEvent(item, index) {
        this.$emit('clickEventObj', item, index)
      },
      postFontColor() {
        let origin = this.$cookie.get('origin')
        if (origin == 'YunyiDoctApp') {
          let userAgent = window.navigator.userAgent.toUpperCase()
          let info = {
            isBlack: this.isBlack,
            colorRgb: this.colorRgb
          }
          if (userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('updateStateBarColor', info, (data) => {})
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('updateStateBarColor', info, (data) => {})
          }
        }
      }
    },
    created() {
      this.iphoneOrIphonex()
      window['updateStateBarColor'] = this.updateStateBarColor
      this.postFontColor()
    }
  }
</script>
<style scoped>
  .iphone {
    height: 20px;
  }
  .iphonex {
    height: 44px;
  }
  .heard-wrapper {
    position: fixed;
    width: 100%;
    z-index: 999;
    top: 0px;
    box-sizing: border-box;
  }
  .customHeader {
    height: 44px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    box-sizing: border-box;
  }
  .returnImg {
    border: none;
    flex: 1;
    height: 44px;
    display: flex;
    align-items: center;
  }
  .returnImg img {
    width: 21px;
  }
  .returnImg1 {
    font-size: 16px;
    width: auto;
    height: auto;
    border: none;
    flex: 1;
  }
  .name {
    font-size: 18px;
    line-height: 44px;
    text-align: center;
    flex: 1;
    font-weight: 400;
  }
  .skipBox {
    width: auto;
    height: 15px;
    font-size: 16px;
    line-height: 15px;
    flex: 1;
    text-align: right;
  }
  .popup {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99999999;
  }
  .popup-box {
    position: absolute;
    width: 128px;
    background: #fff;
    right: 15px;
    top: 34px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.21);
    border-radius: 4px;
    padding: 0 8px;
    box-sizing: border-box;
  }
  .iphoneTop {
    top: 54px;
  }
  .iphoneTop {
    top: 78px;
  }
  .topimg {
    position: absolute;
    right: 5px;
    top: -8px;
    width: 12px;
  }
  .popup-item {
    font-size: 14px;
    color: #333;
    padding: 8px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #EEEEEE;
  }
  .popup-item:last-child {
    border-bottom: none;
  }
  .popup-text {
    margin-left: 12px;
  }
  .moment{
    font-size: 18px;
    font-weight: bold;
  }
</style>
