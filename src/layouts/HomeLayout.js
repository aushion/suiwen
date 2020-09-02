import React, { useState } from 'react';
import { Layout, Affix, Button, Avatar } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import SmartInput from '../components/SmartInput';
import FeedBack from '../components/FeedBack';
import Link from 'umi/link';
import styles from './HomeLayout.less';
import RestTools from '../utils/RestTools';
import LoginRegister from '../components/LoginRegister';
import MessageBox from '../components/MessageBox';

const { Header, Footer, Content } = Layout;

function HomeLayout(props) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.ShowName : '');
  const [visible, setVisible] = useState(false);
  const [showLoginAndRegister, setShowLoginAndRegister] = useState(false);
  const [isVisibleLogin, setShowLogin] = useState(false);
  const [isVisibleRegister, setShowRegister] = useState(false);

  const { dispatch, avatar } = props;
  function handleClickEnterOrItem(value) {
    const q = value.trim();
    dispatch({ type: 'global/setQuestion', payload: { q: q } });
    value && router.push(`/query?q=${encodeURIComponent(q)}`);
    RestTools.setSession('q', q);
  }

  function logout() {
    window.Ecp_LogoutOptr_my(0);
    localStorage.removeItem('userInfo');
    setUsername(null);
  }

  return (
    <div className={styles.wrapper}>
      <Header className={styles.header}>
        <div className={styles.logo1}></div>
        <div className={styles.logo2}></div>
        <div className={styles.login}>
          <span className={`${styles.tips} display_flex`}>
            {username ? (
              <>
                <span style={{ cursor: 'pointer', marginRight: 20 }}>
                  <MessageBox userName={username} />
                </span>
                <Link
                  style={{ color: '#fff', marginLeft: 10 }}
                  to={`/personCenter/people/ask?userName=${userInfo ? userInfo.UserName : ''}`}
                >
                  <Avatar
                    size="small"
                    src={
                      avatar ||
                      `${process.env.apiUrl}/user/getUserHeadPicture?userName=${
                        userInfo ? userInfo.UserName : ''
                      }`
                    }
                  />
                  <span className={styles.links}>{RestTools.formatPhoneNumber(username)}</span>
                </Link>
                <button onClick={logout} className={styles.login_btn}>
                  退出
                </button>
              </>
            ) : (
              '游客'
            )}
          </span>
          {username ? null : (
            <Button
              className={styles.login_btn}
              onClick={() => {
                setShowLoginAndRegister(true);
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              登录
            </Button>
          )}
          {username ? null : (
            <Button
              className={styles.register_btn}
              onClick={() => {
                setShowLoginAndRegister(true);
                setShowLogin(false);
                setShowRegister(true);
              }}
            >
              注册
            </Button>
          )}
        </div>

        <div className={styles.inputWrap}>
          <SmartInput
            needTip
            question={props.q}
            onClickEnter={handleClickEnterOrItem}
            onClickItem={handleClickEnterOrItem}
            themeColor={props.theme}
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
      <LoginRegister
        visible={showLoginAndRegister} //控制显隐
        showLogin={isVisibleLogin}
        showRegister={isVisibleRegister}
        triggerCancel={() => {
          setShowLoginAndRegister(false);
        }}
      />
      <Affix offsetBottom={50} style={{ position: 'absolute', right: 10 }}>
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
