import request from '../utils/request';
const serverurl = process.env.apiUrl + '/community';

export default {
  getNewHelpList() {
    return request.get(serverurl + '/GetNewQuestion?size=6');
  },
  getNewQuestions(payload) {
    const page = JSON.parse(sessionStorage.getItem('page'));

    const {
      size = page ? page.size : 10,
      index = page ? page.index : 1,
      searchKey = sessionStorage.getItem('searchKey') || '',
      domain = '',
      uid = ''
    } = payload;
    return request.post(serverurl + `/getNewQuestion`, null, {
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
    return request.post(serverurl + `/getNewQuestion`, null, {
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
    return request.post(serverurl + `/getMyCommiuntyAnswer`, null, {
      params: {
        pageSize: size,
        pageStart: index,
        searchKey,
        domain,
        userName: uid
      }
    });
  },
  getAnwser(payload) {
    const { QID, uid = '' } = payload;
    return request.post(serverurl + `/getDetailByQuestion`, null, {
      params: {
        qId: QID,
        userId: uid
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
      ? request.post(serverurl + '/getCommunityClass', null, {
          params: {
            uId: payload.uId
          }
        })
      : request.post(serverurl + '/getCommunityClass');
  },

  getPersonDomain(payload) {
    return request.post(serverurl + '/getCommunityClass', null, {
      params: { ...payload }
    });
  },
  deleteQuestion(payload) {
    const { qId } = payload;
    return request.get(serverurl + `/delQuestion?qId=${qId}`);
  },
  getUserCommunityInfo(payload) {
    return request.post(process.env.apiUrl + `/user/getUserCommunityInfo`, null, {
      params: { ...payload }
    });
  },
  getComment(payload) {
    return request.post(serverurl + `/getCommentByAnswer`, null, {
      params: { ...payload }
    });
  }
};
