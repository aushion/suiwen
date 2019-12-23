// import queryString from 'querystring';
import { getAnswer, getSG, getRelevantByAnswer, setEvaluate } from './service/result';
import Cookies from 'js-cookie';

export default {
  namespace: 'result',
  state: {
    sgData: [],
    relatedData: [],
    answerData: [],
    faqData: [], //faq数据
    repositoryData: [] //知识库数据
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
  const res = yield call(setEvaluate, payload);
  console.log(res);
}
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
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
              relatedData: []
            }
          });
          //获取数据
          dispatch({ type: 'getAnswer', payload: { ...query, pageStart: 1, pageCount: 10, userId: Cookies.get('cnki_qa_uuid') } });
          dispatch({ type: 'getSG', payload: { ...query, pageStart: 1, pageCount: 10 } });
          dispatch({
            type: 'getRelevantByAnswer',
            payload: { ...query, pageStart: 1, pageCount: 10 }
          });
        }
      });
    }
  }
};
