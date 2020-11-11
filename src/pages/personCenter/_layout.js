import React from 'react';
import { Row, Col, Button } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import PersonAvatar from './components/PersonAvatar';
import PersonMenu from './components/PersonMenu'; //编辑个人资料菜单
import PeopleMenu from './components/PeopleMenu'; //社区相关
import FollowButton from '../../components/FollowButton';
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
        <Link
          to={`/help/newHelp`}
          style={{ verticalAlign: 'middle', display: 'flex', padding: 20 }}
        >
          <svg
            t="1603347246432"
            // class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1177"
            width="32"
            height="32"
          >
            <path
              d="M508.811636 867.141818c-197.678545 0-358.469818-160.814545-358.469818-358.493091S311.156364 150.155636 508.811636 150.155636c197.678545 0 358.493091 160.814545 358.493091 358.493091S706.490182 867.141818 508.811636 867.141818z m0-670.440727c-172.008727 0-311.924364 139.938909-311.924363 311.947636S336.826182 820.596364 508.811636 820.596364c172.032 0 311.947636-139.938909 311.947637-311.947637S680.843636 196.701091 508.811636 196.701091z"
              p-id="1178"
              fill="#1296db"
            ></path>
            <path
              d="M120.250182 874.030545c-48.034909 0-83.549091-12.730182-100.305455-41.728-43.357091-75.124364 75.613091-193.885091 150.365091-258.001454l30.301091 35.328c-117.387636 100.677818-155.066182 173.963636-140.357818 199.400727 26.670545 46.266182 235.799273 11.566545 515.700364-149.992727 279.877818-161.605818 414.487273-325.352727 387.770181-371.618909-13.312-23.133091-82.618182-28.997818-207.36 10.030545l-13.917091-44.427636c98.583273-30.836364 224-53.946182 261.585455 11.124364 57.274182 99.188364-160.302545 294.004364-404.805818 435.2-173.032727 99.909818-362.635636 174.685091-478.976 174.68509z"
              p-id="1179"
              fill="#1296db"
            ></path>
          </svg>
          <span style={{ lineHeight: '32px', fontWeight: 'bold', fontSize: 16 }}>社区</span>
        </Link>
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
              {userInfo && userInfo.UserName === userName ? (
                <Button type="primary" ghost>
                  <Link to={`/personCenter/edit/personInfo?userName=${userCommunityInfo.userName}`}>
                    编辑个人资料
                  </Link>
                </Button>
              ) : (
                <FollowButton
                  hasFollowed={userCommunityInfo.hasFollowed}
                  loginUserInfo={userInfo}
                  currentUser={userName}
                />
              )}
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