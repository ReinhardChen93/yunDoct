<template>
  <div class="noticeOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" @back="back" :isBlack="isBlack" :name="'在线咨询须知'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg">\</commonHeader>
    </div>
    <!-- 内容 -->
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div class="text">
        <p v-for="i in 3" :key="i">1.为了便于更好的搭建医生与用户的沟通交流平台，提高咨询服务的效率和质量，医生应确保在本系统注册的个人信息真实、全面。</p>
      </div>
    </div>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
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
        // 头部元素高度
        headHeight: '',
        // 头部是否要返回按钮
        isBack: true,
        // 返回按钮图片
        returnImg: require('@/assets/backB.png'),
        // 内容的高度
        contentHeight: ''
      }
    },
    methods: {
      // 头部返回按钮
      back() {
        window.history.go(-1)
      },
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
    background-color: #fff;
    border-top: 1px solid #E6E9F0;
  }
  .text {
    position: relative;
    padding: 19px 15px;
  }
  .text p {
    margin-bottom: 19px;
    font-size: 14px;
    color: #303133;
  }
</style>
