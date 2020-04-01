import React, { useState, useEffect } from 'react';
import { Layout, Menu, List, Carousel, Skeleton,  } from 'antd';
import router from 'umi/router';
import find from 'lodash/find';
import SmartInput from '../../components/SmartInput';
import querystring from 'querystring';
import { connect } from 'dva';
import styles from './index.less';
import RestTools from 'Utils/RestTools';
import logo from '../../assets/随问logo.png'

const { SubMenu } = Menu;
const { Header, Sider, Content , Footer} = Layout;
function Special(props) {
  const {
    topics,
    initialKey,
    hotQuestions,
    imgData,
    dispatch,
    fetchMenu,
    fetchHotQuestions
  } = props;
  const { topicId } = querystring.parse(window.location.href.split('?')[1]);
  const [menuKey, setMenuKey] = useState(initialKey);
  const [menuDataIndex, setMenuDataIndex] = useState(-1);
  const [hotDataIndex, setHotDataIndex] = useState(-1);
  const topicData = RestTools.getSession('topicData');
  const topicInfo = find(topicData,{topicId: topicId});

  const {name ,info: {topic, themeColor},logoUrl} = topicInfo
 

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
    router.push(`/result?topic=${topic}&q=${encodeURIComponent(question)}`);
    RestTools.setSession('q', question);
    RestTools.setStorageInput(RestTools.HISTORYKEY, question);
  }

  function handleClickEnterOrItem(value) {
    const q = value.trim();
    dispatch({ type: 'global/setQuestion', payload: { q: q } });
    q && router.push(`/result?topic=${topic}&q=${encodeURIComponent(q)}`);
    RestTools.setSession('q', q);
  }

  return (
    <Layout className={styles.wrapper}>
      <Header className={styles.header}>
       <div className={styles.logo} onClick={() => {router.push('/home')}}><img  src={logo} alt=""/></div>
        <Carousel autoplay dots={false}>
          {imgData.length
            ? imgData.map((item, index) => (
                <div className={styles.imgWrap}>
                  <img key={index} src={item} alt="" />
                </div>
              ))
            : null}
        </Carousel>

        <div className={styles.title}>{`随问${name}专题`}</div>
        <div className={styles.inputWrap}>
          <SmartInput
            // needTip
            // question={props.q}
            themeColor={themeColor}
            onClickEnter={handleClickEnterOrItem}
            onClickItem={handleClickEnterOrItem}
          />
        </div>
      </Header>
      <Layout className={styles.main}>
        <Skeleton loading={fetchMenu && fetchHotQuestions} active>
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
        </Skeleton>

        <Content className={styles.content}>
          <div className={styles.listWrap}>
            {topics.length
              ? topics.map((item) => {
                  return item.children ? (
                    item.children.map((child) => {
                      return (
                        <div key={child.id} hidden={menuKey !== item.name + child.name}>
                          <div className={styles.title}>{item.name}</div>
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
                      <div className={styles.title}>{item.name}</div>
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
                    style={hotDataIndex === index ? { color: '#fff', background: themeColor } : null}
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
    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    ...state.special,
    fetchMenu: state.loading.effects['result/getAllclassifyQuestionByTopic'],
    fetchHotQuestions: state.loading.effects['result/getQuestionByTopic']
  };
}

export default connect(mapStateToProps)(Special);