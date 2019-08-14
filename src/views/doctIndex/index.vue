<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" @skip='skipFun' :skip='skip' :isBlack="isBlack" @back="back" :name="'医生主页'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div class="doctbox" ref="boxH">
        <div class="doctTop">
          <div class="doctTop-left">
            <div class="doctTop-left-img">
              <img :src="doct.DoctPhoto">
            </div>
          </div>
          <div class="doctTop-right">
            <div class="doctTop-title">{{doct.DoctName}} <span class="doctTop-Ftitle">{{doct.DoctRank}}</span></div>
            <div class="doctTop-text">{{doct.HospName}} <span class="mL10">{{doct.DeptName}}</span></div>
          </div>
        </div>
        <div class="doctbootom" @click="openText">
          <div class="doctbootom-text" :style="{height:this.textheight}">
            <div ref="textH">医生介绍：{{doct.DoctIntro}}
            </div>
          </div>
          <div class="postion">
            <img src="@/assets/bottom.png" :class="['postionimg', isclick?'tefrom':'']">
          </div>
        </div>
      </div>
      <div class="box">
        <div class="box-title">
          <div class="box-title-text">用户评价</div>
          <div class="box-title-right">
            <span class="iconfont iconziyuan1"></span>
          </div>
        </div>
        <div class="box-list" :style="{height:this.boxHeight}">
          <van-pull-refresh v-model="list.refreshing" @refresh="onRefresh" v-if="data.length!=0">
            <van-list v-model="list.loading" :finished="list.finished" :finished-text="'没更多内容了'" @load="onLoad" :immediate-check=false>
              <div class="box-item" v-for="item in data" :key="item.EvalDoctId">
                <div class="start" v-for="(i,index) in item.EvalStar" :key="index">
                  <span class="iconfont iconscore"></span>
                </div>
                <div class="box-item-text">{{item.EvalContent}}</div>
                <div class="box-item-flex">
                  <div class="box-item-flex-left">{{item.UserName}}</div>
                  <div class="box-item-flex-right">{{item.EvalDate.split(' ')[0]}}</div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
          <NAN :height='this.boxHeight' v-else></NAN>
          <commonBottom class="bottom-style" />
        </div>
      </div>
      <!--投诉弹窗 -->
      <van-dialog v-model="show" title="投诉" show-cancel-button showConfirmButton overlay closeOnClickOverlay :beforeClose='before'>
        <div class="tareaBox">
          <textarea class="tarea" placeholder="请输入意见..." ref="tarea"></textarea>
        </div>
      </van-dialog>
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
  import {
    setTimeout
  } from 'timers';
  export default {
    components: {
      commonHeader,
      commonBottom,
      NAN
    },
    data() {
      return {
        // 头部元素颜色
        bgColor: '#358FF3',
        color: '#fff',
        // 传给原生的值（判断字体是否是黑色）
        isBlack: true,
        // 头部元素高度
        headHeight: '',
        // 头部是否要返回按钮
        isBack: true,
        // 返回按钮图片
        returnImg: require('@/assets/backW.png'),
        // 内容高度
        contentHeight: '',
        // nav高度
        navHeight: 0,
        textheight: '',
        isclick: false,
        boxHeight: '',
        busType: '',
        pageIndex: 0,
        pageSize: 10,
        doctId: '',
        list: {
          items: [],
          refreshing: false,
          loading: false,
          error: false,
          finished: false
        },
        data: [],
        IsLast: false,
        doct: {},
        skip: '投诉',
        show: false,
        type: ''
      }
    },
    methods: {
      back() {
        // 跳转到原生首页
        if (this.origin == 'YunyiDoctApp' && this.type == undefined) {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('closeWebViewPage', null, (data) => {})
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('closeWebViewPage', null, (data) => {})
          }
        } else {
          window.history.go(-1)
        }
      },
      openText() {
        // 获取文本高度
        if (!this.isclick) {
          this.isclick = true
          this.textheight = `${this.$refs.textH.offsetHeight}px`
          //等待动画完成后获取高度
          setTimeout(() => {
            this.boxHeight = `calc(100vh - ${(this.$refs.head.$el.offsetHeight + this.$refs.boxH.offsetHeight + 10 + 44)}px)`
          }, 500)
        } else {
          this.isclick = false
          this.textheight = ''
          //等待动画完成后获取高度
          setTimeout(() => {
            this.boxHeight = `calc(100vh - ${(this.$refs.head.$el.offsetHeight + this.$refs.boxH.offsetHeight + 10 + 44)}px)`
          }, 500)
        }
      },
      GetHospDoctInfo() {
        ajax.GetHospDoctInfo(this.doctId).then(res => {
          this.doct = res.data.data
        })
      },
      GetEvaluatesByToken() {
        ajax.GetEvaluatesByToken(this.doctId, this.busType, this.pageIndex, this.pageSize).then(res => {
          if (res.data.succeed) {
            let data = res.data.data
            this.isLast = data.IsLast
            data.map((val, index) => {
              this.data.push(val)
            })
            this.IsLast = res.data.IsLast
            if (this.pageSize > data.length) {
              this.list.finished = true
              this.list.loading = false
            }
          }
        })
      },
      // 下拉刷新
      onRefresh() {
        setTimeout(() => {
          this.data = []
          this.pageIndex = 0
          this.GetEvaluatesByToken()
          this.list.finished = false
          this.list.refreshing = false
          window.scrollTo(0, 10)
        }, 1000)
      },
      onLoad() {
        this.list.loading = true
        this.pageIndex += 1
        this.GetEvaluatesByToken()
        setTimeout(() => {
          this.list.loading = false
          if (this.IsLast) {
            this.list.finished = true
            this.list.loading = false
          }
        }, 500)
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
      },
      skipFun() {
        this.show = true
      },
      before(action, done) {
        if (action === 'confirm') {
          if (this.$refs.tarea.value != '') {
            ajax.ReportCircle(1, this.$refs.tarea.value).then(res => {
              if (res.data.succeed) {
                done()
                this.$toast('提交成功', 500)
              }
            })
          } else {
            this.$toast('请输入内容', 500)
            done(false)
          }
        } else {
          done()
        }
      }
    },
    created() {
      this.hideLoading()
      this.origin = this.$cookie.get('origin')
      this.userAgent = window.navigator.userAgent.toUpperCase()
      this.doctId = this.$route.query.doctId
      this.type = this.$route.query.type
      window['closeWebViewPage'] = this.closeWebViewPage
      window['dismissLoadingDialog'] = this.dismissLoadingDialog
      this.GetHospDoctInfo()
      this.GetEvaluatesByToken()
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight}px`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight}px)`
      // 内容高度
      this.contentHeight = `calc(100vh - ${headHeight}px)`
      this.boxHeight = `calc(100vh - ${(headHeight + this.$refs.boxH.offsetHeight + 10 + 44)}px)`
    },
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
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    /*ios平滑弹性滚动*/
    font-size: 14px;
  }
  .doctbox {
    padding: 15px;
    box-sizing: border-box;
    background: #358FF3 url('../../assets/bgdoct.png') no-repeat top right;
    background-size: 96px 148px;
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .doctTop {
    display: flex;
    height: 80px;
    color: #fff;
    overflow: hidden;
    box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.2);
  }
  .doctTop-left {
    flex: 1.5;
    padding: 0;
    box-sizing: border-box;
    align-self: center;
  }
  .doctTop-left-img {
    border-radius: 50%;
    overflow: hidden;
    width: 50px;
    height: 50px;
  }
  .doctTop-left-img img {
    width: 100%;
    height: 100%;
  }
  .doctTop-right {
    flex: 8.5;
    padding: 0 0 0 15px;
    box-sizing: border-box;
    align-self: center;
  }
  .doctTop-title {
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
  }
  .doctTop-Ftitle {
    font-size: 14px;
    font-weight: 400;
    margin-left: 10px;
  }
  .doctTop-text {
    font-size: 14px;
    font-weight: normal;
  }
  .mL10 {
    margin-left: 10px;
  }
  .doctbootom {
    padding: 15px 0;
    box-sizing: border-box;
    color: #fff;
    font-size: 12px;
    position: relative;
  }
  .doctbootom-text {
    overflow: hidden;
    transition: all .5s;
    height: 16px;
  }
  .postion {
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
  }
  .postionimg {
    margin: 0 auto;
    width: 12px;
  }
  .tefrom {
    display: block;
    transform: rotate(180deg);
    transition: all .5s;
  }
  .box {
    overflow-y: hidden;
  }
  .box-title {
    height: 44px;
    line-height: 44px;
    color: #333;
    padding: 0 15px;
    box-sizing: border-box;
    display: flex;
    border-bottom: 1px solid #E6E9F0;
    background: #fff;
  }
  .box-list {
    overflow-y: auto;
  }
  .box-title-text {
    font-size: 16px;
    flex: 1;
    text-align: left;
  }
  .box-title-right {
    flex: 1;
    font-size: 12px;
    color: #D8D8D8;
    text-align: right;
  }
  .box-list {
    padding: 0 15px;
    box-sizing: border-box;
    background: #fff;
  }
  .box-item {
    border-bottom: 1px solid #E6E9F0;
    padding: 15px 0;
    box-sizing: border-box;
  }
  .start {
    margin-right: 6px;
    margin-bottom: 10px;
    color: #FEC538;
    display: inline-block;
  }
  .box-item-text {
    margin-bottom: 8px;
    font-size: 14px;
  }
  .box-item-flex {
    display: flex;
    font-size: 12px;
    color: #909399;
  }
  .box-item-flex-left {
    flex: 1;
    text-align: left;
  }
  .box-item-flex-right {
    flex: 1;
    text-align: right;
  }
  .tareaBox {
    padding: 15px;
    box-sizing: border-box;
  }
  .tarea {
    border: none;
    background: #f1f1f1;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
    outline: none;
    color: #333;
    width: 100%;
    height: 150px;
    border-radius: 4px;
  }
</style>
