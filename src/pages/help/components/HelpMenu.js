import React, { useState } from 'react';
import { Menu } from 'antd';
import router from 'umi/router';
import querystring from 'querystring';

export default function HelpMenu(props) {
  const [current, setCurrent] = useState(props.current);
  const { data = [], dispatch } = props;
  const paramStr = window.location.href.split('?')[1];
  const query = querystring.parse(paramStr);
  const { username = '' } = query;

  function handleClick(e) {
    dispatch({
      type: 'help/changeDomain',
      payload: {
        communityNode: null
      }
    });
    setCurrent(e.key);
    router.push(username ? `/help/${e.key}?username=${username}` : `/help/${e.key}`);
  }
  return (
    <Menu theme="light" onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      {data.length
        ? data.map((item) => (
            <Menu.Item style={{ fontWeight: 'bolder', fontSize: 16 }} key={item.key}>
              {item.text}
            </Menu.Item>
          ))
        : null}
    </Menu>
  );
}
