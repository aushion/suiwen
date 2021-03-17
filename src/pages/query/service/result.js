import axios from 'axios';
import request from '../../../utils/request';

export function getAnswer(payload) {
  const { topic } = payload;
  return topic
    ? request.get('/getAnswerByTopic', {
        params: { ...payload }
      })
    : request.get('/getAnswer', {
        params: { ...payload }
      });
}

export function getAnswerByPage(payload) {
  return request.get('/getAnswerByPage', {
    params: { ...payload }
  });
}

export function getSG(payload) {
  return request.get('/getSGData', {
    timeout: 30000,
    params: { ...payload }
  });
}

export function getRelevantByAnswer(payload) {
  return request.get('/getRelevantByAnswer', {
    params: { ...payload }
  });
}

export function getRelevant(payload) {
  return request.get('/getRelavent', {
    params: { ...payload }
  });
}

export function getEvaluate(payload) {
  return request.post('/queryForEvaluate', null, {
    params: { ...payload }
  });
}

export function setEvaluate(payload) {
  return request.post('/setEvaluate', null, {
    params: { ...payload }
  });
}

export function getHotHelpList() {
  return request.post('/community/getNewQuestion', null, {
    params: {
      pageSize: 5,
      pageStart: 1
    }
  });
}

export function getCommunityAnswer(payload) {
  return request.get('/getCommunityAnswer', {
    params: { ...payload }
  });
}

export function getCustomView(payload) {
  return request.post('/getCustomView', null, {
    data: {
      ...payload
    }
  });
}

export function setQuestion(payload) {
  return request.post(process.env.apiUrl + '/community/commitQuestion', null, {
    params: {
      ...payload
    }
  });
}

export function getSemanticData(payload) {
  return request.get('/getSemanticData', {
    timeout: 30000,
    params: {
      ...payload
    }
  });
}

//获取问题收集，统计用
export function collectQuestion(payload) {
  return request.post(`${process.env.apiUrl_collect}/admin/cache/submit`, null, {
    data: {
      ...payload
    }
  });
}

//问答统计
export function submitQa(payload) {
  return request.post(`${process.env.apiUrl_collect}/admin/cache/submitqa`, null, {
    data: {
      ...payload
    }
  });
}

// 知识元

export function getConcept(payload) {
  const { 概念, focus } = payload;
  return axios.post(`https://zsysw.cnki.net/api/Concept/GetConceptDataList`, null, {
    data: {
      termName: 概念,
      attrType: focus === '基本定义' ? '' : focus
    }
  });
}

//获取知识元概念属性
export function getConceptAttrs(payload) {
  const { 概念 } = payload;
  return axios.post(`https://zsysw.cnki.net/api/Concept/GetConceptAttrsByTerm`, null, {
    data: {
      termName: 概念
    }
  });
}

//获取知识元方法数据
export function getMethod(payload) {
  const { 方法 } = payload;
  return axios.post(`https://zsysw.cnki.net/api/Method/GetMethodDataList`, null, {
    data: {
      termName: 方法,
      attrType: ''
    }
  });
}

//获取知识元方法属性
export function getMethodAttrs(payload) {
  const { 方法 } = payload;
  return axios.post(`https://zsysw.cnki.net/api/Method/GetMethodAttrsByTerm`, null, {
    data: {
      termName: 方法
    }
  });
}

// 相关推荐
export function getRecommend(payload) {
  return request.post(`/getRecommend?query=${payload.q}`);
}
