<template>
  <div class="referralDetailOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :isBlack="isBlack" @back="back" :name="'转诊申请'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg" :margLeft="0.8 +'rem'"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="referralDetailOutContent" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <div class="topBtn">
        <!-- state 0未处理,1已同意,2未同意--> <!-- dataType 0是我的申请进来的,1是我的处理进来的 -->
        <van-button v-show="dealInfo.State===0 && dataType == '1'" type="info" @click="immediatelyDeal"><i class="iconfont iconprocess"></i>立即处理（待处理）</van-button>
        <van-button v-show="dealInfo.State===0 && dataType == '0'" type="warning" @click="tips"><i class="iconfont iconremind"></i>对方还未处理催一催</van-button>
        <div v-show="dealInfo.State===1">
          <div class="success">
            <span class="success-background"></span>
            <p>同意转诊</p>
          </div>
          <van-cell-group>
            <van-cell value="住院信息" />
            <ul class="basic">
              <li>
                <p>处理人</p><span>{{dealInfo.AccDoctName }}</span>
              </li>
              <li>
                <p>处理时间</p><span>{{dealInfo.HandleTime}}</span>
              </li>
              <li>
                <p>转入日期</p><span>{{dealInfo.InhospDate }}</span>
              </li>
              <li>
                <p>转入科室</p><span>{{dealInfo.AccMappingName }}</span>
              </li>
            </ul>
          </van-cell-group>
        </div>
        <div v-show="dealInfo.State===2">
          <div class="success">
            <span class="failure-background"></span>
            <p>拒绝转诊</p>
          </div>
          <van-cell-group>
            <van-cell value="住院信息" />
            <ul class="basic">
              <li>
                <p>处理人</p><span>{{dealInfo.AccDoctName }}</span>
              </li>
              <li>
                <p>处理时间</p><span>{{dealInfo.HandleTime}}</span>
              </li>
              <li>
                <p>拒绝原因</p><span>{{dealInfo.HandleResult }}</span>
              </li>
            </ul>
          </van-cell-group>
        </div>
      </div>
      <!-- 基本信息 -->
      <section dealInfo>
        <van-cell-group>
          <van-cell value="基本信息" />
          <ul class="basic">
            <li>
              <p>患者姓名</p><span>{{dealInfo.MemName}}</span></li>
            <li>
              <p>患者性别</p><span>{{dealInfo.MemSex?'女':'男'}}</span></li>
            <li>
              <p>出生日期</p><span>{{dealInfo.MemBirthday}}</span></li>
            <li>
              <p>身份证号</p><span>{{dealInfo.MemIdcard}}</span></li>
            <li>
              <p>联系电话</p><span>{{dealInfo.MemTelphone}}</span></li>
            <li>
              <p>家庭地址</p><span>{{dealInfo.MemAddress}}</span></li>
            <li>
              <p>参保类型</p><span>{{dealInfo.MemInsuranceName}}</span></li>
          </ul>
        </van-cell-group>
        <!-- 住院信息 -->
        <van-cell-group>
          <van-cell value="住院信息" />
          <ul class="basic">
            <li>
              <p>住院号</p><span>{{dealInfo.InhospNo }}</span></li>
            <li>
              <p>科别</p><span>{{dealInfo.ReqMappingName}}</span></li>
            <li>
              <p>主诉</p><span>{{dealInfo.Complaints }}</span></li>
            <li>
              <p>入院诊断</p><span>{{dealInfo.Diagnosis }}</span></li>
            <li>
              <p>治疗情况</p><span>{{dealInfo.Treatment  }}</span></li>
            <li>
              <p>转出原因</p><span>{{dealInfo.Reson }}</span></li>
          </ul>
        </van-cell-group>
        <!-- 转入医院 -->
        <van-cell-group>
          <van-cell value="转入医院" />
          <ul class="basic">
            <li>
              <p>医院</p><span>{{dealInfo.AccHospName }}</span></li>
            <li>
              <p>科别</p><span>{{dealInfo.AccMappingName}}</span></li>
          </ul>
        </van-cell-group>
        <!-- 病案首页 -->
        <van-cell-group>
          <van-cell value="病案首页" />
          <ul class="basic">
            <li>
              <p>主诉</p><span>{{dealInfo.Complaints }}</span></li>
            <li>
              <p>现病史</p><span>{{dealInfo.InhospMapDeptNo }}</span></li>
            <li>
              <p>既往史</p><span>{{dealInfo.InhospNo }}</span></li>
            <li>
              <p>个人史</p><span>{{dealInfo.InhospMapDeptNo }}</span></li>
            <li>
              <p>家庭史</p><span>{{dealInfo.InhospNo }}</span></li>
          </ul>
        </van-cell-group>
        <!-- 入院记录 -->
        <van-cell-group>
          <van-cell title="入院记录" is-link @click="checkIntoHospitalRecord" />
        </van-cell-group>
        <!-- 病程记录 -->
        <van-cell-group >
          <van-cell value="病程记录" />
          <van-field type="textarea" placeholder="请输入转入情况说明…" value="医疗条件有限无法提供良好的治疗和就医条件，情况恶化，特此申请" rows="4" autosize disabled />
        </van-cell-group>
        <!-- 检验报告 -->
        <van-cell-group v-show="false">
          <van-cell value="检验报告" />
          <van-cell title="空腹葡萄糖" is-link to="index" label="检查时间：2018-01-10" />
        </van-cell-group>
        <!-- 附件信息 -->
        <van-cell-group v-show="imageList.length !== 0">
          <van-cell value="附件信息" />
          <div class="ChatImage">
            <van-image width="1.6rem" height="1.6rem" v-for="(img, index) in imageList" fit="cover" :src="img" lazy-load @click="showImagePreview(index)">
              <template v-slot:loading>
                  <van-loading type="spinner" size="20" />
                    </template>
                    <template v-slot:error>
                       加载失败
                    </template>
            </van-image>
          </div>
        </van-cell-group>
      </section>
      <commonBottom class="bottom-style"/>
    </div>
  </div>
</template>

<script>
// 头部
import commonHeader from '@/components/header/commonHeader'
import commonBottom from '@/components/bottom/commonBottom'
import {
  ImagePreview
} from 'vant'
import ajax from '@/api/index'
export default {
  name: 'referralDetail',
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
      reqId: '',
      dealInfo: '',
      imageList: [],
      infoType: '', // 是已完成还是未完成
      dataType: '' // 0是我的申请,1还是我的处理
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
    // 预览图片
    showImagePreview (position, timer) {
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
    // 获取当前需要处理的转诊信息
    GetRemoteReferral (type) {
      ajax.GetRemoteReferral(type).then((res) => {
        let result = res.data
        if (result.succeed) {
          this.dealInfo = res.data.data
          console.log(this.dealInfo)
          if (this.dealInfo.images.length !== 0) {
            let image = this.dealInfo.images
            for (let key in image) {
              this.imageList.push(image[key].ImageUrl)
            }
          }
          if (this.dealInfo.MemBirthday !== '') {
            this.dealInfo.MemBirthday = this.dealInfo.MemBirthday.split(' ')[0]
          }
          if (this.dealInfo.InhospDate !== '') {
            this.dealInfo.InhospDate = this.dealInfo.InhospDate.split(' ')[0]
          }
        } else {
          this.$toast(result.msg)
        }
      })
    },
    immediatelyDeal () {
      console.log(this.reqId)
      let ReqId = this.reqId
      let hospId = this.dealInfo.AccHospId
      this.$router.push({
        path: '/referralDeal',
        query: {
          ReqId,
          hospId
        }
      })
    },
    // 催一催
    tips () {
      this.$toast('接口还没有')
    },
    // 查看入院记录
    checkIntoHospitalRecord () {
      this.$toast('目前无法获取数据')
    }
  },
  created () {
    this.reqId = this.$route.query.ReqId
    this.infoType = this.$route.query.infoType
    this.dataType = this.$route.query.dataType
    this.GetRemoteReferral(this.reqId)
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
  .referralDetailOut>>>.van-cell-group {
    margin-top: 10px;
  }
  .referralDetailOut>>>.van-cell:not(:last-child)::after {
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
  .ChatImage {
    box-sizing: border-box;
    padding: 15px;
    margin-bottom: 30px;
    display: flex;
    justify-content: normal;
    overflow: auto;
    flex-wrap: wrap;
  }
  .ChatImage >>> .van-image {
    margin-right: 5px;
    margin-top: 10px;
  }
  .topBtn i {
    margin-right: 10px;
  }
  .referralDetailOutContent>>>.van-cell__value {
    color: #323233;
  }
  .success {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
  }
  .success span{

    background-size: 100%;
    height: 50px;
    width: 50px;
    border-radius: 25px;
    margin: 8px;
  }
  .success-background{
    background: url("~@/assets/referral/success.png") no-repeat center center;
  }
  .failure-background{
    background: url("~@/assets/referral/failure.png") no-repeat center center;
  }
  .success p{
    font-weight:500;
    color:rgba(48,49,51,1);
    line-height:14px;
  }
  .referralDetailOutContent >>> .van-field__control:disabled{
    color:#323233;
  }
</style>
