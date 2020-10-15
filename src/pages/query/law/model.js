import { getAnswer, getSG, getRelevant, getRelevantByAnswer } from '../service/result';
export default {
  namespace: 'law',

  state: {
    repositoryData: null,
    sgData: null,
    relaventQuestions: [],
    relatedData: []
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(getAnswer, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            repositoryData: res.data.result.metaList
          }
        });
      }
    },

    *getSG({ payload }, { call, put }) {
      const res = yield call(getSG, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            sgData: res.data.result
          }
        });
      }
    },
    *getRelavent({ payload }, { call, put }) {
      const res = yield call(getRelevant, payload);
      const { data } = res;
      if (data.result.metaList) {
        yield put({
          type: 'save',
          payload: {
            relaventQuestions: data.result.metaList
          }
        });
      }
    },
    *getRelevantByAnswer({ payload }, { call, put }) {
      const res = yield call(getRelevantByAnswer, payload);
      const { data } = res;
      if (data.result && data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            relatedData: data.result.metaList
          }
        });
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/query/law') {
          const { q, topic, topicName } = query;
          window.document.title = `${q}`;
          if (q) {
            dispatch({ type: 'save', payload: { repositoryData: null, sgData: null } });
            dispatch({ type: 'fetch', payload: { q, topic } });
            dispatch({ type: 'getSG', payload: { q } });
            dispatch({ type: 'getRelavent', payload: { q: encodeURIComponent(q), area: topic } });

            dispatch({
              type: 'getRelevantByAnswer',
              payload: { q: encodeURIComponent(q), pageStart: 1, pageCount: 10, topic, topicName }
            });
          }
        }
      });
    }
  }
};
