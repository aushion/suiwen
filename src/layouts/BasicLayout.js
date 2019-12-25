import React, { useState } from 'react';
import { Layout, BackTop } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './BasicLayout.less';
import SmartInput from '../components/SmartInput';
import querystring from 'querystring';
import RestTools from '../utils/RestTools';
const { Header, Footer, Content } = Layout;

function BasicLayout(props) {
  const query = querystring.parse(window.location.href.split('?')[1]);

  let { q = RestTools.getSession('q') } = query;
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');

  function handleClickEnterOrItem(value) {
    props.dispatch({ type: 'global/setQuestion', payload: { q: value } });
    value && router.push(`/result?q=${value}`);
    RestTools.setSession('q', value);
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
          <div className={styles.title} onClick={goHome}>
            <div className={styles.cn}>智能问答服务平台</div>
            <div className={styles.en}>Intelligent Question and Answer</div>
          </div>
          <div className={styles.inputWrap}>
            <SmartInput
              question={q}
              onClickEnter={handleClickEnterOrItem}
              onClickItem={handleClickEnterOrItem}
            />
          </div>
          <div className={styles.login}>
            您好! 欢迎 {username || '游客'}
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
        <ul className={styles.footer_wrap}>
          <li className={styles.footer_item}>
            <a href="http://cnki.net/gycnki/gycnki.htm" target="_blank" rel="noopener noreferrer">
              关于我们
            </a>
          </li>
          <li className={styles.footer_item}>
            <a
              href="http://www.cnki.net/other/gonggao/bqsm.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              版权公告
            </a>
          </li>
          <li className={styles.footer_item}>
            <a href="http://service.cnki.net/" target="_blank" rel="noopener noreferrer">
              客服中心
            </a>
          </li>
          <li className={styles.footer_item}>
            <a href="http://help.cnki.net/" target="_blank" rel="noopener noreferrer">
              在线咨询
            </a>
          </li>
          <li className={styles.footer_item}>
            <a href="http://ec.cnki.net/skwd/skwd.htm" target="_blank" rel="noopener noreferrer">
              购买知网卡
            </a>
          </li>
          <li className={styles.footer_item}>
            <a
              href="http://my.cnki.net/CNKIRecharging/czzx.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              充值中心
            </a>
          </li>
          <li className={styles.footer_item}>
            <a href="http://my.cnki.net/" target="_blank" rel="noopener noreferrer">
              我的CNKI
            </a>
          </li>
        </ul>
      </Footer>
      <BackTop />
    </div>
  );
}

function mapStateToProps(state) {
  return state.global;
}
export default connect(mapStateToProps)(BasicLayout);
