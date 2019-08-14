
<template>
  <div class="recordOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" @back="back" :isBlack="isBlack" :name="'咨询记录'" :skip="'在线咨询须知'" :color="color" :bgColor="bgColor" @skip="skip" :isBack="isBack" :returnImg="returnImg" :margLeft="1.2+'rem'">\</commonHeader>
    </div>
    <!-- 导航栏 -->
    <div class="nav" ref="nav" :style="{marginTop:this.headHeight,height:this.navHeight}">
      <van-tabs v-model="active" swipeable color="#358FF3" line-width="20px" title-active-color="#358FF3" title-inactive-color="#303133">
        <van-tab v-for="(tab,index) in tabs" :title="tab.name" :key="index">
          <!-- 内容 -->
          <div :style="{marginTop:this.headHeight,height:contentHeight}" class="content" v-if="recordList.length!=0">
            <van-pull-refresh v-model="list.refreshing" @refresh="onRefresh">
              <van-list v-model="list.loading" :finished="list.finished" :finished-text="'没更多内容了'" @load="onLoad">
                <div class="box" v-if="count != 0">
                  <!-- item -->
                  <div class="listItem" v-for="(record,index) in recordList" :key="index">
                    <!-- 标题 -->
                    <div class="itemTop"  @click="toTurnTalkRecord(record)">
                      <div class="topLeft">
                        <img src="@/assets/advisory/graphic.png" alt="">
                        <span>图文咨询</span>
                      </div>
                    </div>
                    <!-- 中间内容 -->
                    <div class="itemCenter"  @click="toTurnTalkRecord(record)">
                      <div class="centerTitle">
                        <div class="name">患者：{{record.MemName}}</div>
                        <div class="time">{{record.AskTime}}</div>
                      </div>
                      <div class="centerContent">{{record.AskContent}}</div>
                    </div>
                    <!-- 底部按钮 -->
                    <div class="itemBottom" v-if="active==0">
                      <div class="bottomBtn">
                        <div class="bottomLeft" @click="toTurnTalkRecord(record)">继续回答</div>
                      </div>
                      <div class="bottomBtn">
                        <div class="bottomRight" @click="finishAdvisory(record)">完成咨询</div>
                      </div>
                    </div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
            <commonBottom></commonBottom>
          </div>
          <NAN :height='contentHeight' v-else></NAN>
        </van-tab>
      </van-tabs>
    </div>
    <van-popup v-model="showBottom" position="bottom">
      <div class="popupbox">
        <div class="popuptitelbox">
          <div>点击【解决咨询】结束本次咨询，并获得咨询费用</div>
          <div>点击【放弃咨询】则放弃本次咨询，不能获得咨询费用</div>
        </div>
        <div class="popupbtnBox">
          <div class="popupbtn red" @click="solveQuestionAsync">放弃咨询</div>
          <div class="popupbtn blue" @click="solveQuestion">解决咨询</div>
        </div>
        <div class="popupbtn" @click="closepopup">取消</div>
        <commonBottom></commonBottom>
      </div>
    </van-popup>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
  // 底部
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
        headHeight: 0,
        // nav高度
        navHeight: 0,
        // 内容高度
        contentHeight: 0,
        // 头部是否要返回按钮
        isBack: true,
        // 返回按钮图片
        returnImg: require('@/assets/backB.png'),
        // nav
        active: 0,
        tabs: [{
            name: '进行中'
          },
          {
            name: '已完成'
          }
        ],
        // 是否最后
        isLast: false,
        // 数据条数
        count: 0,
        // 1:进行中 2:已解决
        askState: 1,
        // 0:图文 1:电话 2:视频
        askType: 0,
        pageIndex: 0,
        pageSize: 5,
        recordList: [],
        memberId: '',
        list: {
          items: [],
          refreshing: false,
          loading: false,
          error: false,
          finished: false
        },
        showBottom: false
      }
    },
    watch: {
      active() {
        if (this.active == 0) {
          this.askState = 1
          this.list.finished = false
        } else {
          this.askState = 2
          this.list.finished = false
        }
        this.recordList = []
        this.pageIndex = 0
        this.pageSize = 5
        this.isLast = false
        this.GetMemberAsksAndDoctor()
      }
    },
    methods: {
      toTurnTalkRecord (data) {
        // 跳转到聊天内容页面
        if (this.origin == 'YunyiDoctApp') {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('goToAskProfilePage', data, (data) => {
            })
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('goToAskProfilePage', data, (data) => {
            })
          }
        }
      },
      // 头部返回按钮
      back () {
        window.history.go(-1)
      },
      // 在线咨询须知
      skip () {
        this.$router.push({
          path: '/advisoryNotice',
          query: {}
        })
      },
      // 上拉加载
      onLoad () {
        this.pageIndex += 1
        this.GetMemberAsksAndDoctor()
        setTimeout(() => {
          for (let i = 0; i < 5; i++) {
            this.list.items = this.recordList
          }
          this.list.loading = false
          if (this.isLast) {
            this.list.finished = true
          }
        }, 500)
      },
      // 下拉刷新
      onRefresh () {
        setTimeout(() => {
          this.recordList = []
          this.pageIndex = 0
          this.pageSize = 5
          this.isLast = false
          this.GetMemberAsksAndDoctor()
          this.list.finished = false
          this.list.refreshing = false
          window.scrollTo(0, 10)
        }, 1000)
      },
      // 获取咨询记录（医生端）
      GetMemberAsksAndDoctor () {
        ajax.GetMemberAsksAndDoctor(this.memberId, this.askState, this.askType, this.pageIndex, this.pageSize).then((res) => {
          this.isLast = res.data.IsLast
          this.count = res.data.Count
          let data = res.data.data
          data.map((val, index) => {
            this.recordList.push(val)
          })
        })
      },
      // 完成咨询
      finishAdvisory (data) {
        this.showBottom = true
        this.questionId = data.QuestionId
      },
      closepopup () {
        this.showBottom = false
      },
      // 解决咨询
      solveQuestion () {
        this.$dialog.confirm({
          title: '提示',
          message: '确认结束本次咨询？'
        }).then(() => {
          // on confirm
          this.showBottom = false
          ajax.SolveQuestion(this.questionId).then((res) => {
            if (res.data.succeed) {
              this.onRefresh()
            }
          })
        }).catch(() => {
          // on cancel
        });
      },
      // 未解决咨询
      solveQuestionAsync () {
        this.$dialog.confirm({
          title: '提示',
          message: '确认放弃本次咨询？'
        }).then(() => {
          // on confirm
          this.showBottom = false
          ajax.SolveQuestionAsync(this.questionId).then((res) => {
            if (res.data.succeed) {
              this.onRefresh()
            }
          })
        }).catch(() => {
          // on cancel
        });
      },
      // 隐藏原生loading
      hideLoading () {
        // 跳转到原生首页
        if (this.origin == 'YunyiDoctApp') {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('dismissLoadingDialog', null, (data) => {
            })
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('dismissLoadingDialog', null, (data) => {
            })
          }
        }
      },
    },
    created() {
      this.hideLoading()
      this.origin = this.$cookie.get('origin')
      this.userAgent = window.navigator.userAgent.toUpperCase()
      this.memberId = this.$route.query.memberId
      window['goToAskProfilePage'] = this.goToAskProfilePage
      window['dismissLoadingDialog'] = this.dismissLoadingDialog
      this.GetMemberAsksAndDoctor()
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight / 37.5}rem`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight / 37.5}rem)`
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
  }
  /* 导航栏 */
  .nav>>>.van-tabs__wrap {
    height: 44px;
  }
  .nav>>>.van-tab {
    font-size: 14px !important;
    color: #303133;
    border-top: 1px solid #E6E9F0 !important;
    background: #fff !important;
  }
  /* 进行中 */
  .content {
    overflow: scroll;
    padding-top: 10px;
  }
  .listItem {
    position: relative;
    padding: 0 15px;
    font-size: 14px;
    background-color: #fff;
    margin-bottom: 10px;
  }
  /* item的标题 */
  .itemTop {
    position: relative;
    width: 100%;
    height: 48px;
    border-bottom: 1px solid #E6E9F0;
    display: flex;
    justify-content: space-between;
  }
  .topLeft {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #303133;
  }
  .topLeft img {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
  .topRight {
    color: #358FF3;
    line-height: 48px;
  }
  /* item的内容 */
  .itemCenter {
    position: relative;
    width: 100%;
    border-bottom: 1px solid #E6E9F0;
    padding-bottom: 15px;
  }
  .itemCenterFinish {
    position: relative;
    width: 100%;
    height: 96px;
  }
  .centerTitle {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
  }
  .centerTitle .name {
    color: #303133;
  }
  .centerTitle .time {
    color: #909399;
  }
  .centerContent {
    color: #606266;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  /* item的按钮 */
  .itemBottom {
    position: relative;
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-between;
  }
  .bottomBtn {
    padding: 12px 0;
    width: 50%;
  }
  .bottomLeft {
    width: 100%;
    border-right: 1px solid #E6E9F0;
    color: #4A90E2;
  }
  .bottomRight {
    width: 100%;
    color: #FF6A5B;
  }
  .popupbox {
    box-sizing: border-box;
    background: #f8f8f8;
  }
  .popuptitelbox {
    width: 100%;
    font-size: 12px;
    color: #909399;
    padding: 15px;
    box-sizing: border-box;
    border-bottom: 1px solid #E6E9F0;
    background: #fff;
  }
  .popuptitelbox div:first-child {
    margin-bottom: 8px;
  }
  .popupbtn {
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 14px;
    color: #999999;
    background: #fff;
  }
  .red {
    color: #FF6A5B;
    border-bottom: 1px solid #E6E9F0;
  }
  .blue {
    color: #358FF3;
  }
  .popupbtnBox {
    margin-bottom: 10px;
    padding: 0 15px;
    box-sizing: border-box;
    background: #fff;
  }
</style>
