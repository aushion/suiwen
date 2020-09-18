import { getUserHistoryNotification, getUserInfo } from './service/notify';

export default {
  namespace: 'notify',
  state: {
    userHistoryNotification: null,
    userCommunityInfo: null
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const res = yield call(getUserHistoryNotification, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            userHistoryNotification: res.data.result
          }
        });
      }
    },
    *getUserInfo({ payload }, { call, put }) {
      const res = yield call(getUserInfo, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            userCommunityInfo: res.data.result
          }
        });
      }
    }
  },

  subscriptions: {
    init({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const { type } = query;
        const userInfo = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : null;
        if (pathname === '/notify') {
          dispatch({
            type: 'global/setQuestion',
            payload: {
              q: ''
            }
          });
          sessionStorage.removeItem('q');

          dispatch({
            type: 'fetch',
            payload: {
              pageStart: 1,
              pageSize: 10,
              type,
              userName: userInfo.UserName
            }
          });

          dispatch({
            type: 'getUserInfo',
            payload: {
              userName: userInfo.UserName
            }
          });
        }
      });
    }
  }
};
