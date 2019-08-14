<template>
  <div class="personDetailOut">
    <!-- 头 -->
    <div class="headOuter" :style="{height:this.headHeight,backgroundColor:this.bgColor}">
      <commonHeader ref="head" @back="back" :isBlack="isBlack" :name="'患者信息'" :color="color" :bgColor="bgColor" :isBack="isBack" :returnImg="returnImg">\</commonHeader>
    </div>
    <!-- 标题 -->
    <div class="title" ref="title" :style="{marginTop:this.headHeight}">
      <span>患者基本信息</span>
    </div>
    <!-- 内容 -->
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :finished="finished" :finished-text="'没更多内容了'" @load="onLoad">
          <div class="listBox">
            <div class="list">
              <div class="item">
                <div class="itemName">姓名</div>
                <div class="itemMsg">{{data.MemName}}</div>
              </div>
              <div class="item">
                <div class="itemName">性别</div>
                <div class="itemMsg">{{sex}}</div>
              </div>
              <div class="item">
                <div class="itemName">身高（cm）</div>
                <div class="itemMsg">{{data.Height}}cm</div>
              </div>
              <div class="item">
                <div class="itemName">体重（kg）</div>
                <div class="itemMsg">{{data.Weight}}kg</div>
              </div>
              <div class="item">
                <div class="itemName">血型</div>
                <div class="itemMsg">{{blood}}</div>
              </div>
              <div class="item">
                <div class="itemName">婚育史</div>
                <div class="itemMsg">{{marrige}}</div>
              </div>
              <div class="item">
                <div class="itemName">生育史</div>
                <div class="itemMsg">{{fertility}}</div>
              </div>
              <div class="item item1">
                <div class="itemName">手术或外伤</div>
                <div class="itemMsg">{{data.OperationText}}</div>
              </div>
              <div class="item item1">
                <div class="itemName">家族病史</div>
                <div class="itemMsg">{{data.FamilyAllergyText}}</div>
              </div>
              <div class="item item1">
                <div class="itemName">药物过敏</div>
                <div class="itemMsg">{{data.MedicAllergyText}}</div>
              </div>
              <div class="item item1 noBorder">
                <div class="itemName">食物或接触过敏</div>
                <div class="itemMsg">{{data.FoodAllergyText}}</div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  // 头部
  import commonHeader from '@/components/header/commonHeader'
  import ajax from '@/api/index'
  export default {
    components: {
      commonHeader
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
        // 内容的外边距
        contentMarginHeight: '',
        // 内容的高度
        contentHeight: '',
        // 成员健康档案
        data: '',
        // 性别
        sex: '',
        // 血型
        blood: '',
        // 婚否
        marrige: '',
        // 生育史
        fertility: '',
        refreshing: false,
        loading: false,
        finished: false
      }
    },
    methods: {
      // 头部返回按钮
      back() {
        window.history.go(-1)
      },
      onLoad() {
        setTimeout(() => {
          this.loading = false
          this.finished = true
        }, 500)
      },
      onRefresh() {
        setTimeout(() => {
          this.data = []
          this.getMemberDoc()
          this.finished = false
          this.refreshing = false
          window.scrollTo(0, 10)
        }, 1000)
      },
      // 成员健康档案
      getMemberDoc() {
        let memberId = 161
        ajax.GetMemberDoc(memberId).then((res) => {
          this.data = res.data.data
          console.log('tag', this.data)
          if (this.data.MemSex == 0) {
            this.sex = '男'
          } else {
            this.sex = '女'
          }
          if (this.data.Blood == 0) {
            this.blood = '未知血型'
          } else if (this.data.Blood == 1) {
            this.blood = 'A血型'
          } else if (this.data.Blood == 2) {
            this.blood = 'B血型'
          } else if (this.data.Blood == 3) {
            this.blood = 'O血型'
          } else if (this.data.Blood == 4) {
            this.blood = 'AB血型'
          } else {
            this.blood = '其他'
          }
          if (this.data.Marriage == 0) {
            this.marrige = '已婚'
          } else {
            this.marrige = '未婚'
          }
          if (this.data.Fertility == 0) {
            this.fertility = '未生育'
          } else if (this.data.Fertility == 1) {
            this.fertility = '备孕期'
          } else if (this.data.Fertility == 2) {
            this.fertility = '怀孕期'
          } else {
            this.fertility = '已生育'
          }
        })
      }
    },
    created() {
      this.getMemberDoc()
    },
    mounted() {
      // 头部元素高度
      let headHeight = this.$refs.head.$el.offsetHeight
      this.headHeight = `${headHeight / 37.5}rem`
    }
  }
</script>

<style scoped>
  .headOuter {
    position: fixed;
    top: 0;
    width: 100%;
  }
  .title {
    width: 100%;
    height: 44px;
    color: #909399;
    font-size: 14px;
    line-height: 44px;
    border-top: 1px solid #E6E9F0;
  }
  .title span {
    margin-left: 15px;
  }
  .content {
    width: 100%;
  }
  .listBox {
    position: relative;
  }
  .list {
    position: relative;
    height: auto;
    padding: 0 15px;
    background-color: #fff;
  }
  .item {
    position: relative;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #E6E9F0;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .item1 {
    height: auto;
    padding: 15px 0;
  }
  .itemName {
    color: #303133;
  }
  .itemMsg {
    text-align: right;
    width: 50%;
    color: #909399;
  }
  .noBorder {
    border-bottom: 0;
  }
</style>
