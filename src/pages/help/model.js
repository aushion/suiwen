import helpService from '../../services/help';
import Cookies from 'js-cookie';
import RestTools from '../../utils/RestTools';

export default {
  namespace: 'help',
  state: {
    newHelpData: null,
    hotHelpData: null,
    domainList: [],
    domain: '全部',
    communityNode: sessionStorage.getItem('communityNode')
      ? JSON.parse(sessionStorage.getItem('communityNode'))
      : null,
    size: 10,
    index: 1,
    uid: JSON.parse(localStorage.getItem('userInfo'))
      ? JSON.parse(localStorage.getItem('userInfo')).UserName
      : Cookies.get('cnki_qa_uuid')
  },

  effects: {
    *getNewQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getNewQuestions, {
        ...payload
      });
      const resultData = res.data;

      yield put({
        type: 'saveList',
        payload: { newHelpData: resultData.result, ...payload }
      });
    },

    *getUserCommunityInfo({ payload }, { call, put }) {
      const res = yield call(helpService.getUserCommunityInfo, {
        ...payload
      });
      const resultData = res.data;
      yield put({
        type: 'global/save',
        payload: {
          ...payload,
          userInfo: resultData.result
        }
      });
      if (!sessionStorage.getItem('userCommuityInfo')) {
        sessionStorage.setItem('userCommunityInfo', JSON.stringify(resultData.result));
      }
    },

    *getDomain({ payload }, { call, put }) {
      const res = yield call(helpService.getDomain, payload);
      const resultData = res.data;
      yield put({ type: 'saveDomainList', payload: { domainList: resultData.result } });
    },

    *getPersonDomain({ payload }, { call, put }) {
      const res = yield call(helpService.getPersonDomain, payload);
      const resultData = res.data;
      yield put({ type: 'saveDomainList', payload: { domainList: resultData.result } });
    },

    *getHotQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getHotQuestions, payload);
      yield put({ type: 'saveList', payload: { hotHelpData: res.data.result, ...payload } });
    },

    *getMyAnswerQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getMyAnswerQuestions, payload);
      yield put({ type: 'saveList', payload: { newHelpData: res.data.result, ...payload } });
    },
    *deleteQuestion({ payload }, { call, put }) {
      const res = yield call(helpService.deleteQuestion, payload);
      const uid = RestTools.getLocalStorage('userInfo')
        ? RestTools.getLocalStorage('userInfo').UserName
        : Cookies.get('cnki_qa_uuid');
      if (res.data.result) {
        yield put({
          type: 'getNewQuestions',
          payload: { domain: '', uid }
        });
      }
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const match = pathname.match(/Help/i);
        const { username } = query;
        if (match) {
          const uid = RestTools.getLocalStorage('userInfo')
            ? RestTools.getLocalStorage('userInfo').UserName
            : Cookies.get('cnki_qa_uuid');
          const communityNode = sessionStorage.getItem('communityNode')
            ? JSON.parse(sessionStorage.getItem('communityNode'))
            : null;
          const current = pathname;
          dispatch({ type: 'saveList', payload: { newHelpData: null, index: 1, size: 10 } }); //重置状态
          dispatch({ type: 'getUserCommunityInfo', payload: { userName: uid } });
          dispatch({
            type: 'getHotQuestions',
            payload: { domain: encodeURIComponent('') }
          });
          if (current === '/help/newHelp') {
            dispatch({
              type: 'getDomain'
            });

            dispatch({
              type: 'getNewQuestions',
              payload: {
                domain: communityNode
                  ? communityNode.secondNode
                    ? communityNode.secondNode.cId
                    : communityNode.firstNode.cId
                  : ''
              }
            });
          } else if (current === '/help/hotHelp') {
            dispatch({
              type: 'getDomain'
            });

            dispatch({
              type: 'getHotQuestions',
              payload: { domain: encodeURIComponent('') }
            });
          } else if (current === '/help/myHelp') {
            dispatch({
              type: 'getDomain',
              payload: { uId: uid }
            });
            dispatch({
              type: 'getNewQuestions',
              payload: { domain: encodeURIComponent(''), uid }
            });
          } else if (current === '/help/myReply') {
            dispatch({
              type: 'getMyAnswerQuestions',
              payload: { domain: encodeURIComponent(''), uid }
            });

            dispatch({
              type: 'getPersonDomain',
              payload: { uId: uid }
            });
          } else if (current === '/help/otherHelp') {
            dispatch({
              type: 'getDomain',
              payload: { uId: username }
            });
            dispatch({
              type: 'getNewQuestions',
              payload: { domain: encodeURIComponent(''), uid: username }
            });
          } else if (current === '/help/otherReply') {
            dispatch({
              type: 'getDomain',
              payload: { uId: username }
            });
            dispatch({
              type: 'getMyAnswerQuestions',
              payload: { domain: encodeURIComponent(''), uid: username }
            });
          }
        }
      });
    }
  },
  reducers: {
    saveList(state, { payload }) {
      return { ...state, ...payload };
    },
    saveDomainList(state, { payload }) {
      return { ...state, ...payload };
    },
    changeDomain(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
