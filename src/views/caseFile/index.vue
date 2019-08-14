<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'病例档案'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div class="box">
        <div class="box-padding" v-if="data.length!=0">
          <van-pull-refresh v-model="list.refreshing" @refresh="onRefresh">
            <van-list v-model="list.loading" :finished="list.finished" :finished-text="'没更多内容了'" @load="onLoad" :immediate-check=false>
              <div class="box-itembox">
                <div class="box-item" v-for="item in data" :key="item.id">
                  <div class="box-item-title">{{item.year}}</div>
                  <div class="box-itemlist" v-for="(i,index) in item.array" :key="index">
                    <div class="box-itemlist-top">
                      <div class="box-itemlist-top-left">
                        <div class="box-itemlist-img">
                          <span class="iconfont iconregistered bluecolor" v-if="i.SeeType==1"></span>
                          <span class="iconfont iconhospitalization origecolor" v-if="i.SeeType==0"></span>
                        </div>
                        <div class="box-itemlist-text">{{i.SeeDate.split(' ')[0].slice(5)}}</div>
                      </div>
                      <div class="box-itemlist-top-right">
                        <div class="box-itemlist-top-title" v-if="i.SeeType==1">门诊</div>
                        <div class="box-itemlist-top-title" v-if="i.SeeType==0">住院</div>
                        <div class="box-itemlist-tag">{{i.HospName}} {{i.DeptName}}</div>
                      </div>
                    </div>
                    <div class="box-itemlist-bottom">
                      <div class="box-itemlist-bottom-left">
                        <div class="box-itemlist-bottom-xian"></div>
                      </div>
                      <div class="box-itemlist-bottom-right">
                        <div class="box-itemlist-bottom-title">诊断流水号:{{i.SquenceNo}}</div>
                        <div class="box-itemlist-bottom-text"> {{i.MedIcdName}}</div>
                      </div>
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
        pageIndex: 0,
        pageSize: 5,
        memberId: '',
        type: '',
        list: {
          items: [],
          refreshing: false,
          loading: false,
          error: false,
          finished: false
        },
        data: [],
        timeContent: ''
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
      GetCaseSeeRecord() {
        ajax.GetCaseSeeRecord(this.memberId, this.type, this.pageIndex, this.pageSize).then(res => {
          if (res.data.succeed) {
            let data = res.data.data
            let oldData = []
            data.map((val, index) => {
              oldData.push(val)
            })
            if (this.pageSize > data.length) {
              this.list.finished = true
              this.list.loading = false
            }
            // 重构数组
            let newData = []
            let year = ''
            let array = []
            for (let i = 0; i < oldData.length; i++) {
              let obj = {}
              obj.year = oldData[i].SeeDate.split(' ')[0].split('-')[0]
              if (year != obj.year) {
                year = obj.year
                array = []
                newData.push({
                  year: obj.year,
                  array: array
                })
              }
              array.push(oldData[i])
            }
            newData.map((vaule, index) => {
              this.data.push(vaule)
            })
          }
        })
      },
      onRefresh() {
        setTimeout(() => {
          this.data = []
          this.pageIndex = 0
          this.GetCaseSeeRecord()
          this.list.finished = false
          this.list.refreshing = false
          window.scrollTo(0, 10)
        }, 1000)
      },
      onLoad() {
        this.pageIndex += 1
        setTimeout(() => {
          this.GetCaseSeeRecord()
        }, 500)
      },
      // 隐藏原生loading
      hideLoading() {
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
      },
    },
    created() {
      this.origin = this.$cookie.get('origin')
      this.userAgent = window.navigator.userAgent.toUpperCase()
      this.memberId = this.$route.query.memberId
      this.hideLoading()
      this.GetCaseSeeRecord()
      window['closeWebViewPage'] = this.closeWebViewPage
      window['dismissLoadingDialog'] = this.dismissLoadingDialog
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
       this.headHeight = `${headHeight}px`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight}px)`
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
    height: 100%;
  }
  .box-padding {
    height: 100%;
    background: #fff;
  }
  .box-itembox {
    overflow: hidden;
  }
  .box-item {
    background: #fff;
    padding: 0 15px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .box-item-title {
    font-size: 16px;
    font-weight: 500;
    height: 44px;
    line-height: 44px;
    border-bottom: 1px solid #E6E9F0;
  }
  .box-itemlist {
    overflow: hidden;
  }
  .box-itemlist-top {
    display: flex;
    width: 100%;
    padding: 15px 0;
  }
  .box-itemlist-top-left {
    flex: 1.5;
  }
  .box-itemlist-top-right {
    flex: 8.5;
  }
  .box-itemlist-img {
    text-align: left;
  }
  .box-itemlist-img span {
    font-size: 30px;
  }
  .bluecolor {
    color: #358FF3;
  }
  .origecolor {
    color: #FEC538;
  }
  .box-itemlist-text {
    font-size: 10px;
    color: #909399;
    text-align: left;
  }
  .box-itemlist-top-title {
    text-align: left;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 500;
  }
  .box-itemlist-tag {
    font-size: 14px;
    text-align: left;
  }
  .box-itemlist-bottom {
    display: flex;
    width: 100%;
  }
  .box-itemlist-bottom-left {
    flex: 1.5;
  }
  .box-itemlist-bottom-right {
    flex: 8.5;
    color: #909399;
    font-size: 14px;
    padding: 15px 0;
    border-top: 1px solid #E6E9F0;
  }
  .box-itemlist-bottom-xian {
    width: 1px;
    height: 100%;
    background: #E6E9F0;
    margin-left: 15px;
  }
  .box-itemlist-bottom-title {
    margin-bottom: 12px;
  }
</style>
