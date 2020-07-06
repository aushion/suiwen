import React from 'react';
import { Menu, Icon } from 'antd';
import router from 'umi/router';

function PersonMenu() {
  const menuItemStyle = {
    padding: '20px 0 20px 30px',
    height: '80px',
    fontSize: 16,
    marginTop: 0,
    marginBottom: 0
  }

  function handleClick(item) {
    console.log('window.location.pathname', window.location.pathname)
    router.push(`/personCenter/${item.key}`)
  }

  return (
    <div>
      <Menu onClick={handleClick} defaultSelectedKeys={window.location.pathname.replace('/web/personCenter/','')} >
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
