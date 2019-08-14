<template>
  <div class="referralDetailOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'随访详情'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="referralDetailOutContent" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <!-- 基本信息 -->
      <section dealInfo>
        <!-- 住院信息 -->
        <van-cell-group>
          <van-cell value="体征" />
          <ul class="basic">
            <li>
              <p>血压（mmHg）</p><span>舒张压{{dealInfo.Diastolic }}/收缩压{{dealInfo.Systolic }}</span></li>
            <li>
              <p>身高（cm）</p><span>{{dealInfo.Height }}</span></li>
            <li>
              <p>体重（kg）</p><span>{{dealInfo.Weight }}</span></li>
            <li>
              <p>心率（次/分）</p><span>{{dealInfo.HeartRate }}</span></li>
            <li>
              <p>症状</p><span>{{dealInfo.Symptom }}</span></li>
            <li>
              <p>其他</p><span>{{dealInfo.SymotomOther }}</span></li>
          </ul>
        </van-cell-group>
        <van-cell-group>
          <van-cell value="生活方式" />
          <ul class="basic">
            <li>
              <p>日吸烟量（支）</p><span>{{dealInfo.Smoke }}</span></li>
            <li>
              <p>日饮酒量（两）</p><span>{{dealInfo.Drink }}</span></li>
            <li>
              <p>摄盐情况（咸/淡）</p><span>{{dealInfo.SaltStr  }}</span></li>
            <li>
              <p>运动（次/周）</p><span>{{dealInfo.MoveCount }}</span></li>
            <li>
              <p>心理调整</p><span>{{dealInfo.MindStr  }}</span></li>
            <li>
              <p>遵医行为</p><span>{{dealInfo.RespectStateStr}}</span></li>
            <li>
              <p>辅助检查</p><span>{{dealInfo.AuxiliaryInspection}}</span></li>
            <li>
              <p>服药依从性</p><span>{{dealInfo.MedicineDependStr }}</span></li>
            <li>
              <p>药物不良反应</p><span>{{dealInfo.MedicineReactionStr }}</span></li>
            <li>
              <p>用药情况</p><span>{{dealInfo.MedicineHappening}}</span></li>
          </ul>
        </van-cell-group>
        <p class="titleBox">
          根据了解患者的情况为患者设置血压的预警范围
        </p>
        <van-cell-group>
          <van-field readonly clickable label="本次随访结果" :value="intoDivision" placeholder="请选择" right-icon="arrow" @click="showIntoDivisionPicker = true" />
          <van-popup v-model="showIntoDivisionPicker" position="bottom">
            <van-picker show-toolbar :columns="insuredList" @cancel="showIntoDivisionPicker = false" @confirm="onIntoDivisionConfirm" />
          </van-popup>
          <van-cell value="健康指导意见" />
          <van-field type="textarea" v-model="controlResult" placeholder="请输入健康指导意见……" rows="4" autosize />
        </van-cell-group>
        <van-button type="info" @click="submitform" :disabled="isDisable">确认</van-button>
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
  name: 'arrange',
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
      // 健康指导意见
      guidance: '',
      intoDivision: '',
      insuredList: [],
      showIntoDivisionPicker: false,
      // 路由传参过来的查询详细信息id
      dealInfo: '',
      isDisable: false,
      id: '',
      UrgencyLevel: 1, // 随访分类
      controlResult: '', // 健康指导意见
      VisitId: '' // 随访id
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
    GetBloodVisitInfo (id) {
      ajax.GetBloodVisitInfo(id).then((res) => {
        let result = res.data.data
        console.log(res)
        this.isDisable = false
        if (res.data.succeed) {
          this.dealInfo = res.data.data
          this.VisitId = res.data.data.VisitId
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
          memberId: this.memberId
        }
      })
    },
    // 通过数据字典获取参保类型
    GetDictByCodes (codes) {
      ajax.GetDictByCodes(codes).then((res) => {
        let result = res.data.data.control_result
        if (res.data.succeed) {
          for (let key in result) {
            this.insuredList.push({ 'text': result[key].Name, 'Value': result[key].Value })
          }
        } else {
          this.$toast(res.data.msg)
        }
      })
    },
    // 保存随访指导意见
    SaveGuide (visitId, controlResult, guidance) {
      ajax.SaveGuide(visitId, controlResult, guidance).then((res) => {
        let result = res.data
        if (result.succeed) {
          this.$toast('确认成功!')
          setTimeout(this.back(), 1000)
        } else {
        }
      })
    },
    // 控制是否满意
    onIntoDivisionConfirm (value) {
      this.intoDivision = value.text
      this.guidance = value.Value
      this.showIntoDivisionPicker = false
    },
    // 提交表单
    submitform () {
      let subStatus = true
      if (subStatus === true && this.VisitId !== '' && this.controlResult !== '' && this.guidance !== '') {
        subStatus = false
        this.SaveGuide(this.VisitId, this.controlResult, this.guidance)
      } else {
        if (this.controlResult === '') {
          this.$toast('请填写健康指导意见')
        }
        if (this.guidance === '') {
          this.$toast('请选择随访结果')
        }
        subStatus = false
      }
    }
  },
  created () {
    this.id = this.$route.query.Id
    this.GetBloodVisitInfo(this.id)
    this.GetDictByCodes('control_result') // 获取参保类型
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
  .basic li {
    display: flex;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 8px 0;
  }
  .basic li:first-child{
    padding-top: 0;
  }
  .basic li:last-child{
    padding-bottom: 0;
  }
  .basic li p {
    color: #999999;
  }
  .basic li span {
    max-width: 230px;
    text-align: right;
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
  .emergency {
    height: 58px;
    line-height: 58px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 15px;
    font-size: 14px;
    background: #fff;
  }
  .emergency ul {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
  }
  .emergency li {
    line-height: 28px;
    color: #909399;
    text-align: center;
    background: #F8F8F8;
    padding: 7px 10px;
  }
  .emergency li:not(:last-child) {
    margin-right: 21px;
  }
  .emergencyActive {
    color: #358FF3 !important;
    background: #E1F2FE !important;
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
