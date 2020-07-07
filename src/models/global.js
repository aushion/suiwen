import logo from '../assets/随问logo.png';
import Cookies from 'js-cookie';
// import RestTools from '../utils/RestTools';

export default {
  namespace: 'global',
  state: {
    q: '',
    title: {
      cnText: '知网智能问答服务平台',
      enText: 'Intelligent Question and Answer'
    },
    headerStyle: null,
    logo: logo,
    theme: '#0BB3FF',
    showLoginModal: false
  },
  subscriptions: {
    listenHistory({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        const Ecp_LoginStuts = Cookies.get('Ecp_LoginStuts');
        // const userInfo = RestTools.getLocalStorage('userInfo');
        if (pathname.includes('personCenter')) {

          if (!Ecp_LoginStuts) {
            dispatch({
              type: 'setShowLogin',
              payload: {
                showLoginModal: true
              }
            });
          }
        }
      });
    }
  },
  reducers: {
    setQuestion(state, { payload }) {
      return { ...state, ...payload };
    },
    setTitle(state, { payload }) {
      return { ...state, ...payload };
    },
    setShowLogin(state, { payload }) {
      return { ...state, ...payload };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
