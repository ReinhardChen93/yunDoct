<template>
  <div class="advisoryOut">
    <!-- 头 -->
    <commonHeader ref="head" :name="'医院动态'" :color="color" @back=back :isBlack="isBlack" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg"></commonHeader>
    <!-- 内容 -->
    <div class="advisoryContent" :style="{marginTop:this.headHeight,height:contentHeight}">
      <div class="DetailBox">
        <div class="Detail-Title">
          {{title}}
        </div>
        <ul class="Detail-Title-mini">
          <li>{{ time }}</li>
        </ul>
        <div class="Detail-Title-img" v-if="titleImage !== ''">
          <van-image width="8.96rem" height="5.06rem" lazy-load fit="cover" :src="titleImage">
            <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                    </template>
                    <template v-slot:error>
                      加载失败
                    </template>
          </van-image>
        </div>
        <div v-html="contentHtml"></div>
        <commonBottom></commonBottom>
      </div>
    </div>
  </div>
</template>

<script>
// 头部
import commonHeader from '@/components/header/commonHeader'
// 底部组件
import commonBottom from '@/components/bottom/commonBottom'
import ajax from '@/api/index'
export default {
  name: 'dynamicDetail',
  data () {
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
      // 文章id
      articleId: '',
      // 文章内容
      contentHtml: '',
      // 文章标题
      title: '',
      // 文章标题图片
      titleImage: '',
      // 文章时间
      time: ''
    }
  },
  components: {
    commonHeader,
    commonBottom
  },
  methods: {
    back () {
      if (this.isHtml) {
        window.history.go(-1)
      } else {
        // 关闭当前页面
        if (this.origin == 'YunyiDoctApp') {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('closeWebViewPage', null, (data) => {})
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('closeWebViewPage', null, (data) => {})
          }
        }
      }
    },
    // 获取文章信息
    getArticleInfo (id) {
      ajax.GetArticleInfo(id).then((res) => {
        if (res.data.succeed) {
          let data = res.data.data
          this.contentHtml = data.Content
          this.titleImage = data.ImgUrl
          this.time = data.UpdateTime
          this.title = data.Title
          this.hideLoading()
        }
      })
    },
    // 隐藏原生loading
    hideLoading () {
      // 跳转到原生首页
      if (this.origin == 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          this.$bridge.callhandler('dismissLoadingDialog', null, (data) => {})
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callHandler('dismissLoadingDialog', null, (data) => {})
        }
      }
    }
  },
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    this.headHeight = `${headHeight}px`
    // 当前页面高度
    this.contentHeight = `calc(100vh - ${headHeight}px)`
  },
  created () {
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    window['closeWebViewPage'] = this.closeWebViewPage
    window['dismissLoadingDialog'] = this.dismissLoadingDialog
    this.articleId = this.$route.query.id // query包含传递的所有参数,仿制刷新后参数不见
    this.isHtml = this.$route.query.isHtml // 判断是否是从H5页面过来的
    this.getArticleInfo(this.articleId)
  },
  watch: {}
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
  .advisoryOut {
    background: rgba(255, 255, 255, 1);
    overflow: auto;
    color: #303133;
    font-size: 14px;
  }
  .DetailBox {
    box-sizing: border-box;
    padding: 30px 19px;
    font-size: 18px;
    color: #333333;
  }
  .Detail-Title {
    display: flex;
    font-size: 20px;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
    line-height: 28px;
    margin-bottom: 25px;
    justify-content: center;
  }
  .Detail-Title-img {
    margin-bottom: 25px;
  }
  .Detail-Title-mini {
    box-sizing: border-box;
    display: flex;
    justify-content: left;
    height: 14px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(16, 142, 233, 1);
    line-height: 14px;
    margin-bottom: 42px;
  }
  .Detail-Title-mini li {
    height: 14px;
    line-height: 14px;
  }
  .Detail-Title-mini li:not(:last-child):after {
    content: "|";
    font-size: 14px;
    color: #999999;
    margin: 0 4px;
    height: 14px;
    line-height: 14px;
  }
  .Detail-Title-mini li:last-child {
    color: #999999;
  }
</style>
