// import queryString from 'querystring';
import qaServer from '../../services/qa';
export default {
  namespace: 'result',
  state: [],
  reducers: {
    process(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *getAnswer({ payload }, { call }) {
      const res = yield call(qaServer.getAnswer, payload);
    },
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/result') {
          dispatch({ type: 'getAnswer', payload: query });
        }
      });
    },
  },
};
