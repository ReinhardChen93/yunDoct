<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'患者信息'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div class="box-title">
        患者基本信息
      </div>
      <div class="box">
        <div class="box-item">
          <div class="box-item-left">姓名</div>
          <div class="box-item-right">{{basicHealth.MemName}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">性别</div>
          <div class="box-item-right">{{sex}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">生日</div>
          <div class="box-item-right">{{birthday}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">身高（cm）</div>
          <div class="box-item-right">{{basicHealth.Height}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">体重（kg）</div>
          <div class="box-item-right">{{basicHealth.Weight}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">血型</div>
          <div class="box-item-right">{{blood}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">婚育史</div>
          <div class="box-item-right">{{marrige}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">手术或外伤</div>
          <div class="box-item-right" v-if="basicHealth.OperationAdd!=''">{{basicHealth.OperationText}}、{{basicHealth.OperationAdd}}</div>
          <div class="box-item-right" v-else>{{basicHealth.OperationText}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">家族病史</div>
          <div class="box-item-right" v-if="basicHealth.FamilyAllergyAdd!=''">{{basicHealth.FamilyAllergyText}}、{{basicHealth.FamilyAllergyAdd}}</div>
          <div class="box-item-right" v-else>{{basicHealth.FamilyAllergyText}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">药物过敏</div>
          <div class="box-item-right" v-if="basicHealth.MedicAllergyAdd!=''">{{basicHealth.MedicAllergyText}}、{{basicHealth.MedicAllergyAdd}}</div>
          <div class="box-item-right" v-else>{{basicHealth.MedicAllergyText}}</div>
        </div>
        <div class="box-item">
          <div class="box-item-left">食物或接触过敏</div>
          <div class="box-item-right" v-if="basicHealth.FoodAllergyAdd!=''">{{basicHealth.HabitText}}、{{basicHealth.HabitAdd}}</div>
          <div class="box-item-right" v-else>{{basicHealth.HabitText}}</div>
        </div>
      </div>
      <commonBottom class="bottom-style" />
    </div>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
  import commonBottom from '@/components/bottom/commonBottom'
  // ajax
  import ajax from '@/api/index'
  export default {
    components: {
      commonHeader,
      commonBottom
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
        memberId: '',
        basicHealth: [],
        //性别
        sex: '',
        // 血型
        blood: '',
        // 婚史
        marrige: '',
        // 生育
        fertility: '',
        birthday: '',
        type: ''
      }
    },
    methods: {
      back() {
        // 跳转到原生首页
        if (this.origin == 'YunyiDoctApp'&& this.type == undefined) {
          if (this.userAgent.indexOf('IPHONE') > -1) {
            this.$bridge.callhandler('closeWebViewPage', null, (data) => {})
          } else {
            // Android
            // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
            window.WebViewJavascriptBridge.callHandler('closeWebViewPage', null, (data) => {})
          }
        }else{
          window.history.go(-1)
        }
      },
      // 隐藏原生loading
      hideLoading() {
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
      },
      GetMemberDoc() {
        ajax.GetMemberDoc(this.memberId).then(res => {
          if (res.data.succeed) {
            this.basicHealth = res.data.data
            if (this.basicHealth.MemSex == 0) {
              this.sex = '男'
            } else {
              this.sex = '女'
            }
            if (this.basicHealth.Birthday) {
              this.birthday = this.basicHealth.Birthday.split(' ')[0]
            }
            if (this.basicHealth.Blood == 0) {
              this.blood = '未知血型'
            } else if (this.basicHealth.Blood == 1) {
              this.blood = 'A血型'
            } else if (this.basicHealth.Blood == 2) {
              this.blood = 'B血型'
            } else if (this.basicHealth.Blood == 3) {
              this.blood = 'O血型'
            } else if (this.basicHealth.Blood == 4) {
              this.blood = 'AB血型'
            } else {
              this.blood = '其他'
            }
            if (this.basicHealth.Marriage == 0) {
              this.marrige = '已婚'
            } else {
              this.marrige = '未婚'
            }
            if (this.basicHealth.Fertility == 0) {
              this.fertility = '未生育'
            } else if (this.basicHealth.Fertility == 1) {
              this.fertility = '备孕期'
            } else if (this.basicHealth.Fertility == 2) {
              this.fertility = '怀孕期'
            } else {
              this.fertility = '已生育'
            }
          }
        })
      }
    },
    created: function() {
      this.hideLoading()
      this.origin = this.$cookie.get('origin')
      this.userAgent = window.navigator.userAgent.toUpperCase()
      this.memberId = this.$route.query.memberId
      this.type = this.$route.query.type
      this.GetMemberDoc()
      window['closeWebViewPage'] = this.closeWebViewPage
      window['dismissLoadingDialog'] = this.dismissLoadingDialog
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
       this.headHeight = `${headHeight}px`
      // 当前页面高度
      this.navHeight = `calc(100vh - ${headHeight}px)`
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
  .box {
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    background: #fff;
  }
  .box-title {
    height: 44px;
    line-height: 44px;
    color: #999;
    padding: 0 15px;
  }
  .box-item {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #E6E9F0;
    overflow: hidden;
    padding: 12px 0;
  }
  .box-item-left {
    flex: 3;
    text-align: left;
  }
  .box-item-right {
    flex: 7;
    text-align: right;
    color: #999;
    padding-left: 15px;
    box-sizing: border-box;
    word-wrap: break-word;
    word-break: normal;
  }
</style>
