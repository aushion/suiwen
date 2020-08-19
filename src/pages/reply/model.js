import helpServer from '../../services/help';
import RestTools from '../../utils/RestTools';
import Cookies from 'js-cookie';
import { message } from 'antd';
import router from 'umi/router';
import { getSG } from '../query/service/result';

message.config({
  top: 500,
  duration: 2,
  maxCount: 3
});
export default {
  namespace: 'reply',
  state: {
    answerList: [],
    total: 0,
    domains: [],
    sgData: [],
    username: RestTools.getLocalStorage('userInfo')
      ? RestTools.getLocalStorage('userInfo').UserName
      : '',
    uid: RestTools.getLocalStorage('userInfo') ? RestTools.getLocalStorage('userInfo').UserName : ''
  },

  effects: {
    *getAnswer({ payload }, { call, put }) {
      const res = yield call(helpServer.getAnwser, payload);
      if (res.data && res.data.code === 200) {
        let answerList = res.data.result.answerList.map((item) => {
          return {
            ...item,
            showComment: false
          };
        });
        yield put({
          type: 'saveAnswers',
          payload: { answerList: answerList, total: res.data.result.total }
        });
      }
    },
    *getComment({ payload }, { call, select }) {
      const { aId } = payload;
      let { answerList } = yield select((state) => state.reply);

      const res = yield call(helpServer.getComment, payload);
      if (res.data && res.data.code === 200) {
        answerList = answerList.map((item) => {
          if (item.aid === aId) {
            return {
              ...item,
              commentList: res.data.result
            };
          }
          return { ...item };
        });
      }
      return answerList;
    },

    *addComment({ payload }, { call }) {
      const res = yield call(helpServer.addComment, payload);
      return res.data;
    },

    *getUserFAQ({ payload }, { call, put }) {
      const res = yield call(helpServer.getUserFAQ, payload);
      if (!res.data.result) return;
      if (Object.keys(res.data.result).length) {
        yield put({
          type: 'saveAnswers',
          payload: { answerList: res.data.result.metaList, total: res.data.result.metaList.length }
        });
      }
    },
    *setAnswer({ payload }, { call }) {
      const res = yield call(helpServer.setAnswer, payload);
      if (res.data && res.data.code === 200) {
        message.success('回答成功，感谢您的参与');
        router.push('/help/myReply');
      } else {
        message.warning(res.data.msg);
      }
    },

    *editAnswer({ payload }, { call }) {
      const res = yield call(helpServer.editAnswer, payload);
      if (res.data && res.data.code === 200) {
        message.success('修改成功，感谢您的参与');
        router.push('/help/myReply');
      } else {
        message.warning(res.data.msg);
      }
    },

    *setQanswer({ payload }, { call }) {
      const res = yield call(helpServer.setQanswer, payload);
      if (res.data && res.data.code === 200) {
        message.success('回答成功，感谢您的参与');
        router.push('/help/myReply');
      } else {
        message.warning(res.data.msg);
      }
    },

    *getSG({ payload }, { call, put }) {
      const res = yield call(getSG, payload);
      const { data } = res;
      yield put({
        type: 'saveAnswers',
        payload: {
          sgData: []
        }
      });
      if (data.result && data.result.length) {
        yield put({
          type: 'saveAnswers',
          payload: {
            sgData: data.result
          }
        });
      }
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/reply') {
          const params = query;

          dispatch({
            type: 'saveAnswers',
            payload: {
              sgData: [],
              answerList: [],
              total: 0,
              domains: []
            }
          });
          const uid = RestTools.getLocalStorage('userInfo')
            ? RestTools.getLocalStorage('userInfo').UserName
            : '';
          const userId = RestTools.getLocalStorage('userInfo')
            ? RestTools.getLocalStorage('userInfo').UserName
            : Cookies.get('cnki_qa_uuid');
          const { QID, q } = params;
          if (QID) {
            dispatch({ type: 'getAnswer', payload: { ...params, uid: uid } });
          } else {
            dispatch({ type: 'getUserFAQ', payload: params });
          }
          dispatch({
            type: 'getSG',
            payload: {
              q: encodeURIComponent(q),
              pageStart: 1,
              pageCount: 10,
              userId
            }
          });
        }
      });
    }
  },
  reducers: {
    saveAnswers(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  }
};
