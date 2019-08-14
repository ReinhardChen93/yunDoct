<template>
  <div class="myReferralApplyOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'我的处理'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg"></commonHeader>
    </div>
    <div :style="{marginTop:this.headHeight,height:this.navHeight}" class="referralContent">
      <van-tabs v-model="active" swipeable color="#358FF3" line-width="20px" title-active-color="#358FF3" title-inactive-color="#303133" @click="onClick">
        <van-tab v-for="(tab,index) in tabs" :title="tab.name" :key="index" :name="index">
          <div :style="{height:contentHeight}" class="content" v-if="dealInfo.length !== 0">
            <div class="menu">
              <div v-for="item in dealInfo" :key="item.ReqId">
                <div class="title">
                  <div class="title-left">
                    <b>转出医院：<span>{{item.ReqHospName }}</span></b>
                    <ul>
                      <li>
                        <p>患者：<span>{{item.MemName}}</span></p>
                      </li>
                      <li>
                        <p>患者性别：<span>{{item.MemSex?'女':'男'}}</span></p>
                      </li>
                      <li>
                        <p>年龄：<span>{{item.MemAge}}</span></p>
                      </li>
                    </ul>
                  </div>
                  <!-- infoType 已完成(0:未完成，1:已完成) -->
                  <div class="icon-right" v-if="infoType">
                    <i class="agree-icon" :dataleave="item.State" v-if="item.State === 1"></i>
                    <i class="disagree-icon" v-else></i>
                  </div>
                  <div class="icon-right" v-else>
                    <i class="urgent-icon" :dataleave="item.UrgencyLevel" v-if="item.UrgencyLevel === 1"></i>
                    <i class="ordinary-icon" v-else></i>
                  </div>
                </div>
                <ul class="detail">
                  <li>转入科别：{{item.AccMappingName}}</li>
                  <li>入院日期：{{item.TransferData }}</li>
                  <li>入院诊断：{{item.Diagnosis }}</li>
                  <li>申请日期：{{item.ReqDate }}</li>
                </ul>
                <!-- 底部跳转panel的样式判断 -->
                <div class="link" @click="checkDetail(item.ReqId,infoType, 1)">
                  <div class="link-left">
                    <span>查看详情</span>
                  </div>
                  <div class="link-right">
                    <van-icon name="arrow" />
                  </div>
                </div>
              </div>
              <commonBottom class="bottom-style" />
            </div>
          </div>
          <NAN :height="contentHeight" v-else />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
  import commonBottom from '@/components/bottom/commonBottom'
  import NAN from '@/components/NAN'
  // ajax
  import ajax from '@/api/index'
  export default {
    components: {
      commonHeader,
      commonBottom,
      NAN
    },
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
        // 内容高度
        contentHeight: '',
        // nav高度
        navHeight: 0,
        active: 0,
        tabs: [{
            name: '进行中'
          },
          {
            name: '已完成'
          }
        ],
        list: {
          items: [],
          refreshing: false,
          loading: false,
          error: false,
          finished: false
        },
        dealInfo: '', // 详细信息
        infoType: 0 // 信息类型,0进行中,1已完成
      }
    },
    methods: {
      back() {
        window.history.go(-1)
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
      // 获取我的处理
      GetRemoteReferralsByDeal(type) {
        ajax.GetRemoteReferralsByDeal(type).then((res) => {
          let result = res.data
          console.log(result)
          if (result.succeed) {
            this.dealInfo = res.data.data
            console.log(this.dealInfo)
          } else {
            this.$toast(result.msg)
          }
        })
      },
      // 点击tab切换type
      onClick(name) {
        this.infoType = name
        this.GetRemoteReferralsByDeal(name)
        console.log(this.infoType)
      },
      // 查看详情
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
    },
    created: function() {
      this.origin = this.$cookie.get('origin')
      console.log('tag', this.origin)
      this.userAgent = window.navigator.userAgent.toUpperCase()
      window['closeWebViewPage'] = this.closeWebViewPage
      console.log('tag', this.$cookie.get('Authorization'))
      // 获取我的申请
      this.GetRemoteReferralsByDeal(0)
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight}px`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight}px)`
      // 内容高度
      this.contentHeight = `calc(${this.navHeight} - ${44 / 37.5}rem)`
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
  .content {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    font-size: 14px;
  }
  .NaN {
    background: url("~@/assets/empty.png") no-repeat center;
    background-size: 126px;
  }
  .referralContent {
    position: fixed;
    width: 100%;
  }
  .menu div {
    background: #FFFFFF;
    margin-top: 10px;
  }
  .menu div:first-child {
    margin-top: 0;
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
    padding-top: 15px;
  }
  .title-left li {
    color: #606266;
    margin-right: 10px;
  }
  .icon-right i {
    height: 40px;
    width: 46px;
    display: inline-block;
    background-size: contain;
  }
  .title ul {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  .title b {
    font-size: 16px;
    font-weight: 600;
    color: rgba(48, 49, 51, 1);
    line-height: 16px;
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
  }
  .link-left {
    display: flex;
  }
  .link-left p {
    box-sizing: border-box;
    width: 56px;
    height: 24px;
    margin-right: 10px;
    text-align: center;
  }
  .link-yellow {
    color: #FEC538;
    border-radius: 1px;
    border: 1px solid rgba(254, 197, 56, 1);
  }
  .link-blue {
    color: #358FF3;
    border-radius: 1px;
    border: 1px solid rgba(53, 143, 243, 1);
  }
  .link-right {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    height: 24px;
    line-height: 24px;
  }
  .link-right span {
    margin-right: 10px;
  }
  .link i {
    color: #D8D8D8;
    font-size: 14px;
  }
  .disagree-icon {
    background: url("~@/assets/referral/disagree.png") no-repeat;
  }
  .agree-icon {
    background: url("~@/assets/referral/agree.png") no-repeat;
  }
  .urgent-icon {
    background: url("~@/assets/referral/urgent.png") no-repeat;
  }
  .ordinary-icon {
    background: url("~@/assets/referral/ordinary.png") no-repeat;
  }
  .bottom-style {
    margin-top: 0!important;
  }
</style>
