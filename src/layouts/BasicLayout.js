import React, { useState } from 'react';
import { Layout } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './BasicLayout.less';
import SmartInput from '../components/SmartInput';
import querystring from 'querystring'
import RestTools from '../utils/RestTools';
const { Header, Footer, Content } = Layout;

function BasicLayout(props) {
  const query = querystring.parse(window.location.search.replace('?',''))

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');

  function handleClickEnterOrItem(value) {
    props.dispatch({ type: 'global/setQuestion', payload: { q: value } });
    value && router.push(`/result?q=${value}`);
    RestTools.setSession('q',value)
  }

  function goHome() {
    props.dispatch({ type: 'global/setQuestion', payload: { q: '' } });
    router.push('/home');
  }

  function goLogin() {
    console.log('goLogin');
    window.Ecp_ShowLoginLayer2('-90px', '42px');
  }

  function logout() {
    localStorage.setItem('userInfo', null);
    setUsername(null);
  }

  return (
    <div className={styles.wrapper}>
      <Header className={styles.header}>
        <div className={styles.inputGroup}>
          <div onClick={goHome} className={styles.logo} />
          <div className={styles.inputWrap}>
            <SmartInput
              question={query.q}
              onClickEnter={handleClickEnterOrItem}
              onClickItem={handleClickEnterOrItem}
            />
          </div>
          <div className={styles.login}>
            您好! 欢迎您来到智能问答平台 {username || '游客'}
            {username ? null : (
              <button className={styles.login_btn} onClick={goLogin}>
                登录
              </button>
            )}
            {username ? null : (
              <button className={styles.register_btn}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="http://my.cnki.net/elibregister/commonRegister.aspx?autoreturn=1&returnurl=http://local.cnki.net:8000"
                >
                  注册
                </a>
              </button>
            )}
            {username ? (
              <button onClick={logout} className={styles.login_btn}>
                注销
              </button>
            ) : null}
          </div>
        </div>
      </Header>
      <Content className={styles.content}>{props.children}</Content>
      <Footer className={styles.footer}>
        <div>basicfooter</div>
      </Footer>
    </div>
  );
}

function mapStateToProps(state) {
  return state.global;
}
export default connect(mapStateToProps)(BasicLayout);
