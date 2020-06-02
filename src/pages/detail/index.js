import React, { useState } from 'react';
import { Anchor, Layout } from 'antd';
import styles from './index.less';
import RestTools from '../../utils/RestTools';

const { Link } = Anchor;
const { Header, Footer, Sider, Content } = Layout;

function Detail() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');
  const medicalData = RestTools.getLocalStorage('medicalData');
  console.log('medicalData', medicalData);

  let initKeys = [
    '疾病中文名',
    '疾病英文名',
    '英文名',
    '别名',
    '概述',
    '病因',
    '发病机制',
    '临床表现',
    '流行病学',
    '并发症',
    '诊断',
    '治疗',
    '预防'
  ];

  initKeys = initKeys.filter((item) => medicalData[item]);
  console.log('initKeys', initKeys);
  function logout() {
    window.Ecp_LogoutOptr_my(0);
    localStorage.setItem('userInfo', null);
    setUsername(null);
  }
  return (
    <Layout className={styles.detail}>
      <Header className={styles.header}>
        {/* <a href="http://qa.cnki.net/web" style={{color: '#fac500',marginRight: 20}}>回到旧版</a> */}
        <div>
          <span className={styles.tips}>
            您好! {username ? RestTools.formatPhoneNumber(username) : '游客'}
          </span>
          {username ? null : (
            <a
              className={styles.login_btn}
              href={`https://login.cnki.net/login/?platform=kns&ForceReLogin=1&ReturnURL=${encodeURIComponent(
                window.location.href
              )}`}
            >
              登录
            </a>
          )}
          {username ? null : (
            <a
              className={styles.register_btn}
              href={`http://my.cnki.net/elibregister/commonRegister.aspx?autoreturn=1&returnurl=${encodeURIComponent(
                window.location.href
              )}`}
            >
              注册
            </a>
          )}
          {username ? (
            <button onClick={logout} className={styles.login_btn}>
              退出
            </button>
          ) : null}
        </div>
        <div className={styles.wrapper}>
          <div className={styles.logo} />
          <div className={styles.title}>医药知识库</div>
        </div>
      </Header>
      <Layout className={styles.main}>
        <Sider className={styles.sider} width={258}>
          <div className={styles.wrapper}>
            <Anchor>
              <div className={styles.title}>目录</div>
              {initKeys.map((item) => (
                <Link href={`#${item}`} title={item} className={styles.link_item} />
              ))}
            </Anchor>
          </div>
        </Sider>
        <Content className={styles.content}>
          {initKeys.map((item) => (
            <div id={item} className={styles.content_item}>
              <div className={styles.title}>{item}</div>
              <div
                className={styles.detail}
                dangerouslySetInnerHTML={{ __html: RestTools.removeHtmlTag(RestTools.removeFlag(medicalData[item])) }}
              />
            </div>
          ))}
        </Content>
      </Layout>
      <Footer className={styles.footer}>Footer</Footer>
    </Layout>
  );
}

export default Detail;
