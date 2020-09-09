import React, { useState } from 'react';
import { List, Button, Avatar } from 'antd';
import { throttle } from 'lodash';
import { router } from 'umi';
import { connect } from 'dva';
import RestTools from '../../../utils/RestTools';

function FollowList(props) {
  const { data, dispatch, loading, stateName, userCommunityInfo } = props;

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
    if (hasFollowed === 0) {
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
            <List.Item>
              <div style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                <div style={{ float: 'left' }}>
                  <Avatar
                    onClick={() => {
                      if (userCommunityInfo.userName !== item.userName) {
                        router.push(`/personCenter/people/ask?userName=${item.userName}`);
                      }
                      return;
                    }}
                    size={64}
                    shape="square"
                    src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${item.userName}`}
                  />
                </div>
                <div
                 style={{float: 'left', overflow: 'hidden', paddingLeft: 10}}
                >
                  <div style={{ fontSize: 16 }}>{RestTools.formatPhoneNumber(item.userName)}</div>
                  <div style={{ color: '#999', fontWeight: 400, paddingTop: 16 }}>
                    <span style={{paddingRight: 4}}> <strong>{item.questionNum}</strong>提问</span>
                    <span style={{paddingRight: 4}}> <strong>{item.answerNum}</strong>回答</span>
                    <span style={{paddingRight: 4}}> <strong>{item.followers}</strong>粉丝</span>
                    <span> <strong>{item.followees}</strong>关注者</span>
                  </div>
                </div>
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

export default connect((state) => ({
  ...state.personCenter
}))(FollowList);
