import React from 'react';
import { Divider, List } from 'antd';
import { connect } from 'dva';
import PeopleMenu from '../components/PeopleMenu';
import styles from './people.less';

function People(props) {
  const { myCommunityQuestion, loading } = props;

  return (
    <div className={styles.people}>
      <div className={styles.menu}>
        <PeopleMenu />
      </div>
      <div className={styles.main}>
        <div className={styles.title}>我的提问</div>
        <Divider />
        <div className={styles.content}>
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={myCommunityQuestion?.dataList}
            pagination={
              myCommunityQuestion
                ? {
                    hideOnSinglePage: true,
                    pageSize: myCommunityQuestion?.pageCount,
                    size: myCommunityQuestion?.pageNum,
                    total: myCommunityQuestion?.total
                  }
                : null
            }
            renderItem={(item) => {
              return (
                <List.Item>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>{item.question}</div>
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
    loading: state.loading.effects['personCenter/getMyCommunityQuestion']
  };
}

export default connect(mapStateToProps)(People);
