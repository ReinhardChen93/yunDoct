<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="name" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div v-show="data.length!=0">
        <div class="box" v-for="item in data" :key="item.TopicId" @click="toConsultation(item)">
          <div class="box-left">{{item.Title}}</div>
          <div class="box-right">
            <span class="iconfont iconziyuan1"></span>
          </div>
        </div>
      </div>
      <NAN :height='this.contentHeight' v-show="data.length==0"></NAN>
      <commonBottom class="bottom-style" />
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
      classId: '',
      data: []
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    toConsultation (item) {
      this.$router.push({
        path: '/consultation',
        query: {
          name: item.Title,
          topicId: item.TopicId
        }
      })
    },
    GetHelpDocuments () {
      ajax.GetHelpDocuments(this.classId).then(res => {
        this.data = res.data.data
        console.log(this.data.length)
      })
    }
  },
  created () {
    this.name = this.$route.query.name
    this.classId = this.$route.query.classId
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    this.GetHelpDocuments()
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
  .box:first-child {
    margin-top: 10px;
  }
  .box {
    background: #fff;
    border-bottom: 1px solid #E6E9F0;
    height: 44px;
    line-height: 44px;
    display: flex;
    box-sizing: border-box;
    padding: 0 15px;
  }
  .box-left {
    flex: 8;
    text-align: left;
    color: #333;
  }
  .box-right {
    flex: 2;
    text-align: right;
    color: #D8D8D8;
  }
</style>
