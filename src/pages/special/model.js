import { message } from 'antd';
import { getAllclassifyQuestionByTopic, getQuestionByTopic } from './service';

message.config({
  top: 500,
  duration: 2,
  maxCount: 3
});
export default {
  namespace: 'special',
  state: {
    topics: [],
    initialKey: null,
    hotQuestions: null
  },

  effects: {
    *getAllclassifyQuestionByTopic({ payload }, { call, put }) {
      const { data } = yield call(getAllclassifyQuestionByTopic, payload);
      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            topics: data.result,
            initialKey: data.result.length
              ? data.result[0].children
                ? data.result[0].name + data.result[0].children[0].name
                : data.result[0].name
              : null
          }
        });
      }
    },
    *getQuestionByTopic({ payload }, { call, put }) {
      const { data } = yield call(getQuestionByTopic, payload);

      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            hotQuestions: data.result
          }
        });
      }
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const { topicId = '' } = query;
        if (pathname === '/special') {
          dispatch({
            type: 'getAllclassifyQuestionByTopic',
            payload: { topicId }
          });

          dispatch({
            type: 'getQuestionByTopic',
            payload: { topicId }
          });
        }
      });
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
