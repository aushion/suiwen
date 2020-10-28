import React from 'react';
import { Menu } from 'antd';
import { router } from 'umi';
import { connect } from 'dva';

function PeopleMenu(props) {
  const { defaultPersonKey, dispatch, userName } = props;
  const menuItemStyle = {
    width: 150,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 800
  };

  function handleClick(item) {
    dispatch({
      type: 'personCenter/save',
      payload: {
        defaultPersonKey: item.key
      }
    });
    router.push(`/personCenter/people/${item.key}?userName=${userName}`);
  }

  return (
    <Menu
      mode="horizontal"
      style={{ width: 750, border: '1px solid #ccc' }}
      onClick={handleClick}
      selectedKeys={[defaultPersonKey]}
    >
      <Menu.Item style={menuItemStyle} key="ask">
        提问
      </Menu.Item>
      <Menu.Item style={menuItemStyle} key="answer">
        回答
      </Menu.Item>
      <Menu.Item style={menuItemStyle} key="follow">
        关注
      </Menu.Item>
      <Menu.Item style={menuItemStyle} key="fans">
        粉丝
      </Menu.Item>
      <Menu.Item style={menuItemStyle} key="followQuestion">
        关注问题
      </Menu.Item>
    </Menu>
  );
}

export default connect((state) => ({
  ...state.personCenter
}))(PeopleMenu);
