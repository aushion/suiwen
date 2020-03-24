import React, { useState } from 'react';
import { Layout, BackTop, Affix, Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './BasicLayout.less';
// import Cookies from 'js-cookie';
import SmartInput from '../components/SmartInput';
import querystring from 'querystring';
import FeedBack from '../components/FeedBack';

import RestTools from '../utils/RestTools';
const { Header, Footer, Content } = Layout;

function BasicLayout(props) {
  const query = querystring.parse(window.location.href.split('?')[1]);

  let { q = RestTools.getSession('q'), topic = '' } = query;
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');
  const [visible, setVisible] = useState(false);
  const { title, headerStyle, dispatch } = props;
  function handleClickEnterOrItem(value) {
    const q = value.trim();

    dispatch({ type: 'global/setQuestion', payload: { q } });
    value && topic ? router.push(`/result?q=${encodeURIComponent(q)}&topic=${topic}`) : router.push(`/result?q=${encodeURIComponent(q)}`);
    RestTools.setSession('q', q);
  }

  function goHome() {
    router.push('/home');
  }

  function goHomeByDomain(title) {
    const topic = {
      医学: '4',
      农业: '5'
    };
    router.push('/special?topicId=' + topic[title.cnText]);
  }

  function logout() {
    // Cookies.remove('Ecp_LoginStuts',{expires: -1, path: '/', domain: '.cnki.net' })
    // Cookies.remove("c_m_expire", { expires: -1, path: '/', domain: '.cnki.net' });
    // Cookies.remove("c_m_LinID", { expires: -1, path: '/', domain: '.cnki.net' });
    // Cookies.remove("Ecp_session", { expires: -1 });
    // Cookies.remove("LID",  { expires: -1, path: '/', domain: '.cnki.net' });
    window.Ecp_LogoutOptr_my(0);
    localStorage.setItem('userInfo', null);
    setUsername(null);
  }

  return (
    <div className={styles.wrapper}>
      <Header className={styles.header} style={headerStyle ? headerStyle : null}>
        <div className={styles.inputGroup}>
          <div onClick={goHome} className={styles.logo} />
          <div className={styles.title} onClick={goHomeByDomain.bind(this, title)}>
            <div className={styles.cn}>{title.cnText}</div>
            <div className={styles.en}>{title.enText}</div>
          </div>
          <div className={styles.inputWrap}>
            <SmartInput
              question={q}
              needTip
              onClickEnter={handleClickEnterOrItem}
              onClickItem={handleClickEnterOrItem}
            />
          </div>
          <div className={styles.login}>
            <span className={styles.tips}>您好! {username || '游客'}</span>
            {username ? null : (
              <a
                className={styles.login_btn}
                // href="https://login.cnki.net/login/?platform=kns&ForceReLogin=1&ReturnURL=http://qa.cnki.net/sw.web"
                href={`https://login.cnki.net/login/?platform=kns&ForceReLogin=1&ReturnURL=${process.env.returnUrl}`}
              >
                登录
              </a>
            )}
            {username ? null : (
              <a
                className={styles.register_btn}
                href="http://my.cnki.net/elibregister/commonRegister.aspx?autoreturn=1&returnurl=http://qa.cnki.net/sw.web"
              >
                注册
              </a>
            )}
            {username ? (
              <button onClick={logout} className={styles.login_btn}>
                退出
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
      <FeedBack visible={visible} triggerCancel={() => setVisible(false)} />
      <Affix offsetBottom={10} style={{ position: 'absolute', right: 10 }}>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          反馈
        </Button>
      </Affix>
      <BackTop />
    </div>
  );
}

function mapStateToProps(state) {
  return state.global;
}
export default connect(mapStateToProps)(BasicLayout);
