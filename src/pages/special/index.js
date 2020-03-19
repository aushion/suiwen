import React from 'react'
import { Layout,  } from 'antd';
import styles from './index.less';

const { Header, Footer, Sider, Content } = Layout;

export default function Special() {
  return (
    <Layout theme="light">
      <Header className={styles.header}>
      
      </Header>
      <Layout className={styles.main}>
        <Sider className={styles.menu}>Sider</Sider>
        <Content className={styles.content}>Content</Content>
      </Layout>
      <Layout className={styles.main}>
        <Content className={styles.hotQuestions}></Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  )
}
