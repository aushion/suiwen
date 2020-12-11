import request from '../../../utils/request';

export function getDomainQuestions(payload) {
  return request.get('/getDomainQuestions');
}

export function getTopicQuestions(payload) {
  return request.get('/getTopicQuestions');
}
export function getHomePictureIds(payload) {
  const { type } = payload;
  return request.get(`/getHomePictureIds?type=${type}`);
}
export function getHotHelpList(payload) {
  return request.post('/community/getNewQuestion', null, {
    params: {
      ...payload
    }
  });
}
//获取示例文档
export function getExampleDoc(payload) {
  return request.get(`/doc/getExampleDoc`);
}
