import React, { useState } from 'react';
import { Avatar, Popover, Spin } from 'antd';
import { Link } from 'umi';
import helpServer from '../../services/help';
import RestTools from '../../utils/RestTools';
import FollowButton from '../FollowButton';

function CaAvatar({ userName, showFollowBtn = true }) {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const loginUser = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  function fetchUser() {
    // if(!loginUser){
    //   return;
    // }
    setLoading(true);
    helpServer
      .getUserCommunityInfo({ userName, operator: loginUser ? loginUser.UserName : '' })
      .then((res) => {
        if (res.data.code === 200) {
          setUserInfo(res.data.result);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  return (
    <>
      {RestTools.isUUid(userName) || !userName ? (
        <div>
          <Avatar icon="user" />
          <span style={{ color: '#414141', marginLeft: 10, fontWeight: 400 }}>游客</span>
        </div>
      ) : (
        <Link
          to={`/personCenter/people/ask?userName=${RestTools.encodeBase64(userName)}`}
          target="_blank"
        >
          <Popover
            placement="bottomLeft"
            content={
              <Spin spinning={loading}>
                <Avatar
                  src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userName}`}
                  shape="square"
                />
                <span style={{ marginLeft: 10, fontWeight: 400, color: '#414141' }}>
                  {RestTools.formatPhoneNumber(RestTools.hideEmailInfo(userName))}
                </span>
                <div>
                  {userInfo ? (
                    <>
                      <div
                        className="display_flex justify-content_flex-justify"
                        style={{ width: 200, padding: '10px' }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div>提问</div>
                          <strong>{userInfo.questionNum}</strong>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div>回答</div>
                          <strong>{userInfo.answerNum}</strong>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div>粉丝</div>
                          <strong>{userInfo.followers}</strong>
                        </div>
                      </div>
                      {!loginUser ? null : showFollowBtn &&
                        loginUser.userName !== userName &&
                        userInfo.hasFollowed ? (
                        <FollowButton
                          hasFollowed={userInfo.hasFollowed}
                          currentUser={userName}
                          loginUserInfo={loginUser}
                        />
                      ) : null}
                    </>
                  ) : null}
                </div>
              </Spin>
            }
          >
            <div onMouseEnter={fetchUser}>
              <Avatar
                shape="square"
                src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userName}`}
              />
              <span style={{ paddingLeft: 6 }}>
                {RestTools.formatPhoneNumber(RestTools.hideEmailInfo(userName))}
              </span>
            </div>
          </Popover>
        </Link>
      )}
    </>
  );
}

export default CaAvatar;
