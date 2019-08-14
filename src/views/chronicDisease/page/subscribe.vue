<template>
  <div class="referralDetailOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'签约详情'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="referralDetailOutContent" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <!-- 基本信息 -->
      <section dealInfo>
        <van-cell-group>
          <ul class="first-basic">
            <li>
              <p>签约人</p>
                <div>
                  <span>{{dealInfo.MemName}}</span><span @click="goPage">基本信息</span>
                </div>
            </li>
          </ul>
        </van-cell-group>
        <!-- 住院信息 -->
        <van-cell-group>
          <van-cell value="住院信息" />
          <ul class="basic">
            <li>
              <p>确诊时间</p><span>{{dealInfo.ConfirmDate}}</span></li>
            <li>
              <p>签约时间</p><span>{{dealInfo.SignTime}}</span></li>
            <li>
              <p>设备</p><span>{{dealInfo.BindNo}}</span></li>
            <li>
              <p>患者分组</p><span>{{dealInfo.GroupName}}</span></li>
            <li>
              <p>慢性病种</p><span>{{dealInfo.DiseaseName}}</span></li>
            <li>
              <p>服药记录</p><span>{{dealInfo.Medicine}}</span></li>
          </ul>
        </van-cell-group>
        <p class="titleBox">
          根据了解患者的情况为患者设置血压的预警范围
        </p>
        <van-cell-group>
          <div class="mmHg">
            <div>
              <span>收缩压上限</span>
              <p>{{dealInfo.SystolicHighValue}}mmHg</p>
            </div>
            <div>
              <span>舒张压上限</span>
              <p>{{dealInfo.DiastolicHighValue}}mmHg</p>
            </div>
          </div>
        </van-cell-group>
        <van-cell-group>
          <div class="mmHg">
            <div>
              <span>收缩压下限</span>
              <p>{{dealInfo.SystolicLowValue }}mmHg</p>
            </div>
            <div>
              <span>舒张压下限</span>
              <p>{{dealInfo.DiastolicLowValue}}mmHg</p>
            </div>
          </div>
        </van-cell-group>
        <van-button type="info" @click="submitform" :disabled="isDisable">联系患者</van-button>
      </section>
      <commonBottom class="bottom-style"/>
    </div>
  </div>
</template>

<script>
// 头部
import commonHeader from '@/components/header/commonHeader'
import commonBottom from '@/components/bottom/commonBottom'
import ajax from '@/api/index'
export default {
  name: 'subscribe',
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
      // 路由传参过来的查询详细信息id
      dealInfo: '',
      isDisable: false,
      memberId: '' // 写死的
    }
  },
  components: {
    commonHeader,
    commonBottom
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    // 获取签约信息
    GetSignInfo (memberId) {
      ajax.GetSignInfo(memberId).then((res) => {
        let result = res.data.data
        console.log(res)
        this.isDisable = false
        if (res.data.succeed) {
          this.dealInfo = res.data.data
          this.dealInfo.ConfirmDate = this.dealInfo.ConfirmDate.split(' ')[0]
          this.dealInfo.SignTime = this.dealInfo.SignTime.split(' ')[0]
          console.log(this.dealInfo)
        } else {
          this.$toast(result.msg)
        }
      })
    },
    // 跳转患者基本信息
    goPage () {
      this.$router.push({
        path: '/patientMsg',
        query: {
          memberId: this.memberId,
          type: 0
        }
      })
    },
    // 提交表单
    submitform () {
      let subStatus = true
      if (subStatus) {

      }
    }
  },
  created () {
    this.memberId = this.$route.query.memberId
    this.GetSignInfo(this.memberId)
  },
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    this.headHeight = `${headHeight}px`
    // 减去nav页面后body高度
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
  .referralDetailOut {
    background: rgba(255, 255, 255, 1);
    color: #303133;
    font-size: 14px;
  }
  .referralDetailOutContent {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background: #f8f8f8;
  }
  .referralDetailOut .heard-wrapper {
    border-bottom: 1px solid #E6E9F0;
  }
  .referralDetailOut >>>.van-cell-group:not(:last-child) {
    margin-top: 10px;
  }

  .referralDetailOut >>>.van-cell:not(:last-child)::after {
    right: 0.4rem;
  }
  .topBtn {
    background: #fff;
  }
  .referralDetailOut>>>.van-button {
    width: 345px;
    height: 50px;
    border-radius: 2px;
    margin: 15px;
    font-size: 16px;
  }
  .basic {
    padding: 15px;
  }
  .first-basic{
    padding: 15px;
  }
  .basic li ,.first-basic li{
    display: flex;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 8px 0;
  }
  .first-basic li{
    padding: 0;
  }
  .basic li p , .first-basic li p{
    color: #999999;
    width: 60px;
    padding-right: 40px;
  }
  .basic li span, .first-basic li span {
    max-width: 230px;
    color: #303133;
    text-align: left;
  }
  .first-basic div span:first-child {
    display: inline-block;
    width: 84px;
    padding-right: 85px;
  }
  .first-basic div span:last-child{
    color: #358FF3;
  }
  .first-basic div span:last-child:before{
    content: '|';
    color: #EEEEEE;
    margin-right: 15px;
  }
  .titleBox {
    padding: 15px 15px 5px 15px;
    color: #909399;
    background: #F8F8F8;
  }
  .topBtn i {
    margin-right: 10px;
  }
  .referralDetailOutContent>>>.van-cell__value {
    color: #323233;
  }
  .referralDetailOutContent >>> .van-field__control:disabled{
    color:#323233;
  }
  .mmHg{
    display: flex;
    justify-content: space-around;
  }
  .mmHg>div{
    padding: 15px 0;
    text-align: center;
  }

  .mmHg span{
    font-size:12px;
    color:rgba(144,147,153,1);
    line-height:12px;
  }
  .mmHg p{
    font-size:16px;
    font-weight:400;
    color:rgba(48,49,51,1);
    line-height:16px;
    margin-top: 10px;
  }
  .referralDetailOutContent >>>.van-button--normal {
    margin: 40px 15px 84px 15px;
    width: 345px;
    height: 44px;
    border-radius: 44px;
    background-color: #358FF3;
    font-size: 16px;
    letter-spacing: 1px;
  }
</style>
