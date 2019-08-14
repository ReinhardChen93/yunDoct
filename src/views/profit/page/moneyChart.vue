<template>
  <div>
    <div class="chartbox" ref="charts"></div>
    <div class="charttext">
      <p>左右滑动可切换日期（2019）</p>
    </div>
  </div>
</template>

<script>
  // 引入echarts
  let echarts = require('echarts/lib/echarts')
  // 引入折线图
  require('echarts/lib/chart/line')
  // 引入提示框
  require('echarts/lib/component/tooltip')
  // 引入缩放
  require('echarts/lib/component/dataZoom')
  // 引入标记
  require('echarts/lib/component/markPoint')
  export default {
    name: 'moneyChart',
    props: {
      chartdate: Object, // 父组件传递过来的数据
      linedata: ''
    },
    data() {
      return {
        money: [20, 124, 80, 110, 100, 40, 120, 50, 90]
      }
    },
    mounted() {
    },
    methods: {
      initEchart(chartdate) {
        // es6新语法,获取对象key和获取值
        let month = Object.keys(chartdate)
        let moneys = Object.values(chartdate)
        // 初始化echart实例，获取dom
        let moneyChart = echarts.init(this.$refs.charts)
        // 配置
        moneyChart.on('dataZoom', function(param) {
        })
        let option = {
          tooltip: {
            formatter: function(params) {
              let data = params
              if (params.value === undefined) {
                data = params[0]
              }
              return '￥ ' + data.value
            },
            backgroundColor: '#303133'
          },
          grid: [{
            left: '8%',
            top: '8%',
            right: '8%',
            bottom: '12%'
          }],
          xAxis: [{
            splitLine: { // 网格线
              lineStyle: {
                type: 'dashed' // 设置网格线类型 dotted：虚线   solid:实线
              },
              show: true // 隐藏或显示
            },
            type: 'category',
            axisLabel: {
              formatter: '{value} 月'
            },
            boundaryGap: false,
            axisPointer: {
              type: 'line',
              show: true // 隐藏或显示
            },
            data: month
          }],
          yAxis: [{
            splitLine: { // 网格线
              show: false // 隐藏或显示
            },
            min: 0,
            type: 'value',
            show: false,
            axisLine: {
              onZero: false
            }
          }],
          dataZoom: [{
            type: 'inside',
            start: 1,
            end: 35
          }],
          series: [{
            type: 'line',
            smooth: true,
            symbolSize: 12,
            itemStyle: {
              normal: {
                shadowColor: 'rgba(53, 143, 243, 0.5)',
                shadowBlur: 10,
                shadowColor: 'rgba(53, 143, 243, 0.5)',
                shadowOffsetX: '0',
                shadowOffsetY: '8px',
                borderColor: '#358FF3',
                color: '#358FF3',
                lineStyle: {
                  color: '#358FF3'
                }
              }
            },
            data: moneys
          }]
        }
        window.onresize = moneyChart.resize
        moneyChart.setOption(option, true)
      }
    },
    created() {},
    watch: {
      chartdate(val, oldVal) {
        // 监听是否切换年份
        this.chartdate = val
        this.initEchart(this.chartdate)
      },
      linedata(val, oldVal) {
        this.linedata = val
        console.log(this.linedata)
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
  .chartbox {
    width: 375px;
    height: 321px;
    background: #fff;
  }
  .charttext {
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    height: 52px;
    width: 375px;
    background: #f8f8f8;
  }
  .charttext p {
    color: #909399;
    font-size: 12px;
  }
</style>
