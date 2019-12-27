import request from '../utils/request';
// const serverurl = 'http://kc.cnki.net/fb/api/';
const serverurl = 'http://192.168.103.24/qa.fb/api/'
export default {
  getNewHelpList() {
    return request.get(serverurl + '/GetNewQuestion?size=6');
  },
  getNewQuestions(payload) {
    const { size = 15, index = 1, searchKey = '', domain = '全部', uid = '' } = payload;
    return request.get(
      serverurl +
        `/GetNewQuestion?size=${size}&index=${index}&searchKey=${searchKey}&domain=${domain}&uid=${uid}`,
    );
  },

  getHotQuestions(payload) {
    const { size = 15, index = 1, searchKey = '', domain = '全部' } = payload;
    return request.get(
      serverurl +
        `/GetHotQuestion?size=${size}&index=${index}&searchKey=${searchKey}&domain=${domain}`,
    );
  },

  getMyAnswerQuestions(payload) {
    const { size = 15, index = 1, searchKey = '', domain = '全部', uid = '' } = payload;
    return request.get(
      serverurl +
        `/GetMyAnswerQuestion?size=${size}&index=${index}&searchKey=${searchKey}&domain=${domain}&uid=${uid}`,
    );
  },
  getAnwser(payload) {
    const { size = 10, index = 1, QID, uid = '' } = payload;
    return request.get(serverurl + `GetAnswer?size=${size}&index=${index}&QID=${QID}&uid=${uid}`);
  },

  getUserFAQ(payload) {
    const { question } = payload;
    return request.get(serverurl + `/getUserFAQ?q=${question}`);
  },

  setAnswer(payload) {
    return request.post(serverurl + `SetAnswer`, {  ...payload });
  },

  setQanswer(payload) {
    return request.post(serverurl + 'SetQanswer', {...payload})
  },
  getDomain() {
    return request.get(serverurl + 'Domain');
  },
};
