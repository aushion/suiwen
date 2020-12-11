import React from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import RestTools from '../../../utils/RestTools';

function PersonMenu(props) {
  const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
  const { dispatch, userName } = props;
  const menuStyle = {
    backgroundColor: 'transparent',
    borderBottom: 'none'
  };

  const menuItemStyle = {
    border: 'none',
    fontSize: 16,
    fontWeight: 400
  };

  function handleClick(item) {
    dispatch({
      type: 'personCenter/save',
      payload: {
        defaultKey: item.key
      }
    });
    router.push(`/personCenter/edit/${item.key}?userName=${RestTools.encodeBase64(userName)}`);
  }

  return (
    <div className="display_flex justify-content_flex-justify">
      {userInfo && userInfo.UserType === 'bk' ? (
        <Menu
          onClick={handleClick}
          selectedKeys={props.defaultKey}
          mode="horizontal"
          style={menuStyle}
        >
          <Menu.Item key="personInfo" style={menuItemStyle}>
            机构信息
          </Menu.Item>
        </Menu>
      ) : (
        <Menu
          onClick={handleClick}
          selectedKeys={props.defaultKey}
          mode="horizontal"
          style={menuStyle}
        >
          <Menu.Item key="personInfo" style={menuItemStyle}>
            个人信息
          </Menu.Item>
          <Menu.Item key="avatar" style={menuItemStyle}>
            头像设置
          </Menu.Item>
          <Menu.Item key="updatePassword" style={menuItemStyle}>
            修改密码
          </Menu.Item>
        </Menu>
      )}
      <div style={{ padding: '10px 40px 0 0' }}>
        <Link to={`/personCenter/people/ask?userName=${RestTools.encodeBase64(userInfo.UserName)}`}>
          返回个人主页
          <Icon type="double-right" />{' '}
        </Link>
      </div>
    </div>
  );
}

export default connect((state) => ({
  ...state.personCenter
}))(PersonMenu);
