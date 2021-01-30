import React, { useState } from 'react';
import { Layout, Popover, Icon, Button, Avatar } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import { connect } from 'dva';
import RestTools from '../../utils/RestTools';
import request from '../../utils/request';
import LoginRegister from '../../components/LoginRegister';
import Chat, { Bubble, useMessages } from '@chatui/core';
import Weather from '../query/components/Weather';

import '@chatui/core/es/styles/index.less';

import '@chatui/core/dist/index.css';
import styles from './chat.less';
import logo from '../../assets/logo1.png';
import user from '../../assets/user.png';
import home from '../../assets/home.png';
import docBg from '../../assets/banner.png';

const { Footer } = Layout;

function ChatPage() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');

  const [showLoginAndRegister, setShowLoginAndRegister] = useState(false);
  const [isVisibleLogin, setShowLogin] = useState(false);
  const [isVisibleRegister, setShowRegister] = useState(false);

  function logout() {
    window.Ecp_LogoutOptr_my(0);
    localStorage.removeItem('userInfo');
    setUsername(null);
  }
  const initialMessages = [
    {
      type: 'text',
      content: { text: '你好，我是你的贴心小助手~, 你可以问我今天天气' }
      //   user: { avatar: '//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg' }
    }
  ];

  const { messages, appendMsg, setTyping } = useMessages(initialMessages);

  function handleSend(type, val) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right'
      });

      setTyping(true);

      //   setTimeout(() => {
      //     appendMsg({
      //       type: 'text',
      //       content: { text: 'Bala bala' }
      //     });
      //   }, 1000);
      sendMessage(val).then((res) => {
        if (res.data.code === 200) {
          const result = res.data.result;
          if (typeof result === 'string') {
            appendMsg({
              type: 'text',
              content: { text: result }
            });
          } else {
            appendMsg({
              type: 'node',
              content: { text: result.metaList[0].intentJson.results[0].fields }
            });
          }
        }
      });
    }
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;
    // 根据消息类型来渲染
    switch (type) {
      case 'text':
        return <Bubble content={content.text} />;
      case 'node':
        return (
          <Bubble type="image">
            <Weather
              style={{ boxShadow: 'none' }}
              showTitle={false}
              weatherData={{
                dataNode: [{ 城市: content.text.城市 }]
              }}
            />
          </Bubble>
        );
      default:
        return null;
    }
  }

  function sendMessage(msg) {
    return request.get('/getMultipleRound', {
      params: {
        q: msg,
        uId: 'fac9894e-826c-423c-a201-59c503150e5f',
        domain: '天气'
      }
    });
  }

  const btnGruop = (
    <div style={{ color: '#fff' }}>
      <div style={{ cursor: 'pointer', borderBottom: '1px solid #fff' }}>
        <span
          onClick={() => {
            setShowLoginAndRegister(true);
            setShowLogin(true);
            setShowRegister(false);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'green';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
          }}
          style={{
            display: 'block',
            padding: '10px 30px',
            color: '#fff',
            borderRadius: 4,
            margin: '10px 0'
          }}
        >
          <Icon type="login" style={{ marginRight: 6 }} />
          登录
        </span>
      </div>
      <div>
        <span
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'green';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
          }}
          onClick={() => {
            setShowLoginAndRegister(true);
            setShowLogin(false);
            setShowRegister(true);
          }}
          style={{
            display: 'block',
            padding: '10px 30px',
            color: '#fff',
            borderRadius: 4,
            margin: '10px 0'
          }}
        >
          <Icon type="form" style={{ marginRight: 6 }} />
          注册
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div
          className={styles.logo}
          onClick={() => {
            router.push('/');
            document.title = '知网随问';
          }}
        >
          <img src={logo} alt="logo" />
          <img src={home} alt="home" style={{ width: 31, height: 30, marginLeft: 16 }} />
        </div>
        <div style={{ height: 250, overflow: 'hidden' }}>
          <img src={docBg} alt="" style={{ width: '100%' }} />
        </div>

        <div className={styles.title}>多轮对话展示</div>

        <div className={styles.user}>
          {username ? (
            <div>
              {
                <Link
                  style={{ color: '#fff', marginLeft: 10 }}
                  to={`/personCenter/people/ask?userName=${
                    userInfo ? RestTools.encodeBase64(userInfo.UserName) : ''
                  }`}
                  target="_blank"
                >
                  <Avatar
                    size="small"
                    src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${
                      userInfo ? userInfo.UserName : ''
                    }`}
                  />
                  <span className={styles.links}>{RestTools.formatPhoneNumber(username)}</span>
                </Link>
              }
              <Button
                style={{
                  background: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  marginLeft: 10
                }}
                onClick={logout}
                // icon="logout"
              >
                退出
              </Button>
            </div>
          ) : (
            <Popover content={btnGruop} placement="bottom" trigger="click">
              <img src={user} alt="user" style={{ width: 30, height: 30 }} />
            </Popover>
          )}
        </div>
      </div>
      <div className={styles.main}>
        <Chat
          navbar={{ title: '多轮对话' }}
          messages={messages}
          renderMessageContent={renderMessageContent}
          onSend={handleSend}
        />
      </div>

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

      <LoginRegister
        visible={showLoginAndRegister}
        showLogin={isVisibleLogin}
        showRegister={isVisibleRegister}
        triggerCancel={() => {
          setShowLoginAndRegister(false);
        }}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.special,
    loading: state.loading.models.special
  };
}

export default connect(mapStateToProps)(ChatPage);
