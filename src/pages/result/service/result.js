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
