import request from '../../../utils/request';

export function getUserHistoryNotification(payload) {
  return request.post('/notify/getUserHistoryNotification', null, {
    params: payload
  });
}

export function getUserInfo(payload) {
  return request.post('/user/getUserCommunityInfo', null, {
    params: payload
  });
}
