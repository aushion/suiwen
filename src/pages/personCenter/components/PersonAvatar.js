import React from 'react';
import { Avatar } from 'antd';
import RestTools from 'Utils/RestTools';

function PersonAvatar(props) {
  const userInfo = RestTools.getLocalStorage('userInfo');

  return (
    <div style={{ display: 'block', textAlign: 'center' }}>
      <Avatar style={{ marginTop: 10 }} size={100} icon="user" src={props.avatar} />
      <div style={{ textAlign: 'center' }}>
        {userInfo ? (
          <span style={{ fontSize: 20, fontWeight: 'bold', color: '#37393B' }}>
            {RestTools.formatPhoneNumber(userInfo.ShowName)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default PersonAvatar;
