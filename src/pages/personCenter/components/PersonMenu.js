import React from 'react';
import { Menu, Icon } from 'antd';
import router from 'umi/router';
import RestTools from '../../../utils/RestTools';

function PersonMenu(props) {
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
  const menuItemStyle = {
    padding: '20px 0 20px 30px',
    height: '80px',
    fontSize: 16,
    marginTop: 0,
    marginBottom: 0
  };

  function handleClick(item) {
    const userInfo = RestTools.getLocalStorage('userInfo');
    router.push(`/personCenter/${item.key}?userName=${userInfo.UserName}`);
  }

  return (
    <div>
      {userInfo.UserType === 'bk' ? (
        <Menu onClick={handleClick} selectedKeys={props.defaultKey}>
          <Menu.Item key="personInfo" style={menuItemStyle}>
            <Icon type="user" /> 机构信息
          </Menu.Item>
          
        </Menu>
      ) : (
        <Menu onClick={handleClick} selectedKeys={props.defaultKey}>
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
      )}
    </div>
  );
}

export default PersonMenu;
