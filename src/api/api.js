import axios from 'axios'
import Qs from 'qs'
// 数据地址
let base = 'http://139.9.53.12:8088'
// let base = '/data'
// 本地数据地址
// .net core 跨域
axios.defaults.withCredentials = false

//  获取医生的收益。
export const GetEarnings = () => {
  return axios.get(`${base}/api/Doct/GetEarnings`, {
    params: {}
  })
}

//  获取咨询记录（医生端）
export const GetMemberAsksAndDoctor = (memId, askState, askType, pageIndex, pageSize) => {
  return axios.get(`${base}/api/Ask/GetMemberAsksAndDoctor`, {
    params: {
      memId,
      askState: askState, // 1:进行中 2:已解决
      askType: askType, // 0:图文 1:电话 2:视频
      pageIndex: pageIndex,
      pageSize: pageSize
    }
  })
}

// 已解决问诊问题
export const SolveQuestion = (questionId) => {
  let datas = {
    questionId: questionId
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Ask/SolveQuestion`,
    data: dataCont
  })
}

// 未解决问诊问题
export const SolveQuestionAsync = (questionId) => {
  let datas = {
    questionId: questionId
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Ask/SolveQuestionAsync`,
    data: dataCont
  })
}

//  获取成员的健康档案
export const GetMemberDoc = (memberId) => {
  return axios.get(`${base}/api/User/GetMemberDoc`, {
    params: {
      memberId: memberId
    }
  })
}

// 修改医生开放的咨询服务。
export const ModifyService = (datas) => {
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Doct/ModifyService`,
    data: dataCont
  })
}

// 获取医生的详情(医生端)。
export const GetHospDoctInfo = (doctId) => {
  return axios.get(`${base}/api/Doct/GetHospDoctInfo`, {
    params: {
      doctId
    }
  })
}

// 获取收益图数据
export const GetEarningCharts = (chartDate) => {
  return axios.get(`${base}/api/Doct/GetEarningCharts`, {
    params: {
      date: chartDate // 收益年份
    }
  })
}

// 获取收益详细信息
export const GetEarningDetails = (date) => {
  return axios.get(`${base}/api/Doct/GetEarningDetails`, {
    params: {
      date: date // 收益年份
    }
  })
}

// 判断是否签了咨询协议条款。
export const GetIsAgreedAskContract = (date) => {
  return axios.get(`${base}/api/Doct/IsAgreedAskContract`, {
    params: {}
  })
}

// 签约咨询协议条款
export const AgreeAskContract = (datas) => {
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Doct/AgreeAskContract`,
    data: dataCont
  })
}

// 绑定银行卡
export const SaveBankCard = (datas) => {
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Doct/SaveBankCard`,
    data: dataCont
  })
}

// 获取用户银行卡信息
export const GetBankCard = () => {
  return axios.get(`${base}/api/Doct/GetBankCard`, {
    params: {}
  })
}

// 获取资讯分类
export const GetCategories = (hospId) => {
  return axios.get(`${base}/api/Article/GetCategories`, {
    params: {
      hospId
    }
  })
}

// 通过医院Id获取首页资讯
export const GetTopArticlesByHospId = (hospId) => {
  return axios.get(`${base}/api/Article/GetTopArticlesByHospId`, {
    params: {
      hospId
    }
  })
}

// 根据分类ID获取文章。
export const GetArticles = (hospId, categoryId, pageIndex, pageCount) => {
  return axios.get(`${base}/api/Article/GetArticles`, {
    params: {
      hospId,
      categoryId,
      pageIndex,
      pageCount
    }
  })
}

// 设置在线时间
export const SetOnlineTimes = (datas) => {
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Doct/SetOnlineTimes`,
    data: dataCont
  })
}
// 获取文章信息。
export const GetArticleInfo = (id) => {
  return axios.get(`${base}/api/Article/GetArticleInfo`, {
    params: {
      id
    }
  })
}

// 获取我的处理记录 type 0：未处理，1：已处理
export const GetRemoteReferralsByDeal = (type) => {
  return axios.get(`${base}/api/Remote/GetRemoteReferralsByDeal`, {
    params: {
      type
    }
  })
}

// 获取转诊详情
export const GetRemoteReferral = (reqId) => {
  return axios.get(`${base}/api/Remote/GetRemoteReferral`, {
    params: {
      reqId
    }
  })
}

// 获取我的申请记录
export const GetRemoteReferrals = (type, memId) => {
  return axios.get(`${base}/api/Remote/GetRemoteReferrals`, {
    params: {
      type,
      memId
    }
  })
}

// 转诊申请
export const SaveRemoteReferra = (formdata) => {
  let dataCont = Qs.stringify(formdata)
  return axios({
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: `${base}/api/Remote/SaveRemoteReferra`,
    data: dataCont
  })
}

// 获取医院列表
export const GetHospInfos = (keyword, pageIndex, pageSize) => {
  return axios.get(`${base}/api/Hosp/GetHospInfos`, {
    params: {
      keyword,
      pageIndex,
      pageSize
    }
  })
}

// 获取医院科室列表
export const GetMappingDepts = (pageIndex, pageSize) => {
  return axios.get(`${base}/api/Hosp/GetMappingDepts`, {
    params: {
      pageIndex,
      pageSize
    }
  })
}

// 查询 住院可用床位
export const QueryBedInfo = (hospId, hisDeptcode, doctId) => {
  return axios.get(`${base}/api/Hosp/QueryBedInfo`, {
    params: {
      hospId,
      hisDeptcode,
      doctId
    }
  })
}

// 删除转诊图片
export const DeleteRemoteImages = (attachId) => {
  let datas = {
    attachId: attachId
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Remote/DeleteRemoteImages`,
    data: dataCont
  })
}

// 修改转诊申请
export const UpdateRemoteReferra = (formdata) => {
  let dataCont = Qs.stringify(formdata)
  return axios({
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: `${base}/api/Remote/UpdateRemoteReferra`,
    data: dataCont
  })
}

// 处理申请
export const ReferralProcessing = (reqId, state, transferData, result) => {
  let datas = {
    reqId, state, transferData, result
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Remote/ReferralProcessing`,
    data: dataCont
  })
}

// 通过编码获取字典
export const GetDictByCodes = (codes) => {
  return axios.get(`${base}/api/Base/GetDictByCodes`, {
    params: {
      codes
    }
  })
}

// 获取帮助分类
export const GetHelpClasss = (type) => {
  return axios.get(`${base}/api/Base/GetHelpClasss`, {
    params: {
      type
    }
  })
}

// 获取帮助文档
export const GetHelpDocuments = (classId) => {
  return axios.get(`${base}/api/Base/GetHelpDocuments`, {
    params: {
      classId
    }
  })
}

// 获取帮助文档详情
export const GetHelpDocument = (topicId) => {
  return axios.get(`${base}/api/Base/GetHelpDocument`, {
    params: {
      topicId
    }
  })
}

// 获取医生的评价信息（医生端）
export const GetEvaluatesByToken = (doctId, busType, pageIndex, pageSize) => {
  return axios.get(`${base}/api/Doct/GetEvaluatesByToken`, {
    params: {
      doctId,
      busType,
      pageIndex,
      pageSize
    }
  })
}

// 获取我的礼物
export const GetMyGifts = () => {
  return axios.get(`${base}/api/Member/GetMyGifts`, {
    params: {
    }
  })
}

// 获取指定礼物的获取记录
export const GetGiftLogs = (giftId, pageIndex, pageSize) => {
  return axios.get(`${base}/api/Member/GetGiftLogs`, {
    params: {
      giftId
    }
  })
}

// 获取圈子动态
export const GetListDoctCircleDynamics = (pageIndex, type, dynamicId, stateType, doctorId) => {
  return axios.get(`${base}/api/Doct/GetListDoctCircleDynamics`, {
    params: {
      pageIndex,
      type,
      dynamicId,
      stateType,
      doctorId
    }
  })
}

// 动态评论
export const SaveHospDoctCircleReply = (DynamicId, ReReplyId, Content) => {
  let datas = {
    DynamicId, ReReplyId, Content
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Doct/SaveHospDoctCircleReply`,
    data: dataCont
  })
}

// 动态点赞或取消点赞
export const SaveHospDoctCircleLikes = (dynamicId) => {
  let datas = {
    dynamicId
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Doct/SaveHospDoctCircleLikes`,
    data: dataCont
  })
}

// 删除动态
export const DeleteHospDoctCircleDynamic = (dynamicId) => {
  let datas = {
    dynamicId
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Doct/DeleteHospDoctCircleDynamic`,
    data: dataCont
  })
}

// 删除评论
export const DeleteDoctCircleReply = (replyId) => {
  let datas = {
    replyId
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Doct/DeleteDoctCircleReply`,
    data: dataCont
  })
}

// 获取病历档案
export const GetCaseSeeRecord = (memId, type, pageIndex, pageSize) => {
  return axios.get(`${base}/api/User/GetCaseSeeRecord`, {
    params: {
      memId,
      type,
      pageIndex,
      pageSize
    }
  })
}

// 获取慢病列表
export const GetChronicDiseases = (doctId) => {
  return axios.get(`${base}/api/Health/GetChronicDiseases`, {
    params: {
      doctId
    }
  })
}

// 获取医生签约的获取高血压患者列表
export const GetDiseaseMembers = (diseaseId, type, pageIndex, pageSize) => {
  return axios.get(`${base}/api/Health/GetDiseaseMembers`, {
    params: {
      diseaseId,
      type,
      pageIndex,
      pageSize
    }
  })
}

// 获取患者最新七天的血压测量数据
export const GetMemberBloodLogs = (memId) => {
  return axios.get(`${base}/api/Health/GetMemberBloodLogs`, {
    params: {
      memId
    }
  })
}

// 获取患者血压预警值
export const GetBloodConfig = (memId) => {
  return axios.get(`${base}/api/Health/GetBloodConfig`, {
    params: {
      memId
    }
  })
}

// 获取签约详情
export const GetSignInfo = (memberId) => {
  return axios.get(`${base}/api/Health/GetSignInfo`, {
    params: {
      memberId
    }
  })
}
// 获取患者血压预警值
export const GetBloodVisitList = (memId, pageIndex, pageSize) => {
  return axios.get(`${base}/api/Health/GetBloodVisitList`, {
    params: {
      memId,
      pageIndex,
      pageSize
    }
  })
}

// 获取患者的测量数据
export const GetMemberHealthBloodConfigs = (memId, type, pageIndex, pageSize) => {
  return axios.get(`${base}/api/Health/GetMemberHealthBloodConfigs`, {
    params: {
      memId,
      type,
      pageIndex,
      pageSize
    }
  })
}

// 获取高血压随访信息
export const GetBloodVisitInfo = (id) => {
  return axios.get(`${base}/api/Health/GetBloodVisitInfo`, {
    params: {
      id
    }
  })
}

// 保存随访指导意见
export const SaveGuide = (visitId, controlResult, guidance) => {
  let datas = {
    visitId, controlResult, guidance
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Health/SaveGuide`,
    data: dataCont
  })
}

// 删除评论
export const ReportCircle = (dynamicId, thereason) => {
  let datas = {
    dynamicId,
    thereason
  }
  let dataCont = Qs.stringify(datas)
  return axios({
    method: 'post',
    url: `${base}/api/Doct/ReportCircle`,
    data: dataCont
  })
}

// 获取用户详细信息
export const GetMember = (memberId) => {
  return axios.get(`${base}/api/Member/GetMember`, {
    params: {
      memberId
    }
  })
}
