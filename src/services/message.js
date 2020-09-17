import request from '../utils/request';

export function getUnReadNotification(payload) {

  return request.post(`/notify/getUnReadNotification`, null, {
      params: payload
  });
}

export function getUnReadCount(payload) {
  return request.get('/notify/getUnReadCount',{
    params: payload
  })
}

export function getCommentNotify(payload) {
  return request.post('/notify/getCommentNotify',null, {
    params: payload
  })
} 


export function getCommunityAnswerByAId(payload) {
  return request.post('/notify/getCommunityAnswerByAId',null, {
    params: payload
  })
}

export function getLikeNotify(payload) {
  return request.post('/notify/getLikeNotify',null, {
    params: payload
  })
}

export function getAnswerNotify(payload) {
  return request.post('/notify/getAnswerNotify',null, {
    params: payload
  })
}

export function readMessage(payload) {
  return request.post('/notify/readMessage',null,{
    params: payload
  })
}





