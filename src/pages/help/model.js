import helpService from '../../services/help';
import Cookies from 'js-cookie';
import RestTools from '../../utils/RestTools'

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
      : Cookies.get('cnki_qa_uuid'),
  },

  effects: {
    *getNewQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getNewQuestions, payload);
      const result = res.data;
      yield put({ type: 'saveList', payload: { newHelpData: result.data, ...payload } });
    },

    *getDomain({ payload }, { call, put }) {
      const res = yield call(helpService.getDomain);
      const result = res.data
      yield put({ type: 'saveDomainList', payload: { domainList: result } });
    },

    *getHotQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getHotQuestions, payload);
      yield put({ type: 'saveList', payload: { newHelpData: res.data.data, ...payload } });
    },

    *getMyAnswerQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getMyAnswerQuestions, payload);

      yield put({ type: 'saveList', payload: { newHelpData: res.data.data, ...payload } });
    },
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        const match = pathname.match(/help/i);
        if (match) {
          dispatch({
            type: 'getDomain',
          });


          const uid = RestTools.getLocalStorage('userInfo')
          ? RestTools.getLocalStorage('userInfo').UserName
            : Cookies.get('cnki_qa_uuid');
          const current = pathname;
          dispatch({type: 'saveList', payload: {newHelpData: null}}) //重置状态
          if (current === '/help/newHelp') {
            dispatch({
              type: 'getNewQuestions',
              payload: { domain: '全部' },
            });
          } else if (current === '/help/hotHelp') {
            dispatch({
              type: 'getHotQuestions',
              payload: { domain: '全部' },
            });
          } else if (current === '/help/myHelp') {
            dispatch({
              type: 'getNewQuestions',
              payload: { domain: '全部', uid },
            });
          } else if (current === '/help/myReply') {
            dispatch({
              type: 'getMyAnswerQuestions',
              payload: { domain: '全部', uid },
            });
          }
        }
      });
    },
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
    },
  },
};
