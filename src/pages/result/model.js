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
  getCustomView,
  collectQuestion,
  submitQa
} from './service/result';
import { message } from 'antd';
import router from 'umi/router';
import Cookies from 'js-cookie';
import RestTools from 'Utils/RestTools';

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
      const { q } = payload;
      const { data } = res;
      const userid = RestTools.getLocalStorage('userInfo')
        ? RestTools.getLocalStorage('userInfo').UserName
        : Cookies.get('cnki_qa_uuid');
      yield call(submitQa, {
        clientType: 'pc',
        question: decodeURIComponent(q),
        answerStatus: res.data.code === 200 ? 'yes' : 'no',
        ip: '192.168.22.13',
        userid: userid
      });
      if (data.result) {
        const faqData = data.result.metaList.filter((item) => item.dataType === 0); //faq类的答案
        let repositoryData = data.result.metaList.filter((item) => item.dataType === 3); //知识库答案

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
        newRepositoryData = oldRepositoryData.map((item, index) => {
          if (index === 0) {
            //数组的第0项是论文数据
            const {
              data: newData,
              sql: newSql,
              year: newYear,
              orderBy,
              subject: newSubject
            } = res.data.result[0].dataNode;
            const { dataNode } = item;
            const { data, year, subject, ...others } = dataNode;

            item = {
              ...item,
              ...res.data.result[0],
              dataNode: {
                ...others,
                data: newData,
                orderBy,
                year: newYear || [],
                subject: newSubject || [],
                sql: newSql
              }
            };
          }

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
      return newRepositoryData;
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
    },
    *collectQuestion({ payload }, { call }) {
      const { q } = payload;
      const userid = RestTools.getLocalStorage('userInfo')
        ? RestTools.getLocalStorage('userInfo').UserName
        : Cookies.get('cnki_qa_uuid');
      yield call(collectQuestion, {
        ClientType: 'pc',
        browser: 'Chrome',
        ip: '182.98.177.137',
        question: q,
        type: 'search',
        userid
      });
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // const userId = Cookies.get('cnki_qa_uuid');
        let { q, domain = '' } = query;
        // const userId = RestTools.getLocalStorage('userInfo')
        //   ? RestTools.getLocalStorage('userInfo').UserName
        //   : Cookies.get('cnki_qa_uuid');
        if (pathname === '/result') {
          if (domain) {
            dispatch({
              type: 'global/save',
              payload: {
                ...RestTools.headerInfo[domain],
                domain
              }
            });
          }

          //重置问题
          dispatch({
            type: 'global/setQuestion',
            payload: {
              q: q
            }
          });
        }
      });
    }
  }
};
