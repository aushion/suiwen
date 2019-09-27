import helpService from '../../services/help';

export default {
  namespace: 'home',
  state: {
    newHelpList: [],
  },

  effects: {
    *getHelpList({ payload }, { call, put }) {
      const res = yield call(helpService.getNewHelpList);
      yield put({ type: 'saveList', payload: res });
    },
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/home') {
          dispatch({ type: 'getHelpList' });
        }
      });
    },
  },
  reducers: {
    saveList(state, { payload }) {
      state.newHelpList = payload;
      return state;
    },
  },
};
