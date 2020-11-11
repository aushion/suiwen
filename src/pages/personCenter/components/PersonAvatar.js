import React from 'react';
import { Avatar } from 'antd';
import RestTools from 'Utils/RestTools';

function PersonAvatar(props) {
  const { avatar, userName } = props;
  return (
    <div style={{ display: 'block', textAlign: 'center' }}>
      <Avatar style={{ marginTop: 10 }} size={100} icon="user" src={avatar} />
      <div style={{ textAlign: 'center' }}>
        {userName ? (
          <span style={{ fontSize: 20, fontWeight: 'bold', color: '#37393B' }}>
            {RestTools.formatPhoneNumber(userName)}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default PersonAvatar;