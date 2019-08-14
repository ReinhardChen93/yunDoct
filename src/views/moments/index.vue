<template>
  <div class="advisoryOut">
    <!-- 内容 -->
    <div class="headOuter" v-show="this.isOrigin" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="headName" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :moment="moment" @moment="addCircles"></commonHeader>
    </div>
    <div class="advisoryContent" :style="this.isOrigin?'height:this.contentHeight':''">
      <van-pull-refresh v-model="list.refreshing" @refresh="onRefresh">
        <van-list v-model="list.loading" :finished="list.finished" :finished-text="'没更多内容了'" @load="onLoad">
          <div class="ChatContent" v-for="(item, index) in dealInfo" :key="index">
            <div class="ChatBox">
              <div class="ChatHead">
                <van-image
                  height="1.06rem" width="1.06rem"
                  lazy-load
                  class="ChatHead-img"
                  fit="cover"
                  :src="item.DoctPhoto"
                  @click="checkDocDetail"
                >
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error>

                  </template>
                </van-image>
              </div>
              <div>
                <h4 class="userName">
                  {{item.DoctName}}
                </h4>
                <p>
                  {{item.HospName}}
                </p>
              </div>
            </div>
            <div class="ChatDetail">
              <p>{{item.Content}}</p>
              <div class="ChatImage" v-show="item.Attachment.length">
                <van-image  height="2.24rem" width="2.24rem" v-for="(img, index) in item.Attachment" fit="cover" :src="img.ImageUrl" lazy-load  @click="imageShowApp(index,item.Attachment)">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                  <template v-slot:error>
                    加载失败
                  </template>
                </van-image>
              </div>
              <div class="ChatTool">
                <div class="ToolLeft">
                  <span>{{timeFn(item.SendTime)}}</span>
                  <span v-show="item.WhetherSelf" @click="DeleteHospDoctCircleDynamic(item.DynamicId,index)">删除</span>
                </div>
                <div class="ToolIcon">
                  <ul>
                    <li>
                      <i class="iconfont icondianzan iconLike" :class="{'likeActive':item.LikeStatus}" @click="IconLikeClick(item.DynamicId,index,item.LikeStatus)"></i><em v-show="item.LikeSum">{{item.LikeSum}}</em>
                    </li>
                    <li>
                      <i class="iconfont iconziyuan iconComment" @click="replys(index, item.DynamicId)"></i><em v-show="item.Replylist.length">{{item.Replylist.length}}</em>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="ChatMessage">
                <div class="ChatMessage-title" :class="{'title-border-bottom':item.Replylist.length}"  v-show="item.LikeSum">
                  <div>
                    <i class="iconfont icondianzan iconLike"></i>
                    <span v-for="(likeName, index) in item.LikeDoctName" :key="likeName">{{likeName}}<span v-show="index !== item.LikeDoctName.length-1">,</span></span>
                  </div>
                </div>
                <div class="ChatMessage-list" v-show="item.Replylist.length">
                  <ul class="ChatMessage-list-discuss">
                    <li v-for="(reply, leven) in item.Replylist" v-if="reply.ReReplyDoctName === null" :key="reply.ReplyId" @click="replys(index, reply.DynamicId, reply.WhetherSelf, reply.ReReplyId, reply.DoctName, item.DoctName, reply.ReplyId, leven)">
                      <span>{{reply.DoctName}}:</span>
                      {{reply.Content}}
                    </li>
                    <li v-else @click="replys(index, reply.DynamicId, reply.WhetherSelf, reply.ReReplyId, reply.DoctName, item.DoctName, reply.ReplyId, leven)">
                      <span>{{reply.DoctName}}:</span>
                      <b>回复</b>
                      <span>{{reply.ReReplyDoctName}}</span>
                      {{reply.Content}}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
      <commonBottom class="bottom-style" />
    </div>

    <!-- 回复弹窗 -->
    <van-action-sheet
      v-model="isShow"
    >
      <van-cell-group>
        <van-field
          v-model="Content"
          center
          clearable
          :placeholder="placeholder"
        >
          <van-button slot="button" type="info" @click="submitMessage">发送</van-button>
        </van-field>
      </van-cell-group>
    </van-action-sheet>
  </div>
</template>

<script>
// 头部
import ajax from '@/api/index'
import { ImagePreview } from 'vant'
import commonHeader from '@/components/header/commonHeader'
import commonBottom from '@/components/bottom/commonBottom'
export default {
  components: {
    commonHeader,
    commonBottom
  },
  name: 'moments',
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
      // 头部标题名称
      headName: '',
      // 右边加号
      moment: '+',
      navHeight: '',
      origin: '',
      userAgent: '',
      isOrigin: false, // 判断是否需要添加顶部panel
      doctorId: '', // 医生Id，默认为：null（(如果获取医生自己圈子时为空)）
      stateType: '', // 0:全部圈子，1:个人圈子（默认为0）
      show: false,
      index: 0,
      placeholder: '', // 输入框提示
      // 下拉刷新和上拉加载参数配置
      list: {
        items: [],
        refreshing: false,
        loading: false,
        error: false,
        finished: false
      },
      pageIndex: 0,
      pageSize: 5,
      // 是否是第一次加载
      firstLoad: true,
      // 是否最后
      isLast: false,
      // 数据条数
      count: 0,
      isShow: false,
      discuss: '', // 评论数据
      isLike: -1,
      dealInfo: [], // 从后台获取的朋友圈信息
      DynamicId: '', // 文章id
      ReReplyId: '', // 跟帖id
      Content: '', // 评论内容
      DoctName: '', // 这条评论的主人
      articleIndex: '', // 当前评论的是那一条文章
      browserImages: '',
      cricleReloadData: '',
      dismissLoadingDialog: '',
      comment: '', // 隐藏原生navbar
      sendercomment: '', // 显示原生navbar
      moreList: [ { class: 'plus' } ]
    }
  },
  methods: {
    back () {
      // 跳转到原生首页
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
    // 显示原生navbar
    showNav () {
      /*if (this.origin == 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          console.log('显示')
          this.$bridge.callhandler('sendercomment', null, (data) => {
            console.log('显示')
          })
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callHandler('sendercomment', null, (data) => {})
        }
      }*/
    },
    // 隐藏原生navbar
    hiddenNav () {
      /*if (this.origin == 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          console.log('隐藏')
          this.$bridge.callhandler('comment', null, (data) => {
            console.log('隐藏')
          })
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callHandler('comment', null, (data) => {})
        }
      }*/
    },
    // 获取圈子动态
    GetListDoctCircleDynamics (pageSize, type, dynamicIds, stateType, doctorId) {
      this.firstLoad = false
      ajax.GetListDoctCircleDynamics(pageSize, type, dynamicIds,stateType, doctorId).then((res) => {
        console.log('ressss', res)
        if (res.data.data.length !== 0) {
          let result = res.data.data
          let _this = this
          if (res.data.succeed) {
            console.log('jin')
            this.isLast = res.data.IsLast
            this.count = res.data.Count
            switch (type) {
              case '':
                _this.dealInfo = []
                result.map((val, index) => {
                  _this.dealInfo.push(val)
                })
                break
              case 1:
                result.map((val, index) => {
                  _this.dealInfo.push(val)
                })
                break
              case 2:
                result.map((val, index) => {
                  _this.dealInfo.unshift(val)
                })
                break
            }
            console.log('dfg', this.dealInfo)
          } else {
            this.$toast(result.msg)
          }
        } else {
          this.isLast = true
        }
      })
    },
    // 删除动态
    DeleteHospDoctCircleDynamic (dynamicId, index) {
      this.hiddenNav()
      let DynamicId = dynamicId
      let _this = this
      function beforeClose (action, done) {
        if (action === 'confirm') {
          ajax.DeleteHospDoctCircleDynamic(DynamicId).then((res) => {
            let result = res.data
            console.log('删除评论', res.data.data)
            if (result.succeed) {
              _this.showNav()
              console.log(_this.dealInfo)
              _this.dealInfo.splice(index, 1)
              done()
              _this.$toast('删除评论成功')
            } else {
              _this.showNav()
              _this.$toast(result.msg)
            }
          })
        } else {
          done()
          _this.showNav()
        }
      }
      this.$dialog.confirm({
        title: '提示',
        message: '确认删除此动态吗?',
        beforeClose
      })
    },
    // 评论
    SaveHospDoctCircleReply (DynamicId, ReReplyId, Content) {
      ajax.SaveHospDoctCircleReply(DynamicId, ReReplyId, Content).then((res) => {
        let result = res.data.data
        if (res.data.succeed) {
          this.$toast('评论成功')
          this.dealInfo[this.articleIndex].Replylist.push({
            'Content': result.Content,
            'DoctId': result.DoctId,
            'DoctName': result.DoctName,
            'DynamicId': result.DynamicId,
            'ReReplyDoctName': result.ReReplyDoctName,
            'ReReplyId': result.ReReplyId,
            'ReplyId': result.ReplyId,
            'SendTime': result.SendTime
          })
        } else {
          this.$toast(res.data.msg)
        }
      })
    },
    // 点赞
    SaveHospDoctCircleLikes (dynamicId) {
      ajax.SaveHospDoctCircleLikes(dynamicId).then((res) => {
        let result = res.data
        console.log('点赞', res)
        if (result.succeed) {
          this.dealInfo[this.articleIndex].LikeSum = result.data.LikeSum
          this.dealInfo[this.articleIndex].LikeDoctName = result.data.DoctNames
        } else {
          this.$toast(result.msg)
        }
      })
    },
    // 上拉加载
    onLoad () {
      console.log('第几次', this.dealInfo)
      let type = '' // 1加载,2刷新
      let DynamicIds = '' // 需要告诉后台从那一天开始查询
      // 每次请求页数加1
      if (this.firstLoad === true) {
        type = '' // 第一次加载type不传
        DynamicIds = ''
      } else {
        console.log('不是第一次了')
        type = 1
        console.log(this.dealInfo)
        console.log(typeof this.dealInfo.length)
        if (this.dealInfo.length === 0) {
          DynamicIds = ''
        } else {
          console.log('length', this.dealInfo.length)
          DynamicIds = this.dealInfo[this.dealInfo.length - 1].DynamicId
        }
      }
      console.log('console.log(this.doctorId)',this.doctorId)
      if (this.doctorId !== '' && this.doctorId !== undefined && this.doctorId !== null) {
        this.GetListDoctCircleDynamics(this.pageSize, type, DynamicIds, this.stateType, this.doctorId)
      } else {
        this.GetListDoctCircleDynamics(this.pageSize, type, DynamicIds)
      }

      // 异步加载,每5毫秒加载一次
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
        this.pageSize = 5
        this.isLast = false
        let type = 2 // type = 2 刷新
        let DynamicIds = ''
        DynamicIds = this.dealInfo[0].DynamicId
        console.log('console.log(this.doctorId)',this.doctorId)
        if (this.doctorId !== '' && this.doctorId !== undefined && this.doctorId !== null) {
          this.GetListDoctCircleDynamics(this.pageSize, type, DynamicIds, this.stateType, this.doctorId)
        } else {
          this.GetListDoctCircleDynamics(this.pageSize, type, DynamicIds)
        }
        this.list.finished = false
        this.list.refreshing = false
        window.scrollTo(0, 10)
      }, 1000)
    },
    // 预览图片
    showImagePreview (position, imageData, timer) {
      console.log(imageData)
      console.log(position)
      let image = []
      for (let key in imageData) {
        image.push(imageData[key].ImageUrl)
      }
      const instance = ImagePreview({
        images: image,
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
    IconLikeClick (DynamicId, index, isLike) {
      this.articleIndex = ''
      console.log('312',DynamicId, index)
      this.articleIndex = index
      this.dealInfo[index].LikeStatus = !this.dealInfo[index].LikeStatus
      if (DynamicId && index !== '' && index !== null && index !== undefined) {
        console.log('进来了')
        this.SaveHospDoctCircleLikes(DynamicId, isLike)
      }
    },
    // 评论
    replys (index, DynamicId, WhetherSelf, ReReplyId, DoctName, fatherName, ReplyId, leven) {
      // 制空参数
      console.log(WhetherSelf)
      this.ReReplyId = ''
      this.articleIndex = ''
      this.placeholder = ''
      this.articleIndex = ''
      console.log('fatherName', fatherName)
      this.articleIndex = index
      switch (WhetherSelf) {
        case true :
          this.isShow = false
          this.DeleteDoctCircleReply(ReplyId, leven)
          break
        case false :
          this.isShow = true
          break
        case undefined:
          this.isShow = true
      }
      console.log('ReReplyId', ReReplyId)
      // 有两种类型,一种是有reply.DoctName!=='',是属于跟帖,另一种是自己发送回复
      if (ReReplyId !== undefined && ReReplyId !== null && ReReplyId !== '') {
        console.log('有跟贴id')
        console.log('跟贴id', ReReplyId)
        // 有跟帖id的情况下判断是否是本人追加评论
        if (fatherName !== DoctName) {
          this.placeholder = '回复' + DoctName
        }
        this.ReReplyId = ReReplyId
      } else {
        console.log('sm', leven)
        console.log('这条评论的id', ReplyId)
        console.log('没有跟帖id,就删除')
        console.log('这条评论是谁的', DoctName)
      }
      this.DynamicId = DynamicId
      console.log('this.DynamicId', this.DynamicId)
      console.log('this.placeholder', this.placeholder)
    },
    // 删除单条自己的评论
    DeleteDoctCircleReply (replyId, leven) {
      console.log('要删除评论呢', replyId)
      console.log('在数据里是那一条', leven)
      console.log(this.articleIndex)
      console.log('单个删除自己的评论', this.dealInfo[this.articleIndex].Replylist[leven], typeof this.dealInfo[this.articleIndex].Replylist[leven])

      this.hiddenNav()
      let _this = this
      function beforeClose (action, done) {
        if (action === 'confirm') {
          ajax.DeleteDoctCircleReply(replyId).then((res) => {
            let result = res.data
            console.log('删除评论', res.data.data)
            if (result.succeed) {
              _this.showNav()
              console.log(_this.dealInfo)
              _this.dealInfo[_this.articleIndex].Replylist.splice(leven, 1)
              done()
              _this.$toast('删除评论成功')
            } else {
              _this.showNav()
              _this.$toast(result.msg)
            }
          })
        } else {
          done()
          _this.showNav()
        }
      }
      this.$dialog.confirm({
        title: '提示',
        message: '确认删除此评论吗?',
        beforeClose
      })
    },
    // 发送消息后关闭弹窗
    submitMessage () {
      console.log('submitMessage')
      console.log(this.Content)
      console.log(this.DynamicId)
      console.log(this.ReReplyId)
      if (this.Content !== '' && this.DynamicId !== '') {
        this.SaveHospDoctCircleReply(this.DynamicId, this.ReReplyId, this.Content)
        this.isShow = false
      } else {
        this.$toast('回复不能是空的哦')
      }
      console.log(this.isShow)
    },
    // 关闭原生loding
    hideLoading () {
      // 跳转到原生首页
      if (this.origin === 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          console.log('33')
          this.$bridge.callhandler('dismissLoadingDialog', null, (data) => {
            console.log('2')
          })
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callHandler('dismissLoadingDialog', null, (data) => {})
        }
      }
    },
    // 原生发布新的圈子动态
    publish () {
      // 跳转到原生首页
      if (this.origin === 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          this.$bridge.registerhandler('cricleReloadData', (params, data) => {
            console.log('刷新,接收到', params)
            this.refresh()
          })
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.registerhandler('cricleReloadData', (params, data) => {
            console.log('刷新,接收到', params)
            this.refresh()
          })
        }
      }
    },
    // 原生调用我们的刷新
    imageShowApp (index, imageData) {
      let imageList = []
      for (let key in imageData) {
        imageList.push(imageData[key].ImageUrl)
      }
      let datas = {
        index, imageList
      }
      if (this.origin === 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          console.log('33')
          this.$bridge.callhandler('browserImages', datas, (data) => {
            console.log('2')
          })
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callHandler('browserImages', datas, (data) => {})
        }
      }
    },
    // 原生查看图片
    refresh () {
      console.log('web刷新')
      this.pageSize = 5
      this.isLast = false
      let type = 2 // 刷新
      let DynamicIds = ''
      DynamicIds = this.dealInfo[0].DynamicId
      if (this.doctorId !== '' && this.doctorId !== undefined && this.doctorId !== null) {
        this.GetListDoctCircleDynamics(this.pageSize, type, DynamicIds, this.stateType, this.doctorId)
      } else {
        this.GetListDoctCircleDynamics(this.pageSize, type, DynamicIds)
      }
      this.list.finished = false
      this.list.refreshing = false
    },
    // 获取时间差
    timeFn (sendTime) {
      let dateBegin = sendTime
      dateBegin = new Date(dateBegin.replace(/-/g, '/'))
      let dateEnd = new Date() // 获取当前时间
      let dateDiff = dateEnd.getTime() - dateBegin.getTime()// 时间差的毫秒数
      let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))// 计算出相差天数
      let leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000))// 计算出小时数
      // 计算相差分钟数
      let leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000))// 计算相差分钟数
      // 计算相差秒数
      let leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000)
      if (dayDiff) {
        return dayDiff + '天前'
      } else if (hours) {
        return hours + '小时前'
      } else {
        return minutes + '分钟前'
      }
    },
    // 点击头像查看医生信息
    checkDocDetail () {
      this.$router.push({
        path: '/doctIndex',
        query: {
          type: 0
        }
      })
    },
    // 调取原生方法,添加朋友圈
    addCircles () {
      if (this.origin == 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          console.log('显示')
          this.$bridge.callhandler('addCircle', null, (data) => {
            console.log('显示')
          })
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callHandler('addCircle', null, (data) => {})
        }
      }
    }
  },
  mounted () {
    if (this.isOrigin) {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight}px`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight}px)`
      // 内容高度
      this.contentHeight = `calc(100vh - ${headHeight}px)`
    }
  },
  created () {
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    this.stateType = this.$route.query.stateType
    this.doctorId = this.$route.query.doctorId
    /*if (this.doctorId !== '' && this.doctorId !== undefined && this.doctorId !== null) {
      this.isOrigin = false // 这里是控制头部导航是否显示的地方,如果有doctorId就需要隐藏,但是现在的需求是不需要隐藏,所有改成true,如果需要隐藏改成false
    }*/
    this.isOrigin = true
    if (this.doctorId !== undefined) {
      this.headName = '我的圈子'
    } else {
      this.headName = '圈子'
    }
    window['cricleReloadData'] = this.cricleReloadData
    window['dismissLoadingDialog'] = this.dismissLoadingDialog
    window['browserImages'] = this.browserImages
    window['closeWebViewPage'] = this.closeWebViewPage
    window['comment'] = this.comment
    window['sendercomment'] = this.sendercomment
    window['addCircle'] = this.addCircle
    this.hideLoading()
    this.publish()
  },
  watch: {
    isShow (val, oldval) {
      this.Content = ''
      if (val) {
        this.hiddenNav()
      } else {
        this.showNav()
      }
    }
  }

}
</script>

<style scoped>
  .advisoryContent{
    height: 100vh;
    background:rgba(255,255,255,1);
    color:#303133;
    font-size: 14px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .advisoryOut >>> .van-overlay{
    background-color: rgba(0, 0, 0, 0)!important;
  }
  .userName{
    font-size: 14px;
    height: 14px;
    line-height: 14px;
  }
  .ChatContent{
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .ChatContent:not(:last-child){
    border-bottom: 1px solid #eee;
  }
  .ChatBox{
    display: flex;
    align-items:center;
    box-sizing: border-box;
    padding-left: 15px;
    padding-right: 15px;
  }
  .ChatHead{
    margin-right: 10px;
    display: flex;
  }
  .ChatHead >>> .van-image__img{
    border-radius: 40px;
    width: 40px;
    height: 40px;
  }
  .ChatBox p{
    margin-top: 8px;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    color: #909399;
  }
  .ChatDetail{
    margin-left: 65px;
    margin-top: 8px;
    margin-right: 15px;
    font-size: 16px;
    letter-spacing:-1px;
  }
  .ChatDetail i{
    margin-right: 5px;
  }
  .ChatImage{
    box-sizing: border-box;
    margin-top: 10px;
  }
  .ChatImage >>> .van-image{
    margin-right: 5px;
  }
  .ChatTool{
    display: flex;
    justify-content: space-between;
    color:rgba(144,147,153,1);
    line-height:12px;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 12px;
  }
  .ChatTool span:nth-child(1){
    margin-right: 10px;
  }
  .ChatTool span:nth-child(2){
    color: #358FF3;
  }
  .ToolIcon ul{
    display: flex;
  }
  .ToolIcon li{
    display: flex;
    justify-content:center;
    align-items:center;
    font-size: 12px;
    min-width: 29px;
  }
  .ToolIcon li:not(:last-child){
    margin-right: 20px;
  }
  .ToolIcon em{
    font-style: normal;
    margin-left: 5px;
    color: #BFC2CC;
  }
  .ChatMessage{
    box-sizing: border-box;
  }
  .ChatMessage-title{
    display: flex;
    box-sizing: border-box;
    background: #F8F8F8;
    padding: 10px 10px 8px 10px;
  }
  .ChatMessage-list{
    background: #F8F8F8;
    padding: 0 10px 10px 10px;
  }
  .ChatMessage-title div{
    line-height: 14px;
  }
  .ChatMessage-title span{
    font-size: 14px;
  }
  .ChatMessage-title div span {
    padding-left: 5px;
  }
  .ChatMessage-title i{
    margin-right: 5px;
  }
  .ChatMessage-title p{
    color: #358FF3;
    height: 14px;
    line-height: 14px;
    font-size: 14px;
  }
  .ChatMessage-title b{
    font-weight: normal;
  }
  .ChatMessage-list-discuss li{
    line-height: 16px;
    padding-top: 8px;
    font-size: 14px;
    letter-spacing: 0.5px;
  }
  .ChatMessage-list-discuss li span{
    color: #358FF3;
  }
  .ChatMessage-list-discuss b{
    font-weight:normal;
  }
  .ChatMessage-list-discuss p{
    display: inline-block;
    margin-left: 5px;
  }
  .iconLike{
    color: #BFC2CC;
  }
  .likeActive{
    color: #ff6a5b;
  }
  .iconComment{
    color:#BFC2CC
  }
  .iconComment:active{
    color:#bfc2cc
  }
  .advisoryOut >>> .van-cell__value--alone { /*修改输入框背景色*/
    color: #323233;
    text-align: left;
    background: #F5F6FA;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .advisoryOut >>> .van-field__control{ /*修改输入框左右内边距*/
    padding: 0 10px;
  }
  .title-border-bottom{
    border-bottom: 1px solid #E6E9F0;
  }
</style>
