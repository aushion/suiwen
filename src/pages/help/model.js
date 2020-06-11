import helpService from '../../services/help';
import Cookies from 'js-cookie';
import RestTools from '../../utils/RestTools';

export default {
  namespace: 'help',
  state: {
    newHelpData: null,
    domainList: [],
    domain: '全部',
    size: 10,
    index: 1,
    uid: RestTools.getLocalStorage('userInfo')
      ? RestTools.getLocalStorage('userInfo').UserName
      : Cookies.get('cnki_qa_uuid')
  },

  effects: {
    *getNewQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getNewQuestions, { ...payload });
      const resultData = res.data;

      yield put({ type: 'saveList', payload: { newHelpData: resultData.result, ...payload } });
    },

    *getDomain({ payload }, { call, put }) {
      const res = yield call(helpService.getDomain);
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
      yield put({ type: 'saveList', payload: { newHelpData: res.data.result, ...payload } });
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
          const current = pathname;
          dispatch({ type: 'saveList', payload: { newHelpData: null, index: 1 } }); //重置状态
          if (current === '/help/newHelp') {
            dispatch({
              type: 'getDomain'
            });

            dispatch({
              type: 'getNewQuestions',
              payload: { domain: encodeURIComponent('') }
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
              type: 'getPersonDomain',
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
              type: 'getPersonDomain',
              payload: { uId: uid }
            });
            dispatch({
              type: 'getNewQuestions',
              payload: { domain: encodeURIComponent(''), uid: username }
            });
          } else if (current === '/help/otherReply') {
            dispatch({
              type: 'getPersonDomain',
              payload: { uId: uid }
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
