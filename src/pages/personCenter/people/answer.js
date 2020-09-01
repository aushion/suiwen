import React from 'react';
import { Divider, List, Avatar } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import RestTools from 'Utils/RestTools';
import styles from './people.less';

function Answer(props) {
  const { myCommunityAnswer, avatar, loading,location } = props;
  const {query} = location;
  const { userName } = query;
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  return (
    <div className={styles.people}>
      <div className={styles.main}>
        <div className={styles.title}>{userInfo.UserName === userName ? `我的回答`:`他的回答`}</div>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <div className={styles.content}>
          <List
            loading={loading}
            dataSource={myCommunityAnswer?.dataList}
            pagination={
              myCommunityAnswer
                ? {
                    hideOnSinglePage: true,
                    pageSize: myCommunityAnswer.pageCount,
                    size: myCommunityAnswer.pageNum,
                    total: myCommunityAnswer.total
                  }
                : null
            }
            itemLayout="vertical"
            renderItem={(item) => {
              return (
                <List.Item>
                  <Link
                    to={`/reply?q=${item.question}&QID=${item.qid}`}
                    style={{ fontSize: 16, fontWeight: 'bold', color: '#38393C' }}
                  >
                    {item.question}
                  </Link>
                  <div style={{ padding: '10px 0' }}>
                    <Avatar src={avatar} />
                    <span>{RestTools.formatPhoneNumber(item.answer[0].userName)}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: '#474747',
                      fontWeight: 400,
                      letterSpacing: '2px'
                    }}
                    dangerouslySetInnerHTML={{ __html: item.answer[0].answer }}
                  />
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

export default connect((state) => ({
  ...state.personCenter,
  loading: state.loading.effects['personCenter/getMyCommunityAnswer']
}))(Answer);
