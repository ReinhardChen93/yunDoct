<template>
  <div>
    <div v-for="(lists, listname, index) in detailsdate" :key="listname" class="detailmenu" v-if="lists.length">
      <div class="lilist" >
        <p>{{listname}}</p>
        <p @click="showHide(index)" class="open">收起</p>
      </div>
      <div class="detailist">
        <ul>
          <li v-for="(item, name, index) in lists" :key="index">
            <p>{{item.AskContent}}</p>
            <p>{{item.Money}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'profitList',
    components: {
    },
    props: {
      detailsdate: Object
    },
    data() {
      return {
        profitList: [{
          date: '2018-10',
          money: '120.00',
          openFlag: false
        }, {
          date: '2018-11',
          money: '100.00',
          openFlag: false
        }, {
          date: '2018-12',
          money: '60.00',
          openFlag: false
        }],
        showContent: false,
        detailData: Object,
        liConHeight: 50 // 两行文字的高度
      }
    },
    methods: {
      showHide(index) { // 点击展开收起
        console.log(index)
        let contant = document.getElementsByClassName('detailist')[index] // 这里通过参数index来让浏览器判断你点击的是哪一个列表
        let height = contant.getBoundingClientRect().height // 获取页面元素的当前高度
        let icon = document.getElementsByClassName('open')[index] // 获取点击的icon
        icon.innerHTML = height ? '展开' : '收起'
        if (height) {
          contant.style.height = height + 'px'
          let f = document.body.offsetHeight // 强制相应dom重绘，使最新的样式得到应用
          contant.style.height = '0px'
        } else {
          contant.style.height = 'auto'
          height = contant.getBoundingClientRect().height
          contant.style.height = '0'
          let f = document.body.offsetHeight
          contant.style.height = height + 'px'
        }
      }
    },
    mounted() {
    },
    created() {
    },
    watch: {
      detailsdate(val, oldVal) {
        this.detailData = val
        console.log(this.detailData)
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
  .detailmenu {
    margin-top: 20px;
  }
  .detailmenu:nth-child(1) {
    margin-top: 0;
  }
  .lilist {
    height: 44px;
    line-height: 44px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    font-size: 14px;
    background: #fff;
  }
  .lilist p {
    font-size: 14px;
  }
  .lilist p:nth-child(1):before {
    content: '';
    margin-right: 10px;
    border: 1.5px solid #358FF3;
  }
  .lilist p:nth-child(1) {
    margin-left: 15px;
  }
  .lilist p:nth-child(2) {
    margin-right: 15px;
    color: #358FF3;
  }
  .detailist {
    background: #FFFFFF;
    transition: height 1s;
    overflow: hidden;
    box-sizing: border-box;
  }
  .detailist ul {
    box-sizing: border-box;
  }
  .detailist li {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
    border-top: 1px solid #E6E9F0;
    margin: 0 15px;
    box-sizing: border-box;
    background: #fff;
  }
  .detailist p {
    box-sizing: border-box;
    font-size: 14px;
  }
  .detailist p:nth-child(1) {
    width: 224px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #303133;
  }
  .detailist p:nth-child(2) {
    color: #358FF3;
  }
  .detailist p:nth-child(2):before {
    content: "￥";
  }
</style>
