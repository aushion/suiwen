import request from '../../../utils/request';

export function getAnswer(payload) {
  return request.get('/getAnswer', {
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

export function getHotHelpList(payload) {
  return request.get(process.env.apiUrl_help + '/GetNewQuestion?size=12')
}
