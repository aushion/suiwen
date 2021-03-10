import { message } from 'antd';
import { find } from 'lodash';
import {
  getAllclassifyQuestionByTopic,
  getQuestionByTopic,
  getShareDoc,
  getHotDoc
} from './service';

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
    shareDoc: null,
    hotDoc: null,
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
      const urlPrefix = process.env.apiUrl + '/file/topic/topicHome';
      const topicData = JSON.parse(localStorage.getItem('topicData'));
      const { topicId } = payload;
      const topic = find(topicData, { topicId: topicId });
      const imgData = topic && topic.info.picIds.map((item) => `${urlPrefix}/${item.picId}.png`);

      yield put({
        type: 'save',
        payload: {
          imgData
        }
      });
    },
    *getShareDoc({ payload }, { call, put }) {
      const res = yield call(getShareDoc, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            shareDoc: res.data.result
          }
        });
      }
    },
    *getHotDoc({ payload }, { call, put }) {
      const res = yield call(getHotDoc, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            hotDoc: res.data.result
          }
        });
      }
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const { topicId = '' } = query;
        if (pathname === '/special/doc') {
          dispatch({
            type: 'save',
            payload: {
              topics: [],
              imgData: [],
              initialKey: null,
              hotQuestions: null
            }
          });
          dispatch({
            type: 'getShareDoc',
            payload: { pageSize: 20, pageStart: 1, searchWord: '', subject: '' }
          });
          dispatch({
            type: 'getHotDoc',
            payload: {
              pageSize: 10
            }
          });
        }
        if (pathname === '/special') {
          dispatch({
            type: 'save',
            payload: {
              topics: [],
              imgData: [],
              initialKey: null,
              hotQuestions: null
            }
          });
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
            payload: { topicId, type: 'PC' }
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
