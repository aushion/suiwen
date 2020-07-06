import React from 'react';
import { Avatar } from 'antd';
import { connect } from 'dva';
import RestTools from '../../../utils/RestTools';

function PersonAvatar() {
  const userInfo = RestTools.getLocalStorage('userInfo');

  function handleError() {}

  return (
    <div style={{ backgroundColor: '#fff', position: 'relative', height: 116 }}>
      <Avatar
        style={{ marginTop: 25, marginLeft: '18.75%' }}
        size={100}
        shape="square"
        icon="user"
        onError={handleError}
      />
      {userInfo ? (
        <span style={{ fontSize: 26, paddingLeft: 10, fontWeight: 'bold', color: '#37393B' }}>
          {userInfo.ShowName}
        </span>
      ) : null}
    </div>
  );
}

export default PersonAvatar;
