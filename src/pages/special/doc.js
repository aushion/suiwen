import React, { useState, useEffect } from 'react';
import { Layout, Popover, Icon, Button, Avatar, Tabs, Row, Col } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';
import RestTools from '../../utils/RestTools';
import request from '../../utils/request';
import LoginRegister from '../../components/LoginRegister';
import logo from '../../assets/logo1.png';
import user from '../../assets/user.png';
import home from '../../assets/home.png';
import docBg from '../../assets/banner.png';
const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;
function Doc(props) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');
  const [subject, setSubject] = useState([]);
  const [showLoginAndRegister, setShowLoginAndRegister] = useState(false);
  const [isVisibleLogin, setShowLogin] = useState(false);
  const [isVisibleRegister, setShowRegister] = useState(false);

  useEffect(() => {
    request.get('/doc/getSubjectDocs').then((res) => {
      console.log('res', res);
      if (res.data.code === 200) {
        setSubject(res.data.result);
      }
    });
  }, []);

  function logout() {
    window.Ecp_LogoutOptr_my(0);
    localStorage.removeItem('userInfo');
    setUsername(null);
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
      <div style={{ borderBottom: '1px solid #fff' }}>
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
    <Layout className={styles.wrapper}>
      <Header className={styles.header}>
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
        <div style={{ height: 300 }}>
          <img src={docBg} alt="" />
        </div>

        <div className={styles.title}>文档撰写助手</div>
        <div className={styles.inputWrap}></div>

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
      </Header>
      <Layout className={styles.main}>
        <Content className={styles.hotQuestions}>
          <div className={styles.title}>
            <Tabs>
              {subject.map((item) =>
                item.subject ? (
                  <TabPane key={item.subject} tab={item.subject}>
                    <Row>
                      {item.dataList.length
                        ? item.dataList.map((current) => {
                            return (
                              <Col span={12}>
                                <div key={current.docId}>{current.docName}</div>
                              </Col>
                            );
                          })
                        : null}
                    </Row>
                  </TabPane>
                ) : null
              )}
            </Tabs>
          </div>
        </Content>
      </Layout>

      <Layout className={styles.main}>
        <Content className={styles.hotQuestions}>
          <div className={styles.title}>
            <div>热 门 问 题</div>
            {/* <div>Hot Issue</div> */}
          </div>
          <div className={styles.list}></div>
        </Content>
      </Layout>

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
    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    ...state.special,
    loading: state.loading.models.special
  };
}

export default connect(mapStateToProps)(Doc);
