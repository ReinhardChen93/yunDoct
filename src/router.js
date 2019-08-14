import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // 咨询首页
    {
      path: '/advisoryIndex',
      name: 'advisoryIndex',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () =>
        import(/* webpackChunkName: "advisoryIndex" */'@/views/advisory/index')
    },
    // 咨询记录
    {
      path: '/advisoryRecord',
      name: 'advisoryRecord',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () =>
        import(/* webpackChunkName: "advisoryRecord" */'@/views/advisory/page/record/index')
    },
    // 在线咨询须知
    {
      path: '/advisoryNotice',
      name: 'advisoryNotice',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () =>
        import(/* webpackChunkName: "advisoryNotice" */'@/views/advisory/page/record/notice')
    },
    // // 患者详情
    // {
    //   path: '/advPersonDetails',
    //   name: 'advPersonDetails',
    //   component: () =>
    //     import('@/views/advisory/page/record/personDetails')
    // },
    // 资费标准
    {
      path: '/advFeeStandard',
      name: 'advFeeStandard',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () =>
        import(/* webpackChunkName: "advFeeStandard" */'@/views/advisory/page/feeStandard/index')
    },
    // 资费标准---价格
    {
      path: '/feeStandardDetails',
      name: 'feeStandardDetails',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () =>
        import(/* webpackChunkName: "feeStandardDetails" */'@/views/advisory/page/feeStandard/details')
    },
    // 资费标准---自定义
    {
      path: '/feeStandardDesign',
      name: 'feeStandardDesign',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () =>
        import(/* webpackChunkName: "feeStandardDesign" */'@/views/advisory/page/feeStandard/design')
    },
    // 服务时间
    {
      path: '/serviceHours',
      name: 'serviceHours',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () =>
        import(/* webpackChunkName: "serviceHours" */'@/views/advisory/page/serviceHours/index')
    },
    // 总收益
    {
      path: '/profit',
      name: 'profit',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () =>
        import(/* webpackChunkName: "profit" */'@/views/profit/index')
    },
    // 用户协议
    {
      path: '/agreement',
      name: 'agreement',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () =>
        import(/* webpackChunkName: "agreement" */'@/views/advisory/page/agreement/index')
    },
    // 绑定银行卡
    {
      path: '/bindbankcard',
      name: 'bindbankcard',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      // 首页
      component: () =>
        import(/* webpackChunkName: "bindbankcard" */'@/views/advisory/page/bindBankCard/index')
    },
    // 圈子
    {
      path: '/moments',
      name: 'moments',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      // 首页
      component: () => import(/* webpackChunkName: "moments" */'@/views/moments/index')
    },
    // 互动消息
    {
      path: '/interact',
      name: 'interact',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "interact" */'@/views/moments/page/interact')
    },
    // 医院动态
    {
      path: '/dynamic',
      name: 'dynamic',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "dynamic" */'@/views/dynamic/index')
    },
    // 医院动态中的谋篇文章详情
    {
      path: '/dynamicDetail',
      name: 'dynamicDetail',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "dynamicDetail" */'@/views/dynamic/page/dynamicDetail')
    },
    // 申请转诊
    {
      path: '/referral',
      name: 'referral',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "referral" */'@/views/referral/index')
    },
    // 申请转诊
    {
      path: '/referralApply',
      name: 'referralApply',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "referralApply" */'@/views/referral/page/referralApply')
    },
    // 申请转诊
    {
      path: '/referralRecompose',
      name: 'referralRecompose',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否需要loding图
      },
      component: () => import(/* webpackChunkName: "referralRecompose" */'@/views/referral/page/referralRecompose')
    },
    // 转诊详情
    {
      path: '/referralDetail',
      name: 'referralDetail',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "referralDetail" */'@/views/referral/page/referralDetail')
    },
    // 双向转诊
    {
      path: '/doubleReferral',
      name: 'doubleReferral',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "doubleReferral" */'@/views/referral/page/doubleReferral')
    },
    // 我的申请
    {
      path: '/myReferralApply',
      name: 'myReferralApply',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "myReferralApply" */'@/views/referral/page/myReferralApply')
    },
    // 我的处理
    {
      path: '/myReferralDeal',
      name: 'myReferralDeal',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "myReferralDeal" */'@/views/referral/page/myReferralDeal')
    },
    // 帮助与反馈
    {
      path: '/help',
      name: 'help',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "help" */'@/views/help/index')
    },
    // 帮助与反馈--列表
    {
      path: '/consultationlist',
      name: 'consultationlist',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "consultationlist" */'@/views/help/page/consultationlist')
    },
    // 帮助与反馈--列表详情
    {
      path: '/consultation',
      name: 'consultation',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "consultation" */'@/views/help/page/consultation')
    },
    // 转诊处理
    {
      path: '/referralDeal',
      name: 'referralDeal',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "referralDeal" */'@/views/referral/page/referralDeal')
    },
    // 用户评价
    {
      path: '/evaluation',
      name: 'evaluation',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "evaluation" */'@/views/evaluation/index')
    },
    // 我的礼物
    {
      path: '/gift',
      name: 'gift',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "gift" */'@/views/gift/index')
    },
    // 我的礼物明细
    {
      path: '/giftActive',
      name: 'giftActive',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "giftActive" */'@/views/gift/page/giftActive')
    },
    // 患者信息
    {
      path: '/patientMsg',
      name: 'patientMsg',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "patientMsg" */'@/views/patientMsg/index')
    },
    // 病例档案
    {
      path: '/caseFile',
      name: 'caseFile',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "caseFile" */'@/views/caseFile/index')
    },
    // 医生主页
    {
      path: '/doctIndex',
      name: 'doctIndex',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "doctIndex" */'@/views/doctIndex/index')
    },
    // 慢病管理
    {
      path: '/chronicDisease',
      name: 'chronicDisease',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: true // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "chronicDisease" */'@/views/chronicDisease/index')
    },
    // 慢病管理-列表_高血压
    {
      path: '/chronicDiseaseList_blood',
      name: 'chronicDiseaseList_blood',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "chronicDiseaseList_blood" */'@/views/chronicDisease/page/chronicDiseaseList_blood')
    },
    // 慢病管理-列表_糖尿病
    {
      path: '/chronicDiseaseList_diabetes',
      name: 'chronicDiseaseList_diabetes',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "chronicDiseaseList_diabetes" */'@/views/chronicDisease/page/chronicDiseaseList_diabetes')
    },
    // 慢病管理-历史列表
    {
      path: '/chronicDiseaseOldData',
      name: 'chronicDiseaseOldData',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "chronicDiseaseOldData" */'@/views/chronicDisease/page/chronicDiseaseOldData')
    },
    // 慢病管理-详情
    {
      path: '/chronicDiseaseActive',
      name: 'chronicDiseaseActive',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "chronicDiseaseActive" */'@/views/chronicDisease/page/chronicDiseaseActive')
    },
    // 签约患者
    {
      path: '/subscribe',
      name: 'subscribe',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "subscribe" */'@/views/chronicDisease/page/subscribe')
    },
    // 随访详情
    {
      path: '/arrange',
      name: 'arrange',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "arrange" */'@/views/arrange/index')
    },
    // 随访详情
    {
      path: '/register',
      name: 'register',
      meta: {
        keepAlive: false, // 此组件需要被缓存
        isBack: false, // 用于判断上一个页面是哪个
        routerStatus: false // 是否关闭loding图
      },
      component: () => import(/* webpackChunkName: "register" */'@/views/advisory/page/agreement/register')
    }
  ]
})
