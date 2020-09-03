import React from 'react';
import { Avatar } from 'antd';
import { connect } from 'dva';
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
        boxShadow: '0px 0px 5px 0px rgba(216,216,216,0.76)'
      }}
    >
      <div>
        <div>
          <Link
            className="display_flex"
            to={`/personCenter/people/ask?userName=${userInfo.userName}`}
          >
            <Avatar
              icon="user"
              size={80}
              src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userInfo.userName}`}
            />
            <div style={{ marginLeft: 20, padding: '20px 0' }}>
              <div style={{ color: '#414141', fontSize: 18 }}>
                {RestTools.formatPhoneNumber(userInfo.userName) || '游客'}
              </div>
              <div style={{ color: '#666', fontSize: 13 }}>我很懒什么也没留下</div>
            </div>
          </Link>
        </div>

        <div
          className="display_flex justify-content_flex-justify"
          style={{ padding: '20px 20px 0', textAlign: 'center' }}
        >
          <Link
            to={`/personCenter/people/answer?userName=${userInfo.userName}`}
            style={{ textAlign: 'center' }}
          >
            <div>{userInfo.answerNum || 0}</div>
            <div style={{ color: '#333', fontWeight: 'bolder' }}>回答</div>
          </Link>
          <Link to={`/personCenter/people/ask?userName=${userInfo.userName}`}>
            <div>{userInfo.questionNum || 0}</div>
            <div style={{ color: '#333', fontWeight: 'bolder' }}>提问</div>
          </Link>
          <Link to={`/personCenter/people/fans?userName=${userInfo.userName}`}>
            <div>{userInfo.followers || 0}</div>
            <div style={{ color: '#333', fontWeight: 'bolder' }}>粉丝</div>
          </Link>
          <Link to={`/personCenter/people/follow?userName=${userInfo.userName}`}>
            <div>{userInfo.followees || 0}</div>
            <div style={{ color: '#333', fontWeight: 'bolder' }}>关注</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default connect((state) => ({
  ...state.global
}))(UserInfo);
