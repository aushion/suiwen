import { getDomainQuestions, getTopicQuestions, getHotHelpList } from './service/home';
import RestTools from '../../utils/RestTools';

export default {
  namespace: 'home',
  state: {
    newHelpList: [],
    skillExamples: [],
    specialQuestions: [],
    topicTheme: null
  },

  effects: {
    *getDomainQuestions({ payload }, { call, put }) {
      const { data } = yield call(getDomainQuestions, payload);
      if (data.code === 200) {
        let newArray = data.result.map((item) => {
          return {
            name: Object.keys(item)[0],
            data: Object.values(item)[0]
          };
        });
        yield put({
          type: 'save',
          payload: {
            skillExamples: newArray
          }
        });
        RestTools.setSession('skillExamples', newArray);
      }
    },

    *getTopicQuestions({ payload }, { call, put }) {
      const { data } = yield call(getTopicQuestions);
      const urlPrefix = process.env.apiUrl;

      const topicData = data.result.map(item => {
        return  {
          ...item,
          logoUrl: `${urlPrefix}/getTopicLogo?topicId=${item.data[0].topicId}`,
          thumbUrl: `${urlPrefix}/getTopicHomePicture?topicId=${item.data[0].topicId}`,
          topicId: item.data[0].topicId,

        }
      })
      if (data.code === 200) {
        yield put({
          type: 'save',
          payload: {
            specialQuestions: topicData
          }
        });
      }
      RestTools.setSession('topicData', topicData)
    },

    *getHotHelpList({ payload }, { call, put }) {
      const { data } = yield call(getHotHelpList);
      if (data.length) {
        yield put({
          type: 'save',
          payload: {
            newHelpList: data
          }
        });
      }
    }
  },

  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const skillExamples = RestTools.getSession('skillExamples');
        if (pathname === '/home') {
          dispatch({ type: 'global/setQuestion', payload: { q: '' } });
          if (!skillExamples) {
            dispatch({ type: 'getDomainQuestions' });
          } else {
            dispatch({
              type: 'save',
              payload: {
                skillExamples
              }
            });
          }
          dispatch({ type: 'getTopicQuestions' });
          dispatch({ type: 'getHotHelpList' });
        }
      });
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
