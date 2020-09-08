import helpService from '../../services/help';
import Cookies from 'js-cookie';
import RestTools from '../../utils/RestTools';

export default {
  namespace: 'help',
  state: {
    newHelpData: null,
    hotHelpData: null,
    domainList: [],
    domain: '全部',
    communityNode: sessionStorage.getItem('communityNode')
      ? JSON.parse(sessionStorage.getItem('communityNode'))
      : null,
    size: 10,
    index: 1,
    uid: JSON.parse(localStorage.getItem('userInfo'))
      ? JSON.parse(localStorage.getItem('userInfo')).UserName
      : Cookies.get('cnki_qa_uuid'),
    waitAnswer: []
  },

  effects: {
    *getNewQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getNewQuestions, {
        ...payload
      });
      const resultData = res.data;

      yield put({
        type: 'saveList',
        payload: { newHelpData: resultData.result, ...payload }
      });
    },

    *getHotQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getHotQuestions, payload);
      yield put({ type: 'saveList', payload: { newHelpData: res.data.result, ...payload } });
    },
    *getNeedHelpQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getNeedHelpQuestions, payload);
      yield put({ type: 'saveList', payload: { newHelpData: res.data.result, ...payload } });
    },
    *getUserCommunityInfo({ payload }, { call, put }) {
      const res = yield call(helpService.getUserCommunityInfo, {
        ...payload
      });
      const resultData = res.data;
      yield put({
        type: 'global/save',
        payload: {
          ...payload,
          userInfo: resultData.result
        }
      });
 
        sessionStorage.setItem('userCommunityInfo', JSON.stringify(resultData.result));
      
    },

    *getDomain({ payload }, { call, put }) {
      const res = yield call(helpService.getDomain, payload);
      const resultData = res.data;
      yield put({ type: 'saveDomainList', payload: { domainList: resultData.result } });
    },

    *getPersonDomain({ payload }, { call, put }) {
      const res = yield call(helpService.getPersonDomain, payload);
      const resultData = res.data;
      yield put({ type: 'saveDomainList', payload: { domainList: resultData.result } });
    },

    *getMyAnswerQuestions({ payload }, { call, put }) {
      const res = yield call(helpService.getMyAnswerQuestions, payload);
      yield put({ type: 'saveList', payload: { newHelpData: res.data.result, ...payload } });
    },
    *deleteQuestion({ payload }, { call, put }) {
      const res = yield call(helpService.deleteQuestion, payload);
      const uid = RestTools.getLocalStorage('userInfo')
        ? RestTools.getLocalStorage('userInfo').UserName
        : Cookies.get('cnki_qa_uuid');
      if (res.data.result) {
        yield put({
          type: 'getNewQuestions',
          payload: { domain: '', uid }
        });
      }
    },
    *waitAnswer({ payload }, { call, put }) {
      const res = yield call(helpService.waitAnswer, payload);
      if (res.data.code === 200) {
        yield put({
          type: 'saveList',
          payload: {
            waitAnswer: res.data.result
          }
        });
      }
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const match = pathname.match(/Help/i);
        if (match) {
          const userInfo = RestTools.getLocalStorage('userInfo')
            ? RestTools.getLocalStorage('userInfo')
            : null;

          const communityNode = sessionStorage.getItem('communityNode')
            ? JSON.parse(sessionStorage.getItem('communityNode'))
            : null;
          const current = pathname;
          window.document.title = `知网随问-社区`;

          dispatch({
            type: 'saveList',
            payload: { newHelpData: null, hotHelpData: null, index: 1, size: 10 }
          }); //重置状态
         

          dispatch({ type: 'getDomain' });
          userInfo &&
            dispatch({ type: 'getUserCommunityInfo', payload: { userName: userInfo.UserName } }); //获取社区个人信息
          if (current === '/help/newHelp') {
            dispatch({
              type: 'getNewQuestions',
              payload: {
                domain: communityNode
                  ? communityNode.secondNode
                    ? communityNode.secondNode.cId
                    : communityNode.firstNode.cId
                  : ''
              }
            });
          } else if (current === '/help/hotHelp') {
            dispatch({
              type: 'getHotQuestions',
              payload: {
                domain: communityNode
                  ? communityNode.secondNode
                    ? communityNode.secondNode.cId
                    : communityNode.firstNode.cId
                  : ''
              }
            });
          } else if (current === '/help/needHelp') {
            dispatch({
              type: 'getNeedHelpQuestions',
              payload: {
                domain: communityNode
                  ? communityNode.secondNode
                    ? communityNode.secondNode.cId
                    : communityNode.firstNode.cId
                  : ''
              }
            });
          }
        }
      });
    }
  },
  reducers: {
    saveList(state, { payload }) {
      return { ...state, ...payload };
    },
    saveDomainList(state, { payload }) {
      return { ...state, ...payload };
    },
    changeDomain(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
