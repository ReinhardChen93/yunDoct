<template>
  <div class="designOuter">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" @back="back" :isBlack="isBlack" :name="headName" :skip="'确定'" :color="color" :bgColor="bgColor" @skip="skip" @backName="backName" :isBack="isBack" :backName="'取消'">\</commonHeader>
    </div>
    <!-- 内容 -->
    <div class="content" :style="{marginTop:this.headHeight,height:contentHeight}">
      <div class="box">
        <div class="input">
          <input type="number" v-model="cost" placeholder="请输入价格">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 头部
import commonHeader from '@/components/header/commonHeader'
// ajax
import ajax from '@/api/index'
export default {
  components: {
    commonHeader
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
      // 头部名称
      headName: '',
      // 头部是否要返回按钮
      isBack: false,
      // 内容高度
      contentHeight: '',
      // 价格
      cost: ''
    }
  },
  methods: {
    // 头部返回按钮
    back () {
      window.history.go(-1)
    },
    // 确定按钮
    skip () {
      if (this.graphic !== undefined) {
        let info = {
          GraphicCost: parseFloat(this.cost),
          Graphic: 1
        }
        this.cost = ''
        ajax.ModifyService(info).then((res) => {
          if (res.data.succeed) {
            // 没有开通跳转服务时间
            if (this.isNotOpen === 0) {
              this.$router.replace({
                path: '/serviceHours',
                query: {
                  isNotOpen: this.isNotOpen
                }
              })
            } else {
              // 开通过直接跳转资费标准首页
              this.$router.replace({
                path: '/advFeeStandard',
                query: {}
              })
            }
          }
        })
      } else if (this.telphone !== undefined) {
        let info = {
          TelphoneCost: parseFloat(this.cost),
          Telphone: 1
        }
        ajax.ModifyService(info).then((res) => {
          console.log('222222222', res)
        })
      } else {
        let info = {
          VideoCost: parseFloat(this.cost),
          Video: 1
        }
        ajax.ModifyService(info).then((res) => {
          console.log('3333333333', res)
        })
      }
    },
    // 点击取消
    backName () {
      window.history.go(-1)
    }
  },
  created () {
    this.graphic = this.$route.query.graphic
    this.telphone = this.$route.query.telphone
    this.video = this.$route.query.video
    // 是否开通
    this.isNotOpen = this.$route.query.isNotOpen
    if (this.isNotOpen == 0) {
      this.headName = '设置资费'
    } else {
      this.headName = '自定义资费'
    }
    console.log(this.graphic, this.telphone, this.video)
  },
  mounted () {
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
    border-bottom: 1px solid #E6E9F0;
    font-size: 14px;
  }
  .box {
    position: relative;
    padding: 0 15px;
    height: 44px;
    background-color: #fff;
    margin-top: 10px;
  }
  .input {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .input input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
  }
</style>
