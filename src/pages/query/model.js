// import queryString from 'querystring';
import {
  getAnswer,
  getSG,
  getRelevantByAnswer,
  setEvaluate,
  getHotHelpList,
  getCommunityAnswer,
  // getAnswerByTopic,
  getRelevant,
  setQuestion,
  getCustomView,
  collectQuestion,
  submitQa
} from './service/result';
import { getTopicQuestions } from '../home/service/home';
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
    relaventQuestions: [], //相关问题
    communityAnswer: null,
    specialQuestions: []
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
      const { q, userId } = payload;
      const { data } = res;

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
          repositoryData: repositoryData,
          source: 'getAnswer'
        });
      }
      yield call(submitQa, {
        clientType: 'pc',
        question: decodeURIComponent(q),
        answerStatus: res.data.code === 200 ? 'yes' : 'no',
        ip: '192.168.22.13',
        userid: userId
      });
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

    *getRelavent({ payload }, { call, put }) {
      const res = yield call(getRelevant, payload);
      const { data } = res;
      if (data.result.metaList) {
        yield put({
          type: 'save',
          payload: {
            relaventQuestions: data.result.metaList
          }
        });
      }
    },

    *getCustomView({ payload }, { call, put }) {
      const res = yield call(getCustomView, payload);
      const oldAnswer = RestTools.getSession('answer');
      //  const answerSource = oldAnswer.source;
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
              subject: newSubject,
              subjectType: newSubjectType
            } = res.data.result[0].dataNode;
            const { dataNode, intentJson } = item;
            const { data, year, subject, ...others } = dataNode;

            item = {
              ...item,
              ...res.data.result[0],
              intentJson,
              dataNode: {
                ...others,
                data: newData,
                orderBy,
                subjectType: newSubjectType,
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

      document.body.scrollTop = document.documentElement.scrollTop = 0; //页面滚动到顶部
      RestTools.setSession('answer', {
        ...oldAnswer,
        repositoryData: newRepositoryData,
        source: 'getCustomView'
      });
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
      if (data.result && data.code === 200) {
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
      const { q, userId } = payload;

      yield call(collectQuestion, {
        ClientType: 'pc',
        browser: 'Chrome',
        ip: '182.98.177.137',
        question: q,
        type: 'search',
        userid: userId
      });
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        let { q, topic = '' } = query;
        let userId = RestTools.getLocalStorage('userInfo')
          ? RestTools.getLocalStorage('userInfo').UserName
          : Cookies.get('cnki_qa_uuid');
        if (!userId) {
          userId = RestTools.createUid();
          Cookies.set('cnki_qa_uuid', userId, {
            expires: 3650
          });
        }
        const topicData =
          RestTools.getSession('topicData') || RestTools.getLocalStorage('topicData');
        if (!topicData) {
          dispatch({
            type: 'getTopicQuestions'
          });
        }
        if (pathname === '/query') {
          sessionStorage.removeItem('answer');
          if (topic) {
            dispatch({
              type: 'global/save',
              payload: {
                ...RestTools.headerInfo[topic],
                domain: topic
              }
            });
          } else {
            dispatch({
              type: 'global/save',
              payload: {
                ...RestTools.headerInfo['default'],
                domain: null
              }
            });
          }

          if (q) {
            //重置问题
            dispatch({
              type: 'global/setQuestion',
              payload: {
                q: q
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
                communityAnswer: null,
                relaventQuestions: []
              }
            });

            if (topic) {
              dispatch({
                type: 'getAnswer',
                payload: { q: encodeURIComponent(q), pageStart: 1, pageCount: 10, userId, topic }
              });
              dispatch({
                type: 'getSG',
                payload: {
                  q: encodeURIComponent(q),
                  pageStart: 1,
                  pageCount: 10,
                  userId,
                  domain: topic
                }
              });
              dispatch({
                type: 'getRelavent',
                payload: {
                  q: encodeURIComponent(q),
                  area: topic
                }
              });
              dispatch({
                type: 'getRelevantByAnswer',
                payload: { q: encodeURIComponent(q), pageStart: 1, pageCount: 10, topic }
              });
            } else {
              dispatch({
                type: 'getAnswer',
                payload: { q: encodeURIComponent(q), pageStart: 1, pageCount: 10, userId }
              });
              dispatch({
                type: 'getRelavent',
                payload: {
                  q: encodeURIComponent(q)
                }
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
                payload: { q: encodeURIComponent(q && q.replace(/？/g, '')), userId }
              });
            }
            dispatch({ type: 'collectQuestion', payload: { q, userId } });
            dispatch({
              type: 'getHotHelpList'
            });
          }
        }
      });
    }
  }
};
