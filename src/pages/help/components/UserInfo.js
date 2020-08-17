import React from 'react';
import { Avatar } from 'antd';

function UserInfo() {
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
          <Avatar icon="user" size={80} />
          <div style={{ marginLeft: 20, padding: '20px 0' }}>
            <div style={{ color: '#414141', fontSize: 18 }}>游客</div>
            <div style={{ color: '#919191' }}>我很懒什么也没留下</div>
          </div>
        </div>

        <div
          className="display_flex justify-content_flex-justify"
          style={{ padding: '20px 20px 0', textAlign: 'center' }}
        >
          <div style={{ textAlign: 'center' }}>
            <div>0</div>
            <div style={{ color: '#919191' }}>回答</div>
          </div>
          <div>
            <div>0</div>
            <div style={{ color: '#919191' }}>收到赞</div>
          </div>
          <div>
            <div>0</div>
            <div style={{ color: '#919191' }}>粉丝</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
