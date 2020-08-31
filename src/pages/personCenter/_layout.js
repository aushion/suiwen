import React from 'react';
import { Row, Col, Button } from 'antd';
import { connect } from 'dva';
import PersonAvatar from './components/PersonAvatar';
import styles from './_layout.less';

function UserLayout(props) {
  const { userCommunityInfo } = props;
  return (
    <div className={styles.layout}>
      <div className={styles.bg}>
        <div className={styles.avatar}>
          <PersonAvatar avatar={props.avatar} />
        </div>
        {userCommunityInfo ? (
          <div className={styles.info}>
            <Row style={{ textAlign: 'center' }} gutter={24}>
              <Col span={12}>
                <div>{userCommunityInfo.followers}</div>
                <div className={styles.text}>粉丝</div>
              </Col>
              <Col span={12}>
                <div>{userCommunityInfo.followees}</div>
                <div className={styles.text}>关注</div>
              </Col>
            </Row>
            <div style={{ float: 'right', marginTop: 10 }}>
              <Button type="primary">退出</Button>
            </div>
          </div>
        ) : null}
      </div>
      <div>{props.children}</div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ...state.global,
    ...state.personCenter
  };
}

export default connect(mapStateToProps)(UserLayout);
