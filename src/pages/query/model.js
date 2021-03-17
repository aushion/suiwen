// import queryString from 'querystring';
import {
  getAnswer,
  getSG,
  getRelevantByAnswer,
  setEvaluate,
  getHotHelpList,
  getCommunityAnswer,
  getRelevant,
  setQuestion,
  getCustomView,
  collectQuestion,
  submitQa,
  getConcept,
  getConceptAttrs,
  getMethod,
  getMethodAttrs,
  getAnswerByPage,
  getRecommend
} from './service/result';
import { getTopicQuestions } from '../home/service/home';
import { message } from 'antd';
import router from 'umi/router';
import Cookies from 'js-cookie';

import RestTools from '../../utils/RestTools';

export default {
  namespace: 'result',
  state: {
    sgData: [],
    semanticData: null,
    relatedData: [],
    answerData: [],
    visible: false,
    faqData: [], //faq数据
    repositoryData: [], //知识库数据,
    helpList: [],
    relaventQuestions: [], //相关问题
    communityAnswer: null,
    specialQuestions: [],
    conceptData: null, //知识元概念数据
    conceptDataAttrs: null, //知识元概念属性
    methodData: null, //知识元方法数据
    methodDataAttrs: null, //知识元方法属性,
    recommend: [],
    sgCount: 0
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
      const { q, userId, topicName } = payload;
      const res = yield call(getAnswer, payload);
      const { data } = res;

      if (data.result) {
        const faqData = data.result.metaList.filter((item) => item.dataType === 0); //faq类的答案
        let repositoryData = data.result.metaList.filter((item) => item.dataType === 3); //知识库答案
        const conceptData = repositoryData.filter((item) => item.template === 'concept'); //知识元概念
        const methodData = repositoryData.filter((item) => item.template === 'method'); //知识元方法

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

        //知识元概念库意图
        if (conceptData[0]?.intentJson?.results[0]?.fields) {
          const payload = conceptData[0].intentJson.results[0].fields;
          yield put({
            type: 'getConcept',
            payload
          });
          yield put({
            type: 'getConceptAttrs',
            payload
          });
        }

        //知识元方法库意图
        if (methodData[0]?.intentJson?.results[0]?.fields) {
          const payload = methodData[0].intentJson.results[0].fields;
          yield put({
            type: 'getMethod',
            payload
          });
          yield put({
            type: 'getMethodAttrs',
            payload
          });
        }
      }

      if (q && decodeURIComponent(q)) {
        if (res.data.code === 200) {
          yield put({
            type: 'submitQa',
            payload: {
              clientType: 'pc',
              question: decodeURIComponent(q),
              answerStatus: 'yes',
              ip: '192.168.22.13',
              user_id: userId,
              topic: topicName || ''
            }
          });
        } else {
          yield put({
            type: 'submitQa',
            payload: {
              clientType: 'pc',
              question: decodeURIComponent(q),
              answerStatus: 'no',
              ip: '192.168.22.13',
              user_id: userId,
              topic: topicName || ''
            }
          });
        }
      }
    },

    *getAnswerByPage({ payload }, { call, put }) {
      const res = yield call(getAnswerByPage, payload);
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
    },

    // 获取相关推荐
    *getRecommend({ payload }, { call, put }) {
      const res = yield call(getRecommend, payload);
      const { data } = res;
      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            recommend: data.result
          }
        });
      }
    },
    //获取知识元概念库属性句子
    *getConcept({ payload }, { call, put }) {
      const res = yield call(getConcept, payload);

      if (res.data.Code === 0) {
        if (
          (Array.isArray(res.data.Data) && res.data.Data.length) ||
          !Array.isArray(res.data.Data)
        ) {
          yield put({
            type: 'save',
            payload: {
              conceptData: res.data.Data
            }
          });
        }
      }
    },
    //获取知识元概念基本属性
    *getConceptAttrs({ payload }, { call, put }) {
      const res = yield call(getConceptAttrs, payload);
      if (res) {
        if (res.data.Code === 0) {
          if (
            (Array.isArray(res.data.Data) && res.data.Data.length) ||
            !Array.isArray(res.data.Data)
          ) {
            yield put({
              type: 'save',
              payload: {
                conceptDataAttrs: res.data.Data
              }
            });
          }
        }
      } else {
        yield put({
          type: 'save',
          payload: {
            conceptDataAttrs: null
          }
        });
      }
    },

    //获取知识元方法库属性句子
    *getMethod({ payload }, { call, put }) {
      const res = yield call(getMethod, payload);

      if (res.data.Code === 0) {
        if (
          (Array.isArray(res.data.Data) && res.data.Data.length) ||
          !Array.isArray(res.data.Data)
        ) {
          yield put({
            type: 'save',
            payload: {
              methodData: res.data.Data
            }
          });
        }
      }
    },
    //获取知识元方法基本属性
    *getMethodAttrs({ payload }, { call, put }) {
      const res = yield call(getMethodAttrs, payload);
      if (res.data.Code === 0) {
        if (
          (Array.isArray(res.data.Data) && res.data.Data.length) ||
          !Array.isArray(res.data.Data)
        ) {
          yield put({
            type: 'save',
            payload: {
              methodDataAttrs: res.data.Data
            }
          });
        }
      }
    },

    *submitQa({ payload }, { call }) {
      yield call(submitQa, payload);
    },

    *getTopicQuestions({ payload }, { call, put }) {
      const { data } = yield call(getTopicQuestions);
      const urlPrefix = process.env.apiUrl;
      const topicData = data.result
        .filter((item) => item.data.length)
        .map((item) => {
          return {
            ...item,
            logoUrl: `${urlPrefix}/file/topic/icon/${item.data[0].topicId}.png`,
            thumbUrl: `${urlPrefix}/file/topic/home/${item.data[0].topicId}.png`,
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
      const oldAnswer = JSON.parse(window.sessionStorage.getItem('answer'));
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

    *getSG({ payload }, { call, put, select }) {
      let userId = RestTools.getLocalStorage('userInfo')
        ? RestTools.getLocalStorage('userInfo').UserName
        : Cookies.get('cnki_qa_uuid');
      if (!userId) {
        userId = RestTools.createUid();
        Cookies.set('cnki_qa_uuid', userId, {
          expires: 3650
        });
      }

      const sgCount = yield select((state) => state.result.sgCount);
      const start = Date.now();

      const res = yield call(getSG, { ...payload, userId });

      const responseTime = Date.now() - start;
      console.log(`sgResponseTime`, responseTime);
      const { data } = res;
      if (data.result && data.result.length) {
        yield put({
          type: 'save',
          payload: {
            sgData: data.result,
            sgCount: data.result[0].name === '全部' ? data.result[0].pagination.total : sgCount
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
      const res = yield call(getHotHelpList);

      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            helpList: res.data.result.dataList
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
      if (res.data.result) {
        yield put({ type: 'save', payload: { visible: false } });
        router.push(`/personCenter/people/ask?userName=${RestTools.encodeBase64(payload.uId)}`);
      } else {
        message.error(res.data.msg);
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
        let { q, topic = '', topicName } = query;
        window.localStorage.removeItem('sgTop');
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
          JSON.parse(window.sessionStorage.getItem('topicData')) ||
          JSON.parse(window.localStorage.getItem('topicData'));
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
                ...RestTools.headerInfo[topic]
                // domain: topic
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

          if (q && q.trim()) {
            RestTools.setStorageInput('SUIWEN_RECORD', q);
            //重置问题
            dispatch({
              type: 'global/setQuestion',
              payload: {
                q: q
              }
            });
            dispatch({
              type: 'getRecommend',
              payload: {
                q
              }
            });
            //重置数据
            dispatch({
              type: 'save',
              payload: {
                sgData: [],
                semanticData: null,
                answerData: [],
                faqData: [],
                repositoryData: [], //知识库数据
                relatedData: [],
                helpList: [],
                communityAnswer: null,
                relaventQuestions: [],
                conceptData: null,
                conceptDataAttrs: null, //知识元概念属性
                methodData: null, //知识元方法数据
                methodDataAttrs: null, //知识元方法属性
                recommend: [],
                sgCount: 0
              }
            });
            dispatch({ type: 'collectQuestion', payload: { q, userId } });
            dispatch({
              type: 'getHotHelpList'
            });
            if (topic) {
              if (topic === 'YD') {
              } else {
                dispatch({
                  type: 'getAnswer',
                  payload: {
                    q: encodeURIComponent(q),
                    pageStart: 1,
                    pageCount: 5,
                    userId,
                    topic,
                    topicName
                  }
                });
                dispatch({
                  type: 'getSG',
                  payload: {
                    q: encodeURIComponent(q),
                    pageStart: 1,
                    pageSize: 10,
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
                  payload: {
                    q: encodeURIComponent(q),
                    pageStart: 1,
                    pageCount: 10,
                    topic,
                    topicName
                  }
                });
              }
            } else {
              dispatch({
                type: 'getAnswer',
                payload: { q: encodeURIComponent(q), pageStart: 1, pageCount: 5, userId }
              });
              dispatch({
                type: 'getRelavent',
                payload: {
                  q: encodeURIComponent(q)
                }
              });
              dispatch({
                type: 'getSG',
                payload: { q: encodeURIComponent(q), pageStart: 1, pageCount: 50, userId }
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
          }
        }
      });
    }
  }
};
