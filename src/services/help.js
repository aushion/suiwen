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
    return request.post(serverurl + `/getMyCommunityAnswer`, null, {
      params: {
        pageSize: size,
        pageStart: index,
        searchKey,
        domain,
        operatorName: uid,
        userName: uid
      }
    });
  },
  getAnwser(payload) {
    const { QID, uid = '' } = payload;
    return request.post(serverurl + `/getDetailByQuestion`, null, {
      params: {
        qId: QID,
        sort: 'hot',
        pageSize: 10,
        pageStart: 1,
        userId: uid
      }
    });
  },

  getUserFAQ(payload) {
    const { question } = payload;
    return request.get(serverurl + `/getUserFAQ?q=${question}`);
  },

  setAnswer(payload) {
    return request.post(serverurl + `/replyAnswer`, { ...payload });
  },

  editAnswer(payload) {
    return request.post(serverurl + `/editCommunityAnswer`, { ...payload });
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
  },
  addComment(payload) {
    return request.post(process.env.apiUrl + '/comment/addComment', { ...payload });
  },
  replyComment(payload) {
    return request.post(process.env.apiUrl + '/comment/replyComment', { ...payload });
  },
  delComment(payload) {
    return request.post(process.env.apiUrl + '/comment/delComment', null, { params: payload });
  },
  delReply(payload) {
    return request.post(process.env.apiUrl + '/comment/delReply', null, { params: payload });
  },
  likeComment(payload) {
    return request.post(process.env.apiUrl + '/like/likeComment', null, { params: payload });
  },
  likeReply(payload) {
    return request.post(process.env.apiUrl + '/like/likeReply', null, { params: payload });
  },
  likeAnswer(payload) {
    return request.post(process.env.apiUrl + '/like/likeAnswer', null, { params: payload });
  },
  disLikeAnswer(payload) {
    return request.post(process.env.apiUrl + '/like/disLikeAnswer', null, { params: payload });
  },
  followQuestion(payload) {
    return request.post(process.env.apiUrl + '/follow/followQuestion', null, { params: payload });
  },
  unFollowQuestion(payload) {
    return request.post(process.env.apiUrl + '/follow/unFollowQuestion', null, { params: payload });
  },
  followUser(payload) {
    return request.post(process.env.apiUrl + '/follow/followUser', null, { params: payload });
  },
  unFollowUser(payload) {
    return request.post(process.env.apiUrl + '/follow/unFollowUser', null, { params: payload });
  }
};
