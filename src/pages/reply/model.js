import helpServer from '../../services/help';
import qaServer from '../../services/qa';
import RestTools from '../../utils/RestTools';
import Cookies from 'js-cookie';
import { message } from 'antd';
import router from 'umi/router';

message.config({
  top: 500,
  duration: 2,
  maxCount: 3,
});
export default {
  namespace: 'reply',
  state: {
    answerList: [],
    total: 0,
    domains: [],
    username: RestTools.getLocalStorage('userInfo')? RestTools.getLocalStorage('userInfo').UserName: '',
    uid: RestTools.getLocalStorage('userInfo')? RestTools.getLocalStorage('userInfo').UserName : '',
  },

  effects: {
    *getAnswer({ payload }, { call, put }) {
      const res = yield call(helpServer.getAnwser, payload);

      yield put({
        type: 'saveAnswers',
        payload: { answerList: res.data.data.list, total: res.data.data.total },
      });
    },
    *getUserFAQ({ payload }, { call, put }) {
      const res = yield call(helpServer.getUserFAQ, payload);
      if (!res.data.result) return;
      if (Object.keys(res.data.result).length) {
        yield put({
          type: 'saveAnswers',
          payload: { answerList: res.data.result.metaList, total: res.data.result.metaList.length },
        });
      }
    },
    *setAnswer({ payload }, { call }) {
      const res = yield call(helpServer.setAnswer, payload);
      if (res.data && res.data.success) {
        message.success('回答成功，感谢您的参与');
        router.push('/help/myReply');
      } else {
        message.warning(res.data.message);
      }
      //获取答案
      // const params = querystring.parse(window.location.search.replace('?', ''));
      // const uid = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')).user_name : '';
      // const result = yield call(helpServer.getAnwser, { ...params, uid: uid });
      // yield put({
      //   type: 'saveAnswers',
      //   payload: { answerList: result.data.list, total: result.data.total },
      // });
    },
    *getDomains({ payload }, { call, put }) {
      const res = yield call(qaServer.getDomains, payload);
      if (res.data) {
        yield put({ type: 'saveAnswers', payload: { domains: res.data.result } });
      }
    },
    *setQanswer({ payload }, { call }) {
      const res = yield call(helpServer.setQanswer, payload);
      if (res.data && res.data.success) {
        message.success('回答成功，感谢您的参与');
        router.push('/help/myReply');
      } else {
        message.warning(res.data.message);
      }
      // const params = querystring.parse(window.location.search.replace('?', ''));
      // const uid = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')).user_name : '';
      // const result = yield call(helpServer.getAnwser, { ...params, uid: uid });

      // yield put({
      //   type: 'saveAnswers',
      //   payload: { answerList: result.data.list, total: result.data.total },
      // });
    },
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/reply') {
          const params = query;
          const uid = RestTools.getLocalStorage('userInfo') ? RestTools.getLocalStorage('userInfo').UserName : '';
          const { QID } = params;
          if (QID) {
            dispatch({ type: 'getAnswer', payload: { ...params, uid: uid } });
          } else {
            dispatch({ type: 'getUserFAQ', payload: params });
          }
          // dispatch({ type: 'getDomains' });
        }
      });
    },
  },
  reducers: {
    saveAnswers(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
