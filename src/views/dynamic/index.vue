<template>
  <div class="advisoryOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :name="'医院动态'"  @back="back" :isBlack="isBlack" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="1.2+'rem'"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="advisoryContent" :style="{marginTop:this.headHeight,height:this.navHeight}">
      <van-tabs v-model="active" sticky @click="tabClick" title-active-color='#358FF3' color='#358FF3' line-height='1px'>
        <van-tab v-for="index in tabs" :title="index.Name" :key="index.CategoryId" :name="index.CategoryId" swipeable>
        </van-tab>
        <div :style="{height:contentHeight}" class="content">
          <van-pull-refresh v-model="list.refreshing" @refresh="onRefresh">
            <van-list v-model="list.loading" :finished="list.finished" :finished-text="'没更多内容了'" @load="onLoad">
              <!-- 首条新闻 -->
              <div>
                <div class="firstNew" v-for="(item, index) in Articles" v-if="index === 0" :data-title="item.Title" :data-articleid="item.ArticleId" @click="CheckOutDetail($event)">
                  <van-image width="10rem" height="5.06rem" lazy-load fit="cover" :src="item.ImgUrl">
                    <template v-slot:loading>
                      <van-loading type="spinner" size="20" />
                    </template>
                    <template v-slot:error>
                      加载失败
                    </template>
                  </van-image>
                  <span class="firstNew-cover"></span>
                  <p class="firstNew-title">{{item.Title}}</p>
                </div>
                <!-- 其他新闻 -->
                <div class="box" >
                  <!-- 列表信息 -->
                  <div class="New-list" v-for="(item, index) in Articles" v-if="index !== 0" :data-title="item.Title" :data-articleid="item.ArticleId" @click="CheckOutDetail($event)">
                    <div class="New-list-left" >
                      <h3>{{item.Title}}</h3>
                      <p>{{item.Summary}}</p>
                    </div>
                    <van-image
                      width="2.906rem"
                      height="2.08rem"
                      lazy-load
                      fit="cover"
                      :src="item.ImgUrl"
                    >
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                      <template v-slot:error>
                        加载失败
                      </template>
                    </van-image>
                  </div>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tabs>
    </div>
  </div>
</template>

<script>
// 头部
import commonHeader from '@/components/header/commonHeader'
import ajax from '@/api/index'
export default {
  name: 'agreement',
  data () {
    return {
      // 头部元素颜色
      bgColor: '#ffffff',
      color: '#303133',
      // 头部元素高度
      headHeight: '',
      // 传给原生的值（判断字体是否是黑色）
      isBlack: true,
      // 头部是否要返回按钮
      isBack: true,
      // 返回按钮图片
      returnImg: require('@/assets/backB.png'),
      // nav高度
      navHeight: 0,
      // 内容高度
      contentHeight: 0,
      // 是否激活
      active: '',
      // 是否最后
      isLast: false,
      // 数据条数
      count: 0,
      tabs: {},
      hospId: '7', // 医院id 开发默认值
      pageIndex: 0,
      pageSize: 5,
      CategoryId: '',
      Articles: [],
      list: {
        items: [],
        refreshing: false,
        loading: false,
        error: false,
        finished: false
      },
      tabName: '', // 当前激活的tabName
      isHtml: true
    }
  },
  components: {
    commonHeader
  },
  methods: {
    back () {
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
    },
    // 点击tab切换数据
    tabClick (name, title) {
      // 重新赋值文章id
      this.CategoryId = name
      this.tabName = title
    },
    // 上拉加载
    onLoad () {
      // 每次请求页数加1
      this.pageIndex += 1
      // 异步加载,每5毫秒加载一次
      if (this.CategoryId !== '') {
        console.log(this.CategoryId)
        this.GetArticles(this.hospId, this.CategoryId, this.pageIndex)
      }
      setTimeout(() => {
        this.list.loading = false
        if (this.isLast) {
          this.list.finished = true
        }
      }, 500)
    },
    // 下拉刷新
    onRefresh () {
      setTimeout(() => {
        this.Articles = []
        this.pageIndex = 0
        this.pageSize = 5
        this.isLast = false
        this.GetArticles(this.hospId, this.CategoryId)
        this.list.finished = false
        this.list.refreshing = false
        window.scrollTo(0, 10)
      }, 1000)
    },
    // 获取资讯分类
    GetCategories (hospId) {
      ajax.GetCategories(hospId).then((res) => {
        this.tabs = res.data.data
        this.CategoryId = res.data.data[0].CategoryId
        this.tabName = res.data.data[0].Name
      })
    },
    // 根据分类ID获取文章。
    GetArticles (hospId, categoryId, pageIndex, pageCount) {
      ajax.GetArticles(hospId, categoryId, pageIndex, pageCount).then((res) => {
        if (res.data.succeed) {
          this.hideLoading()
        }
        this.isLast = res.data.IsLast
        this.count = res.data.Count
        let data = res.data.data
        data.map((val, index) => {
          this.Articles.push(val)
        })
      })
    },
    // 查看文章详细信息
    CheckOutDetail (e) {
      e.preventDefault()
      e.stopPropagation()
      let ArticleId = e.currentTarget.dataset.articleid
      this.$router.push({
        path: '/dynamicDetail', // 跳转路径
        name: 'dynamicDetail', // 跳转路径的name值，不写跳转后页面取不到参数
        // 参数
        query: {
          id: ArticleId,
          isHtml: this.isHtml
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
    this.navHeight = `calc(100vh - ${headHeight}px)`
    // 内容高度
    this.contentHeight = `calc(${this.navHeight} - ${44 / 37.5}rem)`
  },
  created () {
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    window['closeWebViewPage'] = this.closeWebViewPage
    window['dismissLoadingDialog'] = this.dismissLoadingDialog
    this.GetCategories(this.hospId)
  },
  watch: {
    CategoryId (val, oldval) {
      // 监听当前tab是哪一个激活,根据激活tab的文章id请求新的数据
      this.isLast = false
      this.list.finished = false
      this.list.refreshing = false
      this.pageIndex = 0
      this.pageSize = 5
      this.Articles = []
      this.CategoryId = val
      console.log('whatch', this.CategoryId)
      this.GetArticles(this.hospId, this.CategoryId)
    },
    tabName (val, oldval) {
      this.tabName = val
    }
  }
}
</script>

<style scoped>
  .headOuter {
    position: fixed;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #E6E9F0;
  }
  .advisoryOut {
    color: #303133;
    font-size: 14px;
  }
  .advisoryOut>>>.van-tab {
    font-size: 16px;
  }
  .advisoryOut>>>.van-tab--active {
    color: #358FF3;
  }
  .advisoryOut>>>.van-tabs__line {
    background-color: #358FF3;
  }
  .content{
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    padding-top: 10px;
  }
  .firstNew {
    position: relative;
    box-sizing: border-box;
  }
  .firstNew-cover {
    position: absolute;
    box-sizing: border-box;
    left: 0;
    top: 0;
    right: 0;
    bottom: 4px;
    background: linear-gradient(360deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.3) 51%, rgba(0, 0, 0, 0) 100%);
    color: #FFFFFF;
    font-size: 26px;
  }
  .firstNew-title {
    position: absolute;
    bottom: 20px;
    color: #fff;
    line-height: 25px;
    font-size: 18px;
    left: 0;
    right: 0;
    text-align: center;
  }
  .New-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 14px;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    padding-bottom: 14px;
  }
  .New-list-left {
    padding-right: 15px;
    max-width: 222px;
    overflow: hidden;
  }
  .New-list-left h3 {
    font-size: 16px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
    margin-bottom: 14px;
  }
  .New-list-left p {
    height: 15px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
