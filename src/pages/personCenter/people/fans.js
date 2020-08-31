import React, { useState } from 'react';
import { Divider, List, Avatar, Button } from 'antd';
import { connect } from 'dva';
import { throttle } from 'lodash';
import PeopleMenu from '../components/PeopleMenu';
import RestTools from 'Utils/RestTools';
import styles from './people.less';

function Fans(props) {
  const { fans, loading, dispatch } = props;
  console.log('fans', fans);
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
  const unFollowStyle = {
    background: '#0097FF',
    color: '#fff',
    width: 100
  };

  function handleMouseHover(item, index) {
    if (item.hasFollowed === 2 || item.hasFollowed === 3) {
      setButrtonIndex(index);
    }
  }

  function handleClick(item) {
    throttle(handleFollow.bind(this, item), 200);
  }

  function handleFollow({ hasFollowed, userName }) {
    if (hasFollowed === 2 || hasFollowed === 3) {
      let data = fans.map((item) => {
        if (item.userName === userName) {
          console.log('2', 2);
          return {
            ...item,
            hasFollowed: 1
          };
        }
        return item;
      });
      console.log('data', data);
      dispatch({
        type: 'personCenter/save',
        fans: data
      });
      // dispatch({
      //   type: 'personCenter/unFollowUser',
      //   payload: {
      //     followUser: userName,
      //     userId: userCommunityInfo.userName
      //   }
      // })
    }
  }

  return (
    <div className={styles.people}>
      <div className={styles.menu}>
        <PeopleMenu />
      </div>
      <div className={styles.main}>
        <div className={styles.title}>我的粉丝</div>
        <Divider style={{ marginTop: 10, marginBottom: 0 }} />
        <div className={styles.content}>
          <List
            loading={loading}
            dataSource={fans}
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
                      onMouseOver={handleMouseHover.bind(this, item, index)}
                      // onMouseLeave={() => {
                      //   setButrtonIndex(-1);
                      // }}
                      onClick={throttle(() => {
                        handleFollow(item);
                      }, 2020)}
                      style={
                        buttonIndex === index
                          ? cancelFollowStyle
                          : item.hasFollowed === 1
                          ? unFollowStyle
                          : followedStyle
                      }
                    >
                      {buttonIndex === index
                        ? item.hasFollowed === 2 || item.hasFollowed === 3
                          ? '取消关注'
                          : RestTools.followStatus[item.hasFollowed]
                        : RestTools.followStatus[item.hasFollowed]}
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
})(Fans);
