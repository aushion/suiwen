import { getAnswer, getSG } from '../query/service/result';
export default {
  namespace: 'law',

  state: {
    data: null,
    sgData:null,
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
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/law') {
          const { q, topic } = query;

          if (q) {
            dispatch({
              type: 'save',
              payload: {
                data: null,
                sgData: null,
              }
            });
            dispatch({
              type: 'fetch',
              payload: {
                q,
                topic
              }
            });
            dispatch({
              type: 'getSG',
              payload: {
                q
              }
            });
          }
        }
      });
    }
  }
};
