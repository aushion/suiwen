import { message } from 'antd';
import { getAllclassifyQuestionByTopic, getQuestionByTopic, getTopicPictures } from './service';

message.config({
  top: 500,
  duration: 2,
  maxCount: 3
});
export default {
  namespace: 'special',
  state: {
    topics: [],
    imgData: [],
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
    },
    *getTopicPictures({ payload }, { call, put }) {
      const { topicId } = payload;
      const { data } = yield call(getTopicPictures, payload);
      const urlPrefix = process.env.apiUrl + '/getPictureInfo';
      if (data.code === 200) {
        const imgData = data.result.map(
          (item) => `${urlPrefix}?topicId=${topicId}&picId=${item.picId}`
        );
        yield put({
          type: 'save',
          payload: {
            imgData
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
            type: 'save',
            payload: {
              topics: [],
              imgData: [],
              initialKey: null,
              hotQuestions: null
            }
          })
          dispatch({
            type: 'getAllclassifyQuestionByTopic',
            payload: { topicId }
          });

          dispatch({
            type: 'getQuestionByTopic',
            payload: { topicId }
          });

          dispatch({
            type: 'getTopicPictures',
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
