import queryString from 'querystring'
export default {
  namespace: 'result',
  state: [],
  reducers: {
    'delete'(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
  },
  effects: {
    *getAnswer({payload},{call,put}){
      yield call
    }
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/result') {
          console.log(queryString.parse(history.location.search.replace('?','')))
        }
      });
    },
  },
}