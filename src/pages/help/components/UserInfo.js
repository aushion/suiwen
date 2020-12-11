import React from 'react';
import { Avatar } from 'antd';
import { Link } from 'umi';
import RestTools from '../../../utils/RestTools';

function UserInfo(props) {
  const userInfo = sessionStorage.getItem('userCommunityInfo')
    ? JSON.parse(sessionStorage.getItem('userCommunityInfo'))
    : props.userInfo;
  return (
    <div
      style={{
        borderRadius: 4,
        padding: '20px',
        background: '#fff',
        marginBottom: 10
      }}
    >
      <div>
        <div>
          <Link
            className="display_flex justify-content_flex-center"
            to={`/personCenter/people/ask?userName=${RestTools.encodeBase64(userInfo?.userName)}`}
          >
            <Avatar
              icon="user"
              size={80}
              src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userInfo?.userName}`}
            />
            <div style={{ marginLeft: 20, padding: '20px 0' }}>
              <div style={{ color: '#414141', fontSize: 18 }}>
                {RestTools.formatPhoneNumber(userInfo?.userName) || '游客'}
              </div>
              <div style={{ color: '#666', fontSize: 13 }}>我很忙什么也没留下</div>
            </div>
          </Link>
        </div>

        <div
          className="display_flex justify-content_flex-justify"
          style={{ padding: '0px 20px 0', textAlign: 'center' }}
        >
          <Link
            to={`/personCenter/people/answer?userName=${RestTools.encodeBase64(
              userInfo?.userName
            )}`}
            style={{ color: '#333', fontWeight: 'bold' }}
          >
            <div>{userInfo?.answerNum || 0}</div>
            <div style={{ color: '#868686', fontWeight: 400 }}>回答</div>
          </Link>
          <Link
            to={`/personCenter/people/ask?userName=${RestTools.encodeBase64(userInfo?.userName)}`}
            style={{ color: '#333', fontWeight: 'bold' }}
          >
            <div>{userInfo?.questionNum || 0}</div>
            <div style={{ color: '#868686', fontWeight: 400 }}>提问</div>
          </Link>
          <Link
            to={`/personCenter/people/fans?userName=${RestTools.encodeBase64(userInfo?.userName)}`}
            style={{ color: '#333', fontWeight: 'bold' }}
          >
            <div>{userInfo?.followers || 0}</div>
            <div style={{ color: '#868686', fontWeight: 400 }}>粉丝</div>
          </Link>
          <Link
            to={`/personCenter/people/follow?userName=${RestTools.encodeBase64(
              userInfo?.userName
            )}`}
            style={{ color: '#333', fontWeight: 'bold' }}
          >
            <div>{userInfo?.followees || 0}</div>
            <div style={{ color: '#868686', fontWeight: 400 }}>关注</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
