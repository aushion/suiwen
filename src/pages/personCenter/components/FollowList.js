import React, { useState } from 'react';
import { List, Button, Avatar } from 'antd';
import { throttle } from 'lodash';
import RestTools from 'Utils/RestTools';
import { router } from 'umi';

function FollowList(props) {
  const { data, dispatch, loading, stateName } = props;
  const userCommunityInfo = sessionStorage.getItem('userCommunityInfo')
    ? JSON.parse(sessionStorage.getItem('userCommunityInfo'))
    : null;
  const [buttonIndex, setButtonIndex] = useState(-1);
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
      setButtonIndex(index);
    }
  }

  function handleFollow({ hasFollowed, userName }) {
      if(hasFollowed === 0){
          return;
      }
    let tempest = data;
    if (hasFollowed === 2 || hasFollowed === 3) {
      tempest = data.map((item) => {
        if (item.userName === userName) {
          return {
            ...item,
            hasFollowed: 1
          };
        }
        return item;
      });
    } else if (hasFollowed === 1) {
      tempest = data.map((item) => {
        if (item.userName === userName) {
          return {
            ...item,
            hasFollowed: 2
          };
        }
        return item;
      });
    }

    dispatch({
      type: 'personCenter/save',
      payload: {
        [stateName]: tempest
      }
    });
    dispatch({
      type: hasFollowed === 1 ? 'personCenter/followUser' : 'personCenter/unFollowUser',
      payload: {
        followUser: userName,
        userId: userCommunityInfo.userName
      }
    });
  }
  return (
    <div>
      <List
        loading={loading}
        dataSource={data}
        renderItem={(item, index) => {
          return (
            <List.Item >
              <div style={{ fontWeight: 'bold',cursor: "pointer" }}>
                <Avatar
                
                onClick={() => {
                  if(userCommunityInfo.userName !== item.userName){
                    router.push(`/personCenter/people/ask?userName=${item.userName}`)
                  }
                  return;
                }}
                  size={64}
                  shape="square"
                  src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${item.userName}`}
                />
                <span style={{ marginLeft: 20 }}>{RestTools.formatPhoneNumber(item.userName)}</span>
              </div>
              <div>
                <Button
                  onMouseOver={handleMouseHover.bind(this, item, index)}
                  onMouseLeave={() => {
                    setButtonIndex(-1);
                  }}
                  onClick={throttle(() => {
                    handleFollow(item);
                  }, 200)}
                  style={
                    buttonIndex === index
                      ? cancelFollowStyle
                      : item.hasFollowed === 1
                      ? unFollowStyle
                      : followedStyle
                  }
                  icon={item.hasFollowed === 1 ? 'plus' : null}
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
  );
}

export default FollowList;
