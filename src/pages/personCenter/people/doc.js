import React from 'react';
import { Divider, List } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './people.less';
import RestTools from '../../../utils/RestTools';

function Doc(props) {
  console.log(props);
  const { userDoc, loading, location, dispatch } = props;
  const { query } = location;
  const { userName } = query;
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

  return (
    <div className={styles.people}>
      <div className={styles.main}>
        <div className={styles.title}>
          {userInfo?.UserName === userName
            ? '我的文档'
            : `${RestTools.formatPhoneNumber(userName)}的文档`}
        </div>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <div className={styles.content}>
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={userDoc.dataList}
            pagination={{
              pageSize: userDoc.pageCount || 10,
              current: userDoc.pageNum,
              total: userDoc.total,
              onChange: (page) => {
                dispatch({
                  type: 'personCenter/getUserDoc',
                  payload: {
                    operatorName: userInfo.UserName,
                    pageSize: 10,
                    pageStart: page,
                    userName: userName
                  }
                });
              }
            }}
            renderItem={(item) => {
              return (
                <List.Item>
                  <Link
                    to={`/doc/outlineConfig?docId=${item.docId}`}
                    style={{ fontSize: 16, fontWeight: 'bold', color: '#38393C' }}
                  >
                    {item.docName}
                  </Link>
                  <div
                    style={{
                      color: '#B3B3B3',
                      fontSize: 14,
                      paddingTop: 10
                    }}
                  >
                    {/* <span style={{ marginRight: 14 }}>{item.total}个回答</span>
                    <span style={{ marginRight: 14 }}>{item.followers}个关注</span> */}
                    <span>创建于{item.createTime}</span>
                  </div>
                </List.Item>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  console.log('mapStateToProps', state);
  return {
    ...state.personCenter,
    loading: state.loading.effects['personCenter/getUserDoc']
  };
}

export default connect(mapStateToProps)(Doc);
