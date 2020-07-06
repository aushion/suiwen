import Cookies from 'js-cookie';

export default {
  namespace: 'personCenter',
  state: {},
  effects: {},
  reducers: {},
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        
      });
    }
  }
};
