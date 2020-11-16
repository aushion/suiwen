import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { throttle } from 'lodash';
import RestTools from '../../utils/RestTools';
import helpServer from '../../services/help';

/*   currentUser: 当前行用户
  loginUserInfo：当前登录用户 */

function FollowButton({ hasFollowed, currentUser, loginUserInfo }) {
  const [followStatus, updateStatus] = useState('');
  const userInfo = localStorage.getItem('userInfo') ? localStorage.getItem('userInfo') : null;

  useEffect(() => {
    updateStatus(hasFollowed);
  }, [currentUser, hasFollowed]);

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

  const style = {
    '4': cancelFollowStyle,
    '1': unFollowStyle,
    '2': followedStyle,
    '3': followedStyle
  };

  function handleFollow() {
    //修改本地状态使其实时修改页面显示
    if (!userInfo) {
      message.warning('请您先登录');
      return;
    }
    if (followStatus === 0) {
      return;
    }
    if (followStatus === 3 || followStatus === 2) {
      updateStatus(1);
    }
    if (followStatus === 1) {
      updateStatus(2);
    }

    //发起请求服务端去修改状态
    const payload = {
      followUser: currentUser,
      userId: loginUserInfo.UserName
    };
    if (followStatus === 1) {
      helpServer.followUser(payload);
    } else {
      helpServer.unFollowUser(payload);
    }
  }

  return followStatus ? (
    <Button
      // onMouseOver={handleMouseOver}
      // onMouseLeave={handleMouseLeave}
      onClick={throttle(() => {
        handleFollow();
      }, 200)}
      style={style[followStatus]}
    >
      {RestTools.followStatus[followStatus]}
    </Button>
  ) : null;
}

export default FollowButton;
