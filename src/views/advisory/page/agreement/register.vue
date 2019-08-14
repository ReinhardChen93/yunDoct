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
        <span>云医在线医生协议</span>
      </div>
      <!-- 协议正文 -->
      <div class="agreement-content">
        医生在使用云医在线APP服务前，应当仔细阅读《云医在线医生协议》的全部内容，尤其是涉及到您重大权益的文字。本协议经勾选，即成为对医生和云医在线有约束力的法律文件。
        <br />
        <b>一、相关定义</b>
        <br />
        1.云医在线：指云医在线服务平台的经营者。
        <br />
        2.用户：指完成云医在线平台注册程序，获得登录权限的正式注册会员。
        <br />
        3.医生：指具有医生资格和资质，并完成云医在线平台注册程序的医生。
        <br />
        <br />
        <b>二、医生资格</b>
        <br />
        1.医生欲加入云医在线平台使用本协议项下服务，须向云医在线平台提供真实、有效、合法、准确的个人信息（包括但不限于医生资质、资格、身份信息等信息或证明文件）。
        <br />
        2.当上述信息变更时医生应立即通知云医在线进行更新或自行更新。
        <br />
        3.当上述信息变更后使得医生不再具备履行本协议的情形出现时，应立即通知云医在线，云医在线有权立即终止或中止本协议。
        <br />
        4.医生同意为其未及时地通知或更新其信息所造成的后果承担全部责任。
        <br />
        <br />
        <b>三、医生声明与保证</b>
        <br />
        1.树立敬业求实精神，遵守职业道德，持有同情心，尽职尽责的为用户开展咨询服务。
        <br />
        2.关心、爱护、尊重用户，维护云医在线平台秩序，避免在提供在线服务时与患者出现纠纷。
        <br />
        3.对提供服务过程中所获知的患者信息具有保密义务，保护其个人隐私，不得泄露。
        <br />
        4.若医生提交错误、虚假信息（包括但不限于医生资质、资格、身份信息等信息或证明文件）产生的法律责任，由医生独立承担。
        <br />
        5.医生保证在云医在线上发布的任何信息真实、准确、合法，没有任何夸大或虚假内容，同时不发布任何有损国家、集体、他人合法权益内容的信息。
        <br />
        6.医生在使用云医在线提供的服务时，不得有下列行为：
        <br />
        （1）利用云医在线从事洗钱、窃取商业秘密、窃取个人信息等违法犯罪活动；
        <br />
        （2）将有关干扰、破坏或限制任何计算机软件、硬件或通讯设备功能的软件病毒或其他计算机代码、档案和程序之资料，加以加载、发布、发送电子邮件或以其他方式传送；
        <br />
        （3）干扰云医在线平台正常运行，非法入侵云医在线服务器、篡改云医在线代码或其他损害云医在线系统的行为；
        <br />
        （4）将在本系统注册的个人账号交由他人使用并由此开展服务。
        <br />
        （5）其他损害他人或云医在线合法权益的行为。
        <br />
        7.医生保证除履行本协议的目的外，不将从云医在线获取的任何数据做商业性利用，也不得披露给任何第三方。
        <br />
        8.医生不得通过不正当手段谋取利益。
        <br />
        <br />
        <b>四、云医在线服务内容及方式</b>
        <br />
        1.医生签订本协议并经过云医在线平台审核通过后，可享受平台上的服务。
        <br />
        2.对于医生与用户之间的任何咨询内容云医在线作为一个沟通交流平台不予评价并不承担任何责任。
        <br />
        <br />
        <b>五、医生服务内容及方式</b>
        <br />
        1.医生在为用户提供线上咨询时只能提供信息和建议，不能涉及问诊，不能开处方。若涉及问诊，由此带来的任何后果均由医生本人承担。
        <br />
        2.医生应审慎开展咨询服务，对自己的问答内容负责，确保质量与安全。
        <br />
        3.医生理解并同意，因医生违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，由医生独立承担责任；云医在线由此遭受损失的，医生也应当一并赔偿。
        <br />
        4.医生可在系统后台自行设定服务模式，若开启服务模式，应在用户提出咨询后30分钟内进行答复，否则，用户有权申请退还咨询费用。
        <br />
        <br />
        <b>六、违约责任</b>
        <br />
        如一方发生违反本协议的行为，守约方可以书面通知方式要求违约方在指定的期限内停止违约行为，并就违约行为造成的损失进行索赔，如违约方未能按时停止违约行为，则守约方有权立即终止本协议。
        <br />
        <br />
        <b>七、通知和公告</b>
        <br />
        1.云医在线向医生发送的所有公告，将通过页面公告或者电子邮件的方式送达。
        <br />
        2.云医在线通过电子邮件或短信等方式发送的信息，均以医生注册时自行填写和提交的信息为准，如因医生提交的信息错误或虚假造成相关通知和公告没有送达的，云医在线不承担责任。
        <br />
        <br />
        <b>八、争议解决及其他</b>
        <br />
        1.本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。
        <br />
        2.本协议规定是可分割的，部分条款的无效或无法执行不影响其他条款的效力。
        <br />
        3.如双方就本协议内容或其执行发生任何争议，双方应尽力友好协商解决，协商不成时，任何一方均可向云医在线平台所在地人民法院提起诉讼。
        <br />
      </div>
    </div>
    <!-- 协议底部 -->
    <div class="agreement-footer">
      <div>
        <p @click="getNotAgree"></p>
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
  name: 'register',
  data () {
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
    hideLoading () {
      // 跳转到原生首页
      if (this.origin === 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          console.log('33')
          this.$bridge.callhandler('dismissLoadingDialog', null, (data) => {
            console.log('2')
          })
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callHandler('dismissLoadingDialog', null, (data) => {})
        }
      }
    },
    // 同意协议
    getAgree () {
      this.back()
    },
    // 不同意
    getNotAgree () {
      // 跳转到原生首页
      this.back()
    },
    // 返回
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
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    this.headHeight = `${headHeight}px`
    // 当前页面高度
    this.navHeight = `calc(100vh - ${headHeight}px)`
    // 内容高度
    this.contentHeight = `calc(${this.navHeight} - ${44 / 37.5}rem)`
  },
  created () {
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
    z-index:999;
  }
  .headOuter >>> .customHeader{
    border-bottom: 1px solid #E6E9F0;
    color: #303133;
  }
  .advisoryOut {
    background: rgba(255, 255, 255, 1);
    color: #303133;
    font-size: 14px;
  }
  .advisoryContent{
    position: fixed;
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
  .agreement-footer div{
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    box-sizing: border-box;
  }
  .agreement-footer p:nth-child(2) {
    color: #358FF3;
  }
</style>
