// import queryString from 'querystring';
import {
  getAnswer,
  getSG,
  getRelevantByAnswer,
  setEvaluate,
  getHotHelpList,
  getCommunityAnswer,
  getAnswerByDomain,
  setQuestion,
  getCustomView
} from './service/result';
import { message } from 'antd';
import router from 'umi/router';
import Cookies from 'js-cookie';
import RestTools from '../../utils/RestTools';

export default {
  namespace: 'result',
  state: {
    sgData: [],
    relatedData: [],
    answerData: [],
    visible: false,
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
        RestTools.setSession('answer', {
          answerData: data.result.metaList,
          faqData: faqData,
          repositoryData: repositoryData
        });
      }
    },

    *getAnswerByDomain({ payload }, { call }) {
      const res = yield call(getAnswerByDomain, payload);
      const { data } = res;
      if (data.result) {
        console.log(data);
      }
    },

    *getCustomView({ payload }, { call, put }) {
      const res = yield call(getCustomView, payload);
      const oldAnswer = RestTools.getSession('answer');
      const oldRepositoryData = oldAnswer.repositoryData.filter((item) => item.domain === '文献');
      let newRepositoryData = [];
      if (res.data.code === 200) {
        newRepositoryData = oldRepositoryData.map((item) => {
          const { sql, orderSql, data: newData } = res.data.result[0].dataNode;
          const { dataNode } = item;
          const { data, ...others } = dataNode;
          // if (
          //   whereSql.split('ORDER')[0].replace(/\s/g, '') ===
          //   item.whereSql.split('ORDER')[0].replace(/\s/g, '')
          // ) {
          item = {
            ...item,
            ...res.data.result[0],
            dataNode: {
              data: newData,
              ...others,
              sql: sql,
              orderBy: orderSql
            },
          };
          // }
          return item;
        });
      }
      yield put({
        type: 'save',
        payload: {
          ...oldAnswer,
          repositoryData: newRepositoryData
        }
      });

      RestTools.setSession('answer', { ...oldAnswer, repositoryData: newRepositoryData });
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
            relatedData: data.result.metaList
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
    },
    *setQuestion({ payload }, { call, put }) {
      const res = yield call(setQuestion, payload);
      if (res.data.success) {
        yield put({ type: 'save', payload: { visible: false } });
        router.push('/help/myHelp');
      } else if (!res.data.message) {
        message.error('提交失败');
      } else if (res.data.message === '1') {
        message.warn('请勿重复提交');
      }
      return res;
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
            payload: { q: encodeURIComponent(q.replace(/？/g, '')) }
          });
          dispatch({
            type: 'getHotHelpList'
          });
        }
      });
    }
  }
};
