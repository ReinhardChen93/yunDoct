<template>
  <div class="feeOuter">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" @back="back" :isBlack="isBlack" :name="headName" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg">\</commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div class="list">
        <div class="listItem" @click="toTurnGraphic">
          <div class="itemLeft">
            <img src="@/assets/advisory/graphic.png" alt="">
            <span>图文咨询</span>
          </div>
          <div :class="[data.Graphic == 1?'redcolor':'blackcolor']" v-if="data.Graphic == 1">{{data.GraphicCost.toFixed(2)}}/次</div>
          <div :class="[data.Graphic == 0?'blackcolor':'redcolor']" v-else>请设置金额</div>
        </div>
        <div class="listItem">
          <div class="itemLeft">
            <img src="@/assets/advisory/phone.png" alt="">
            <span>电话咨询</span>
          </div>
          <div class="blackcolor">暂未开通</div>
        </div>
        <div class="listItem noborder">
          <div class="itemLeft">
            <img src="@/assets/advisory/video.png" alt="">
            <span>视频咨询</span>
          </div>
          <div class="blackcolor">暂未开通</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
  import ajax from '@/api/index'
  export default {
    components: {
      commonHeader
    },
    data() {
      return {
        // 头部元素颜色
        bgColor: '#ffffff',
        color: '#303133',
        // 传给原生的值（判断字体是否是黑色）
        isBlack: true,
        // 头部名称
        headName: '',
        // 头部元素高度
        headHeight: '',
        // 头部是否要返回按钮
        isBack: true,
        // 返回按钮图片
        returnImg: require('@/assets/backB.png'),
        // 内容高度
        contentHeight: '',
        // 获取医生的详情(医生端)
        data: []
      }
    },
    methods: {
      // 头部返回按钮
      back() {
        window.history.go(-1)
      },
      // 图文咨询
      toTurnGraphic() {
        let data = this.data
        // 判断是否没有开通
        let isNotOpen = this.isNotOpen
        this.$router.push({
          path: '/feeStandardDetails',
          query: {
            graphic: data.Graphic,
            isNotOpen: isNotOpen,
            graphicCost: data.GraphicCost
          }
        })
      },
      // 电话咨询
      // toTurnTel() {
      //     let data = this.data
      //     if (data.Telphone == 1) {
      //         this.$router.push({
      //             path: '/feeStandardDetails',
      //             query: {
      //                 telphone: data.Telphone
      //             }
      //         })
      //     } else {}
      // },
      // 视频咨询
      // toTurnVideo() {
      //     let data = this.data
      //     if (data.Video == 1) {
      //         this.$router.push({
      //             path: '/feeStandardDetails',
      //             query: {
      //                 video: data.Video
      //             }
      //         })
      //     } else {}
      // },
      // 获取医生的详情(医生端)。
      getHospDoctInfo() {
        ajax.GetHospDoctInfo().then((res) => {
          this.data = res.data.data
          console.log('tag', this.data)
        })
      }
    },
    created() {
      // 判断是否是没开通
      this.isNotOpen = this.$route.query.isNotOpen
      if (this.isNotOpen == 0) {
        this.headName = '设置资费标准'
      } else {
        this.headName = '资费标准'
      }
      this.getHospDoctInfo()
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight / 37.5}rem`
      // 内容的高度
      this.contentHeight = `calc(100vh - ${headHeight}px)`
    }
  }
</script>

<style scoped>
  .headOuter {
    position: fixed;
    top: 0;
    width: 100%;
  }
  .content {
    position: fixed;
    width: 100%;
    border-top: 1px solid #E6E9F0;
  }
  .list {
    position: relative;
    padding: 0 15px;
    background-color: #fff;
    margin-top: 10px;
  }
  .listItem {
    position: relative;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    border-bottom: 1px solid #E6E9F0;
  }
  .itemLeft {
    position: relative;
    display: flex;
    color: #303133;
    justify-content: flex-start;
    align-items: center;
  }
  .itemLeft img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  .redcolor {
    color: #FF6A5B;
  }
  .blackcolor {
    color: #909399;
  }
  .noborder {
    border-bottom: 0;
  }
</style>
