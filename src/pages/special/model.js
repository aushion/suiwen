import { message } from 'antd';

message.config({
  top: 500,
  duration: 2,
  maxCount: 3
});
export default {
  namespace: 'special',
  state: {},

  effects: {},
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/special') {
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
