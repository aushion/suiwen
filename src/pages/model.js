import {
  getDomainQuestions,
  getTopicQuestions,
  getHotHelpList,
  getHomePictureIds,
  getExampleDoc
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
    topicTheme: null,
    docExamples: []
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
        .filter((item) => item.info.isBeta === 0)
        .map((item) => {
          return {
            ...item,
            logoUrl: `${urlPrefix}/file/topic/icon/${item.info.topicId}.png`,
            thumbUrl: `${urlPrefix}/file/topic/home/${item.info.topicId}.png`,
            topicId: item.info?.topicId
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
      const { code, result } = data;
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
      const urlPrefix = `${process.env.apiUrl}/file/home/HomePicture_`;
      if (data.result) {
        const imgData = data.result.map((item) => `${urlPrefix}${item.picId}.png`);
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
    },

    //获取示例文档 /doc/getExampleDoc
    *getExampleDoc({ payload }, { call, put }) {
      const { data } = yield call(getExampleDoc, payload);
      const { code, result } = data;
      if (code === 200 && result) {
        window.localStorage.setItem('docExamples', JSON.stringify(result));
        yield put({
          type: 'save',
          payload: {
            docExamples: result
          }
        });
      }
    }
  },

  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/') {
          sessionStorage.removeItem('q'); //清除问题q
          window.document.title = '知网随问';
          dispatch({ type: 'global/setQuestion', payload: { q: '' } });
          dispatch({ type: 'getDomainQuestions' });
          dispatch({ type: 'getTopicQuestions' });
          dispatch({ type: 'getHomePicture', payload: { type: 0 } });
          dispatch({ type: 'getHomePicture', payload: { type: 1 } });
          dispatch({
            type: 'getHotHelpList',
            payload: { pageStart: 1, pageSize: 10, type: 'new' }
          });
          dispatch({ type: 'getExampleDoc', payload: { pageSize: 10 } });
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
