// import queryString from 'querystring';
import { getAnswer, getSG } from './service/result';
export default {
  namespace: 'result',
  state: [],
  reducers: {
    process(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *getAnswer({ payload }, { call }) {
      const res = yield call(getAnswer, payload);
      console.log(res)
    },
    *getSG({ payload }, { call }) {
      const res = yield call(getSG, payload);
      console.log('sg',res)
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/result') {
          dispatch({ type: 'getAnswer', payload: { ...query, pageStart: 1, pageCount: 10 } });
          dispatch({type: 'getSG',payload: {...query, pageStart:1, pageCount: 10}})
        }
      });
    }
  }
};
