import queryString from 'querystring';

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
