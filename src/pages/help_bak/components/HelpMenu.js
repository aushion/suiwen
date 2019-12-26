import React, { useState } from 'react';
import { Menu } from 'antd';
import router from 'umi/router';

export default function HelpMenu(props) {
  const [current, setCurrent] = useState(props.current);
  function handleClick(e) {
    setCurrent(e.key);
    router.push(`/help/${e.key}`);
  }
  return (
    <Menu
      style={{ paddingLeft: '18.75%' }}
      theme="light"
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
    >
      <Menu.Item key="newHelp">新求助</Menu.Item>
      <Menu.Item key="hotHelp">热门求助</Menu.Item>
      <Menu.Item key="myHelp">我的求助</Menu.Item>
      <Menu.Item key="myReply">我的回答</Menu.Item>
    </Menu>
  );
}
