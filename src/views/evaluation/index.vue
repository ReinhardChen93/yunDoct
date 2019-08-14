<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'用户评价'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div v-if="data.length!=0">
        <van-pull-refresh v-model="list.refreshing" @refresh="onRefresh">
          <van-list v-model="list.loading" :finished="list.finished" :finished-text="'没更多内容了'" @load="onLoad" :immediate-check=false>
            <div class="box">
              <div class="box-list">
                <div class="box-item" v-for="item in data" :key="item.BusId">
                  <div class="box-start coloryellow">
                    <span class="iconfont iconscore startStyle" v-for="list in item.EvalStar" :key="list"></span>
                  </div>
                  <div class="box-cantent">{{item.EvalContent}}</div>
                  <div class="box-usermwsg">
                    <div class="box-usermwsg-left" v-if="item.BusType==0">对医生评价</div>
                    <div class="box-usermwsg-left" v-if="item.BusType==1">挂号就诊</div>
                    <div class="box-usermwsg-left" v-if="item.BusType==2">问诊</div>
                    <div class="box-usermwsg-right">{{item.EvalDate}}</div>
                  </div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <NAN :height='this.contentHeight' v-else></NAN>
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
      // 页数
      pageIndex: 0,
      // 条数
      pageSize: 10,
      // 业务类别，0：无，1：挂号就诊，2：问诊。
      busType: 0,
      data: [],
      list: {
        items: [],
        refreshing: false,
        loading: false,
        error: false,
        finished: false
      }
    }
  },
  methods: {
    GetEvaluatesByToken () {
      ajax.GetEvaluatesByToken(this.busType, this.pageIndex, this.pageSize).then(res => {
        console.log(res)
        let data = res.data.data
        data.map((val, index) => {
          this.data.push(val)
        })
        if (this.pageSize > data.length) {
          this.list.finished = true
          this.list.loading = false
        }
      })
    },
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
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.data = []
        this.pageIndex = 0
        this.GetEvaluatesByToken()
        this.list.finished = false
        this.list.refreshing = false
        window.scrollTo(0, 10)
      }, 1000)
    },
    onLoad () {
      this.pageIndex += 1
      setTimeout(() => {
        this.GetEvaluatesByToken()
      }, 500)
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
  created: function () {
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    this.hideLoading()
    window['closeWebViewPage'] = this.closeWebViewPage
    window['dismissLoadingDialog'] = this.dismissLoadingDialog
    this.GetEvaluatesByToken()
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
    padding-top: 10px;
    box-sizing: border-box;
  }
  .box-list {
    padding: 15px;
    background: #fff;
    box-sizing: border-box;
    width: 100%;
  }
  .box-item {
    width: 100%;
    border-bottom: 1px solid #E6E9F0;
    padding: 15px 0;
    box-sizing: border-box;
  }
  .box-start {
    font-size: 13px;
    margin-bottom: 10px;
  }
  .coloryellow {
    color: #FEC538;
  }
  .startStyle {
    margin-right: 6px;
  }
  .box-cantent {
    font-weight: 400;
    line-height: 19px;
    margin-bottom: 8px;
    word-wrap: break-word;
    word-break: normal;
  }
  .box-usermwsg {
    width: 100%;
    display: flex;
    color: #909399;
    font-size: 12px;
  }
  .box-usermwsg-left {
    flex: 1;
    text-align: left;
  }
  .box-usermwsg-right {
    flex: 1;
    text-align: right;
  }
</style>
