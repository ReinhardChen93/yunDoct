<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" @clickEventObj='clickEventObj' :moreList='moreList' :isBlack="isBlack" @back="back" :name="name" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <van-tabs v-model="active" title-active-color='#358FF3' color='#358FF3' line-height='1px'>
        <van-tab title="血压数据" swipeable>
          <div class="box" :style="{height:boxheight}">
            <div class="itembox">
              <div class="item-mdg">
                <div class="item-time">{{time}}</div>
                <div :class="['item-title',iscolor?'clolr':'']">{{typeText}}</div>
              </div>
              <div class="item-bottom">
                <div class="item-bottom-left">
                  <div class="item-num">{{DiastolicValue}}</div>
                  <div class="item-style">舒张压mmHg</div>
                </div>
                <div class="item-bottom-right">
                  <div class="item-num">{{SystolicValue}}</div>
                  <div class="item-style">收缩压mmHg</div>
                </div>
              </div>
            </div>
            <div class="itemListBox">
              <div class="itemList-title">最近7次测量数据</div>
              <div class="itemList-form">
                <moneyChart :chartdate="this.chartdate" :height='`166px`' @showData='upData' />
              </div>
            </div>
            <div class="item-bottomcontent">
              <div class="item-bBox" v-for="item in chartdate" :key="item.LogId">
                <div class="item-bTop">
                  <div class="item-bTop-left">{{timeFn(item.LogTime)}}</div>
                  <div class="item-bTop-right">{{item.TestStatus}}</div>
                </div>
                <div class="item-bBottomListBox">
                  <div class="item-bBottom-list">
                    <div class="item-bBottom-text">
                      舒张压
                    </div>
                    <div class="item-bBottom-tag">
                      {{item.DiastolicValue}}mmHg
                    </div>
                  </div>
                  <div class="item-bBottom-list">
                    <div class="item-bBottom-text">
                      收缩压
                    </div>
                    <div class="item-bBottom-tag">
                      {{item.SystolicValue}}mmHg
                    </div>
                  </div>
                  <div class="item-bBottom-list">
                    <div class="item-bBottom-text">
                      心率
                    </div>
                    <div class="item-bBottom-tag">
                      {{item.HeartRate}}bpm
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab title="患者随访" swipeable>
          <div class="box pt10" :style="{height:boxheight}">
            <van-pull-refresh v-model="list.refreshing" @refresh="onRefresh" v-if="data.length!=0">
              <van-list v-model="list.loading" :finished="list.finished" :finished-text="'没更多内容了'" @load="onLoad" :immediate-check=false>
                <div class="itemListBox" v-for="item in data" :key="item.Id" @click="toarrage(item.Id, item.route)">
                  <div class="itemListBox-top">
                    <div class="itemListBox-top-left">
                      {{item.Date}}
                    </div>
                    <div class="itemListBox-top-right">
                      {{item.toStatus}}
                    </div>
                  </div>
                  <div class="itemListBox-bottom">
                    {{item.Title}}
                    <span class="redRepaint" v-show="item.State === '等待患者填写'">1</span>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
            <NAN :height='boxheight' v-else></NAN>
            <div class="btn" @click="toCreateMsg">创建随访</div>
          </div>
        </van-tab>
      </van-tabs>
      <commonBottom class="bottom-style" />
    </div>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
  import commonBottom from '@/components/bottom/commonBottom'
  import moneyChart from '@/components/from/index'
  import NAN from '@/components/NAN'
  // ajax
  import ajax from '@/api/index'
  export default {
    components: {
      commonHeader,
      commonBottom,
      moneyChart,
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
        // 右侧更多按钮
        moreList: [{
          class: 'iconhistory',
          name: '历史数据',
          path: '/chronicDiseaseOldData'
        }, {
          class: 'iconme',
          name: '签约详情',
          path: '/subscribe'
        }],
        // 返回按钮图片
        returnImg: require('@/assets/backB.png'),
        // 内容高度
        contentHeight: '',
        // nav高度
        navHeight: 0,
        name: '',
        memberId: '',
        active: '',
        boxheight: '',
        chartdate: [],
        data: [],
        time: '血压数据',
        DiastolicValue: '--', // 舒张压
        SystolicValue: '--', // 收缩压
        type: {},
        typeText: '未测量',
        iscolor: false,
        pageIndex: 0,
        pageSize: 10,
        list: {
          items: [],
          refreshing: false,
          loading: false,
          error: false,
          finished: false
        },
        diseaseId: ''
      }
    },
    methods: {
      back() {
        window.history.go(-1)
      },
      GetBloodConfig() {
        ajax.GetBloodConfig(this.memberId).then(res => {
          this.type = res.data.data
        })
      },
      GetMemberBloodLogs() {
        ajax.GetMemberBloodLogs(this.memberId).then(res => {
          this.chartdate = res.data.data
          console.log(this.chartdate)
          this.DiastolicValue = this.chartdate[0].DiastolicValue
          this.SystolicValue = this.chartdate[0].SystolicValue
          this.typeText = this.chartdate[0].TestStatus
          if (this.typeText != '血压正常') {
            this.iscolor = true
          }
          this.time = this.chartdate[0].LogTime.split(' ')[0]
        })
      },
      // 来自子组件参数$emit
      upData(data) {
        this.data = data
        this.DiastolicValue = data[2].value
        this.SystolicValue = data[3].value
        this.time = data[2].name
        if (this.type.DiastolicHighValue * 1 < this.DiastolicValue * 1 || this.type.SystolicHighValue * 1 < this.SystolicValue * 1) {
          this.typeText = '血压偏高'
          this.iscolor = true
        } else if (this.type.DiastolicLowValue * 1 > this.DiastolicValue * 1 || this.type.SystolicLowValue * 1 > this.SystolicValue * 1) {
          this.typeText = '血压偏低'
          this.iscolor = true
        } else {
          this.typeText = '血压正常'
          this.iscolor = false
        }
      },
      clickEventObj(item, index) {
        this.$router.push({
          path: item.path,
          query: {
            memberId: this.memberId,
            diseaseId: this.diseaseId
          }
        })
      },
      GetBloodVisitList() {
        ajax.GetBloodVisitList(this.memberId, this.pageIndex, this.pageSize).then(res => {
          let data = res.data.data
          data.map((val, index) => {
            this.data.push(val)
          })
          // 为数据添加状态
          this.data.map((val, index) => {
            if (val.State === '等待医生反馈' || val.State === '等待患者填写') {
              this.$set(val, 'toStatus', '待填写')
              this.$set(val, 'route', true)
            } else {
              this.$set(val, 'toStatus', val.State)
              this.$set(val, 'route', false)
            }
          })
          this.IsLast = res.data.IsLast
          if (this.pageSize > data.length) {
            this.list.finished = true
            this.list.loading = false
          }
        })
      },
      // 下拉刷新
      onRefresh() {
        setTimeout(() => {
          this.data = []
          this.pageIndex = 0
          this.GetBloodVisitList()
          this.list.finished = false
          this.list.refreshing = false
          window.scrollTo(0, 10)
        }, 1000)
      },
      onLoad() {
        this.list.loading = true
        this.pageIndex += 1
        this.GetBloodVisitList()
        setTimeout(() => {
          this.list.loading = false
          if (this.IsLast) {
            this.list.finished = true
            this.list.loading = false
          }
        }, 500)
      },
       // 获取时间差
      timeFn(sendTime) {
        let dateBegin = sendTime
        dateBegin = new Date(dateBegin.replace(/-/g, '/'))
        let dateEnd = new Date() // 获取当前时间
        let dateDiff = dateEnd.getTime() - dateBegin.getTime() // 时间差的毫秒数
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
        let leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
        // 计算相差分钟数
        let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
        // 计算相差秒数
        let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
        let seconds = Math.round(leave3 / 1000)
        if (dayDiff) {
          return dayDiff + '天前'
        } else if (hours) {
          return '今天'
        } else {
          return minutes + '分钟前'
        }
      },
      toCreateMsg() {
        console.log('创建随访')
      },
      toarrage(Id, route) {
        if (route) {
          this.$router.push({
            path: '/arrange',
            query: {
              Id: Id
            }
          })
        }
      }
    },
    created: function() {
      this.origin = this.$cookie.get('origin')
      this.userAgent = window.navigator.userAgent.toUpperCase()
      this.name = this.$route.query.name
      this.memberId = this.$route.query.memberId
      this.diseaseId = this.$route.query.diseaseId
      this.GetBloodConfig()
      this.GetMemberBloodLogs()
      this.GetBloodVisitList()
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight}px`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight}px)`
      // 内容高度
      this.contentHeight = `calc(100vh - ${headHeight}px)`
      this.boxheight = `calc(100vh - ${(headHeight + 44) }px)`
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
    overflow: hidden;
    /*ios平滑弹性滚动*/
    font-size: 14px;
    position: fixed;
    width: 100%;
  }
  .box {
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
  }
  .itembox {
    overflow: hidden;
    padding: 0 15px;
    box-sizing: border-box;
    background: #fff;
  }
  .item-mdg {
    background: #fff;
    padding: 20px 0;
    border-bottom: 1px solid #E6E9F0;
    box-sizing: border-box;
  }
  .item-time {
    font-size: 12px;
    color: #909399;
    text-align: center;
    margin: 15px 0;
  }
  .item-title {
    font-size: 34px;
    font-weight: 600;
    color: #358FF3;
    text-align: center;
    margin-bottom: 15px;
  }
  .item-bottom {
    display: flex;
    background: #fff;
    padding: 20px 0;
    box-sizing: border-box;
  }
  .item-bottom-left,
  .item-bottom-right {
    flex: 1;
  }
  .item-num {
    text-align: center;
    font-size: 16px;
    margin-bottom: 8px;
  }
  .item-style {
    text-align: center;
    font-size: 12px;
    color: #909399;
  }
  .itemListBox {
    overflow: hidden;
    margin-bottom: 10px;
  }
  .itemList-title {
    padding: 15px 0;
    text-align: center;
    font-size: 14px;
    color: #909399;
  }
  .itemList-form {
    background: #fff;
  }
  .clolr {
    color: #FF6A5B;
  }
  .item-bBox {
    padding: 0 15px;
    box-sizing: border-box;
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
  }
  .item-bTop {
    display: flex;
    height: 44px;
    line-height: 44px;
    width: 100%;
    border-bottom: 1px solid #E6E9F0;
  }
  .item-bTop-left {
    flex: 1;
    font-size: 14px;
    color: #333;
  }
  .item-bTop-right {
    flex: 1;
    font-size: 14px;
    color: #358FF3;
    text-align: right;
  }
  .item-bBottomListBox {
    width: 100%;
    height: 64px;
    padding: 15px 0;
    display: flex;
    box-sizing: border-box;
  }
  .item-bBottom-list {
    flex: 1;
    font-size: 12px;
    color: #909399;
  }
  .item-bBottom-text {
    margin-bottom: 8px;
  }
  .item-bBottom-tag {
    font-size: 14px;
    color: #333;
  }
  .pt10 {
    padding-top: 10px;
  }
  .itemListBox {
    padding: 0 15px;
    background: #fff;
    margin-bottom: 10px;
  }
  .itemListBox-top {
    display: flex;
    height: 42px;
    line-height: 42px;
    border-bottom: 1px solid #E6E9F0;
    width: 100%;
    box-sizing: border-box;
    color: #909399;
  }
  .itemListBox-top-left {
    flex: 1;
  }
  .itemListBox-top-right {
    flex: 1;
    text-align: right;
    color: #358FF3;
  }
  .itemListBox-bottom {
    padding: 15px 0;
    font-size: 16px;
    color: #333;
    position: relative;
    padding-right: 16px;
  }
  .redRepaint {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #FF6A5B;
    top: 50%;
    right: 0px;
    margin-top: -8px;
    color: #fff;
    line-height: 16px;
    text-align: center;
    font-size: 12px;
  }
  .btn {
    position: fixed;
    bottom: 42px;
    height: 44px;
    line-height: 44px;
    width: 80%;
    left: 35%;
    margin-left: -25%;
    background: #358FF3;
    color: #fff;
    text-align: center;
    font-size: 18px;
    border-radius: 2px;
  }
</style>
