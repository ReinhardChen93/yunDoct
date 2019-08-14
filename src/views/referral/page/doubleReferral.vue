<template>
  <div class="doubleReferralOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'双向转诊'" :skip="'申请转诊'" @skip="ApplicationReferral" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="doubleReferralContent" :style="{marginTop:this.headHeight,height:this.navHeight}">
      <section class="top-menu">
        <div class="top-menu-left" @click="goPage('Apply')">
          <i class="myApply-icon"></i>
          <p>我的申请</p>
        </div>
        <div class="top-menu-right" @click="goPage('deal')">
          <i class="myDispose-icon"></i>
          <p>我的处理</p>
        </div>
      </section>
      <section>
        <p class="tips">- 待处理转诊 -</p>
      </section>
      <div :style="{height:contentHeight}" class="content">
        <section class="menu" v-for="(item, index) in dealInfo" :key="index">
          <div>
            <div class="title">
              <div class="title-left">
                <b>转出医院：<span>{{item.AccHospName}}</span></b>
                <ul>
                  <li>
                    <p>患者：<span>{{item.MemName}}</span></p>
                  </li>
                  <li>
                    <p>性别：<span>{{item.MemSex?'女':'男'}}</span></p>
                  </li>
                  <li>
                    <p>年龄：<span>{{item.MemAge}}</span></p>
                  </li>
                </ul>
              </div>
              <!-- UrgencyLevel 紧急级别(0:普通，1:紧急) -->
              <i class="urgent-icon" :dataleave="item.UrgencyLevel" v-if="item.UrgencyLevel === 1"></i>
              <i class="ordinary-icon" v-else></i>
            </div>
            <ul class="detail">
              <li>转出科别：{{item.AccDeptName}}</li>
              <li>入院日期：{{item.InhospDate}}</li>
              <li>入院诊断：{{item.Diagnosis}}</li>
              <li>申请日期：{{item.ReqDate}}</li>
            </ul>
            <div class="link" @click="checkDetail(item.ReqId,infoType, 1)">
              <span>查看详情</span>
              <div class="link-right">
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </section>
        <commonBottom class="bottom-style" />
      </div>
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
        headHeight: 0,
        // 导航高度
        navHeight: 0,
        // 头部是否要返回按钮
        isBack: true,
        // 返回按钮图片
        returnImg: require('@/assets/backB.png'),
        // 内容高度
        contentHeight: '',
        // 待处理信息
        dealInfo: {},
        infoType: 0 // 信息类型,0进行中,1已完成
      }
    },
    methods: {
      back() {
        window.history.go(-1)
      },
      // 点击查看转诊详细信息
      checkDetail (ReqId, infoType, dataType) {
        this.$router.push({
          path: '/referralDetail',
          query: {
            ReqId,
            infoType,
            dataType
          }
        })
      },
      // 跳转我的申请或者我的处理
      goPage(page) {
        if (page !== 'deal') {
          this.$router.push({
            path: '/myReferralApply',
            query: {}
          })
        } else {
          this.$router.push({
            path: '/myReferralDeal',
            query: {}
          })
        }
      },
      // 获取当前需要处理的转诊信息
      GetRemoteReferralsByDeal(type) {
        ajax.GetRemoteReferralsByDeal(type).then((res) => {
          let result = res.data
          console.log(result)
          if (result.succeed) {
            this.dealInfo = res.data.data
          } else {
            this.$toast(result.msg)
          }
        })
      },
      // 1
      ApplicationReferral() {
        this.$router.push({
          path: '/referralApply',
          query: {}
        })
      }
    },
    created() {
      this.origin = this.$cookie.get('origin')
      console.log('tag', this.origin)
      this.userAgent = window.navigator.userAgent.toUpperCase()
      window['closeWebViewPage'] = this.closeWebViewPage
      console.log('tag', this.$cookie.get('Authorization'))
      this.GetRemoteReferralsByDeal(0)
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight}px`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight}px)`
      // 内容高度
      this.contentHeight = `calc(${this.navHeight} - ${112 / 37.5}rem)`
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
  .content {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .doubleReferralContent {
    position: fixed;
    width: 100%;
    font-size: 14px;
    background: #F8F8F8;
  }
  .doubleReferralOut>>>.customHeader {
    border-bottom: 1px solid #E6E9F0;
    color: #303133;
  }
  .menu {
    background: #FFFFFF;
  }
  .menu:not(:first-child) {
    margin-top: 10px;
  }
  .title {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    margin: 0 15px 15px;
    border-bottom: 1px solid #E6E9F0;
    padding-bottom: 15px;
  }
  .title-left {
    margin-top: 15px!important;
  }
  .title-left li {
    color: #606266;
    margin-right: 20px;
  }
  .title i {
    height: 40px;
    width: 34px;
    background-size: contain;
  }
  .title ul {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    align-items: center;
  }
  .title b {
    font-size: 16px;
    font-weight: 600;
    color: rgba(48, 49, 51, 1);
    line-height: 16px;
  }
  .urgent-icon {
    background: url("~@/assets/referral/urgent.png") no-repeat;
  }
  .ordinary-icon {
    background: url("~@/assets/referral/ordinary.png") no-repeat;
  }
  .tips {
    height: 44px;
    line-height: 44px;
    text-align: center;
    background: #F8F8F8;
    color: #999999;
  }
  .detail {
    font-size: 14px;
    color: rgba(144, 147, 153, 1);
    line-height: 14px;
    margin: 0 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #E6E9F0;
  }
  .detail li {
    margin-top: 10px;
  }
  .link {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 15px;
    color: #909399;
    margin-top: 15px !important;
    line-height: 14px;
  }
  .link i {
    color: #D8D8D8;
  }
  .top-menu {
    display: flex;
    box-sizing: border-box;
    justify-content: space-around;
    align-items: center;
    padding: 10px 0;
    background: #FFFFFF;
    font-size: 14px;
  }
  .top-menu div {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  .top-menu i {
    margin-bottom: 10px;
  }
  .myApply-icon {
    height: 20px;
    width: 20px;
    background: url("~@/assets/referral/myApply.png") no-repeat;
    background-size: contain;
  }
  .myDispose-icon {
    height: 20px;
    width: 20px;
    background: url("~@/assets/referral/myDispose.png") no-repeat;
    background-size: contain;
  }
  .doubleReferralContent>>>.van-button--normal {
    margin: 54px 15px 20px 15px;
    width: 345px;
    height: 44px;
    border-radius: 44px;
    background-color: #358FF3;
    font-size: 16px;
    letter-spacing: 1px;
  }
  .bottom-style {
    background: #ffffff;
  }
</style>
