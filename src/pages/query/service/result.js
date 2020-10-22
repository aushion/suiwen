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
  return request.get('/getNewQuestion', {
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
  if (focus === '基本定义') {
    return axios.post(`http://sxzsy.cnki-shanxi.net:8044/api/Concept/GetTermDataList`, null, {
      params: {
        term: 概念
      }
    });
  } else {
    return axios.post(`http://sxzsy.cnki-shanxi.net:8044/api/Concept/GetConceptDataList`, null, {
      params: {
        termName: 概念,
        attrType: focus
      }
    });
  }
}
