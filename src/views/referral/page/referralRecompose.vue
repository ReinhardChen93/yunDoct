<template>
  <div class="referralOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :name="'修改转诊信息'" :color="color" :bgColor="bgColor" :isBack="isBack" @back="back" :isBlack="isBlack" :returnImg="returnImg"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="referralContent" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <!-- 协议头部 -->
      <p class="titleBox">
        基本信息（可扫描患者身份证获取）
      </p>
      <!-- 转诊患者 -->
      <van-cell-group>
        <!-- 患者姓名 -->
        <van-field v-model="formData.MemName" type="text" label="转诊患者" placeholder="请输入" />
        <!-- 身份证 -->
        <van-field clearable v-model="formData.MemIdcard" label="身份证号" right-icon="scan" placeholder="请输入身份证号" @click-right-icon="getIdCard()">
        </van-field>
        <van-field readonly clickable label="患者性别" :value="sexValue" placeholder="请选择" right-icon="arrow" @click="showSexPicker = true" />
        <van-popup v-model="showSexPicker" position="bottom">
          <van-picker show-toolbar :columns="sex" @cancel="showSexPicker = false" @confirm="onConfirm" />
        </van-popup>
        <!--出生日期-->
        <van-field readonly clickable label="出生日期" :value="formData.MemBirthday" placeholder="请选择" right-icon="arrow" @click="showBirthdayPicker = true" />
        <van-popup v-model="showBirthdayPicker" position="bottom">
          <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" :formatter="formatter" @confirm="onBirthdayConfirm" />
        </van-popup>
        <!-- 联系电话 -->
        <van-field v-model="formData.MemTelphone" type="number" label="联系电话" placeholder="请输入" />
        <!-- 家庭住址 -->
        <van-field v-model="formData.MemAddress" label="家庭住址" placeholder="请输入" />
        <!--参保类型-->
        <van-field readonly clickable label="参保类型" :value="insured" placeholder="请选择" right-icon="arrow" @click="showInsuredPicker = true" />
        <van-popup v-model="showInsuredPicker" position="bottom">
          <van-picker show-toolbar :columns="insuredList" @cancel="showInsuredPicker = false" @confirm="onInsuredConfirm" />
        </van-popup>
      </van-cell-group>
      <p class="titleBox">
        住院信息
      </p>
      <van-cell-group>
        <!-- 住院号 -->
        <van-field type="text" label="住院号" placeholder="请输入" v-model="formData.InhospNo" right-icon="question-o" @click-right-icon="getInHospitalNum" />
        <!-- 科别选择 -->
        <van-field readonly clickable label="科别选择" :value="division" placeholder="请选择" right-icon="arrow" @click="showDivisionPicker = true" />
        <van-popup v-model="showDivisionPicker" position="bottom">
          <van-picker show-toolbar :columns="divisionList" @cancel="showDivisionPicker = false" @confirm="onAccDeptIdConfirm" />
        </van-popup>
        <!-- 入院时间 -->
        <van-field readonly clickable label="入院时间" :value="formData.InhospDate" placeholder="请选择" right-icon="arrow" @click="showInHospitalTimePicker = true" />
        <van-popup v-model="showInHospitalTimePicker" position="bottom">
          <van-datetime-picker v-model="inHospitalTime" type="date" :min-date="hospitalMinDate" :max-date="hospitalMaxDate" :formatter="formatter" @confirm="onInHospitalTimeConfirm" />
        </van-popup>
      </van-cell-group>
      <p class="titleBox">
        住院信息
      </p>
      <van-cell-group>
        <van-cell value="主诉" />
        <van-field type="textarea" v-model="formData.Complaints" placeholder="请输入主诉…" rows="4" autosize />
        <p class="panelPadding"></p>
        <van-cell value="入院诊断" />
        <van-field type="textarea" v-model="formData.Diagnosis" placeholder="请输入入院诊断…" rows="4" autosize />
        <p class="panelPadding"></p>
        <van-cell value="治疗情况" />
        <van-field type="textarea" v-model="formData.Treatment" placeholder="请输入治疗情况…" rows="4" autosize />
        <p class="panelPadding"></p>
        <van-cell value="转入情况说明" />
        <van-field type="textarea" v-model="formData.Reson" placeholder="请输入转入情况说明…" rows="4" autosize />
      </van-cell-group>
      <p class="titleBox">
        转入医院
      </p>
      <van-cell-group>
        <!-- 转入医院 -->
        <van-field readonly clickable label="转入医院" :value="intoHospital" placeholder="请选择" right-icon="arrow" @click="showIntoHospitalPicker = true" />
        <van-popup v-model="showIntoHospitalPicker" position="bottom">
          <van-picker show-toolbar :columns="intoHospitalList" @cancel="showIntoHospitalPicker = false" @confirm="onIntoHospitalConfirm" />
        </van-popup>
        <!-- 转入科别 -->
        <van-field readonly clickable label="转入科别" :value="intoDivision" placeholder="请选择" right-icon="arrow" @click="showIntoDivisionPicker = true" />
        <van-popup v-model="showIntoDivisionPicker" position="bottom">
          <van-picker show-toolbar :columns="intoDivisionList" @cancel="showIntoDivisionPicker = false" @confirm="onIntoDivisionConfirm" />
        </van-popup>
      </van-cell-group>
      <!-- 紧急级别 -->
      <div class="emergency">
        <span>紧急级别</span>
        <ul>
          <li :class="{ emergencyActive:formData.UrgencyLevel === 1 }" @click="changeColor(1)">紧急</li>
          <li :class="{ emergencyActive:formData.UrgencyLevel === 0 }" @click="changeColor(0)">普通</li>
        </ul>
      </div>
      <div class="shareCase">
        <van-checkbox v-model="checked">患者本人同意授权将本人电子病历等信息共享给接收医院</van-checkbox>
      </div>
      <van-cell-group>
        <van-cell value="添加附件" />
        <div class="fileUp">
          <van-uploader v-model="fileList" multiple @delete="deleteImage"/>
          <p>注：可添加图片式文件</p>
        </div>
      </van-cell-group>
      <van-button type="info" @click="submitform" :disabled="isDisable">提交修改</van-button>
      <commonBottom/>
    </div>
  </div>
</template>

<script>
// 头部
import commonHeader from '@/components/header/commonHeader'
import ajax from '@/api/index'
import commonBottom from '@/components/bottom/commonBottom'
export default {
  name: 'referralRecompose',
  data () {
    return {
      // 头部元素颜色
      bgColor: '#fff',
      color: '#303133',
      // 传给原生的值（判断字体是否是黑色）
      isBlack: true,
      // 头部元素高度
      headHeight: '',
      // 头部是否要返回按钮
      isBack: true,
      // 返回按钮图片
      returnImg: require('@/assets/backB.png'),
      // 容器高度
      contentHeight: '',
      // 路由传参过来的查询详细信息id
      reqId: '',
      /** ************圆生参数*****************/
      origin: '',
      userAgent: '',
      /** *******************表单设置已经参数************************ **/
      // 结构需要的参数
      formData: {
        AccHospId: '', // 接收医院Id
        ReqHospId: '7', // 申请医院ID
        MemId: '', // 患者Id
        MemName: '', // 患者姓名
        MemIdcard: '', // 身份证号
        MemSex: '', // 患者性别
        MemBirthday: '', // 患者生日
        MemTelphone: '', // 患者联系电话
        MemAddress: '', // 患者家庭住址
        IsAgree: false, // 同意授权
        MemInsurance: '', // 参保类型
        InhospNo: '', // 住院号
        InhospMapDeptNo: '', // 住院科别
        Complaints: '', // 主诉
        Diagnosis: '', // 入院诊断
        Treatment: '', // 治疗情况
        Reson: '', // 转出原因
        AccMapDeptNo: '', // 接收科别编码
        UrgencyLevel: 0, // 紧急级别(0:普通，1:紧急)
        InhospDate: '', // 入院日期
        images: [] // 图片集合
      },
      // 性别参数设置
      sex: [{
        text: '男',
        value: '0'
      },
      {
        text: '女',
        value: '1'
      }
      ],
      sexValue: '', // 显示在页面上的数据
      showSexPicker: false,
      // 出生日期参数设置
      currentDate: new Date(),
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(),
      showBirthdayPicker: false,
      // 参保类型参数设置
      insuredList: [],
      showInsuredPicker: false,
      insured: '',
      // 科别参数设置
      divisionList: [],
      showDivisionPicker: false,
      division: '',
      // 入院时间参数设置
      inHospitalTime: new Date(),
      hospitalMinDate: new Date(1900, 1, 1),
      hospitalMaxDate: new Date(),
      hospitalTime: '',
      showInHospitalTimePicker: false,
      // 转入医院
      intoHospitalList: [],
      showIntoHospitalPicker: false,
      // 转入医院
      intoHospital: '',
      // 转入科别
      intoDivisionList: [],
      showIntoDivisionPicker: false,
      intoDivision: '',
      // 是否同意共享病例
      checked: true,
      fileList: [],
      // 提交按钮限制
      isDisable: false
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
    GetRemoteReferral (type) {
      ajax.GetRemoteReferral(type).then((res) => {
        let result = res.data
        console.log('recompose', result)
        if (result.succeed) {
          this.formData = {}
          this.formData = res.data.data
          for (let first in this.formData) {
            if (first === 'HandleTime' || first === 'InhospDate' || first === 'ReqDate' || first === 'MemBirthday') {
              if (this.formData[first] !== '' && this.formData[first] !== null && this.formData[first] !== undefined) {
                this.formData[first] = this.formData[first].split(' ')[0]
              }
            }
          }
          if (this.formData.images.length !== 0) {
            let image = this.formData.images
            for (let key in image) {
              this.fileList.push({ 'url': image[key].ImageUrl, 'ReqId': image[key].AttachId})
            }
          }
          if (this.formData.MemSex === 0) {
            this.sexValue = '男'
          } else {
            this.sexValue = '女'
          }
          this.insured = this.formData.MemInsuranceName
          this.division = this.formData.ReqMappingName
          this.intoHospital = this.formData.AccHospName
          this.intoDivision = this.formData.AccMappingName
          console.log('formData', this.formData)
        } else {
          this.$toast(result.msg)
        }
      })
    },
    // 提交修改
    UpdateRemoteReferra (formdatas) {
      let data = formdatas
      console.log('images', data.images)
      console.log('提交修改', data)
      console.log(data)
      ajax.UpdateRemoteReferra(data).then((res) => {
        let result = res.data
        this.isDisable = false
        if (result.succeed) {
          this.$toast('修改成功')
          setTimeout(() => {
            this.back()
          }, 2000)
        }
      })
    },
    // 删除图片
    DeleteRemoteImages (attachId) {
      ajax.DeleteRemoteImages(attachId).then((res) => {
        let result = res.data.data
        if (res.data.succeed) {
          console.log(res.data)
        } else {
          this.$toast(result.msg)
        }
      })
    },
    // 关闭原生loding
    hideLoading () {
      // 跳转到原生首页
      if (this.origin === 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          this.$bridge.callhandler('dismissLoadingDialog', null, (data) => {
          })
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callHandler('dismissLoadingDialog', null, (data) => {})
        }
      }
    },
    // 原生获取身份证信息
    getIdCard () {
      // 跳转到原生首页
      if (this.origin === 'YunyiDoctApp') {
        if (this.userAgent.indexOf('IPHONE') > -1) {
          this.$bridge.callhandler('scanIdCard', null, (data) => {
            console.log('刷新,接收到', data)
            let result = JSON.parse(data)
            console.log(typeof result)
            console.log(result.IDCard)
            this.formData.MemIdcard = result.IDCard
            this.sexValue = result.sex
            if (result.sex === '男') {
              this.formData.MemSex = 0
            } else {
              this.formData.MemSex = 1
            }
            this.formData.MemName = result.name
            this.formData.MemBirthday = result.birthday
            console.log(this.formData)
          })
        } else {
          // Android
          // 第一个参数是 调用java的函数名字 第二个参数是要传递的数据 第三个参数js在被回调后具体执行方法，responseData为java层回传数据
          window.WebViewJavascriptBridge.callhandler('scanIdCard', null, (data) => {
            console.log('刷新,接收到', data)
          })
        }
      }
    },
    // 获取医院列表
    GetHospInfos (keyword, pageIndex, pageSize) {
      ajax.GetHospInfos(keyword, pageIndex, pageSize).then((res) => {
        let result = res.data.data
        if (res.data.succeed) {
          for (let key in result) {
            this.intoHospitalList.push({ 'text': result[key].HospName, 'HospId': result[key].HospId })
          }
        } else {
          this.$toast(result.msg)
        }
      })
    },
    // 获取科室
    GetMappingDepts (pageIndex, pageSize) {
      ajax.GetMappingDepts(pageIndex, pageSize).then((res) => {
        let result = res.data.data
        if (res.data.succeed) {
          for (let key in result) {
            this.intoDivisionList.push({ 'text': result[key].MappingName, 'MappingCode': result[key].MappingCode })
            this.divisionList.push({ 'text': result[key].MappingName, 'MappingCode': result[key].MappingCode })
          }
        } else {
          this.$toast(result.msg)
        }
      })
    },
    // 通过数据字典获取参保类型
    GetDictByCodes (codes) {
      ajax.GetDictByCodes(codes).then((res) => {
        let result = res.data.data.Insurance
        if (res.data.succeed) {
          for (let key in result) {
            this.insuredList.push({ 'text': result[key].Name, 'Value': result[key].Value })
          }
        } else {
          this.$toast(res.data.msg)
        }
      })
    },
    onConfirm (value) {
      this.sexValue = value.text
      this.formData.MemSex = value.value
      this.showSexPicker = false
      // 这里还有需要传给后台的value没有赋值,但是已经存在sex对象里
      console.log(value)
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
    // 出生日期选择
    onBirthdayConfirm (value) {
      this.formData.MemBirthday = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate()
      this.showBirthdayPicker = false
      // 这里还有需要传给后台的value没有赋值,但是已经存在sex对象里
      console.log(this.formData.MemBirthday)
    },
    // 参保类型
    onInsuredConfirm (value) {
      this.insured = value.text
      console.log(value)
      this.formData.MemInsurance = value.Value
      this.showInsuredPicker = false
    },
    // 接收科室
    onAccDeptIdConfirm (value) {
      console.log('接收科室', value)
      this.division = value.text
      this.formData.InhospMapDeptNo = value.MappingCode
      this.showDivisionPicker = false
    },
    onDivisionConfirm (value) {
      this.intoDivision = value.text
      this.formData.InhospMapDeptNo = value.value
      this.showDivisionPicker = false
    },
    /* 获取住院号 */
    getInHospitalNum () {
      this.$toast('方法还没写')
    },
    // 出生日期选择
    onInHospitalTimeConfirm (value) {
      this.formData.InhospDate = value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate()
      this.showInHospitalTimePicker = false
      // 这里还有需要传给后台的value没有赋值,但是已经存在sex对象里
      console.log(value)
      console.log(typeof value)
    },
    // 转入医院
    onIntoHospitalConfirm (value) {
      console.log('选择医院', value)
      this.formData.AccHospId = value.HospId
      this.intoHospital = value.text
      this.showIntoHospitalPicker = false
      console.log('转入医院', this.formData)
    },
    // 转入科别
    onIntoDivisionConfirm (value) {
      this.intoDivision = value.text
      this.formData.AccMapDeptNo = value.MappingCode
      this.showIntoDivisionPicker = false
    },
    // 切换紧急级别
    changeColor (index) {
      this.formData.UrgencyLevel = index
    },
    // 删除照片
    deleteImage (file) {
      console.log(file)
      if (file.ReqId !== '' && file.ReqId !== undefined && file.ReqId !== null){
        this.DeleteRemoteImages(file.ReqId)
      }
    },
    // 提交表单
    submitform () {
      let data = this.formData
      let subStatus = true
      for (let key in data) {
        if (data[key] === '' && key !== 'TransferData' && key !== 'AccDeptId' && key !== 'MemId' && key !== 'TransferData' && key !== 'HandleDoctId' && key !== 'HandleResult') {
          this.$toast(key + '没有填写')
          subStatus = false
        } else {
          if (key === 'MemTelphone') {
            console.log(key)
            const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/// 0571-86295197
            const isPhone02 = /^\d{3,4}-\d{3,4}-\d{3,4}$/ // 4001-550-520
            // const isPhone02 = /^[0-9]{3,4}-[0-9]{2,3}-[0-9]{2,3}$/; // 4001-550-520
            // const isPhone02 = /^([0-9]{3,4}-)?([0-9]{3,4}-)?[0-9]{3,4}$/; // 4001-550-520
            const isMob = /^1[0-9]{10}$/
            // const phone02 = /^0\d{2,3}-?\d{7,8}$/;
            const valuePhone = data[key]
            if (isMob.test(valuePhone) || isPhone.test(valuePhone) || isPhone02.test(valuePhone)) { // 正则验证

            } else {
              this.$toast('请输入正确手机号或座机电话') // 校验不通过
            }
          }
          if (key === 'MemIdcard') {
            const idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            if (idCard.test(data[key]) === false) {
              this.$toast('身份证输入不正确,可以尝试扫描功能')
            }
          }
        }
      }
      if (subStatus) {
        this.isDisable = true
        console.log(this.formData)
        this.UpdateRemoteReferra(this.formData)
      }
    }
  },
  mounted () {
    // 头部元素高度
    let headHeight = this.$refs.head.$el.offsetHeight
    this.headHeight = `${headHeight / 37.5}rem`
    // 当前页面高度
    this.contentHeight = `calc(100vh - ${headHeight}px)`
  },
  created () {
    this.origin = this.$cookie.get('origin')
    this.userAgent = window.navigator.userAgent.toUpperCase()
    window['scanIdCard'] = this.scanIdCard
    window['dismissLoadingDialog'] = this.dismissLoadingDialog
    this.reqId = this.$route.query.ReqId
    this.hideLoading()
    this.GetHospInfos() // 获取医院列表
    this.GetMappingDepts(0, 200) // 获取科室列表,默认给了200获取所有
    this.GetDictByCodes('Insurance') // 获取参保类型
    this.GetRemoteReferral(this.reqId)
  },
  watch: {
    fileList (val, oldval) {
      console.log(11111,val)
      this.formData.images = []
      for (let key in val) {
        if (val[key].content !== undefined && val[key].content !== null && val[key].content !== '') {
          this.formData.images.push(val[key].content)
          console.log(typeof val[key].content)
        }
      }
    },
    checked (val, oldval) {
      console.log(val)
      val ? this.formData.IsAgree = 1 : this.formData.IsAgree = 0
      console.log(this.formData.IsAgree)
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
  .referralOut {
    background: rgba(255, 255, 255, 1);
    color: #303133;
    font-size: 14px;
  }
  .referralContent {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .referralOut .heard-wrapper {
    border-bottom: 1px solid #E6E9F0;
  }
  .titleBox {
    padding: 15px;
    color: #909399;
    background: #F8F8F8;
  }
  .panelPadding {
    padding: 5px;
    color: #909399;
    background: #F8F8F8;
  }
  /* input 的样式合集 */
  .referralContent>>>.van-field__label {
    width: 3rem!important;
    font-size: 14px;
  }
  .referralContent>>>.van-cell:not(:last-child)::after {
    right: 0.4rem;
  }
  .referralContent>>>.van-icon-scan {
    font-size: 20px;
  }
  .emergency {
    height: 58px;
    line-height: 58px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 15px;
    font-size: 14px;
  }
  .emergency ul {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
  }
  .emergency li {
    width: 68px;
    line-height: 28px;
    color: #909399;
    text-align: center;
    background: #F8F8F8;
  }
  .emergency li:not(:last-child) {
    margin-right: 21px;
  }
  .emergencyActive {
    color: #358FF3 !important;
    background: #E1F2FE !important;
  }
  .shareCase {
    box-sizing: border-box;
    padding: 15px;
    line-height: 20px;
  }
  .shareCase>>>.van-checkbox {
    align-items: normal;
  }
  .fileUp {
    padding: 15px;
  }
  .fileUp p {
    font-size: 12px;
    font-weight: 400;
    color: rgba(144, 147, 153, 1);
    line-height: 17px;
  }
  .referralContent>>>.van-button--normal {
    margin: 30px 15px 84px 15px;
    width: 345px;
    height: 44px;
    border-radius: 44px;
    background-color: #358FF3;
    font-size: 16px;
    letter-spacing: 1px;
  }
</style>
