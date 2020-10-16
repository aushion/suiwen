import request from '../utils/request';
const serverUrl = process.env.apiUrl + '/community';

export default {
  getNewHelpList() {
    return request.get(serverUrl + '/GetNewQuestion?size=6');
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
    return request.post(serverUrl + `/getNewQuestion`, null, {
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
    return request.post(serverUrl + `/getNewQuestion`, null, {
      params: {
        pageSize: size,
        pageStart: index,
        searchKey,
        domain,
        type: 'hot'
      }
    });
  },

  getNeedHelpQuestions(payload) {
    const page = sessionStorage.getItem('page');
    const {
      size = page ? page.size : 10,
      index = page ? page.index : 1,
      searchKey = '',
      domain = '全部'
    } = payload;
    return request.post(serverUrl + `/getNewQuestion`, null, {
      params: {
        pageSize: size,
        pageStart: index,
        searchKey,
        domain,
        type: 'unsolved'
      }
    });
  },
  getMyAnswerQuestions(payload) {
    const { size = 10, index = 1, searchKey = '', domain = '全部', uid } = payload;
    return request.post(serverUrl + `/getMyCommunityAnswer`, null, {
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

  waitAnswer(payload) {
    return request.post(serverUrl + `/waitAnswer`);
  },

  getAnswer(payload) {
    const { QID, uid = '' } = payload;
    return request.post(serverUrl + `/getDetailByQuestion`, null, {
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
    return request.get(serverUrl + `/getUserFAQ?q=${question}`);
  },

  setAnswer(payload) {
    return request.post(serverUrl + `/replyAnswer`, { ...payload });
  },

  editAnswer(payload) {
    return request.post(serverUrl + `/editCommunityAnswer`, { ...payload });
  },

  setQanswer(payload) {
    return request.post(serverUrl + '/setQuestionAndAnswer', { ...payload });
  },
  getDomain(payload) {
    return payload
      ? request.post(serverUrl + '/getCommunityClass', null, {
          params: {
            uId: payload.uId
          }
        })
      : request.post(serverUrl + '/getCommunityClass');
  },

  getPersonDomain(payload) {
    return request.post(serverUrl + '/getCommunityClass', null, {
      params: { ...payload }
    });
  },
  deleteQuestion(payload) {
    const { qId } = payload;
    return request.get(serverUrl + `/delQuestion?qId=${qId}`);
  },
  getUserCommunityInfo(payload) {
    return request.post(process.env.apiUrl + `/user/getUserCommunityInfo`, null, {
      params: { ...payload }
    });
  },
  getComment(payload) {
    return request.post(serverUrl + `/getCommentByAnswer`, null, {
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
  },
  communityReport(payload) {
    return request.post(serverUrl + '/communityReport',{...payload})
  }
};
