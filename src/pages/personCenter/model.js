import {
  editUserInfo,
  getUserInfo,
  updatePassword,
  getMyCommunityQuestion,
  getMyCommunityAnswer,
  getUserFolloweeInfo,
  getUserFollowerInfo,
  getUserFollowedQuestion
} from './service';
import helpServer from '../../services/help';
import helpService from '../../services/help';
import querystring from 'querystring';
import RestTools from '../../utils/RestTools';

export default {
  namespace: 'personCenter',
  state: {
    userInfo: null,
    avatar: `${process.env.apiUrl}/user/getUserHeadPicture?userName=${
      RestTools.getLocalStorage('userInfo') ? RestTools.getLocalStorage('userInfo').UserName : ''
    }`,
    userCommunityInfo: null,
    defaultKey: window.location.pathname.replace('/web/personCenter/edit', ''),
    defaultPersonKey: window.location.pathname.replace('/web/personCenter/people/', ''),
    myCommunityQuestion: null,
    myCommunityAnswer: null,
    userFolloweeInfo: [],
    fans: [],
    userFollowQuestion: []
  },
  effects: {
    *getUserCommunityInfo({ payload }, { call, put }) {
      const res = yield call(helpService.getUserCommunityInfo, {
        ...payload
      });
      const resultData = res.data;
      yield put({
        type: 'save',
        payload: {
          ...payload,
          userCommunityInfo: resultData.result
        }
      });
    
    },

    *getMyCommunityQuestion({ payload }, { call, put }) {
      const res = yield call(getMyCommunityQuestion, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            myCommunityQuestion: res.data.result
          }
        });
      }
    },

    *getUserFollowedQuestion({ payload }, { call, put }) {
      const res = yield call(getUserFollowedQuestion, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            userFollowQuestion: res.data.result
          }
        });
      }
    },

    *getMyCommunityAnswer({ payload }, { call, put }) {
      const res = yield call(getMyCommunityAnswer, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            myCommunityAnswer: res.data.result
          }
        });
      }
    },

    *getUserFolloweeInfo({ payload }, { call, put }) {
      const res = yield call(getUserFolloweeInfo, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            userFolloweeInfo: res.data.result
          }
        });
      }
    },

    *getUserFollowerInfo({ payload }, { call, put }) {
      const res = yield call(getUserFollowerInfo, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            fans: res.data.result
          }
        });
      }
    },
    *unFollowUser({ payload }, { call }) {
      const res = yield call(helpServer.unFollowUser, payload);
      return res.data;
    },
    *followUser({ payload }, { call }) {
      const res = yield call(helpServer.followUser, payload);
      return res.data;
    },
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

      return res;
    },
    *updatePassword({ payload }, { call }) {
      const res = yield call(updatePassword, payload);
      return res;
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
        const userInfo = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : null;
        const current = pathname;
        const pathnameArray = current.split('/'); //获取路由信息为了渲染默认菜单选中
        if (match) {
          if (pathnameArray[2] === 'edit') {
            dispatch({
              type: 'save',
              payload: {
                defaultKey: pathnameArray[3]
              }
            });
          } else {
            dispatch({
              type: 'save',
              payload: {
                defaultPersonKey: pathnameArray[3]
              }
            });
          }
          dispatch({
            type: 'save',
            payload: {
              avatar: `${process.env.apiUrl}/user/getUserHeadPicture?userName=${userName}`
            }
          });
          dispatch({
            type: 'getUserCommunityInfo',
            payload: { userName: encodeURIComponent(userName) }
          });

          if (current === '/personCenter/people/ask') {
            dispatch({
              type: 'getMyCommunityQuestion',
              payload: {
                operatorName: userInfo.UserName,
                pageSize: 10,
                pageStart: 1,
                userName: userName
              }
            });
          } else if (current === '/personCenter/people/answer') {
            dispatch({
              type: 'getMyCommunityAnswer',
              payload: {
                operatorName: userInfo.UserName,
                pageSize: 10,
                pageStart: 1,
                userName: userName
              }
            });
          } else if (current === '/personCenter/people/follow') {
            dispatch({
              type: 'getUserFolloweeInfo',
              payload: {
                operatorName: userInfo.UserName,
                pageSize: 10,
                pageStart: 1,
                userName: userName
              }
            });
          } else if (current === '/personCenter/people/fans') {
            dispatch({
              type: 'getUserFollowerInfo',
              payload: {
                operatorName: userInfo.UserName,
                pageSize: 10,
                pageStart: 1,
                userName: userName
              }
            });
          } else if (current === '/personCenter/people/followQuestion') {
            dispatch({
              type: 'getUserFollowedQuestion',
              payload: {
                operatorName: userInfo.UserName,
                pageSize: 10,
                pageStart: 1,
                userName: userName
              }
            });
          } else if (current === '/personCenter/edit/personInfo') {
            dispatch({ type: 'getUserInfo', payload: { userName: encodeURIComponent(userName) } });
            dispatch({ type: 'save', payload: { defaultKey: 'personInfo' } });
          } else if (current === '/personCenter/edit/avatar') {
            dispatch({ type: 'getUserHeadPicture', payload: { userName } });
            dispatch({ type: 'save', payload: { defaultKey: 'avatar' } });
          } else if (current === '/personCenter/edit/updatePassword') {
            dispatch({ type: 'save', payload: { defaultKey: 'updatePassword' } });
          }
        }
      });
    }
  }
};
