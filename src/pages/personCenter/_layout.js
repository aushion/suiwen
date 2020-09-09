import React from 'react';
import { Row, Col, Button } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import PersonAvatar from './components/PersonAvatar';
import PersonMenu from './components/PersonMenu'; //编辑个人资料菜单
import PeopleMenu from './components/PeopleMenu'; //社区相关
import styles from './_layout.less';

function UserLayout(props) {
  const { userCommunityInfo, location, avatar } = props;
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  const { pathname, query } = location;
  const { userName } = query;

  function showEditMenu(pathname) {
    return pathname.indexOf('edit') > 0;
  }

  return (
    <div className={styles.layout}>
      <div className={styles.bg}>
        <Link to={`/help/newHelp`}>进入社区</Link>
        <div className={styles.avatar}>
          <PersonAvatar avatar={avatar} userName={query.userName} />
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
              {userInfo.UserName === userName ? (
                <Button type="primary" ghost>
                  <Link to={`/personCenter/edit/personInfo?userName=${userCommunityInfo.userName}`}>
                    编辑个人资料
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      <div className={styles.wrap}>
        {showEditMenu(pathname) ? (
          <div>
            <PersonMenu userName={userName} />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              marginLeft: '-375px',
              marginTop: '-20px',
              zIndex: 99
            }}
          >
            <PeopleMenu userName={userName} />
          </div>
        )}
        <div>{props.children}</div>
      </div>
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
