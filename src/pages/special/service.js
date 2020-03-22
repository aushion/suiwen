import request from '../../utils/request';

export function getAllclassifyQuestionByTopic(payload) {
  const { topicId } = payload;
  return request.get(`/getAllclassifyQuestionByTopic?topicId=${topicId}`);
}


export function getQuestionByTopic(payload) {
  const { topicId } = payload;
  return request.get(`/getQuestionByTopic?topicId=${topicId}`);
}