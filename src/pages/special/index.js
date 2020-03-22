import React, { useState, useEffect } from 'react';
import { Layout, Menu, List } from 'antd';
import SmartInput from '../../components/SmartInput';
import { connect } from 'dva';
import styles from './index.less';
const { SubMenu } = Menu;

const { Header, Footer, Sider, Content } = Layout;

function Special(props) {
  const { topics, initialKey, hotQuestions } = props;

  const [menuKey, setMenuKey] = useState(initialKey);
  console.log('hotQuestions', hotQuestions);
  useEffect(() => {
    setMenuKey(initialKey);
    return () => {};
  }, [initialKey]);
  function handleClick(e) {
    setMenuKey(e.key);
  }

  return (
    <Layout theme="light">
      <Header className={styles.header}>
        <div className={styles.inputWrap}>
          <SmartInput></SmartInput>
        </div>
      </Header>
      <Layout className={styles.main}>
        <Sider className={styles.menu}>
          <div>
            {topics.length ? (
              <Menu
                mode="inline"
                onClick={handleClick}
                defaultOpenKeys={topics[0].name}
                defaultSelectedKeys={menuKey || initialKey}
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
          <div>
            {topics.length
              ? topics.map((item) => {
                  return item.children ? (
                    item.children.map((child) => {
                      return (
                        <div key={child.id} hidden={menuKey !== item.name + child.name}>
                          <List
                            header={null}
                            footer={null}
                            bordered
                            dataSource={child.data}
                            renderItem={(item) => (
                              <List.Item key={item.qId}>{item.question}</List.Item>
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
                        bordered
                        dataSource={item.data}
                        renderItem={(item) => <List.Item>{item.question}</List.Item>}
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
          {hotQuestions && hotQuestions.dataList.length ? (
            <List
              dataSource={hotQuestions.dataList}
              header={null}
              footer={null}
              renderItem={(item) => <List.Item>{item.question}</List.Item>}
            />
          ) : null}
        </Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  );
}

function mapStateToProps(state) {
  return {
    ...state.special,
    loading: state.loading.effects['result/getTopics']
  };
}

export default connect(mapStateToProps)(Special);
