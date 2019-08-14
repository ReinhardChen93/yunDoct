<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="name" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div v-if="data.length!=0">
        <van-pull-refresh v-model="list.refreshing" @refresh="onRefresh">
          <van-list v-model="list.loading" :finished="list.finished" :finished-text="'没更多内容了'" @load="onLoad" :immediate-check=false>
            <div class="box">
              <div class="box-title">明细</div>
              <div class="box-itembox">
                <div class="box-item" v-for="item in data" :key="item.LogId">
                  <div class="box-item-left">
                    <div class="box-item-title">{{item.Remark}}</div>
                    <div class="box-item-text">{{item.LogTime}}</div>
                  </div>
                  <div class="box-item-right">x{{item.Amount}}</div>
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
      list: {
        items: [],
        refreshing: false,
        loading: false,
        error: false,
        finished: false
      },
      data: [],
      pageIndex: 0,
      pageSize: 5,
      giftId: ''
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    GetGiftLogs () {
      ajax.GetGiftLogs(this.giftId, this.pageIndex, this.pageSize).then(res => {
        if (res.data.succeed) {
          let data = res.data.data
          data.map((val, index) => {
            this.data.push(val)
          })
          if (this.pageSize > data.length) {
            this.list.finished = true
            this.list.loading = false
          }
        }
      })
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.data = []
        this.pageIndex = 0
        this.GetGiftLogs()
        this.list.finished = false
        this.list.refreshing = false
        window.scrollTo(0, 10)
      }, 1000)
    },
    onLoad () {
      this.pageIndex += 1
      setTimeout(() => {
        this.GetGiftLogs()
      }, 500)
    }
  },
  created: function () {
    this.giftId = this.$route.query.giftId
    this.name = this.$route.query.name
    this.GetGiftLogs()
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
  .box-title {
    padding: 15px;
    font-size: 14px;
    color: #909399;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
  }
  .box-itembox {
    padding: 0 15px;
    box-sizing: border-box;
    background: #fff;
  }
  .box-item {
    height: 66px;
    border-bottom: 1px solid #E6E9F0;
    box-sizing: border-box;
    padding: 15px 0;
    display: flex;
  }
  .box-item-left {
    flex: 8;
    text-align: left;
  }
  .box-item-right {
    flex: 2;
    text-align: right;
    display: flex;
    flex-grow: inherit;
    align-items: center;
    font-size: 16px;
    color: #358FF3;
  }
  .box-item-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
  }
  .box-item-text {
    font-size: 12px;
    color: #909399;
  }
</style>
