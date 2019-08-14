<template>
  <div>
    <div class="chartbox" ref="charts" :style="{height:this.height,width:this.width}"></div>
  </div>
</template>

<script>
  // 引入echarts
  let echarts = require('echarts/lib/echarts')
  // 引入折线图
  require('echarts/lib/chart/line')
  // 引入散点图
  require('echarts/lib/chart/scatter')
  // 引入柱形图
  require('echarts/lib/chart/bar')
  // 引入提示框
  require('echarts/lib/component/tooltip')
  // 引入缩放
  require('echarts/lib/component/dataZoom')
  // 引入标记
  require('echarts/lib/component/markPoint')
  export default {
    name: 'moneyChart',
    props: {
      chartdate: Array, // 父组件传递过来的数据
      linedata: '',
      height: '',
      width: ''
    },
    data() {
      return {

      }
    },
    mounted() {},
    methods: {
      changData(data) {
        let msg = data
        this.$emit('showData', msg)
      },
      initEchart(chartdate) {
        let that = this
        let DiastolicValue = []
        let SystolicValue = []
        let year = []
        // 竖线隐藏数值
        let barDataZero = []
        // 竖线显示数组
        let barDataOne = []
        chartdate.map((val, index) => {
          DiastolicValue.push(val.DiastolicValue) // 舒张压
          SystolicValue.push(val.SystolicValue) // 收缩压
          barDataZero.push(val.DiastolicValue)
          barDataOne.push(`${val.SystolicValue - val.DiastolicValue}`)
          year.push(val.LogTime)
        })
        // 创建color数组
        let colorList = []
        // 创建当前颜色
        let curColor
        for (let r = 0; r < chartdate.length; r++) {
          if (chartdate[r].Staus > 0) {
            colorList.push('#fe4b64')
          } else {
            colorList.push('#65ccfa')
          }
        }
        // es6新语法,获取对象key和获取值
        // 初始化echart实例，获取dom
        let moneyChart = echarts.init(this.$refs.charts)
        // 配置
        moneyChart.on('dataZoom', function(param) {})
        let option = {
          grid: [{
            left: "2.5%",
            top: "5%",
            right: "2.5%",
            bottom: "12%",
          }],
          tooltip: {
            formatter: function(params) {
              that.changData(params)
              return `${params[3].name}<br />${params[3].seriesName}: ${params[3].data}<br />${params[2].seriesName}: ${params[2].data}`
            },
            trigger: 'axis', //坐标轴触发，可设为 item 数据项图形触发
            confine: true, //将 tooltip 框限制在图表的区域内，在移动端开发时非常有用
            show: true
          },
          xAxis: {
            type: 'category',
            axisPointer: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: '#efeff4'
              },
            },
            handle: {
              show: true,
              color: '#004E52'
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#ccc'
              },
            },
            show: false,
            data: year,
          },
          yAxis: {
            type: 'value',
            min: 40,
            max: 160,
            show: true,
            interval: 60,
            splitArea: {
              interval: 10
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: '12',
              },
              inside: true,
            },
            offset: 8,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#ccc'
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#eaebed'
              }
            },
            axisTick: {
              show: true
            }
          },
          series: [{
              // 隐藏数据
              type: 'bar',
              data: barDataZero,
              barWidth: 1,
              stack: '1',
              itemStyle: {
                normal: {
                  barBorderColor: 'rgba(0,0,0,0)',
                  color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                  barBorderColor: 'rgba(0,0,0,0)',
                  color: 'rgba(0,0,0,0)'
                }
              }
            }, {
              // 显示数据
              type: 'bar',
              symbolSize: 8,
              data: barDataOne,
              barWidth: 1,
              stack: '1',
              itemStyle: {
                normal: {
                  color: function(params) {
                    curColor = colorList[params.dataIndex]
                    return curColor
                  }
                }
              }
            },
            // 舒张压散点
            {
              name: '舒张压',
              type: 'scatter',
              data: DiastolicValue,
              symbolSize: 8,
              itemStyle: {
                normal: {
                  color: function(params) {
                    curColor = colorList[params.dataIndex]
                    return curColor
                  }
                }
              }
            },
            {
              // 收缩压散点
              name: '收缩压',
              type: 'scatter',
              data: SystolicValue,
              symbol: 'emptyCircle',
              symbolSize: 8,
              itemStyle: {
                normal: {
                  color: function(params) {
                    curColor = colorList[params.dataIndex]
                    return curColor
                  }
                }
              }
            },
            {
              name: '平行于y轴的趋势线',
              type: 'line',
              markLine: {
                name: 'aa',
                symbolSize: 1,
                lineStyle: {
                  color: '#d6d7dc'
                },
                animation: false,
                data: [
                  [{
                      name: '',
                      x: '0',
                      yAxis: 40
                    },
                    {
                      name: '',
                      x: '0',
                      yAxis: 160
                    }
                  ]
                ]
              }
            }
          ]
        }
        // let option = {
        //   tooltip: {
        //     formatter: function(params) {
        //       that.changData(params)
        //       return `${params[0].seriesName}: ${params[0].data}<br />${params[1].seriesName}: ${params[1].data}`
        //     },
        //     trigger: 'axis', //坐标轴触发，可设为 item 数据项图形触发
        //     confine: true, //将 tooltip 框限制在图表的区域内，在移动端开发时非常有用
        //     backgroundColor: '#303133'
        //   },
        //   legend: {
        //     data: ['舒张压', '收缩压']
        //   },
        //   title: {
        //         text: ''
        //     },
        //     grid: [{
        //         left: "2.5%",
        //         top: "1.4%",
        //         right: "2.5%",
        //         bottom: "6%",
        //     }],
        //   xAxis: [{
        //     splitLine: { // 网格线
        //       lineStyle: {
        //         type: 'dashed' // 设置网格线类型 dotted：虚线   solid:实线
        //       },
        //       show: true // 隐藏或显示
        //     },
        //     type: 'category',
        //     axisLabel: {
        //       formatter: time
        //     },
        //     boundaryGap: true,
        //     axisPointer: {
        //       type: 'line',
        //       show: true // 隐藏或显示
        //     },
        //     data: year
        //   }],
        //   yAxis: [{
        //     splitLine: { // 网格线
        //       show: false // 隐藏或显示
        //     },
        //     splitNumber: 3, // Y轴显示个数
        //     min: 20,
        //     type: 'value',
        //     show: true,
        //     axisLine: {
        //       onZero: false
        //     }
        //   }],
        //   dataZoom: [{
        //     type: 'inside',
        //     start: 1,
        //     end: 100
        //   }],
        //   series: [{
        //       name: '收缩压',
        //       type: 'line',
        //       smooth: false,
        //       symbolSize: 12,
        //       itemStyle: {
        //         normal: {
        //           shadowColor: 'rgba(53, 143, 243, 0.5)',
        //           shadowBlur: 10,
        //           shadowColor: 'rgba(53, 143, 243, 0.5)',
        //           shadowOffsetX: '0',
        //           shadowOffsetY: '8px',
        //           borderColor: '#358FF3',
        //           color: '#358FF3',
        //           lineStyle: {
        //             color: '#358FF3'
        //           }
        //         }
        //       },
        //       data: SystolicValue
        //     },
        //     {
        //       name: '舒张压',
        //       type: 'line',
        //       smooth: false,
        //       symbolSize: 12,
        //       symbol: 'circle', // 设置实心圆
        //       itemStyle: {
        //         normal: {
        //           shadowColor: 'rgba(53, 143, 243, 0.5)',
        //           shadowBlur: 10,
        //           shadowColor: 'rgba(53, 143, 243, 0.5)',
        //           shadowOffsetX: '0',
        //           shadowOffsetY: '8px',
        //           borderColor: '#358FF3',
        //           color: '#358FF3',
        //           lineStyle: {
        //             color: '#358FF3'
        //           }
        //         }
        //       },
        //       data: DiastolicValue
        //     }
        //   ]
        // }
        window.onresize = moneyChart.resize
        moneyChart.setOption(option, true)
      }
    },
    watch: {
      chartdate() {
        this.$nextTick(() => {
          this.initEchart(this.chartdate)
        })
      }
    }
  }
</script>

<style scoped>
  .chartbox {
    width: 100%;
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
