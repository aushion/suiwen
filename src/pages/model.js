import {
  getDomainQuestions,
  getTopicQuestions,
  getHotHelpList,
  getHomePictureIds
} from './home/service/home';
import RestTools from '../utils/RestTools';

export default {
  namespace: 'index',
  state: {
    newHelpList: [],
    skillExamples: [],
    specialQuestions: [],
    skillPicture: [],
    helpPicture: [],
    topicTheme: null
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
        RestTools.setSession('skillExamples', newArray);
      }
    },

    *getTopicQuestions({ payload }, { call, put }) {
      const { data } = yield call(getTopicQuestions);
      const urlPrefix = process.env.apiUrl;
      const topicData = data.result
        .filter((item) => item.data.length)
        .map((item) => {
          return {
            ...item,
            logoUrl: `${urlPrefix}/getTopicLogo?topicId=${item.data[0].topicId}`,
            thumbUrl: `${urlPrefix}/getTopicHomePicture?topicId=${item.data[0].topicId}`,
            topicId: item.data[0].topicId
          };
        });
      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            specialQuestions: topicData
          }
        });
      }
      RestTools.setSession('topicData', topicData);
      RestTools.setLocalStorage('topicData', topicData);
    },

    *getHotHelpList({ payload }, { call, put }) {
      const { data } = yield call(getHotHelpList, payload);
      const {code, result} = data;
      if (code === 200 && result) {
        yield put({
          type: 'save',
          payload: {
            newHelpList: result.dataList
          }
        });
      }
    },

    *getHomePicture({ payload }, { call, put }) {
      const { data } = yield call(getHomePictureIds, payload);
      const { type } = payload;
      const urlPrefix = `${process.env.apiUrl}/getHomePicture?picId=`;
      if (data.result) {
        const imgData = data.result.map((item) => urlPrefix + item.picId);
        type === 0
          ? yield put({
              type: 'save',
              payload: {
                skillPicture: imgData
              }
            })
          : yield put({
              type: 'save',
              payload: {
                helpPicture: imgData
              }
            });
      }
    }
  },

  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/') {
          dispatch({ type: 'global/setQuestion', payload: { q: '' } });
          dispatch({ type: 'getDomainQuestions' });
          dispatch({ type: 'getTopicQuestions' });
          dispatch({ type: 'getHomePicture', payload: { type: 0 } });
          dispatch({ type: 'getHomePicture', payload: { type: 1 } });
          dispatch({ type: 'getHotHelpList', payload: { pageStart: 1, pageSize: 10, type: 'new'} });
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
