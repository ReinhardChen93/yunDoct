<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="name" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div class="box">
        <div class="box-list">
          <div class="box-list-left">
            <span class="iconfont iconask blue"></span>
          </div>
          <div class="box-list-right border">
            {{msg.Title}}
          </div>
        </div>
        <div class="box-list">
          <div class="box-list-left">
            <span class="iconfont iconanswerA gree"></span>
          </div>
          <div class="box-list-right">
             {{msg.Content}}
          </div>
        </div>
      </div>
      <commonBottom class="bottom-style" />
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
  data () {
    return {
      name: '',
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
      topicId: '',
      msg: {}
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    GetHelpDocument () {
      ajax.GetHelpDocument(this.topicId).then(res => {
        this.msg = res.data.data
      })
    }
  },
  created () {
    this.topicId = this.$route.query.topicId
    this.name = this.$route.query.name
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    this.GetHelpDocument()
    window['closeWebViewPage'] = this.closeWebViewPage
  },
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    this.headHeight = `${headHeight / 37.5}rem`
    // 减去nav页面后body高度
    this.navHeight = `calc(100vh - ${headHeight / 37.5}rem)`
    // 内容高度
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
  .content {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    /*ios平滑弹性滚动*/
    font-size: 14px;
  }
  .box {
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 10px;
    padding: 15px;
  }
  .box-list {
    display: flex;
    margin-bottom: 15px;
  }
  .box-list-left {
    flex: 1.5;
    text-align: center;
    padding: 15px 0;
  }
  .box-list-left span {
    font-size: 32px;
  }
  .box-list-right {
    flex: 8.5;
    text-align: left;
    font-size: 14px;
    padding: 15px 0;
  }
  .blue {
    color: #28B8FF;
  }
  .gree {
    color: #37c897;
  }
  .border {
    border-bottom: 1px solid #E6E9F0;
  }
</style>
