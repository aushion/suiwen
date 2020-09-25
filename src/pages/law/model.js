import { getAnswer } from '../query/service/result';
export default {
  namespace: 'law',

  state: {
    data: null
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
            data: res.data.result.metaList
          }
        });
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/law') {
          const { q, topic } = query;
          if (q) {
            dispatch({
              type: 'fetch',
              payload: {
                q,
                topic
              }
            });
          }
        }
      });
    }
  }
};
