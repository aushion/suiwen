import {
  addUserDoc,
  delContent,
  delDocRoute,
  delRouteQuestion,
  delUserDoc,
  editUserDoc,
  generateDoc,
  getDocContent,
  getRouteTemplate,
  getTemplateList,
  getRouteContent,
  getUserDoc,
  queryForRoute,
  queryForRouteQuestion,
  refreshDocContent,
  saveRoute,
  saveRouteQuestion,
  chooseTemplateRoute,
  getQuestionTemplate,
  getDocClassify,
  getDocInfo,
  getContentTaskStatus,
} from './service/index';
const Doc = {
  namespace: 'Doc',
  state: {
    //提纲目录
    outlineData: [],
    //文档内容
    docContentData: [],
    //文档模版
    docTemplateData: [],
    //文档标签
    docClassifyData: [],
  },
  effects: {
    *addUserDoc({ payload }, { call, put }) {
      const response = yield call(addUserDoc, payload);
      return response.data;
    },

    *chooseTemplateRoute({ payload }, { call, put }) {
      const response = yield call(chooseTemplateRoute, payload);
      return response.data;
    },

    *delContent({ payload }, { call, put }) {
      const response = yield call(delContent, payload);
      return response.data;
    },

    *delDocRoute({ payload }, { call, put }) {
      const response = yield call(delDocRoute, payload);
      return response.data;
    },

    *delRouteQuestion({ payload }, { call, put }) {
      const response = yield call(delRouteQuestion, payload);
      return response.data;
    },

    *delUserDoc({ payload }, { call, put }) {
      const response = yield call(delUserDoc, payload);
      return response.data;
    },

    *editUserDoc({ payload }, { call, put }) {
      const response = yield call(editUserDoc, payload);
      return response.data;
    },

    *generateDoc({ payload }, { call, put }) {
      const response = yield call(generateDoc, payload);
      return response.data;
    },

    *getDocContent({ payload }, { call, put }) {
      const response = yield call(getDocContent, payload);
      let data = response.data;
      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            docContentData: data.result
          }
        });
      }

      return data;
    },

    *getRouteTemplate({ payload }, { call, put }) {
      const response = yield call(getRouteTemplate, payload);
      return response.data;
    },

    *getTemplateList({ payload }, { call, put }) {
      const response = yield call(getTemplateList, payload);
      let data = response.data;
      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            docTemplateData: data.result
          }
        });
      }

      return data;
    },

    *getRouteContent({ payload }, { call, put }) {
      const response = yield call(getRouteContent, payload);
      return response.data;
    },

    *getUserDoc({ payload }, { call, put }) {
      const response = yield call(getUserDoc, payload);
      return response.data;
    },

    *queryForRoute({ payload }, { call, put }) {
      const response = yield call(queryForRoute, payload);
      let data = response.data;
      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            outlineData: data.result
          }
        });
      }

      return data;
    },

    *queryForRouteQuestion({ payload }, { call, put }) {
      const response = yield call(queryForRouteQuestion, payload);
      return response.data;
    },

    *refreshDocContent({ payload }, { call, put }) {
      const response = yield call(refreshDocContent, payload);
      let data = response.data;
      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            docContentData: data.result
          }
        });
      }

      return data;
    },

    *saveRoute({ payload }, { call, put }) {
      const response = yield call(saveRoute, payload);
      return response.data;
    },

    *saveRouteQuestion({ payload }, { call, put }) {
      const response = yield call(saveRouteQuestion, payload);
      return response.data;
    },

    *getQuestionTemplate({ payload }, { call, put }) {
      const response = yield call(getQuestionTemplate, payload);
      let data = response.data;
      return data;
    },

    *getDocClassify({ payload }, { call, put }) {
      const response = yield call(getDocClassify, payload);
      let data = response.data;
      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            docClassifyData: data.result
          }
        });
      }

      return data;
    },

    *getDocInfo({ payload }, { call, put }) {
      const response = yield call(getDocInfo, payload);
      let data = response.data;
      return data;
    },

    *getContentTaskStatus({ payload }, { call, put }) {
      const response = yield call(getContentTaskStatus, payload);
      let data = response.data;
      return data;
    },
    
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  },

  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const match = pathname.match(/Doc/i);
        const userInfo = localStorage.getItem('userInfo')
          ? JSON.parse(localStorage.getItem('userInfo'))
          : null;
        if (match && userInfo) {
          window.document.title = `文档辅助生成`;
        }
      });
    }
  }
};

export default Doc;
