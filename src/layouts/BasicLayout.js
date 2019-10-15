import React, { useState } from 'react';
import { Layout } from 'antd';
import router from 'umi/router'
import styles from './BasicLayout.less';
import SmartInput from '../components/SmartInput';
import { connect } from 'dva';
const { Header, Footer, Content } = Layout;

function BasicLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');
  function handleClickEnter(value) {
    console.log(value);
  }

  function handleClickItem(value) {
    console.log(value);
  }

  function goHome() {
    router.push('/home')
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
          <div onClick={goHome} className={styles.logo}></div>
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
          <div className={styles.inputWrap}>
            <SmartInput
              question={props.question}
              onClickEnter={handleClickEnter}
              onClickItem={handleClickItem}
            ></SmartInput>
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
