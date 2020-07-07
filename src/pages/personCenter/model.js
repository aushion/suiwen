import { getUserHeadPicture, editUserInfo, getUserInfo, uploadUserHeadPicture } from './service';

export default {
  namespace: 'personCenter',
  state: {
    userInfo: null,
    headerPicture: ''
  },
  effects: {
    *getUserInfo({ payload }, { call, put }) {
      const res = yield call(getUserInfo, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            userInfo: res.data.result
          }
        });
      }
    },
    *editUserInfo({ payload }, { call }) {
      const res = yield call(editUserInfo, payload);
      console.log('res', res);
    },

    *uploadUserHeadPicture({ payload }, { call }) {
      const res = yield call(uploadUserHeadPicture, payload);
      console.log('res', res);
    },

    *getUserHeadPicture({ payload }, { call }) {
      const res = yield call(getUserHeadPicture, payload);
      console.log('res', res);
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const match = pathname.match(/personCenter/i);
        const { userName } = query;
        const current = pathname;
        if (match) {
          if (current === '/personCenter/personInfo') {
            dispatch({ type: 'getUserInfo', payload: { userName } });
          }
        }
      });
    }
  }
};
