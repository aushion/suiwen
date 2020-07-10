import request from '../utils/request';
const serverurl = process.env.apiUrl;

export default {
  getNewHelpList() {
    return request.get(serverurl + '/GetNewQuestion?size=6');
  },
  getNewQuestions(payload) {
    const page = JSON.parse(sessionStorage.getItem('page'));
    
    const {
      size = page ? page.size : 10,
      index = page ? page.index : 1,
      searchKey = '',
      domain = '全部',
      uid = ''
    } = payload;
    return request.get(serverurl + `/getNewQuestion`, {
      params: {
        pageSize: size,
        pageStart: index,
        searchKey,
        domain,
        type: 'new',
        uId: uid
      }
    });
  },

  getHotQuestions(payload) {
    const page = sessionStorage.getItem('page');
    const {
      size = page ? page.size : 10,
      index = page ? page.index : 1,
      searchKey = '',
      domain = '全部'
    } = payload;
    return request.get(serverurl + `/getNewQuestion`, {
      params: {
        pageSize: size,
        pageStart: index,
        searchKey,
        domain,
        type: 'hot'
      }
    });
  },

  getMyAnswerQuestions(payload) {
    const { size = 10, index = 1, searchKey = '', domain = '全部', uid } = payload;
    return request.get(serverurl + `/getMyCommiuntyAnswer`, {
      params: {
        pageSize: size,
        pageStart: index,
        searchKey,
        domain,
        uId: uid
      }
    });
  },
  getAnwser(payload) {
    const { QID, uid = '' } = payload;
    return request.get(serverurl + `/getCommunityAnswerByQuestion`, {
      params: {
        qId: QID,
        uId: uid
      }
    });
  },

  getUserFAQ(payload) {
    const { question } = payload;
    return request.get(serverurl + `/getUserFAQ?q=${question}`);
  },

  setAnswer(payload) {
    return request.post(serverurl + `/replyCommunityAnswer`, { ...payload });
  },

  editAnswer(payload) {
    return request.post(serverurl + `/editCommuityAnswer`, { ...payload });
  },

  setQanswer(payload) {
    return request.post(serverurl + '/setQuestionAndAnswer', { ...payload });
  },
  getDomain(payload) {
    return payload
      ? request.get(serverurl + '/getCommiuntyDomain', {
          params: {
            uId: payload.uId
          }
        })
      : request.get(serverurl + '/getCommiuntyDomain');
  },

  getPersonDomain(payload) {
    return request.get(serverurl + '/getPersonCommiuntyDomain', {
      params: { ...payload }
    });
  },
  deleteQuestion(payload) {
    const { qId } = payload;
    return request.get(serverurl + `/delQuestion?qId=${qId}`);
  }
};
