import React from 'react';
import { Avatar } from 'antd';
import { connect } from 'dva';
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
        <div className="display_flex">
          <Avatar
            icon="user"
            size={80}
            src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userInfo.userName}`}
          />
          <div style={{ marginLeft: 20, padding: '20px 0' }}>
            <div style={{ color: '#414141', fontSize: 18 }}>
              {RestTools.formatPhoneNumber(userInfo.userName) || '游客'}
            </div>
            <div style={{ color: '#919191' }}>我很懒什么也没留下</div>
          </div>
        </div>

        <div
          className="display_flex justify-content_flex-justify"
          style={{ padding: '20px 20px 0', textAlign: 'center' }}
        >
          <div style={{ textAlign: 'center' }}>
            <div>{userInfo.answerNum || 0}</div>
            <div style={{ color: '#919191' }}>回答</div>
          </div>
          <div>
            <div>{userInfo.questionNum || 0}</div>
            <div style={{ color: '#919191' }}>提问</div>
          </div>
          <div>
            <div>{userInfo.followees || 0}</div>
            <div style={{ color: '#919191' }}>粉丝</div>
          </div>
          <div>
            <div>{userInfo.followers || 0}</div>
            <div style={{ color: '#919191' }}>关注</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect((state) => ({
  ...state.global
}))(UserInfo);
