<template>
  <div class="myReferralDeal">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'转诊处理'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <div class="content" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div class="gray-panel">
        本院目前的空床情况
      </div>
      <div class="panel" @click="selectBad(1)">
        <div class="panel-left">
          <p>神经内科一病区</p>
          <span>3床</span>
        </div>
        <div class="panel-right">
          <i class="iconfont" :class="activeClass == 1 ? 'iconselected':''" ></i>
        </div>
      </div>
      <div class="panel" @click="selectBad(2)">
        <div class="panel-left">
          <p>神经内科一病区</p>
          <span>3床</span>
        </div>
        <div class="panel-right">
          <i class="iconfont" :class="activeClass == 2 ? 'iconselected':''" ></i>
        </div>
      </div>
      <div class="gray-panel">
        处理情况
      </div>
      <div class="isAgree">
        <span>是否同意转入</span>
        <ul>
          <li :class="{ isAgreeActive:state === 0 }" @click="changeColor(0)">不同意</li>
          <li :class="{ isAgreeActive:state === 1 }" @click="changeColor(1)">同意</li>
        </ul>
      </div>
      <van-cell-group v-if="state">
        <van-field readonly clickable label="入院时间" :value="transferData" placeholder="请选择" right-icon="arrow" @click="showInHospitalTimePicker = true" />
        <van-popup v-model="showInHospitalTimePicker" position="bottom">
          <van-datetime-picker v-model="inHospitalTime" type="date" :min-date="hospitalMinDate" :max-date="hospitalMaxDate" :formatter="formatter" @confirm="onInHospitalTimeConfirm" />
        </van-popup>
      </van-cell-group>
      <van-cell-group v-else>
        <!-- 转入医院 -->
        <van-field readonly clickable label="拒绝原因" :value="reason" placeholder="请选择" right-icon="arrow" @click="showIntoHospitalPicker = true" />
        <van-popup v-model="showIntoHospitalPicker" position="bottom">
          <van-picker show-toolbar :columns="intoHospitalList" @cancel="showIntoHospitalPicker = false" @confirm="onIntoHospitalConfirm" />
        </van-popup>
        <van-field type="textarea" v-show="reason === '其他'" v-model="otherReason" placeholder="其他原因描述…" rows="4" autosize />
      </van-cell-group>
      <van-button type="info" @click="submitform" :disabled="isDisable">确定</van-button>
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
      // nav高度
      navHeight: 0,
      /** ************** 提交后台的form数据 ******************/
      formData: {},
      // 是否同意转诊 0不同意,1同意
      isAgree: 1,
      // 转入时间参数设置
      inHospitalTime: new Date(),
      hospitalMinDate: new Date(1900, 1, 1),
      hospitalMaxDate: new Date(),
      hospitalTime: '',
      showInHospitalTimePicker: false,
      // 提交按钮限制
      isDisable: false,
      // 拒绝原因
      intoHospitalList: [{
        text: '没有床位',
        value: '0'
      },
      {
        text: '其他',
        value: '1'
      }
      ],
      showIntoHospitalPicker: false,
      reason: '', // 下拉选择得拒绝原因
      otherReason: '', // 其他拒绝原因
      activeClass: '',
      hospId: '', // 医院id
      reqId: '', // 申请Id
      transferData: '', // 转入时间
      result: '', // 拒绝原因
      state: 1 // 处理状态(0 拒绝 1 同意)
    }
  },
  methods: {
    back () {
      window.history.go(-1)
    },
    // 获取床位
    QueryBedInfo (hospId) {
      ajax.QueryBedInfo(hospId).then((res) => {
        let result = res.data
        console.log(result)
        if (result.succeed) {
          this.dealInfo = res.data.data
          console.log(this.dealInfo)
        }
      })
    },
    ReferralProcessing(reqId, state, transferData, result) {
      ajax.ReferralProcessing(reqId, state, transferData, result).then((res) => {
        let result = res.data
        console.log(result)
        if (result.succeed) {
          this.$toast('处理成功!')
          setTimeout(() => {
            window.history.go(-2)
          }, 2000)
        }
      })
    },
    // 选择床位
    selectBad (index) {
      this.activeClass = index
    },
    // 是否同意
    changeColor (index) {
      this.state = index
    },
    // 年份选择
    formatter (type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      }
      return value
    },
    // 转入日期选择
    onInHospitalTimeConfirm (value) {
      this.transferData = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate()
      this.showInHospitalTimePicker = false
      // 这里还有需要传给后台的value没有赋值,但是已经存在sex对象里
      console.log(value)
      console.log(typeof value)
    },
    // 拒绝原因
    onIntoHospitalConfirm (value) {
      this.reason = value.text
      this.showIntoHospitalPicker = false
    },
    // 提交表单
    submitform () {
      console.log('hospId', this.hospId, 'reqId', this.reqId, 'transferData', this.transferData, 'result', this.result, 'state', this.state)
      switch (this.state) {
        case 1:
          if (this.transferData !== '') {
            this.ReferralProcessing(this.hospId, this.reqId, this.state, this.transferData, this.result)
          } else {
            this.$toast('请选择入院时间', 2000)
          }
          break
        case 0:
          if (this.result !== '') {
            this.ReferralProcessing(this.hospId, this.reqId, this.state, this.transferData, this.result)
          } else {
            this.$toast('请填写拒绝原因', 2000)
          }
          break
      }
    }
  },
  created: function () {
    this.hospId = this.$route.query.hospId
    this.ReqId = this.$route.query.ReqId
    this.QueryBedInfo(this.hospId)
  },
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    this.headHeight = `${headHeight}px`
    // 减去nav页面后body高度
    this.navHeight = `calc(100vh - ${headHeight}px)`
    // 内容高度
    this.contentHeight = `calc(100vh - ${headHeight}px)`
  },
  watch: {
    otherReason (val, oldval) {
      this.result = val
    },
    reason (val, oldval) {
      if (val !== '其他') {
        this.result = val
      }
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
  .content {
    font-size: 14px;
    color: #303133;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    /*ios平滑弹性滚动*/
  }
  .gray-panel {
    background: #F8F8F8;
    color: #909399;
    line-height: 14px;
    padding: 15px;
  }
  .panel {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 12px 15px;
  }
  .panel-left {
    display: flex;
  }
  .panel-left span {
    color: #909399;
    margin-left: 20px;
  }
  .panel-right {
    color: #358FF3;
  }
  .isAgree {
    height: 58px;
    line-height: 58px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 15px;
    font-size: 14px;
  }
  .isAgree ul {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
  }
  .isAgree li {
    width: 68px;
    line-height: 28px;
    color: #909399;
    text-align: center;
    background: #F8F8F8;
  }
  .isAgree li:not(:last-child) {
    margin-right: 21px;
  }
  .isAgreeActive {
    color: #358FF3 !important;
    background: #E1F2FE !important;
  }
  .content>>>.van-button--normal {
    margin: 40px 15px 84px 15px;
    width: 345px;
    height: 44px;
    border-radius: 44px;
    background-color: #358FF3;
    font-size: 16px;
    letter-spacing: 1px;
  }
</style>
