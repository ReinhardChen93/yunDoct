<template>
  <div class="advisoryOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :name="'我的咨询'" :isBlack="isBlack" @back="back" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg"></commonHeader>
    </div>
      <!-- 内容 -->
    <div class="advisoryContent" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <!-- 年份滚动条 -->
      <van-tabs v-model="activeNAme" @click="handlerYearClick" color="#358FF3FF">
        <van-tab :title="item" v-for="item in years" :key="item" :name="item"></van-tab>
      </van-tabs>
      <moneyChart :chartdate="this.chartdate" />
      <profitList :detailsdate="this.detailsdate" v-if="this.detailsdate" />
    </div>
  </div>
</template>

<script>
// 头部
import commonHeader from '@/components/header/commonHeader'
import moneyChart from '@/views/profit/page/moneyChart'
import profitList from '@/views/profit/page/profitList'
import ajax from '@/api/index'
export default {
  name: 'profit',
  data () {
    return {
      // 头部元素颜色
      bgColor: '#fff',
      color: '#303133',
      // 头部元素高度
      headHeight: '',
      // 头部是否要返回按钮
      isBack: true,
      // 传给原生的值（判断字体是否是黑色）
      isBlack: true,
      // 返回按钮图片
      returnImg: require('@/assets/backB.png'),
      contentHeight: '',
      years: [],
      // 收益年份
      activeYear: '',
      activeNAme: '',
      // 折线图数据
      chartdate: {},
      detailsdate: {}
    }
  },
  components: {
    commonHeader,
    moneyChart,
    profitList
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    // 获取收益表数据
    getEarningCharts (chartdate) {
      let data = `${chartdate}-01-01`
      ajax.GetEarningCharts(data).then((res) => {
        this.chartdate = res.data.data
      })
    },
    // 获取收益明细。
    getEarningDetails (chartdate) {
      let data = `${chartdate}-01-01`
      ajax.GetEarningDetails(data).then((res) => {
        this.detailsdate = res.data.data
      })
    },
    // 点击年份刷新表格数据
    handlerYearClick (name) {
      this.activeYear = name // 后台需要年份后面加上月份
    },
    getDate () {
      let date = new Date()
      this.activeYear = date.getFullYear()
      let endyear = this.activeYear
      let startyear = endyear - 2
      for (let i = startyear; i <= endyear; i++) {
        i = i.toString()
        this.years.push(i)
      }
      this.activeNAme = this.activeYear.toString()
    }
  },
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    // 当前页面高度
    this.headHeight = `${headHeight}px`
    // 当前页面高度
    this.contentHeight = `calc(100vh - ${headHeight}px)`
  },
  created () {
    this.getDate()
  },
  watch: {
    // 监听选择的年份重新请求图表
    activeYear (val, oldval) {
      this.getEarningCharts(val)
      this.getEarningDetails(val)
    }
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
  .advisoryOut>>>.van-ellipsis {
    font-size: 14px;
    font-weight: normal;
  }
  .advisoryOut>>>.van-tabs__line {
    width: 45px;
    height: 2px;
  }
  .advisoryContent{
    position: fixed;
    width: 100%;
    background: #F8F8F8;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
