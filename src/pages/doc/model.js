import {
  addUserDoc,
  delContent,
  delDocRoute,
  delRouteQuestion,
  delUserDoc,
  editUserDoc,
  generateDoc,
  getRouteContent,
  getUserDoc,
  queryForRoute,
  queryForRouteQuestion,
  refreshDocContent,
  saveRoute,
  saveRouteQuestion,

} from './service/index';
const Doc = {
  namespace: 'Doc',
  state: {
    //提纲目录
    outlineData : [],
    //文档内容
    docContentData : [],

  },
  effects: {
    *addUserDoc({ payload }, { call, put }) {
      const response = yield call(addUserDoc, payload);
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
        console.log("outlineData",data.result);
        yield put({
          type: 'save',
          payload: {
            outlineData: data.result,      
          },
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
            docContentData: data.result,      
          },
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

  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
export default Doc;
