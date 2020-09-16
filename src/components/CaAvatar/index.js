import React from 'react';
import { Avatar, Popover, Button } from 'antd';
import RestTools from '../../utils/RestTools';

function CaAvatar({ userName }) {
  return (
    <div>
      <Popover
        content={
          <div>
            <Avatar
              src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userName}`}
              shape="square"
            />
            <span>{RestTools.formatPhoneNumber(userName)}</span>
            <div>
              <Button icon="plus">关注他</Button>
            </div>
          </div>
        }
      >
        <Avatar src={`${process.env.apiUrl}/user/getUserHeadPicture?userName=${userName}`} />
        <span style={{ paddingLeft: 6 }}>{RestTools.formatPhoneNumber(userName)}</span>
      </Popover>
    </div>
  );
}

export default CaAvatar;
