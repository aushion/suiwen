import queryString from 'querystring';
import helpServer from '../../services/help';

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
    *getNewHelpList({ payload }, { call, put }) {
      // const res = yield call(helpServer.getNewQuestions, payload);
      // yield put({ type: 'process', payload: res });
    },
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/help') {
          const payload = queryString.parse(history.location.search.replace('?', ''));
          dispatch({ type: 'getNewHelpList', payload });
        }
      });
    },
  },
};
