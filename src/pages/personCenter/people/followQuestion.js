import React from 'react';
import { Divider, List } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import styles from './people.less';

function FollowQuestion(props) {
  const { userFollowQuestion, loading, location } = props;
  const { query } = location;
  const { userName } = query;
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  return (
    <div className={styles.people}>
      <div className={styles.main}>
        <div className={styles.title}>
          {userInfo?.UserName === userName ? '我关注的问题' : '他关注的问题'}
        </div>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <div className={styles.content}>
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={userFollowQuestion}
            renderItem={(item) => {
              return (
                <List.Item>
                  <Link
                    to={`/reply?q=${item.question}&QID=${item.qid}`}
                    style={{ fontSize: 16, fontWeight: 'bold', color: '#38393C' }}
                  >
                    {item.question}
                  </Link>
                  <div
                    style={{
                      color: '#B3B3B3',
                      fontSize: 14,
                      paddingTop: 10
                    }}
                  >
                    <span style={{ marginRight: 14 }}>{item.total}个回答</span>
                    <span>{item.followers}个关注</span>
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
  return {
    ...state.personCenter,
    loading: state.loading.effects['personCenter/getUserFollowedQuestion']
  };
}

export default connect(mapStateToProps)(FollowQuestion);
