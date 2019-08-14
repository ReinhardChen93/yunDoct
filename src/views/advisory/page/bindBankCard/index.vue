<template>
  <div id="advisoryOut" class="advisoryOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" :name="Titlename" :isBlack="isBlack" @back="back" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg"></commonHeader>
    </div>
    <!-- 内容 -->
    <div class="advisoryContent" :style="{marginTop:this.headHeight,height:this.contentHeight}">
      <p class="titleBox">
        请绑定收款人本人银行卡
      </p>
      <van-cell-group>
        <van-field v-model="Name" type="text" label="收款人" placeholder="请输入" />
        <van-field readonly clickable label="银行名称" :value="BankName" placeholder="请选择" @click="showPicker = true" right-icon="arrow" />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker show-toolbar :columns="banklist" @cancel="showPicker = false" @confirm="onConfirm" />
        </van-popup>
      </van-cell-group>
      <p class="titleBox">
        请绑定收款人本人银行卡
      </p>
      <van-cell-group>
        <van-field v-model="SubBank" type="text" label="开户行" placeholder="请输入" />
      </van-cell-group>
      <van-cell-group>
        <van-field v-model="CardNo" type="text" label="银行账号" placeholder="请输入" />
      </van-cell-group>
      <van-button type="info" @click="submitBank">{{btnName}}</van-button>
    </div>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
  import ajax from '@/api/index'
  export default {
    name: 'bindbankcard',
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
        Titlename: '',
        // 返回按钮图片
        returnImg: require('@/assets/backB.png'),
        contentHeight: '',
        showPicker: false,
        // 收款人
        Name: '',
        Bank: '',
        BankName: '',
        // 银行账号
        CardNo: '',
        // 开户行
        SubBank: '',
        banklist: [
          '招商银行',
          '建设银行',
          '中国银行',
          '农业银行',
          '工商银行',
          '中国邮政储蓄',
          '光大银行',
          '广发银行',
          '浦发银行',
          '交通银行',
          '中信银行',
          '民生银行'
        ],
        //修改银行卡
        sverType: '',
        btnName: ''
      }
    },
    components: {
      commonHeader
    },
    methods: {
      // 头部返回按钮
      back() {
        window.history.go(-1)
      },
      onConfirm(value) {
        this.BankName = value
        this.showPicker = false
      },
      // 获取用户银行卡
      getBankCard() {
        ajax.GetBankCard().then((res) => {
          let data = res.data.data
          this.Name = data.Name
          this.BankName = data.Bank
          this.CardNo = data.CardNo
          this.SubBank = data.SubBank
        })
      },
      // 保存银行卡
      saveBankCard() {
        let info = {
          bank: this.BankName,
          cardNo: this.CardNo,
          subBank: this.SubBank,
          name: this.Name
        }
        if (this.sverType == undefined) {
          let data = {
            type: 1
          }
          // type 1同意，0不同意
          ajax.AgreeAskContract(data).then((res) => {
            let result = res.data
            if (result.succeed) {
              ajax.SaveBankCard(info).then((res) => {
                if (res.data.data === true) {
                  this.$router.push({
                    path: '/advFeeStandard',
                    query: {
                      // 判断是否是没开通
                      isNotOpen: 0
                    }
                  })
                }
              })
            }
          })
        } else {
          ajax.SaveBankCard(info).then((res) => {
            if (res.data.data === true) {
              this.back()
            }
          })
        }
      },
      submitBank() {
        if (this.Name !== '' && this.SubBank !== '' && this.CardNo !== '' && this.BankName !== '') {
          this.saveBankCard()
        } else {
          this.$toast('请确认全部填写')
        }
      }
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight}px`
      // 内容高度
      this.contentHeight = `calc(100vh - ${headHeight}px)`
    },
    created() {
      this.sverType = this.$route.query.sverType
      if (this.sverType == undefined) {
        this.Titlename = '绑定银行卡'
        this.btnName = '确认开通'
      } else {
        this.Titlename = '修改银行卡'
        this.btnName = '保存修改'
      }
      this.getBankCard()
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
    color: #303133;
    background: #F8F8F8;
  }
  .headOuter>>>.customHeader {
    border-bottom: 1px solid #E6E9F0;
    color: #303133;
  }
  .advisoryContent {
    position: fixed;
    width: 100%;
    font-size: 14px;
    overflow: scroll;
    webkit-overflow-scrolling: touch;
  }
  .titleBox {
    padding: 15px;
    color: #909399;
  }
  .advisoryContent>>>.van-field {
    padding: 12px 15px;
    font-size: 14px;
  }
  .advisoryContent>>>.van-field__label {
    width: 3rem!important;
  }
  .advisoryContent>>>.weui-btn {
    color: #fff;
    background: #358FF3;
    border-radius: 44px;
    height: 44px;
  }
  .advisoryContent>>>.weui-btn:active {
    color: #fff;
    background: #1E82F1;
    border-radius: 44px;
    height: 44px;
  }
  .advisoryContent>>>.vux-popup-picker-select {
    text-align: left!important;
    font-size: 14px;
    color: #909399;
  }
  .advisoryContent>>>.vux-popup-picker-placeholder {
    color: #909399;
  }
  .advisoryContent>>>.van-button--normal {
    margin: 54px 15px 0 15px;
    width: 345px;
    height: 44px;
    border-radius: 44px;
    background-color: #358FF3;
    font-size: 16px;
    letter-spacing: 1px;
  }
  .advisoryOut>>>.weui-cells__title {
    height: 50px;
    line-height: 50px;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 28px;
    color: #909399;
  }
  #advisoryOut>>>.vux-popup-header-right {
    color: #108EE9 !important;
  }
  #advisoryOut>>>.van-cell:not(:last-child)::after {
    right: 0.4rem;
  }
</style>
