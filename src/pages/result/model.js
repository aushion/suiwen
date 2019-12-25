// import queryString from 'querystring';
import {
  getAnswer,
  getSG,
  getRelevantByAnswer,
  setEvaluate,
  getHotHelpList
} from './service/result';
import Cookies from 'js-cookie';

export default {
  namespace: 'result',
  state: {
    sgData: [],
    relatedData: [],
    answerData: [],
    faqData: [], //faq数据
    repositoryData: [], //知识库数据,
    helpList: []
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    *getAnswer({ payload }, { call, put }) {
      const res = yield call(getAnswer, payload);
      const { data } = res;
      if (data.result) {
        const faqData = data.result.metaList.filter((item) => item.dataType === 0); //faq类的答案
        const repositoryData = data.result.metaList.filter((item) => item.dataType === 3); //知识库答案
        yield put({
          type: 'save',
          payload: {
            answerData: data.result.metaList,
            faqData: faqData,
            repositoryData: repositoryData
          }
        });
      }
    },
    *getSG({ payload }, { call, put }) {
      const res = yield call(getSG, payload);
      const { data } = res;
      if (data.result) {
        yield put({
          type: 'save',
          payload: {
            sgData: data.metaList
          }
        });
      }
    },
    *getRelevantByAnswer({ payload }, { call, put }) {
      const res = yield call(getRelevantByAnswer, payload);
      const { data } = res;
      if (data.result) {
        yield put({
          type: 'save',
          payload: {
            relatedData: data.result.metaList.filter((item) => item.domain === '文献')[0].dataNode
          }
        });
      }
    },

    *setEvaluate({ payload }, { call }) {
      yield call(setEvaluate, payload);
    },
    *getHotHelpList({ payload }, { call, put }) {
      const { data } = yield call(getHotHelpList);
      if (data.length) {
        yield put({
          type: 'save',
          payload: {
            helpList: data
          }
        });
      }
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const userId = Cookies.get('cnki_qa_uuid');
        const { q } = query;
        if (pathname === '/result') {
          //重置问题
          dispatch({
            type: 'global/setQuestion',
            payload: {
              q: query.q
            }
          });
          //重置数据
          dispatch({
            type: 'save',
            payload: {
              sgData: [],
              answerData: [],
              faqData: [],
              repositoryData: [], //知识库数据
              relatedData: [],
              helpList: []
            }
          });
          //获取数据
          dispatch({
            type: 'getAnswer',
            payload: { q: q, pageStart: 1, pageCount: 10, userId }
          });
          dispatch({
            type: 'getSG',
            payload: { q: q, pageStart: 1, pageCount: 10, userId }
          });
          dispatch({
            type: 'getRelevantByAnswer',
            payload: { q: q, pageStart: 1, pageCount: 10 }
          });
          dispatch({
            type: 'getHotHelpList'
          });
        }
      });
    }
  }
};
