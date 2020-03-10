import React, { useState } from 'react';
import { Layout, Affix, Button } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import SmartInput from '../components/SmartInput';
import FeedBack from '../components/FeedBack';
import Cookies from 'js-cookie';
import styles from './HomeLayout.less';
import RestTools from '../utils/RestTools';

const { Header, Footer, Content } = Layout;

function HomeLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');
  const [visible, setVisible] = useState(false);
  function handleClickEnterOrItem(value) {
    props.dispatch({ type: 'global/setQuestion', payload: { q: value.trim() } });
    value && router.push(`/result?q=${value.trim()}`);
    RestTools.setSession('q', value);
  }

  // function goLogin() {
  // window.Ecp_ShowLoginLayer2('-90px', '42px');
  // window.Ecp_ShowLoginLayer2('-10px','120px')
  // request({url: `http://132.cnki.net/TopLogin/api/loginapi/Login?callback=jQuery111307605174265725956_1577339722053&userName=chenaosheng&pwd=cnki12399&isAutoLogin=false&p=0&_=1577339722059`,method: 'get'})
  // }

  function logout() {
    Cookies.remove('Ecp_LoginStuts',{expires: -1, path: '/', domain: '.cnki.net' })
    Cookies.remove("c_m_expire", { expires: -1, path: '/', domain: '.cnki.net' });
		Cookies.remove("c_m_LinID", { expires: -1, path: '/', domain: '.cnki.net' });
		Cookies.remove("Ecp_session", { expires: -1 });
		Cookies.remove("LID",  { expires: -1, path: '/', domain: '.cnki.net' });
    localStorage.setItem('userInfo', null);
    setUsername(null);
  }

  return (
    <div className={styles.wrapper}>
      <Header className={styles.header}>
        <div className={styles.logo1}></div>
        <div className={styles.logo2}></div>
        <div className={styles.login}>
          您好! 欢迎 {username || '游客'}
          {username ? null : (
            <a
              className={styles.login_btn}
              // href="https://login.cnki.net/login/?platform=kns&ForceReLogin=1&ReturnURL=http://qa.cnki.net/sw.web"
              href={`https://login.cnki.net/login/?platform=kns&ForceReLogin=1&ReturnURL=http://local.cnki.net:8002`}
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
              注销
            </button>
          ) : null}
        </div>

        <div className={styles.inputWrap}>
          <SmartInput
            needTip
            question={props.q}
            onClickEnter={handleClickEnterOrItem}
            onClickItem={handleClickEnterOrItem}
          />
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
      <Affix offsetBottom={10} style={{ position: 'absolute', right: 10,}}>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          反馈
        </Button>
      </Affix>
    </div>
  );
}
function mapStateToProps(state) {
  return { ...state.global };
}

export default connect(mapStateToProps)(HomeLayout);
