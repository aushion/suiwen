import request from '../utils/request';
const serverurl = 'http://kc.cnki.net/fb/api/';
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

  getDomain() {
    return request.get(serverurl + 'Domain');
  },
};
