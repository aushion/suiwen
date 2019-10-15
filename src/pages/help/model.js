import helpService from '../../services/help';

export default {
  namespace: 'help',
  state: {
    newHelpData: null,
    domainList: [],
    domain: '全部',
    size: 15,
    index: 1
  },

  effects: {
    *getNewQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getNewQuestions, payload);
      console.log(payload)
      yield put({ type: 'saveList', payload: { newHelpData: res.data, ...payload } });
    },

    *getDomain({ payload }, { call, put }) {
      const res = yield call(helpService.getDomain);
      yield put({ type: 'saveDomainList', payload: {domainList: res} });
    },

    *getHotQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getHotQuestions, payload);

      yield put({ type: 'saveList', payload: { newHelpData: res.data, ...payload } });
    },
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        console.log(pathname);
        if (pathname === '/help') {
          dispatch({
            type: 'getDomain',
          });
          dispatch({
            type: 'getNewQuestions',
            payload: {},
          });
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
