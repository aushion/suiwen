import React, { useState } from 'react';
import { Divider, List, Avatar, Button } from 'antd';
import { connect } from 'dva';
import { throttle } from 'lodash';
import PeopleMenu from '../components/PeopleMenu';
import RestTools from 'Utils/RestTools';
import styles from './people.less';

function Follow(props) {
  const { userFolloweeInfo, loading, dispatch } = props;
  const userCommunityInfo = sessionStorage.getItem('userCommunityInfo')
    ? JSON.parse(sessionStorage.getItem('userCommunityInfo'))
    : null;
  const [buttonIndex, setButrtonIndex] = useState(-1);
  const followedStyle = {
    backgroundColor: '#8C97AC',
    color: '#fff',
    width: 100
  };

  const cancelFollowStyle = {
    backgroundColor: '#76839B',
    color: '#F5F5F5',
    width: 100
  };

  function handleMouseHover(index) {
    setButrtonIndex(index);
  }

  function handleClick(userName) {
    throttle(() => {
      dispatch({
        type: 'personCenter/unFollowUser',
        payload: {
          followUser: userName,
          userId: userCommunityInfo.userName
        }
      }).then((res) => {});
    }, 200);
  }

  return (
    <div className={styles.people}>
      <div className={styles.menu}>
        <PeopleMenu />
      </div>
      <div className={styles.main}>
        <div className={styles.title}>我的关注</div>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <div className={styles.content}>
          <List
            loading={loading}
            dataSource={userFolloweeInfo}
            renderItem={(item, index) => {
              return (
                <List.Item>
                  <div style={{ fontWeight: 'bold' }}>
                    <Avatar
                      size={64}
                      shape="square"
                      src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${item.userName}`}
                    />
                    {RestTools.formatPhoneNumber(item.userName)}
                  </div>
                  <div>
                    <Button
                      onMouseOver={handleMouseHover.bind(this, index)}
                      onMouseLeave={() => {
                        setButrtonIndex(-1);
                      }}
                      onClick={handleClick.bind(this, item.hasFollowed, item.userName)}
                      style={buttonIndex === index ? cancelFollowStyle : followedStyle}
                    >
                      {buttonIndex === index ? '取消关注' : '已关注'}
                    </Button>
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

export default connect((state) => {
  return {
    ...state.personCenter,
    loading: state.loading.effects['personCenter/getUserFolloweeInfo']
  };
})(Follow);
