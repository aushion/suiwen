import React from 'react';
import { Menu, Icon } from 'antd';

function PersonMenu() {
  const menuItemStyle = {
    padding: '20px 0 20px 30px',
    height: '80px',
    lineHeight: '26px',
    fontSize: 20,
    marginTop: 0,
    marginBottom: 0
  }

  function handleClick(item) {
    console.log(item);
  }

  return (
    <div>
      <Menu onClick={handleClick}>
        <Menu.Item key="personInfo" style={menuItemStyle}>
          <Icon type="user" /> 个人信息
        </Menu.Item>
        <Menu.Item key="avatar" style={menuItemStyle}>
          <Icon type="setting" /> 头像设置
        </Menu.Item>
        <Menu.Item key="updatePassword" style={menuItemStyle}>
          <Icon type="lock" /> 修改密码
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default PersonMenu;
