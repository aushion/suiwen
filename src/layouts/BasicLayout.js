import React, { useState, useEffect } from 'react';
import { Layout, BackTop, Affix, Button, Avatar } from 'antd';
import router from 'umi/router';
import find from 'lodash/find';
import { connect } from 'dva';
import styles from './BasicLayout.less';
import Link from 'umi/link';
import SmartInput from '../components/SmartInput';
import querystring from 'querystring';
import FeedBack from '../components/FeedBack';
import logo from '../assets/logo1.png';
import LoginRegister from '../components/LoginRegister';
import MessageBox from '../components/MessageBox';
import AskModal from '../components/AskModal';
import feedback from '../assets/feedback.png';
import RestTools from '../utils/RestTools';
const { Header, Footer, Content } = Layout;

function BasicLayout(props) {
  const query = querystring.parse(window.location.href.split('?')[1]);

  let { q = sessionStorage.getItem('q'), topic = '', topicName = '' } = query;

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const topicData =
    JSON.parse(sessionStorage.getItem('topicData')) ||
    JSON.parse(localStorage.getItem('topicData'));
  const [username, setUsername] = useState(userInfo ? userInfo.ShowName : '');
  const [visible, setVisible] = useState(false); //反馈弹窗
  const [askModalVisible, setAskModalVisible] = useState(false); //提问弹窗
  const [showLoginAndRegister, setShowLoginAndRegister] = useState(false); //登陆注册弹窗
  const [isVisibleLogin, setShowLogin] = useState(false); //默认是否显示登录
  const [isVisibleRegister, setShowRegister] = useState(false); //默认是否显示注册
  const currentTopic = find(topicData, { info: { topic: topic } });

  let { title, dispatch, theme, showLoginModal, avatar } = props;
  const { topicId, info, name } = currentTopic || {};

  const themeColor = info ? info.themeColor : theme;

  useEffect(() => {
    setShowLogin(showLoginModal);
  }, [showLoginModal]);

  function handleClickEnterOrItem(value) {
    const q = value.trim();
    dispatch({ type: 'global/setQuestion', payload: { q } });
    if (q && q.trim()) {
      //如果topic有值判断是专题
      if (topic) {
        //如果是法律专题则单独处理
        if (topic === 'law') {
          router.replace(
            `/query/law?q=${encodeURIComponent(q)}&topic=${topic}&topicName=${encodeURIComponent(
              topicName
            )}`
          );
        } else {
          router.replace(
            `/query?q=${encodeURIComponent(q)}&topic=${topic}&topicName=${encodeURIComponent(
              topicName
            )}`
          );
        }
      } else {
        //不是专题的话就直接进入普通详情页
        router.replace(`/query?q=${encodeURIComponent(q)}`);
      }
      RestTools.setSession('q', q);
    }
  }

  function goHomeByDomain() {
    if (topicId) {
      router.push('/special?topicId=' + topicId);
    } else {
      router.push('/');
      window.document.title = '知网随问';
    }
  }

  function logout() {
    window.Ecp_LogoutOptr_my(0);
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userCommunityInfo');
    dispatch({
      type: 'global/save',
      payload: {
        userInfo: null
      }
    });
    setUsername(null);
    if (window.location.pathname.includes('personCenter')) {
      router.push('/');
    }
  }

  return (
    <div className={styles.wrapper}>
      <Header className={styles.header} style={{ background: themeColor }}>
        <div className={styles.inputGroup}>
          <div onClick={goHomeByDomain.bind(this, title)} className={styles.logo}>
            <img src={logo} alt="logo" />
            {name ? <span style={{ fontSize: 20, paddingLeft: 5 }}>{name}</span> : null}
          </div>

          <div className={`${styles.inputWrap} display_flex`}>
            <SmartInput
              question={q}
              needTip
              onClickEnter={handleClickEnterOrItem}
              onClickItem={handleClickEnterOrItem}
              themeColor={themeColor}
            />

            {/* <Button
              className={styles.askBtn}
              type="link"
              onClick={() => {
                setAskModalVisible(true);
              }}
            >
              社区提问
            </Button> */}
          </div>
          <div className={styles.login}>
            {/* <a href="http://qa.cnki.net/web" style={{color: '#fac500',marginRight: 20}}>回到旧版</a> */}
            <span className={styles.tips}>
              您好，
              {username ? (
                <>
                  <span style={{ cursor: 'pointer', marginRight: 20 }}>
                    <MessageBox userName={username} />
                  </span>
                  <Link
                    style={{ color: '#fff', marginLeft: 10 }}
                    to={`/personCenter/people/ask?userName=${userInfo ? userInfo.UserName : ''}`}
                    target="_blank"
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
              ) : null}
            </span>
            {username ? null : (
              <Button
                className={styles.login_btn}
                onClick={() => {
                  setShowLoginAndRegister(true);
                  setShowLogin(true);
                  setShowRegister(false);
                }}
                // href="https://login.cnki.net/login/?platform=kns&ForceReLogin=1&ReturnURL=http://qa.cnki.net/sw.web"
                // href={`https://login.cnki.net/login/?platform=kns&ForceReLogin=1&ReturnURL=${encodeURIComponent(window.location.href)}`}
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
                // href={`http://my.cnki.net/elibregister/commonRegister.aspx?autoreturn=1&returnurl=${encodeURIComponent(window.location.href)}`}
              >
                注册
              </Button>
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
      <LoginRegister
        visible={showLoginAndRegister}
        showLogin={isVisibleLogin}
        showRegister={isVisibleRegister}
        triggerCancel={() => {
          setShowLoginAndRegister(false);
          setShowRegister(false);
          setShowRegister(false);
        }}
      />
      <AskModal
        visible={askModalVisible}
        onTriggerCancel={() => {
          setAskModalVisible(false);
        }}
        q=""
      />
      <Affix offsetBottom={100}>
      <div
          className={styles.feedback}
          onClick={() => {
            setVisible(true);
          }}
        >
          <img src={feedback} alt="反馈" />
          <div className={styles.buttonTxt}>反馈</div>
        </div>
      </Affix>
      <BackTop />
    </div>
  );
}

function mapStateToProps(state) {
  return state.global;
}
export default connect(mapStateToProps)(BasicLayout);
