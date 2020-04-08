import request from '../../utils/request';

export function getAllclassifyQuestionByTopic(payload) {
  const { topicId } = payload;
  return request.get(`/getAllclassifyQuestionByTopic?topicId=${topicId}`);
}


export function getQuestionByTopic(payload) {
  const { topicId } = payload;
  return request.get(`/getQuestionByTopic?topicId=${topicId}`);
}
//获取图片地址
export function getTopicPictures(payload) {
  const { topicId,type } = payload;
  return request.get(`/getTopicPictures?topicId=${topicId}&type=${type}`);
}