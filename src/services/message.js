import request from 'Utils/request';

export function getUnReadNotification(payload) {

  return request.post(`/notify/getUnReadNotification`, null, {
      params: payload
  });
}



