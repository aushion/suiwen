import logo from '../assets/随问logo.png'
export default {
  namespace: 'global',
  state: {
    q: '',
    title: {
      cnText: '知网智能问答服务平台',
      enText: 'Intelligent Question and Answer'
    },
    headerStyle:null,
    logo: logo,
    theme: '#0BB3FF'

  },

  reducers: {
    setQuestion(state, { payload }) {
      return { ...state, ...payload };
    },
    setTitle(state, {payload}) {
      return {...state, ...payload}
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
