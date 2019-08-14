<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="name" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <van-tabs v-model="active" @click="tabClick" title-active-color='#358FF3' color='#358FF3' line-height='1px'>
        <van-tab v-for="(item,index) in table" :key="index" :title="item" :name='index' swipeable>
          <div class="box" :style="{height:boxHeight}" v-if="data.length!=0">
            <van-pull-refresh v-model="list.refreshing" @refresh="onRefresh">
              <van-list v-model="list.loading" :finished="list.finished" :finished-text="'没更多内容了'" @load="onLoad" :immediate-check=false>
               <div class="box-item" v-for="item in data" :key="item.MemId" >
                  <div class="item-top" @click="toActive(item)">
                    <div class="item-top-left">{{item.MemName}}</div>
                    <div :class="['item-top-right',item.TestStatus=='血压正常'?'bcolor':''] ">{{item.TestStatus}}</div>
                  </div>
                  <div class="item-middle" @click="toActive(item)">
                    <div class="item-msg">
                      <div class="item-title">舒张压</div>
                      <div class="item-num">{{item.DiastolicValue}}mmHg</div>
                    </div>
                    <div class="item-msg">
                      <div class="item-title">收缩压</div>
                      <div class="item-num">{{item.SystolicValue}}mmHg</div>
                    </div>
                    <div class="item-msg">
                      <div class="item-title">心率</div>
                      <div class="item-num">{{item.HeartRate}}bpm</div>
                    </div>
                  </div>
                  <div class="item-bottom" @click="toSubscribe(item)">
                    <div class="item-bottom-left">{{item.LogTime}}</div>
                    <div class="item-bottom-right">联系患者<span class="iconfont iconziyuan1 ml10"></span></div>
                  </div>
                </div>
              </van-list>
            </van-pull-refresh>
          </div>
          <NAN :height='boxHeight' v-else></NAN>
          <commonBottom class="bottom-style" />
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
        name: '',
        id: '',
        active: '',
        table: ['全部患者', '血压异常', '未测量'],
        boxHeight: '',
        diseaseId: '',
        type: 0,
        data: [],
        list: {
          items: [],
          refreshing: false,
          loading: false,
          error: false,
          finished: false
        },
        pageIndex: 0,
        pageSize: 5,
        IsLast: false,
      }
    },
    methods: {
      back() {
        window.history.go(-1)
      },
      tabClick(name) {
        if (this.type != name) {
          this.type = name
          this.data = []
          this.pageIndex = 0
          this.list.finished = false
          this.list.loading = false
          this.GetDiseaseMembers()
        }
      },
      toActive(item) {
        this.$router.push({
          path: '/chronicDiseaseActive',
          query: {
            name: item.MemName,
            memberId: item.MemId,
            diseaseId: this.diseaseId
          }
        })
      },
       toSubscribe(item){
        this.$router.push({
          path: '/subscribe',
          query: {
            name: item.MemName,
            memberId: item.MemId,
            diseaseId: this.diseaseId
          }
        })
      },
      GetDiseaseMembers() {
        ajax.GetDiseaseMembers(this.diseaseId, this.type, this.pageIndex, this.pageSize).then(res => {
          let data = res.data.data
          data.map((val, index) => {
            this.data.push(val)
          })
          this.IsLast = res.data.IsLast
          if (this.pageSize > data.length) {
            this.list.finished = true
            this.list.loading = false
          }
        })
      },
      onRefresh() {
        setTimeout(() => {
          this.data = []
          this.pageIndex = 0
          this.GetDiseaseMembers()
          this.list.finished = false
          this.list.refreshing = false
          window.scrollTo(0, 10)
        }, 1000)
      },
      onLoad() {
        this.list.loading = true
        this.pageIndex += 1
        this.GetDiseaseMembers()
        setTimeout(() => {
          this.list.loading = false
          if (this.IsLast) {
            this.list.finished = true
            this.list.loading = false
          }
        }, 500)
      },
    },
    created() {
      this.origin = this.$cookie.get('origin')
      this.userAgent = window.navigator.userAgent.toUpperCase()
      this.name = this.$route.query.name
      this.diseaseId = this.$route.query.diseaseId
      this.GetDiseaseMembers()
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight}px`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight}px)`
      // 内容高度
      this.contentHeight = `calc(100vh - ${headHeight}px)`
      this.boxHeight = `calc(100vh - ${(headHeight + 44)}px)`
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
    bottom: 0;
  }
  .box {
    -webkit-overflow-scrolling: touch;
    padding-top: 10px;
    overflow-y: auto;
  }
  .box-item {
    background: #fff;
    margin-bottom: 10px;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .item-top {
    display: flex;
    padding: 15px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #E6E9F0;
  }
  .item-top-left {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
  }
  .item-top-right {
    flex: 1;
    color: #FF6A5B;
    font-size: 14px;
    text-align: right;
  }
  .item-middle {
    display: flex;
    padding: 15px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #E6E9F0;
  }
  .item-msg {
    flex: 1;
  }
  .item-title {
    font-size: 12px;
    color: #909399;
    margin-bottom: 8px;
  }
  .item-num {
    color: #303133;
    font-size: 14px;
  }
  .item-bottom {
    display: flex;
    padding: 15px 0;
    box-sizing: border-box;
  }
  .item-bottom-left {
    font-size: 12px;
    color: #909399;
    flex: 1;
  }
  .item-bottom-right {
    font-size: 12px;
    color: #909399;
    text-align: right;
    flex: 1;
  }
  .ml10 {
    margin-left: 10px;
  }
  .bcolor {
    color: #358FF3;
  }
</style>
