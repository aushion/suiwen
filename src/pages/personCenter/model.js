import { editUserInfo, getUserInfo } from './service';
import querystring from 'querystring';
import RestTools from '../../utils/RestTools';

export default {
  namespace: 'personCenter',
  state: {
    userInfo: null,
    avatar: `${process.env.apiUrl}/user/getUserHeadPicture?userName=${
      RestTools.getLocalStorage('userInfo').UserName
    }`,
    defaultKey: window.location.pathname.replace('/web/personCenter/', '')
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
    *editUserInfo({ payload }, { call, put }) {
      const res = yield call(editUserInfo, payload);
      const { userName } = querystring.parse(window.location.search.split('?')[1]);
      if (res.data.code === 200) {
        yield put({
          type: 'getUserInfo',
          payload: {
            userName
          }
        });
      }
    }

    // *uploadUserHeadPicture({ payload }, { call }) {
    //   const res = yield call(uploadUserHeadPicture, payload);
    //   console.log('res', res);
    // },

    // *getUserHeadPicture({ payload }, { call }) {
    //   const res = yield call(getUserHeadPicture, payload);
    //   console.log('res',  window.URL.createObjectURL(res.data));
    // }
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
            dispatch({ type: 'save', payload: { defaultKey: 'personInfo' } });
          } else if (current === '/personCenter/avatar') {
            dispatch({ type: 'getUserHeadPicture', payload: { userName } });
            dispatch({ type: 'save', payload: { defaultKey: 'avatar' } });
          } else if (current === '/personCenter/updatePassword') {
            // dispatch({ type: 'getUserHeadPicture', payload: { userName } });
            dispatch({ type: 'save', payload: { defaultKey: 'updatePassword' } });
          }
        }
      });
    }
  }
};
