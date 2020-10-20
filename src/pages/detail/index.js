import React, { useState, useEffect } from 'react';
import { Anchor, Layout, Spin, Empty } from 'antd';
import querystring from 'querystring';
import router from 'umi/router';
import styles from './index.less';
import RestTools from '../../utils/RestTools';
import request from '../../utils/request';

const { Link } = Anchor;
const { Footer} = Layout;

function Detail() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [username, setUsername] = useState(userInfo ? userInfo.UserName : '');
  const [medicalData, setMedicalData] = useState(null);

  useEffect(() => {
    let searchword = window.location.href.split('?')[1]; //获取参数字符串
    searchword = searchword.includes('#') ? searchword.split('#')[0] : searchword; //截取锚点之前的参数
    const query = querystring.parse(searchword);
    const { name, id } = query;
    if (name && id) {
      request
        .get(`/getMedicineDetailInfo`, {
          params: {
            id,
            name
          }
        })
        .then((res) => {
          if (res.data.code === 200) {
            setMedicalData(res.data.result[0]);
          } else {
            setMedicalData(true);
          }
        })
        .catch((err) => {
          setMedicalData(true);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    window.Ecp_LogoutOptr_my(0);
    localStorage.removeItem('userInfo');
    setUsername(null);
  }
  return (
    <Layout className={styles.detail}>
      <div className={styles.header}>
        {/* <a href="http://qa.cnki.net/web" style={{color: '#fac500',marginRight: 20}}>回到旧版</a> */}
        <div className={styles.user}>
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
          <div
            className={styles.logo}
            onClick={() => {
              router.push('/');
            }}
          />
          <div className={styles.title}>医药知识库</div>
        </div>
      </div>
      <Spin spinning={!medicalData} style={{ height: 'calc(100vh - 150px)' }}>
        {medicalData && typeof medicalData === 'object' ? (
          <div className={styles.main}>
            <div className={styles.wrapper}>
              <Anchor affix targetOffset={50}>
                {Object.keys(medicalData).map((item) => (
                  <Link key={item} href={`#${item}`} title={item} />
                ))}
              </Anchor>
            </div>

            <div className={styles.content} id="content"> 
              {Object.keys(medicalData).map((item) => (
                <div key={item} id={item} className={styles.content_item}>
                  <div className={styles.title}>{item}</div>
                  <div
                    className={styles.detail}
                    dangerouslySetInnerHTML={{
                      __html: RestTools.removeHtmlTag(RestTools.removeFlag(medicalData[item]))
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : medicalData === true ? (
          <Empty style={{ minHeight: 'calc(100vh - 160px)' }} />
        ) : null}
      </Spin>
      <Footer className={styles.footer}>Footer</Footer>
    </Layout>
  );
}

export default Detail;
