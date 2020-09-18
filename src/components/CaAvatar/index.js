import React, { useState } from 'react';
import { Avatar, Popover, Spin } from 'antd';
import { Link } from 'umi';
import helpServer from '../../services/help';
import RestTools from '../../utils/RestTools';

function CaAvatar({ userName }) {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  // const loginUser = localStorage.getItem('userInfo')
  //   ? JSON.parse(localStorage.getItem('userInfo'))
  //   : null;
  function fetchUser() {
    setLoading(true);
    helpServer
      .getUserCommunityInfo({ userName })
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
        <Link to={`personCenter/people/ask?userName=${userName}`} target="_blank">
          <Popover
            placement="bottomLeft"
            content={
              <Spin spinning={loading}>
                <Avatar
                  src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userName}`}
                  shape="square"
                />
                <span style={{ marginLeft: 10, fontWeight: 400, color: '#414141' }}>
                  {RestTools.formatPhoneNumber(userName)}
                </span>
                <div>
                  {userInfo ? (
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
                  ) : null}
                  {/* {loginUser.UserName !== userName ? <Button icon="plus">关注他</Button> : null} */}
                </div>
              </Spin>
            }
          >
            <div onMouseEnter={fetchUser}>
              <Avatar
                shape="square"
                src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userName}`}
              />
              <span style={{ paddingLeft: 6 }}>{RestTools.formatPhoneNumber(userName)}</span>
            </div>
          </Popover>
        </Link>
      )}
    </>
  );
}

export default CaAvatar;
