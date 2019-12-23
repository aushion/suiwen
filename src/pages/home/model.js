import { getDomainQuestions, getTopicQuestions, getHotHelpList } from './service/home';

export default {
  namespace: 'home',
  state: {
    newHelpList: [],
    skillExamples: [],
    specialQuestions: []
  },

  effects: {
    *getDomainQuestions({ payload }, { call, put }) {
      const { data } = yield call(getDomainQuestions, payload);
      if (data.code === 200) {
        let newArray = data.result.map((item) => {
          return {
            name: Object.keys(item)[0],
            data: Object.values(item)[0]
          };
        });
        yield put({
          type: 'save',
          payload: {
            skillExamples: newArray
          }
        });
      }
    },

    *getTopicQuestions({ payload }, { call, put }) {
      const { data } = yield call(getTopicQuestions);
      if (data.code === 200) {
        let newArray = data.result.map((item) => {
          return {
            name: Object.keys(item)[0],
            data: Object.values(item)[0]
          };
        });
        yield put({
          type: 'save',
          payload: {
            specialQuestions: newArray
          }
        });
      }
    },

    *getHotHelpList({ payload }, { call,put }) {
        const { data } = yield call(getHotHelpList);
        if(data.length) {
          yield put({type: 'save', payload: {
            newHelpList: data
          }})
        }
}
  },



  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/home') {
          dispatch({ type: 'getDomainQuestions' });
          dispatch({ type: 'getTopicQuestions' });
          dispatch({ type: 'getHotHelpList' });

        }
      });
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
