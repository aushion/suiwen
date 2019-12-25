export default {
  namespace: 'global',
  state: {
    q: '',
  },
  reducers: {
    setQuestion(state, { payload }) {
      return { ...state, ...payload };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
