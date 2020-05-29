import React, { useState, useEffect } from 'react';
import { Layout, Menu, List, Carousel, Spin, Popover, Icon, Button } from 'antd';
import router from 'umi/router';
import find from 'lodash/find';
import SmartInput from '../../components/SmartInput';
import querystring from 'querystring';
import { connect } from 'dva';
import styles from './index.less';
import RestTools from 'Utils/RestTools';
import FeedBack from '../../components/FeedBack';
import logo from '../../assets/logo1.png';
import topicLogo from '../../assets/topicLogo.png';
import user from '../../assets/user.png';
import home from '../../assets/home.png';

const { SubMenu } = Menu;
const { Header, Sider, Content, Footer } = Layout;
function Special(props) {
  const { topics, initialKey, hotQuestions, imgData, dispatch, loading } = props;
  const { topicId, q } = querystring.parse(window.location.href.split('?')[1]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');
  const [menuKey, setMenuKey] = useState(initialKey);
  const [menuDataIndex, setMenuDataIndex] = useState(-1);
  const [hotDataIndex, setHotDataIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const topicData = RestTools.getSession('topicData') || RestTools.getLocalStorage('topicData');
  const topicInfo = find(topicData, { topicId: topicId });

  const {
    name,
    info: { topic, themeColor },
    logoUrl
  } = topicInfo;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setMenuKey(initialKey);
    return () => {};
  }, [initialKey]);
  function handleClick(e) {
    setMenuKey(e.key);
  }

  function gotoResult(qId, question) {
    dispatch({
      type: 'global/setQuestion',
      payload: {
        q: question,
        logo: logoUrl
      }
    });
    router.push(`/query?topic=${topic}&q=${encodeURIComponent(question)}`);
    RestTools.setSession('q', question);
    RestTools.setStorageInput(RestTools.HISTORYKEY, question);
  }

  function handleClickEnterOrItem(value) {
    const q = value.trim();
    dispatch({ type: 'global/setQuestion', payload: { q: q } });
    q && router.push(`/query?topic=${topic}&q=${encodeURIComponent(q)}`);
    RestTools.setSession('q', q);
  }

  function logout() {
    window.Ecp_LogoutOptr_my(0);
    localStorage.setItem('userInfo', null);
    setUsername(null);
  }

  const btnGruop = (
    <div style={{ color: '#fff' }}>
      <div style={{ cursor: 'pointer', borderBottom: '1px solid #fff' }}>
        <a
          href={`https://login.cnki.net/login/?platform=kns&ForceReLogin=1&ReturnURL=${encodeURIComponent(
            window.location.href
          )}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
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
        </a>
      </div>
      <div style={{ borderBottom: '1px solid #fff' }}>
        <a
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '';
          }}
          href={`http://my.cnki.net/elibregister/commonRegister.aspx?autoreturn=1&returnurl=${encodeURIComponent(
            window.location.href
          )}`}
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
        </a>
      </div>
      <div
        style={{ padding: '10px 30px', cursor: 'pointer', borderRadius: 4, margin: '10px 0' }}
        onClick={() => {
          setVisible(true);
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = themeColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '';
        }}
      >
        <Icon type="message" style={{ marginRight: 6 }} />
        反馈
      </div>
    </div>
  );

  return (
    <Spin spinning={loading}>
      <Layout className={styles.wrapper}>
        <Header className={styles.header}>
          <div
            className={styles.logo}
            onClick={() => {
              router.push('/');
            }}
          >
            <img src={logo} alt="logo" />
            <img src={home} alt="home" style={{ width: 31, height: 30, marginLeft: 16 }} />
          </div>
          <Carousel autoplay dots={false}>
            {imgData.length
              ? imgData.map((item, index) => (
                  <div className={styles.imgWrap} key={index}>
                    <img src={item} alt="" />
                  </div>
                ))
              : null}
          </Carousel>

          <div className={styles.title}>
            <img src={topicLogo} alt={name} style={{ width: '120px', marginRight: 20 }} />
            {`${name}专题`}
          </div>
          <div className={styles.inputWrap}>
            <SmartInput
              // needTip
              question={q || ''}
              themeColor={themeColor}
              onClickEnter={handleClickEnterOrItem}
              onClickItem={handleClickEnterOrItem}
            />
          </div>

          <div className={styles.user}>
            {username ? (
              <div>
                {`您好！ ${username}`}
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
            <div>概念</div>
          </div>
          </Content>
          
        </Layout>

        <Layout className={styles.main}>
          <Sider className={styles.menu} theme="light">
            <div>
              {topics.length && initialKey ? (
                <Menu
                  theme="light"
                  mode="inline"
                  style={{ color: '#606164', fontWeight: 'bold' }}
                  onClick={handleClick}
                  defaultOpenKeys={[topics[0].name]}
                  defaultSelectedKeys={[initialKey]}
                >
                  {topics.map((item) => {
                    return item.children ? (
                      <SubMenu key={item.name} title={item.name}>
                        {item.children.map((child) => {
                          return <Menu.Item key={item.name + child.name}>{child.name}</Menu.Item>;
                        })}
                      </SubMenu>
                    ) : (
                      <Menu.Item key={item.name}>{item.name}</Menu.Item>
                    );
                  })}
                </Menu>
              ) : null}
            </div>
          </Sider>

          <Content className={styles.content}>
            <div className={styles.listWrap}>
              {topics.length
                ? topics.map((item) => {
                    return item.children ? (
                      item.children.map((child) => {
                        return (
                          <div key={child.id} hidden={menuKey !== item.name + child.name}>
                            <List
                              header={null}
                              footer={null}
                              bordered={false}
                              dataSource={child.data}
                              renderItem={(item, index) => (
                                <List.Item
                                  key={item.qId}
                                  onMouseLeave={() => {
                                    setMenuDataIndex(-1);
                                  }}
                                  onMouseEnter={() => {
                                    setMenuDataIndex(index);
                                  }}
                                  style={
                                    menuDataIndex === index
                                      ? { color: '#fff', background: themeColor }
                                      : null
                                  }
                                  onClick={gotoResult.bind(this, item.qId, item.question)}
                                >
                                  <div className={styles.question_item}>{item.question}</div>
                                </List.Item>
                              )}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <div key={item.id} hidden={menuKey !== item.name}>
                        <List
                          header={null}
                          footer={null}
                          bordered={false}
                          dataSource={item.data}
                          renderItem={(item, index) => (
                            <List.Item
                              onMouseLeave={() => {
                                setMenuDataIndex(-1);
                              }}
                              onMouseEnter={() => {
                                setMenuDataIndex(index);
                              }}
                              style={
                                menuDataIndex === index
                                  ? { color: '#fff', background: themeColor }
                                  : null
                              }
                              onClick={gotoResult.bind(this, item.qId, item.question)}
                            >
                              <div className={styles.question_item}>{item.question}</div>
                            </List.Item>
                          )}
                        />
                      </div>
                    );
                  })
                : null}
            </div>
          </Content>
        </Layout>
        <Layout className={styles.main}>
          <Content className={styles.hotQuestions}>
            <div className={styles.title}>
              <div>热 门 问 题</div>
              {/* <div>Hot Issue</div> */}
            </div>
            <div className={styles.list}>
              {hotQuestions && hotQuestions.dataList.length ? (
                <List
                  grid={{ gutter: 64, column: 2 }}
                  dataSource={hotQuestions.dataList}
                  header={null}
                  footer={null}
                  renderItem={(item, index) => (
                    <List.Item
                      onMouseLeave={() => {
                        setHotDataIndex(-1);
                      }}
                      onMouseEnter={() => {
                        setHotDataIndex(index);
                      }}
                      style={
                        hotDataIndex === index ? { color: '#fff', background: themeColor } : null
                      }
                      onClick={gotoResult.bind(this, item.qId, item.question)}
                    >
                      {item.question}
                    </List.Item>
                  )}
                />
              ) : null}
            </div>
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
        <FeedBack visible={visible} triggerCancel={() => setVisible(false)} />
      </Layout>
    </Spin>
  );
}

function mapStateToProps(state) {
  return {
    ...state.special,
    loading: state.loading.models.special
  };
}

export default connect(mapStateToProps)(Special);
