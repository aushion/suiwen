// import queryString from 'querystring';
import {
  getAnswer,
  getSG,
  getRelevantByAnswer,
  setEvaluate,
  getHotHelpList,
  getCommunityAnswer,
  getAnswerByDomain
} from './service/result';
import Cookies from 'js-cookie';
import RestTools from '../../utils/RestTools';

export default {
  namespace: 'result',
  state: {
    sgData: [],
    relatedData: [],
    answerData: [],
    faqData: [], //faq数据
    repositoryData: [], //知识库数据,
    helpList: [],
    communityAnswer: null
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
        //数据持久化
        RestTools.setSession('answer',{
          nswerData: data.result.metaList,
          faqData: faqData,
          repositoryData: repositoryData
        })
      }
    },

    *getAnswerByDomain({ payload }, { call }) {
  const res = yield call(getAnswerByDomain, payload);
  const { data } = res;
  if (data.result) {
    console.log(data);
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
    },
    *getCommunityAnswer({ payload }, { call, put }) {
      const res = yield call(getCommunityAnswer, payload);
      const result = res.data.result;
      if (result) {
        yield put({
          type: 'save',
          payload: {
            communityAnswer: result
          }
        });
      }
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const userId = Cookies.get('cnki_qa_uuid');
        let { q } = query;
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
              helpList: [],
              communityAnswer: null
            }
          });
          //获取数据
          dispatch({
            type: 'getAnswer',
            payload: { q: encodeURIComponent(q), pageStart: 1, pageCount: 10, userId }
          });
          dispatch({
            type: 'getSG',
            payload: { q: encodeURIComponent(q), pageStart: 1, pageCount: 10, userId }
          });
          dispatch({
            type: 'getRelevantByAnswer',
            payload: { q: encodeURIComponent(q), pageStart: 1, pageCount: 10 }
          });
          dispatch({
            type: 'getCommunityAnswer',
            payload: { q: encodeURIComponent(q.replace(/？/g,'')) }
          });
          dispatch({
            type: 'getHotHelpList'
          });
        }
      });
    }
  }
};
