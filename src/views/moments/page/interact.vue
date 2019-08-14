<template>
  <div class="advisoryOut">
    <!-- 头 -->
    <commonHeader ref="head" :name="'互动消息'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg"></commonHeader>
    <!-- 内容 -->
    <div class="advisoryContent" :style="{marginTop:this.headHeight+'rem'}">
      <div class="ChatContent">
        <div class="ChatBox">
          <div class="ChatHead">
            <van-image lazy-load class="ChatHead-img" src="https://img.yzcdn.cn/vant/cat.jpeg" />
          </div>
          <div>
            <h4 class="userName">
              用户名
            </h4>
            <span>
                回复了你：老子吃火锅你吃火锅底料，老子和酸奶你添酸奶盖盖！
              </span>
            <p>
              30分钟前
            </p>
          </div>
        </div>
        <div class="ChatBox-Friend">
          <van-image lazy-load src="https://img.yzcdn.cn/vant/cat.jpeg" />
        </div>
      </div>
    </div>
    <!-- 回复弹窗 -->
    <van-action-sheet v-model="isShow" @select="onSelect">
      <van-cell-group>
        <van-field v-model="discuss" center clearable>
          <van-button slot="button" type="info">发送</van-button>
        </van-field>
      </van-cell-group>
    </van-action-sheet>
  </div>
</template>

<script>
  // 头部
  import ajax from '@/api/index'
  import {
    ImagePreview
  } from 'vant'
  import commonHeader from '@/components/header/commonHeader'
  export default {
    name: 'interact',
    data() {
      return {
        // 头部元素颜色
        bgColor: '#fff',
        color: '#303133',
        // 头部元素高度
        headHeight: '',
        // 头部是否要返回按钮
        isBack: true,
        // 返回按钮图片
        returnImg: require('@/assets/backB.png'),
        contentHeight: '',
        show: false,
        index: 0,
        imageList: [
          'https://img.yzcdn.cn/vant/apple-1.jpg',
          'https://img.yzcdn.cn/vant/apple-2.jpg',
          'https://img.yzcdn.cn/vant/apple-1.jpg',
          'https://img.yzcdn.cn/vant/apple-2.jpg',
          'https://img.yzcdn.cn/vant/apple-1.jpg',
          'https://img.yzcdn.cn/vant/apple-2.jpg'
        ], // 图片预览
        isShow: false,
        discuss: '' // 评论数据
      }
    },
    components: {
      commonHeader
    },
    methods: {
      // 预览图片
      showImagePreview(position, timer) {
        console.log(this.imageList)
        console.log(position)
        const instance = ImagePreview({
          images: this.imageList,
          asyncClose: !!timer,
          closeOnPopstate: true,
          startPosition: typeof position === 'number' ? position : 0
        })
        if (timer) {
          setTimeout(() => {
            instance.close()
          }, timer)
        }
      },
      IconLikeClick(e) {
        console.log(e)
      },
      // 关闭评论弹窗
      onSelect(item) {
        // 点击选项时默认不会关闭菜单，可以手动关闭
        this.show = false
      }
    },
    mounted() {
      // 头部元素高度
      let head = this.$refs.head.$el.offsetHeight
      this.headHeight = head / 37.5
      // 将100vh 转换成rem
      let vh = 100 * 9.5 / 37.5
      this.contentHeight = vh - this.headHeight
    },
    created() {
    },
    watch: {
    }
  }
</script>

<style scoped>
  .advisoryOut {
    background: rgba(255, 255, 255, 1);
    overflow: auto;
    color: #303133;
    font-size: 14px;
  }
  .advisoryOut>>>.van-field__control {
    /*修改输入框左右内边距*/
    padding: 0 10px;
  }
  .advisoryOut>>>.van-cell__value--alone {
    /*修改输入框背景色*/
    color: #323233;
    text-align: left;
    background: #F5F6FA;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .ChatContent {
    display: flex;
    justify-content: space-between;
    padding: 15px;
  }
  .ChatContent:not(:last-child) {
    border: 1px solid #eee;
  }
  .ChatBox {
    display: flex;
    box-sizing: border-box;
  }
  .ChatHead {
    margin-right: 10px;
  }
  .ChatBox>>>.van-image__img {
    border-radius: 40px;
    width: 40px;
    height: 40px;
  }
  .ChatBox h4 {
    height: 14px;
    line-height: 14px;
  }
  .ChatBox span {
    display: inline-block;
    margin: 6px 0;
  }
  .ChatBox p {
    font-size: 12px;
    color: #909399;
  }
  .ChatBox-Friend>>>.van-image__img {
    width: 54px;
    height: 54px;
  }
</style>
