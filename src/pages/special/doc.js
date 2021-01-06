import React, { useState } from 'react';
import {
  Layout,
  Popover,
  Icon,
  Button,
  Spin,
  Tabs,
  Avatar,
  Row,
  List,
  Col,
  Card,
  Input
} from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './doc.less';
import RestTools from '../../utils/RestTools';
import LoginRegister from '../../components/LoginRegister';
import logo from '../../assets/logo1.png';
import user from '../../assets/user.png';
import home from '../../assets/home.png';
import docBg from '../../assets/banner.png';
import fire from '../../assets/火.png';

const { Search } = Input;
const { Footer } = Layout;
const { TabPane } = Tabs;
function Doc({ shareDoc, hotDoc, dispatch, loading }) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');

  const [showLoginAndRegister, setShowLoginAndRegister] = useState(false);
  const [isVisibleLogin, setShowLogin] = useState(false);
  const [isVisibleRegister, setShowRegister] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const docExamples = hotDoc;
  const subject = shareDoc;

  function logout() {
    window.Ecp_LogoutOptr_my(0);
    localStorage.removeItem('userInfo');
    setUsername(null);
  }

  function handleClick(docId) {
    RestTools.clickDoc(docId);
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

        <div className={styles.title}>
          随问知识文库
          <div
            className={styles.wrap}
            onClick={() => {
              router.push('/doc/outlineConfig');
            }}
          >
            <Icon type="edit" />

            <span className="x">新</span>
            <span className="j">建</span>
            <span className="w">文</span>
            <span className="d">档</span>
          </div>
        </div>

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
        <Row gutter={36}>
          <Spin spinning={loading}>
            <Col span={16}>
              <Card
                bodyStyle={{ paddingTop: 0 }}
                bordered={false}
                title="共享文档"
                extra={
                  <Search
                    autoComplete="one-time-code"
                    onSearch={(value) => {
                      setSearchWord(value);
                      dispatch({
                        type: 'special/getShareDoc',
                        payload: {
                          searchWord: value
                        }
                      });
                    }}
                    placeholder="请输入关键字搜索"
                  />
                }
              >
                {subject ? (
                  <Tabs tabBarStyle={{ fontSize: 24, color: '#333' }} size="large">
                    {subject.map((item) => (
                      <TabPane tab={item.subject} key={item.subject}>
                        <List
                          dataSource={item.dataList}
                          grid={{ gutter: 14, column: 2 }}
                          pagination={{
                            current: item.pageNum,
                            pageSize: item.pageCount,
                            total: item.total,
                            hideOnSinglePage: true,
                            onChange: (page) => {
                              dispatch({
                                type: 'special/getShareDoc',
                                payload: {
                                  pageStart: page,
                                  searchWord,
                                  subject: item.subject
                                }
                              });
                            }
                          }}
                          renderItem={(item) => {
                            return (
                              <List.Item>
                                <div
                                  className={styles.docItem}
                                  onClick={handleClick.bind(this, item.docId)}
                                >
                                  <Link
                                    to={`/doc/outlineConfigPreview?docId=${item.docId}`}
                                    className={styles.text}
                                  >
                                    {item.docName}
                                  </Link>
                                </div>
                              </List.Item>
                            );
                          }}
                        />
                      </TabPane>
                    ))}
                  </Tabs>
                ) : null}
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false} title="热榜">
                <div className={styles.hot}>
                  {docExamples
                    ? docExamples.map((item, index) => (
                        <div
                          className={styles.docItem}
                          key={item.docId}
                          onClick={handleClick.bind(this, item.docId)}
                        >
                          <Link
                            to={`/doc/outlineConfigPreview?docId=${item.docId}`}
                            className={styles.text}
                          >
                            {item.docName}
                            {index < 3 ? (
                              <img
                                style={{ width: 12, margin: '-8px 0 0 4px' }}
                                src={fire}
                                alt="hot"
                              />
                            ) : null}
                          </Link>
                        </div>
                      ))
                    : null}
                </div>
              </Card>
            </Col>
          </Spin>
        </Row>
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

export default connect(mapStateToProps)(Doc);
