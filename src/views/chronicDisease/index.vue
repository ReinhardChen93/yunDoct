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
      <div class="referralMenu" v-for="item in data" :key="item.DiseaseId" @click="goPage(item)">
        <div class="menu-left">
          <div class="menu-top">
            <img class="referral-icon" :src="item.Logo" />
            <p>{{item.Name}}</p>
          </div>
          <div class="menu-bottom">
            <div class="menu-bottom-left">
              患者总数：<span>{{item.NumberTotal}}</span>
            </div>
            <div class="menu-bottom-right">
              异常人数：<span>{{item.Abnormal}}</span>
            </div>
          </div>
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
        refRate: '',
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
      GetChronicDiseases() {
        ajax.GetChronicDiseases().then(res => {
          this.data = res.data.data
        })
      },
      goPage(item) {
        if (item.DiseaseId == 1) {
          this.$router.push({
            path: '/chronicDiseaseList_blood',
            query: {
              name: item.Name,
              diseaseId: item.DiseaseId,
            }
          })
        } else if (item.DiseaseId == 2) {
          this.$router.push({
            path: '/chronicDiseaseList_diabetes',
            query: {
              name: item.Name,
              diseaseId: item.DiseaseId,
            }
          })
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
      this.userAgent = window.navigator.userAgent.toUpperCase()
      window['closeWebViewPage'] = this.closeWebViewPage
      window['dismissLoadingDialog'] = this.dismissLoadingDialog
      // 关闭原生loding
      this.hideLoading()
      this.GetChronicDiseases()
    },
    mounted() {
      // 头部元素高度
      this.headHeight = ((this.$refs.head.$el.offsetHeight) / 37.5).toFixed(2)
      // 当前页面高度
      let clientHeight = ((parseFloat(`${document.body.clientHeight}`)) / 37.5).toFixed(2)
      this.contentHeight = (clientHeight - this.headHeight).toFixed(2)
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
  .referralContent {
    position: fixed;
    width: 100%;
  }
  .topImg {
    height: 289px;
    width: 375px;
    background: url("~@/assets/chronicDisease/chronicDisease.png") no-repeat;
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
    background: url("~@/assets/chronicDisease/text.png") no-repeat;
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
    padding: 22px 20px 22px 20px;
    box-sizing: border-box;
  }
  .menu-left {
    justify-content: space-between;
    align-items: center;
    flex: 9;
  }
  .menu-top {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
  }
  .menu-left img {
    height: 30px;
    width: 30px;
    background-size: contain;
    margin-right: 18px;
  }
  .menu-left p {
    font-size: 18px;
    font-weight: 500;
  }
  .menu-right {
    flex: 1;
    text-align: center;
  }
  .menu-right>>>.van-icon {
    color: #D6D7DC;
  }
  .menu-bottom {
    display: flex;
    font-size: 12px;
    color: #909399;
    margin-left: 48px;
  }
  .menu-bottom-left {
    flex: 1;
    text-align: left;
  }
  .menu-bottom-left span {
    color: #358FF3;
  }
  .menu-bottom-right {
    flex: 1;
    text-align: right;
  }
  .menu-bottom-right span {
    color: #FF6A5B;
  }
</style>
