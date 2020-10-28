import React from 'react';
import { Divider } from 'antd';
import { connect } from 'dva';
import FollowList from '../components/FollowList';
import styles from './people.less';
import RestTools from '../../../utils/RestTools';

function Fans(props) {
  const { fans, loading, dispatch, location } = props;
  const { query } = location;
  const { userName } = query;
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  return (
    <div className={styles.people}>
      <div className={styles.main}>
        <div className={styles.title}>
          {userInfo?.UserName === userName ? '我的粉丝' : `${RestTools.formatPhoneNumber(userName)}的粉丝`}
        </div>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <div className={styles.content}>
          <FollowList
            data={fans.dataList}
            pagination={{
              pageSize: fans.pageCount || 10,
              current: fans.pageNum,
              total: fans.total
            }}
            dispatch={dispatch}
            stateName="fans"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default connect((state) => {
  return {
    ...state.personCenter,
    loading: state.loading.effects['personCenter/getUserFolloweeInfo']
  };
})(Fans);
