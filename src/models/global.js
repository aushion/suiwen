export default {
  namespace: 'global',
  state: {
    question: '',
  },
  reducers: {
    setQuestion(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
