import request from '../../utils/request';

export function feedback(payload) {
  return request.get('/insertFeedback', {
    params: { ...payload }
  });
}
