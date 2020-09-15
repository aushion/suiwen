import React from 'react';
import { Avatar } from 'antd';
import RestTools from '../../utils/RestTools';

function CaAvatar({ userName }) {
  return (
    <div>
      <Avatar src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userName}`} />
      <span style={{ paddingLeft: 6 }}>{RestTools.formatPhoneNumber(userName)}</span>
    </div>
  );
}

export default CaAvatar;
