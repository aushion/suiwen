import React, { useState } from 'react';
import { Menu } from 'antd';
import router from 'umi/router';
import querystring from 'querystring'
import RestTools from '../../../utils/RestTools';

export default function HelpMenu(props) {
  const [current, setCurrent] = useState(props.current);
  const {data = []} = props;
  const paramstr = window.location.href.split('?')[1];
  const query = querystring.parse(paramstr);
  const {username = ''} = query;
  
  function handleClick(e) {
    RestTools.setSession('page',null) //重置分页
    RestTools.setSession('searchKey','') //重置搜索默认值
    setCurrent(e.key);
    router.push(username ? `/help/${e.key}?username=${username}`: `/help/${e.key}`);
  }
  return (
    <Menu
      style={{ paddingLeft: '18.75%' }}
      theme="light"
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
    >
      {data.length ? data.map(item => 
        <Menu.Item key={item.key}>{item.text}</Menu.Item>
      ):null}
  
    </Menu>
  );
}
